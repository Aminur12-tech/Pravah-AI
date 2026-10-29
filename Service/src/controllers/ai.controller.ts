
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const analyzeSchema = z.object({
  description: z.string().trim().min(5).max(5000),
});

const aiResponseSchema = z.object({
  predicted_category: z.string().min(1),
  ranked_categories: z.array(
    z.object({
      category: z.string().min(1),
      score: z.number().finite(),
    })
  ),
  note: z.string().optional(),
});

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// All values match the categories supported by PRAVAH AI.
const categoryMap: Record<string, string> = {
  flood: "flood",
  flooding: "flood",
  "flood disaster": "flood",
  "flash flood": "flood",

  earthquake: "earthquake",
  "earthquake disaster": "earthquake",

  landslide: "landslide",
  landslides: "landslide",
  "landslide disaster": "landslide",

  fire: "fire",
  wildfire: "fire",
  "forest fire": "fire",

  storm: "storm",
  cyclone: "storm",
  hurricane: "storm",
  thunderstorm: "storm",
  "severe weather": "storm",

  "road damage": "road_damage",
  "damaged road": "road_damage",
  "road accident": "road_damage",
  road_damage: "road_damage",

  "waste or pollution": "waste",
  waste: "waste",
  pollution: "waste",

  "drainage problem": "drainage",
  drainage: "drainage",
  "blocked drain": "drainage",

  "water shortage": "water_shortage",
  "lack of water": "water_shortage",

  other: "other",
  "other emergency": "other",
};

function normalizeCategory(value: string): string | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  return categoryMap[normalized] ?? null;
}

export async function analyzeIncident(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = analyzeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide an incident description of 5–5000 characters.",
        errors: parsed.error.issues,
      });
    }

    let aiResponse: globalThis.Response;

    try {
      aiResponse = await fetch(`${AI_SERVICE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: parsed.data.description,
        }),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (error) {
      console.error("AI service connection failed:", error);

      return res.status(503).json({
        success: false,
        message:
          "AI service is unavailable. Please check the AI server and try again.",
      });
    }

    if (!aiResponse.ok) {
      console.error(
        "AI service returned status:",
        aiResponse.status
      );

      return res.status(502).json({
        success: false,
        message: "AI analysis failed. Please try again.",
      });
    }

    let rawResult: unknown;

    try {
      rawResult = await aiResponse.json();
    } catch {
      return res.status(502).json({
        success: false,
        message: "AI service returned invalid JSON.",
      });
    }

    const validated = aiResponseSchema.safeParse(rawResult);

    if (!validated.success) {
      console.error(
        "Invalid AI response format:",
        validated.error.issues
      );

      return res.status(502).json({
        success: false,
        message: "AI service returned an invalid response.",
      });
    }

    const aiResult = validated.data;
    const predictedCategory = normalizeCategory(
      aiResult.predicted_category
    );

    if (!predictedCategory) {
      console.error(
        "Unsupported predicted category:",
        aiResult.predicted_category
      );

      return res.status(502).json({
        success: false,
        message:
          "AI returned an unsupported incident category.",
      });
    }

    const rankedCategories = aiResult.ranked_categories
      .map((item) => {
        const category = normalizeCategory(item.category);

        if (!category) {
          console.warn(
            "Ignoring unsupported ranked category:",
            item.category
          );
          return null;
        }

        return {
          category,
          score: item.score,
        };
      })
      .filter(
        (
          item
        ): item is { category: string; score: number } =>
          item !== null
      );

    return res.status(200).json({
      success: true,
      data: {
        predicted_category: predictedCategory,
        ranked_categories: rankedCategories,
        note: aiResult.note,
      },
    });
  } catch (error) {
    return next(error);
  }
}

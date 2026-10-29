
import os
from pathlib import Path
from contextlib import asynccontextmanager

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import pipeline

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = Path(os.getenv("MODEL_DIR", str(BASE_DIR / "model")))

classifier = None

CATEGORIES = [
    "flood",
    "earthquake",
    "landslide",
    "fire",
    "storm",
    "road damage",
    "waste or pollution",
    "drainage problem",
    "water shortage",
    "other emergency",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    global classifier

    if not (MODEL_DIR / "config.json").exists():
        raise RuntimeError(f"Model config.json not found in {MODEL_DIR}")

    if not (MODEL_DIR / "model.safetensors").exists():
        raise RuntimeError(f"Model weights not found in {MODEL_DIR}")

    print(f"Loading AI model from: {MODEL_DIR}")
    classifier = pipeline(
        task="zero-shot-classification",
        model=str(MODEL_DIR),
        tokenizer=str(MODEL_DIR),
        device=-1,  # CPU
    )
    print("PRAVAH AI classifier loaded.")

    yield

    classifier = None


app = FastAPI(
    title="PRAVAH AI Classification Service",
    version="1.0.0",
    lifespan=lifespan,
)


class AnalyzeRequest(BaseModel):
    description: str = Field(min_length=5, max_length=5000)


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "PRAVAH AI",
        "model_loaded": classifier is not None,
    }


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    if classifier is None:
        raise HTTPException(status_code=503, detail="AI model is not loaded")

    description = request.description.strip()
    if len(description) < 5:
        raise HTTPException(
            status_code=422,
            detail="Description must contain at least 5 characters",
        )

    try:
        result = classifier(
            description,
            candidate_labels=CATEGORIES,
            hypothesis_template="This incident involves {}.",
            multi_label=False,
        )

        scores = [
            {
                "category": label,
                "score": round(float(score), 4),
            }
            for label, score in zip(result["labels"], result["scores"])
        ]

        return {
            "success": True,
            "predicted_category": scores[0]["category"].replace(" ", "_"),
            "ranked_categories": scores,
            "note": (
                "Scores are model ranking scores, not calibrated probabilities. "
                "Verify classifications before making emergency decisions."
            ),
        }

    except Exception as exc:
        print(f"Classification error: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Incident classification failed",
        ) from exc

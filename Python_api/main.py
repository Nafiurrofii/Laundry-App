
import pickle

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Laundry Prediction API",
    description="API prediksi kebutuhan sabun dan parfum",
    version="1.0.0",
)

# CORS: izinkan akses dari Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memuat model saat aplikasi dimulai
with open("random_forest_laundry.pkl", "rb") as file:
    saved_model = pickle.load(file)

model = saved_model["model"]
feature_names = saved_model["feature_names"]
target_names = saved_model["target_names"]


class PredictionInput(BaseModel):
    kg: float = Field(gt=0, le=1000, description="Berat cucian dalam kg")


@app.get("/")
def home():
    return {
        "message": "Laundry Prediction API berjalan",
        "model": "Random Forest",
        "target_names": target_names,
        "feature_names": feature_names,
    }


@app.post("/prediksi")
def prediksi_laundry(data: PredictionInput):
    try:
        input_data = pd.DataFrame(
            [{"kg": data.kg}],
            columns=feature_names,
        )

        hasil = model.predict(input_data)[0]

        return {
            "message": "Prediksi berhasil",
            "input": {
                "kg": data.kg,
            },
            "prediksi": {
                target_names[0]: round(float(hasil[0]), 3),
                target_names[1]: round(float(hasil[1]), 3),
            },
        }

    except Exception as exc:
        # Detail teknis dicatat di server, tidak dikirim ke pengguna.
        print(f"Prediction error: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Terjadi kesalahan saat melakukan prediksi.",
        ) from exc

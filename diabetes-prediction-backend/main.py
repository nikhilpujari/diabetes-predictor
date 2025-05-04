from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
from typing import List, Optional
import os
import logging
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib  # Add joblib import

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Diabetes Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the model and scaler
MODEL_PATH = 'random_forest_diabetes_model.pkl'
SCALER_PATH = 'scaler.pkl'

try:
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"Attempting to load model and scaler")
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler file not found at {SCALER_PATH}")
    
    # Load the trained model and scaler using joblib
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    # Verify the model is a RandomForestClassifier
    if not isinstance(model, RandomForestClassifier):
        logger.error(f"Loaded model is of type {type(model)}, expected RandomForestClassifier")
        raise TypeError("Invalid model type")
        
    # Verify the scaler is a StandardScaler
    if not isinstance(scaler, StandardScaler):
        logger.error(f"Loaded scaler is of type {type(scaler)}, expected StandardScaler")
        raise TypeError("Invalid scaler type")
    
    logger.info("Successfully loaded model and scaler")
    logger.info(f"Model type: {type(model)}")
    logger.info(f"Scaler type: {type(scaler)}")
except Exception as e:
    logger.error(f"Error during setup: {str(e)}")
    raise

class DiabetesInput(BaseModel):
    Niacin: float
    SaturatedFat: float
    Selenium: float
    Carbs: float
    Magnesium: float
    VitaminB6: float
    Potassium: float
    AlcoholicDrinks: float
    Phosphorus: float
    TotalFat: float
    Protein: float
    Alcohol: float
    MonoFat: float
    Calories: float
    Unsat_to_Sat_Fat_Ratio: float
    Fat_to_Calorie_Ratio: float
    Age: float
    Sex_encoded: int

class PredictionResponse(BaseModel):
    risk: int  # Binary prediction (0 or 1)
    probability: float  # Probability of class 1
    raw_probabilities: list  # Full probability array [prob_class_0, prob_class_1]
    scaled_features: list  # Scaled input features
    feature_names: list  # Names of the features

@app.post("/predict", response_model=PredictionResponse)
async def predict_diabetes(input_data: DiabetesInput):
    try:
        logger.info("\n=== New Prediction Request ===")
        
        # Convert input data to numpy array
        input_features = np.array([
            input_data.Niacin,
            input_data.SaturatedFat,
            input_data.Selenium,
            input_data.Carbs,
            input_data.Magnesium,
            input_data.VitaminB6,
            input_data.Potassium,
            input_data.AlcoholicDrinks,
            input_data.Phosphorus,
            input_data.TotalFat,
            input_data.Protein,
            input_data.Alcohol,
            input_data.MonoFat,
            input_data.Calories,
            input_data.Unsat_to_Sat_Fat_Ratio,
            input_data.Fat_to_Calorie_Ratio,
            input_data.Age,
            input_data.Sex_encoded
        ]).reshape(1, -1)

        # Scale the input features
        scaled_features = scaler.transform(input_features)
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        probabilities = model.predict_proba(scaled_features)[0]

        # Invert the prediction if age is above 50 (typical threshold for increased diabetes risk)
        if input_data.Age > 50:
            prediction = 1 if prediction == 0 else 0
            probabilities = np.array([probabilities[1], probabilities[0]])  # Swap probabilities

        logger.info("\nPrediction Results:")
        logger.info(f"Age: {input_data.Age}")
        logger.info(f"Binary prediction: {prediction}")
        logger.info(f"Probability array: {probabilities}")
        logger.info(f"Scaled features: {scaled_features[0]}")

        return {
            "risk": int(prediction),
            "probability": float(probabilities[1]),
            "raw_probabilities": probabilities.tolist(),
            "scaled_features": scaled_features[0].tolist(),
            "feature_names": [
                "Niacin", "SaturatedFat", "Selenium", "Carbs", "Magnesium",
                "VitaminB6", "Potassium", "AlcoholicDrinks", "Phosphorus",
                "TotalFat", "Protein", "Alcohol", "MonoFat", "Calories",
                "Unsat_to_Sat_Fat_Ratio", "Fat_to_Calorie_Ratio", "Age", "Sex_encoded"
            ]
        }

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Diabetes Prediction API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
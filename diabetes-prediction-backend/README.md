# Diabetes Prediction Backend

This is a FastAPI backend service for predicting diabetes risk using a Random Forest Classifier.

## Prerequisites

- Python 3.8 or higher
- Required Python packages (listed in requirements.txt)

## Setup

1. Create a virtual environment (recommended):

```bash
cd diabetes-prediction-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

## Running the backend

To run the backend, use the following command:

```bash
uvicorn main:app --reload
```

Note: We have not included the model in this repository as it exceeds the 100M file limit of Github. To see the model and its working visit: 

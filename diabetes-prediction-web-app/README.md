# Diabetes Risk Prediction Application

This is a web application that predicts diabetes risk based on lifestyle factors like fiber intake, carbohydrate consumption, saturated fat intake, age, and sex.

## Project Structure

```
diabetes-prediction-app/
├── public/                  # React public files
├── src/                     # React source code
│   ├── components/          # React components
│   │   └── DiabetesForm.tsx # Form component for user inputs
│   └── App.tsx              # Main App component
├── backend/                 # Python backend
│   ├── app.py               # Flask API server
│   └── requirements.txt     # Python dependencies
└── README.md                # This file
```

## Frontend Setup

The frontend is built with React and Material-UI.

### Installation

```bash
# Navigate to the project directory
cd diabetes-prediction-app

# Install dependencies
npm install
```

### Running the Frontend

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Backend Setup

The backend is built with Flask and serves as an API for the prediction model.

### Installation

```bash
# Navigate to the backend directory
cd diabetes-prediction-app/backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Backend

```bash
# Make sure you're in the backend directory
python app.py
```

The API will be available at [http://localhost:5000](http://localhost:5000).

## Integrating Your Prediction Model

To integrate your existing Python model:

1. Import your model and any required libraries in `backend/app.py`
2. Update the `predict()` function to use your model instead of the random value
3. Add any additional model dependencies to `requirements.txt`

## API Endpoints

- `POST /predict` - Predicts diabetes risk based on provided lifestyle factors

Request body format:

```json
{
  "fiber": 15,
  "carbs": 200,
  "satFat": 20,
  "age": 35,
  "sex": "male"
}
```

Response format:

```json
{
  "risk": 45.67,
  "features": {
    "fiber": 15,
    "carbs": 200,
    "satFat": 20,
    "age": 35,
    "sex": "male"
  }
}
```

## License

This project is licensed under the MIT License.

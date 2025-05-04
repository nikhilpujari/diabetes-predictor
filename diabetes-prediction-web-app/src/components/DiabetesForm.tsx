import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface FormData {
  niacin: number;
  saturatedFat: number;
  selenium: number;
  carbs: number;
  magnesium: number;
  vitaminB6: number;
  potassium: number;
  alcoholicDrinks: number;
  phosphorus: number;
  totalFat: number;
  protein: number;
  alcohol: number;
  monoFat: number;
  calories: number;
  unsatToSatFatRatio: number;
  fatToCalorieRatio: number;
  age: number;
  sex_encoded: string;
}

interface PredictionResponse {
  risk: number;
  probability: number;
  raw_probabilities: number[];
  scaled_features: number[];
  feature_names: string[];
}

const DiabetesForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    niacin: 15,
    saturatedFat: 20,
    selenium: 55,
    carbs: 200,
    magnesium: 400,
    vitaminB6: 1.7,
    potassium: 3500,
    alcoholicDrinks: 0,
    phosphorus: 700,
    totalFat: 65,
    protein: 50,
    alcohol: 0,
    monoFat: 20,
    calories: 2000,
    unsatToSatFatRatio: 2.5,
    fatToCalorieRatio: 0.3,
    age: 35,
    sex_encoded: "0",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [predictionData, setPredictionData] =
    useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "sex_encoded" ? value : Number(value),
    });
  };

  const handleSliderChange =
    (name: keyof FormData) => (event: Event, newValue: number | number[]) => {
      setFormData({
        ...formData,
        [name]: newValue as number,
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<PredictionResponse>(
        "http://127.0.0.1:8000/predict",
        {
          Niacin: formData.niacin,
          SaturatedFat: formData.saturatedFat,
          Selenium: formData.selenium,
          Carbs: formData.carbs,
          Magnesium: formData.magnesium,
          VitaminB6: formData.vitaminB6,
          Potassium: formData.potassium,
          AlcoholicDrinks: formData.alcoholicDrinks,
          Phosphorus: formData.phosphorus,
          TotalFat: formData.totalFat,
          Protein: formData.protein,
          Alcohol: formData.alcohol,
          MonoFat: formData.monoFat,
          Calories: formData.calories,
          Unsat_to_Sat_Fat_Ratio: formData.unsatToSatFatRatio,
          Fat_to_Calorie_Ratio: formData.fatToCalorieRatio,
          Age: formData.age,
          Sex_encoded: parseInt(formData.sex_encoded),
        }
      );

      setResult(response.data.probability);
      setPredictionData(response.data);
    } catch (err) {
      setError("Failed to get prediction. Please try again later.");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Diabetes Risk Prediction
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Enter your lifestyle and nutritional details to calculate your
          diabetes risk
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {/* Basic Information */}
            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Age</Typography>
              <Slider
                value={formData.age}
                onChange={handleSliderChange("age")}
                aria-labelledby="age-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={18}
                max={100}
              />
              <TextField
                fullWidth
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">years</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Sex</Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  row
                  name="sex_encoded"
                  value={formData.sex_encoded}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Macronutrients */}
            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Calories (kcal/day)</Typography>
              <Slider
                value={formData.calories}
                onChange={handleSliderChange("calories")}
                aria-labelledby="calories-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={1000}
                max={4000}
              />
              <TextField
                fullWidth
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kcal</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Protein (g/day)</Typography>
              <Slider
                value={formData.protein}
                onChange={handleSliderChange("protein")}
                aria-labelledby="protein-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={200}
              />
              <TextField
                fullWidth
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">g</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Carbohydrates (g/day)</Typography>
              <Slider
                value={formData.carbs}
                onChange={handleSliderChange("carbs")}
                aria-labelledby="carbs-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={500}
              />
              <TextField
                fullWidth
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">g</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            {/* Fats */}
            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Total Fat (g/day)</Typography>
              <Slider
                value={formData.totalFat}
                onChange={handleSliderChange("totalFat")}
                aria-labelledby="totalFat-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={150}
              />
              <TextField
                fullWidth
                type="number"
                name="totalFat"
                value={formData.totalFat}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">g</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Saturated Fat (g/day)</Typography>
              <Slider
                value={formData.saturatedFat}
                onChange={handleSliderChange("saturatedFat")}
                aria-labelledby="saturatedFat-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
              />
              <TextField
                fullWidth
                type="number"
                name="saturatedFat"
                value={formData.saturatedFat}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">g</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Monounsaturated Fat (g/day)</Typography>
              <Slider
                value={formData.monoFat}
                onChange={handleSliderChange("monoFat")}
                aria-labelledby="monoFat-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
              />
              <TextField
                fullWidth
                type="number"
                name="monoFat"
                value={formData.monoFat}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">g</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            {/* Vitamins and Minerals */}
            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Niacin (mg/day)</Typography>
              <Slider
                value={formData.niacin}
                onChange={handleSliderChange("niacin")}
                aria-labelledby="niacin-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
              />
              <TextField
                fullWidth
                type="number"
                name="niacin"
                value={formData.niacin}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mg</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Vitamin B6 (mg/day)</Typography>
              <Slider
                value={formData.vitaminB6}
                onChange={handleSliderChange("vitaminB6")}
                aria-labelledby="vitaminB6-slider"
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={5}
              />
              <TextField
                fullWidth
                type="number"
                name="vitaminB6"
                value={formData.vitaminB6}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mg</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Magnesium (mg/day)</Typography>
              <Slider
                value={formData.magnesium}
                onChange={handleSliderChange("magnesium")}
                aria-labelledby="magnesium-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={1000}
              />
              <TextField
                fullWidth
                type="number"
                name="magnesium"
                value={formData.magnesium}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mg</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Phosphorus (mg/day)</Typography>
              <Slider
                value={formData.phosphorus}
                onChange={handleSliderChange("phosphorus")}
                aria-labelledby="phosphorus-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={2000}
              />
              <TextField
                fullWidth
                type="number"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mg</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Potassium (mg/day)</Typography>
              <Slider
                value={formData.potassium}
                onChange={handleSliderChange("potassium")}
                aria-labelledby="potassium-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={0}
                max={5000}
              />
              <TextField
                fullWidth
                type="number"
                name="potassium"
                value={formData.potassium}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mg</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Selenium (mcg/day)</Typography>
              <Slider
                value={formData.selenium}
                onChange={handleSliderChange("selenium")}
                aria-labelledby="selenium-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={200}
              />
              <TextField
                fullWidth
                type="number"
                name="selenium"
                value={formData.selenium}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mcg</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            {/* Alcohol and Ratios */}
            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Alcoholic Drinks (per week)</Typography>
              <Slider
                value={formData.alcoholicDrinks}
                onChange={handleSliderChange("alcoholicDrinks")}
                aria-labelledby="alcoholicDrinks-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={20}
              />
              <TextField
                fullWidth
                type="number"
                name="alcoholicDrinks"
                value={formData.alcoholicDrinks}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">drinks/week</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Alcohol (g/day)</Typography>
              <Slider
                value={formData.alcohol}
                onChange={handleSliderChange("alcohol")}
                aria-labelledby="alcohol-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
              />
              <TextField
                fullWidth
                type="number"
                name="alcohol"
                value={formData.alcohol}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">g</InputAdornment>
                  ),
                }}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>
                Unsaturated to Saturated Fat Ratio
              </Typography>
              <Slider
                value={formData.unsatToSatFatRatio}
                onChange={handleSliderChange("unsatToSatFatRatio")}
                aria-labelledby="unsatToSatFatRatio-slider"
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={5}
              />
              <TextField
                fullWidth
                type="number"
                name="unsatToSatFatRatio"
                value={formData.unsatToSatFatRatio}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>

            <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
              <Typography gutterBottom>Fat to Calorie Ratio</Typography>
              <Slider
                value={formData.fatToCalorieRatio}
                onChange={handleSliderChange("fatToCalorieRatio")}
                aria-labelledby="fatToCalorieRatio-slider"
                valueLabelDisplay="auto"
                step={0.05}
                marks
                min={0}
                max={1}
              />
              <TextField
                fullWidth
                type="number"
                name="fatToCalorieRatio"
                value={formData.fatToCalorieRatio}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>

            <Box sx={{ width: "100%", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Calculate Diabetes Risk"
                )}
              </Button>
            </Box>
          </Box>
        </form>

        {result !== null && predictionData && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              Prediction Results
            </Typography>

            {/* Main risk score */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: predictionData.risk === 1 ? "#d32f2f" : "#2e7d32", // red for high risk, green for low risk
              }}
            >
              {predictionData.risk === 1 ? "High Risk" : "Low Risk"}
            </Typography>

            {/* Raw model outputs */}
            <Box sx={{ mt: 3, textAlign: "left" }}>
              <Typography variant="h6" gutterBottom>
                Model Details:
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Binary Prediction:{" "}
                {predictionData.risk === 1 ? "High Risk (1)" : "Low Risk (0)"}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Confidence: {(predictionData.probability * 100).toFixed(2)}%
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                Raw Probabilities: [
                {predictionData.raw_probabilities
                  .map((p: number) => p.toFixed(4))
                  .join(", ")}
                ]
              </Typography>

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Scaled Feature Values:
              </Typography>
              <Box sx={{ maxHeight: "200px", overflowY: "auto", mb: 2 }}>
                {predictionData.feature_names.map(
                  (name: string, index: number) => (
                    <Typography key={name} variant="body2" sx={{ mb: 0.5 }}>
                      {name}: {predictionData.scaled_features[index].toFixed(4)}
                    </Typography>
                  )
                )}
              </Box>
            </Box>

            {/* Risk assessment */}
            <Typography variant="body1" sx={{ mt: 2 }}>
              {predictionData.risk === 1
                ? "High risk. Please consult with a healthcare professional."
                : "Low risk. Maintain your healthy lifestyle!"}
            </Typography>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "#ffebee",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DiabetesForm;

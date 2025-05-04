from sklearn.ensemble import RandomForestClassifier
import numpy as np
import pickle

# Create sample data
X = np.random.rand(100, 18)  # 18 features
y = np.random.randint(0, 2, 100)  # Binary classification

# Create and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save the model
with open('random_forest_diabetes_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Test model created and saved successfully!") 
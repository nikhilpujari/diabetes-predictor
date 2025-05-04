from sklearn.preprocessing import StandardScaler
import numpy as np
import pickle

# Create sample data with the same features as your input
sample_data = np.random.rand(100, 18)  # 18 features

# Create and fit the scaler
scaler = StandardScaler()
scaler.fit(sample_data)

# Save the scaler
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("New scaler created and saved successfully!") 
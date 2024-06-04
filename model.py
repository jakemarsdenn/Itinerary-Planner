import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
import joblib


def recommend_activity(weather, time_of_day, budget, environment, group_size, physicality_level):
    df = pd.read_csv('activities.csv')
    model = load_model('activity_recommender_model.h5')
    preprocessor = joblib.load('preprocessor.joblib')

    input_df = pd.DataFrame({
        'Weather': [weather],
        'Time of day': [time_of_day],
        'Budget': [budget],
        'Environment': [environment],
        'Group size': [group_size],
        'Physicality level': [physicality_level]
    })

    input_processed = preprocessor.transform(input_df)
    prediction = model.predict(input_processed)
    activity_index = np.argmax(prediction, axis=1)[0]
    activity = pd.get_dummies(df['Activity']).columns[activity_index]

    return activity


# recommended_activity = recommend_activity('sunny', 'morning', 'low', 'indoors', '4+', 1)
# print(f"Recommended Activity: {recommended_activity}")
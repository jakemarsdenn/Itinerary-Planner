import random
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from model import recommend_activity
import requests

app = Flask(__name__)
app.secret_key = 'secret_key'
# session = {}

YELP_API_KEY = '-xzPL1litWa31uPPsXYBUtvqKZFgMwA2sUdnAZfp_Wd2gj8UsrXiGYdYbPzHFv8BYMYw0Dam6eJpuj3hntP36joOQNIxzu0xJcCvDDllGHkZ77rSj-lQpr-CqO1MZnYx'
GOOGLE_MAPS_API_KEY = 'AIzaSyAZJwxQoA5o9KxSNlmzFkK7qrw3b-5pehk'
WEATHER_API_KEY = '8edd014dc7b978cb33195c8a32879e51'


@app.route('/maps')
def maps():
    return render_template('maps.html')

@app.route('/weather')
def weather():
    return render_template('weather.html')

@app.route('/survey')
def survey():
    return render_template('survey.html')

def search_yelp(term, location):
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': f'Bearer {YELP_API_KEY}',
    }
    offset = random.randint(0, 50)
    params = {
        'term': term,
        'location': location,
        'limit': 4,  # Number of results to fetch
        'sort_by': 'rating',  # Sort by best rating
        'offset': offset  # Adding random offset to get different results
    }
    response = requests.get(url, headers=headers, params=params)
    print(f"Making Yelp API request with offset: {offset}")
    if response.status_code != 200:
        print(f"Error fetching Yelp data: {response.status_code}, {response.text}")
        return {}
    response_json = response.json()
    print("Yelp API Response:", response_json)  # Debug log
    return response_json

def calculate_distance_and_time(user_location, destination):
    url = 'https://maps.googleapis.com/maps/api/directions/json'
    params = {
        'origin': f"{user_location['lat']},{user_location['lng']}",
        'destination': f"{destination['latitude']},{destination['longitude']}",
        'key': GOOGLE_MAPS_API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()
    if data['status'] == 'OK':
        route = data['routes'][0]['legs'][0]
        duration = route['duration']['text']
        distance_km = route['distance']['value'] / 1000
        distance_miles = distance_km * 0.621371
        return duration, distance_miles
    else:
        print(f"Error fetching directions: {data['status']}, {data.get('error_message', '')}")
        return None, None

@app.route('/plan', methods=['POST'])
def plan():
    try:
        tasks = request.form.getlist('task')  # Get all tasks from the form
        locations = request.form.getlist('location')  # Get all locations from the form
        
        # this is useless but when i delete it, page stops working.. idk just leave it i guess
        user = {'firstname': "Mr.", 'lastname': "My Father's Son"} 

        print("tasks: ", tasks)
        print("locations: ", locations)
        return render_template('plan.html', tasks=tasks, locations=locations, user=user, GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY)
    except Exception as e:
        print(f"Error: {e}")
        return "There was an error processing your request.", 500

@app.route('/recommendations')
def recommendations():
    task = request.args.get('task')
    location = request.args.get('location')
    print(f"Task: {task}, Location: {location}")  # Add logging
    if not task or not location:
        return redirect(url_for('index'))
    try:
        recommendations = search_yelp(task, location)
        if 'businesses' not in recommendations:
            print(f"Error: Unexpected response format: {recommendations}")
            return {'error': 'Unexpected response format from Yelp API'}, 500
        user_location = {
            'lat': 33.9416,  # Example user location (Los Angeles International Airport)
            'lng': -118.4085
        }
        for rec in recommendations['businesses']:
            duration, distance_miles = calculate_distance_and_time(user_location, rec['coordinates'])
            rec['duration'] = duration
            rec['distance'] = f"{distance_miles:.1f} miles"
        print(f"Recommendations Data: {recommendations['businesses']}")  # Add logging
        return render_template('recommendations.html', task=task, recommendations=recommendations['businesses'], location=location, GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY)
    except Exception as e:
        print(f"Error: {e}")
        return "There was an error processing your request.", 500

@app.route('/refresh_recommendations')
def refresh_recommendations():
    task = request.args.get('task')
    location = request.args.get('location')
    if not task or not location:
        print(f"Error: Missing task or location - task: {task}, location: {location}")
        return jsonify({'error': 'Missing task or location'}), 400
    try:
        recommendations = search_yelp(task, location)
        if 'businesses' not in recommendations:
            print(f"Error: Unexpected response format: {recommendations}")
            return jsonify({'error': 'Unexpected response format from Yelp API'}), 500
        user_location = {
            'lat': 33.9416,  # Example user location (Los Angeles International Airport)
            'lng': -118.4085
        }
        for rec in recommendations['businesses']:
            duration, distance_miles = calculate_distance_and_time(user_location, rec['coordinates'])
            rec['duration'] = duration
            rec['distance'] = f"{distance_miles:.1f} miles"
        return jsonify({'recommendations': recommendations['businesses']})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'There was an error processing your request.'}), 500

@app.route('/submit-survey', methods=['POST'])
def survey_recommendation():
    weather = request.form.get('weather-preference')
    time_of_day = request.form.get('time-preference')
    budget = request.form.get('budget-preference')
    environment = request.form.get('environment-preference')
    group_size = request.form.get('group-preference')
    physicality_level = request.form.get('physicality-preference')
    recommended_activity = recommend_activity(weather, time_of_day, budget, environment, group_size, physicality_level)
    print("reco " + recommended_activity)
    session['recommended_activity'] = recommended_activity
    return redirect("/")


@app.route('/clear-recommended-activity', methods=['POST'])
def clear_recommended_activity():
    session.pop('recommended_activity', None)
    return '', 204


@app.route('/weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    zip = data.get('zip')
    api_url = f'https://api.openweathermap.org/data/2.5/weather?zip={zip},us&appid={WEATHER_API_KEY}'
    response = requests.get(api_url)
    weather_data = response.json()
    return jsonify(weather_data)

@app.route('/select_place', methods=['POST'])
def select_place():
    selected_place_name = request.form['selected_place_name']
    selected_place_address = request.form['selected_place_address']
    session['selected_place_name'] = selected_place_name
    session['selected_place_address'] = selected_place_address
    print(f"Selected Place Name: {selected_place_name}, Selected Place Address: {selected_place_address}")  # Debugging log
    return redirect(url_for('index'))


@app.route('/')
def index():
    selected_place_name = session.get('selected_place_name', '')
    selected_place_address = session.get('selected_place_address', '')
    print(f'Index Route - Selected Place: {selected_place_name}, Address: {selected_place_address}')  # Debugging log
    return render_template('index.html', GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY, selected_place_name=selected_place_name, selected_place_address=selected_place_address)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) #Final working chnage

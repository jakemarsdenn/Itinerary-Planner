from flask import Flask, render_template, request, redirect, url_for
import requests

app = Flask(__name__)
app.secret_key = 'secret_key'

YELP_API_KEY = '-xzPL1litWa31uPPsXYBUtvqKZFgMwA2sUdnAZfp_Wd2gj8UsrXiGYdYbPzHFv8BYMYw0Dam6eJpuj3hntP36joOQNIxzu0xJcCvDDllGHkZ77rSj-lQpr-CqO1MZnYx'  # Replace this with your actual Yelp API key
GOOGLE_MAPS_API_KEY = 'AIzaSyAZJwxQoA5o9KxSNlmzFkK7qrw3b-5pehk'

def search_yelp(term, location):
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {
        'Authorization': f'Bearer {YELP_API_KEY}',
    }
    params = {
        'term': term,
        'location': location,
        'limit': 4,  # Number of results to fetch
        'sort_by': 'rating',  # Sort by best rating
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

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
        return None, None

@app.route('/')
def index():
    return render_template('index.html', GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY)

@app.route('/plan', methods=['POST'])
def plan():
    try:
        task = request.form['task']
        location = request.form['location']
        beaches = search_yelp('beach', location)
        restaurants = search_yelp('restaurant', location)
        return render_template('plan.html', task=task, beaches=beaches['businesses'], restaurants=restaurants['businesses'], GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY)
    except Exception as e:
        print(f"Error: {e}")
        return "There was an error processing your request.", 500

@app.route('/recommendations')
def recommendations():
    task = request.args.get('task')
    location = request.args.get('location')
    if not task or not location:
        return redirect(url_for('index'))
    try:
        recommendations = search_yelp(task, location)
        user_location = {
            'lat': 33.9416,  # Example user location (Los Angeles International Airport)
            'lng': -118.4085
        }
        for rec in recommendations['businesses']:
            duration, distance_miles = calculate_distance_and_time(user_location, rec['coordinates'])
            rec['duration'] = duration
            rec['distance'] = f"{distance_miles:.1f} miles"
        return render_template('recommendations.html', task=task, recommendations=recommendations['businesses'], GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY)
    except Exception as e:
        print(f"Error: {e}")
        return "There was an error processing your request.", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

# This is the latest version ^
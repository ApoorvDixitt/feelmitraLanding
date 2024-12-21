from flask import Flask, request, jsonify
from controllers.journalController import get_personalized_recommendations

app = Flask(__name__)

@app.route('/api/journal', methods=['POST'])
def journal_entry():
    data = request.json
    user_name = data.get('userName')
    date_of_birth = data.get('dateOfBirth')
    journal_entry = data.get('journalEntry')

    recommendations = get_personalized_recommendations(user_name, date_of_birth, journal_entry)

    if recommendations:
        return jsonify(recommendations), 200
    else:
        return jsonify({"error": "Failed to get recommendations"}), 500

if __name__ == "__main__":
    app.run(port=3000) 
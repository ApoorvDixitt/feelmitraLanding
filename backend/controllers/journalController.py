import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Configure the API key
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model with generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-8b",
    generation_config=generation_config,
)

def chunk_text(text, chunk_size=100):
    """Chunk the input text into smaller pieces."""
    words = text.split()
    for i in range(0, len(words), chunk_size):
        yield ' '.join(words[i:i + chunk_size])

def get_personalized_recommendations(user_name, date_of_birth, journal_entry):
    # Chunk the journal entry for better processing
    chunks = list(chunk_text(journal_entry, chunk_size=100))  # Adjust chunk size as needed

    # Construct the input for the AI model
    input_text = (
        f"User Name: {user_name}\n"
        f"Date of Birth: {date_of_birth}\n"
        "Journal Entry Chunks:\n"
    )

    for idx, chunk in enumerate(chunks):
        input_text += f"Chunk {idx + 1}: {chunk}\n"

    input_text += (
        "\nBased on the above information, provide personalized recommendations directly to the user. "
        "Include nutritional advice, mindfulness exercises, and yoga recommendations. "
        "Act as a virtual psychologist to help the user reflect on their day and suggest ways to improve their mood and well-being. "
        "Return the recommendations in the following structured format:\n"
        "{\n"
        "    \"journal_insights\": [],\n"
        "    \"mental_wellbeing_insights\": [],\n"
        "    \"nutritional_recommendations\": [],\n"
        "    \"personal_insights\": [],\n"
        "    \"personalized_exercises\": [],\n"
        "    \"recommendations\": []\n"
        "}\n"
    )

    # Start a chat session
    chat_session = model.start_chat(history=[])

    # Send the constructed input to the AI model
    response = chat_session.send_message(input_text)

    # Check if the response is valid
    if response:
        try:
            # Attempt to parse the response as JSON
            recommendations = json.loads(response.text)

            # Ensure the response has the correct structure
            structured_response = {
                "journal_insights": recommendations.get("journal_insights", []),
                "mental_wellbeing_insights": recommendations.get("mental_wellbeing_insights", []),
                "nutritional_recommendations": recommendations.get("nutritional_recommendations", []),
                "personal_insights": recommendations.get("personal_insights", []),
                "personalized_exercises": recommendations.get("personalized_exercises", []),
                "recommendations": recommendations.get("recommendations", [])
            }

            return structured_response  # Return the structured recommendations
        except json.JSONDecodeError:
            print("Error: Response is not valid JSON.")
            return {
                "recommendations": []  # Return an empty list if parsing fails
            }
    else:
        print("Error: No response received from the AI model.")
        return None
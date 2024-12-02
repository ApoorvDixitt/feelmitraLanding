import streamlit as st
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import numpy as np
from vosk import Model, KaldiRecognizer
import pyaudio
import json
import google.generativeai as genai
import ssl
import plotly.express as px
import pandas as pd

# Page config
st.set_page_config(
    page_title="Emotion Analysis",
    page_icon="🎭",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stButton>button {
        width: 100%;
        border-radius: 10px;
        height: 3em;
    }
    .css-1v0mbdj {
        margin-top: 1em;
    }
    </style>
""", unsafe_allow_html=True)

# Load Go Emotions RoBERTa model and tokenizer
@st.cache_resource
def load_model():
    model_name = "SamLowe/roberta-base-go_emotions"
    return (
        AutoModelForSequenceClassification.from_pretrained(model_name),
        AutoTokenizer.from_pretrained(model_name)
    )

roberta_model, tokenizer = load_model()

# Create Streamlit UI
st.title("🎭 Emotion Analysis with RoBERTa")
st.write("Analyze the emotional content of your text using advanced AI")

with st.expander("ℹ️ About this app", expanded=False):
    st.write("""
    This emotion analyzer uses the RoBERTa model trained on the GoEmotions dataset.
    It can detect 27 different emotions plus neutral, providing detailed insight into the emotional content of text.
    You can either type your text or use the voice input feature to analyze emotions.
    """)

# Initialize Vosk model
try:
    ssl._create_default_https_context = ssl._create_unverified_context
    vosk_model = Model(lang="en-us")
    rec = KaldiRecognizer(vosk_model, 16000)
except Exception as e:
    st.error(f"Error loading Vosk model: {str(e)}")
    st.info("Please install Vosk model by running: python -m pip install vosk")

def get_voice_input():
    try:
        p = pyaudio.PyAudio()
        stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
        stream.start_stream()

        with st.status("🎤 Recording...") as status:
            st.write("Speak now and click 'Stop Recording' when done")
            
            stop_recording = st.button("🛑 Stop Recording", type="primary")
            
            text = ""
            while not stop_recording:
                data = stream.read(4000, exception_on_overflow=False)
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    if result.get("text", ""):
                        text += " " + result["text"]
                        st.write(f"Recognized: {result['text']}")
            
            final_result = json.loads(rec.FinalResult())
            if final_result.get("text", ""):
                text += " " + final_result["text"]
            
            status.update(label="Recording complete!", state="complete")

        stream.stop_stream()
        stream.close()
        p.terminate()
        
        if text.strip():
            st.success("Voice input captured successfully!")
            return text.strip()
        else:
            st.warning("No speech detected. Please try again.")
            return None
            
    except Exception as e:
        st.error(f"Error during voice recording: {str(e)}")
        return None

# Initialize session state for text input if not exists
if 'text_input' not in st.session_state:
    st.session_state.text_input = ""

# Input section
col1, col2 = st.columns([3, 1])
with col1:
    text_input = st.text_area("Input your text here:", value=st.session_state.text_input, height=100, placeholder="Type or paste your text here...")
with col2:
    if st.button("🎤 Start Voice Input", use_container_width=True):
        voice_text = get_voice_input()
        if voice_text:
            st.session_state.text_input = voice_text
            st.experimental_rerun()

if st.button("🔍 Analyze Emotions", type="primary", use_container_width=True):
    if text_input:
        with st.spinner("Analyzing emotions..."):
            # Tokenize and get prediction
            encoded_text = tokenizer(text_input, return_tensors='pt')
            output = roberta_model(**encoded_text)
            scores = output[0][0].detach().numpy()
            scores = softmax(scores)
            
            # Create emotions dictionary
            emotions = {
                0: "admiration 🤩", 1: "amusement 😄", 2: "anger 😠",
                3: "annoyance 😒", 4: "approval 👍", 5: "caring 🤗",
                6: "confusion 😕", 7: "curiosity 🤔", 8: "desire 😍",
                9: "disappointment 😞", 10: "disapproval 👎", 11: "disgust 🤢",
                12: "embarrassment 😳", 13: "excitement 🤪", 14: "fear 😨",
                15: "gratitude 🙏", 16: "grief 😢", 17: "joy 😊",
                18: "love ❤️", 19: "nervousness 😰", 20: "optimism 🌟",
                21: "pride 🦁", 22: "realization 💡", 23: "relief 😌",
                24: "remorse 😔", 25: "sadness 😭", 26: "surprise 😲",
                27: "neutral 😐"
            }
            
            # Create visualization data
            top_emotions = np.argsort(scores)[-5:][::-1]
            
            # Display results in tabs
            tab1, tab2 = st.tabs(["📊 Charts", "📈 Detailed Analysis"])
            
            with tab1:
                col1, col2 = st.columns(2)
                
                with col1:
                    # Bar chart
                    df_bar = pd.DataFrame({
                        'Emotion': [emotions[i] for i in top_emotions],
                        'Score': [scores[i]*100 for i in top_emotions]
                    })
                    fig_bar = px.bar(df_bar, x='Emotion', y='Score',
                                   title='Top 5 Emotions Detected',
                                   color='Score',
                                   color_continuous_scale='Viridis')
                    st.plotly_chart(fig_bar, use_container_width=True)
                
                with col2:
                    # Pie chart
                    df_pie = pd.DataFrame({
                        'Emotion': [emotions[i] for i in top_emotions],
                        'Score': [scores[i]*100 for i in top_emotions]
                    })
                    fig_pie = px.pie(df_pie, values='Score', names='Emotion',
                                   title='Emotion Distribution',
                                   hole=0.4)
                    st.plotly_chart(fig_pie, use_container_width=True)
            
            with tab2:
                # Metrics display
                cols = st.columns(5)
                for idx, (col, emotion_idx) in enumerate(zip(cols, top_emotions)):
                    with col:
                        emotion = emotions[emotion_idx]
                        score = scores[emotion_idx]
                        st.metric(emotion, f"{score*100:.1f}%")
                
                # Additional analysis
                dominant_emotion = emotions[np.argmax(scores)]
                st.subheader("Primary Emotion")
                st.info(f"The dominant emotion detected is: {dominant_emotion}")
                
                if len([s for s in scores if s > 0.2]) > 2:
                    st.warning("ℹ️ Multiple strong emotions detected - this text appears to express complex feelings!")
            
            # Gemini API response
            try:
                GEMINI_API_KEY = "AIzaSyDjaccSQRtRxVfmuDM5-Gfzli2DS3hdknk"
                genai.configure(api_key=GEMINI_API_KEY)
                
                generation_config = {
                    "temperature": 2,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 4096,
                }

                safety_settings = [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
                ]
                
                model = genai.GenerativeModel("gemini-pro", 
                                            generation_config=generation_config,
                                            safety_settings=safety_settings)
                
                tone_map = {
                    "joy": "respond in an upbeat, celebratory tone with party emojis 🎉",
                    "sadness": "respond with empathy and gentle encouragement 🫂",
                    "anger": "respond with calming wisdom and maybe a touch of humor to lighten the mood 😌",
                    "fear": "respond with reassurance and strength 💪",
                    "surprise": "respond with matching excitement and wonderment 🤯",
                    "disgust": "respond with a bit of playful sarcasm and humor 😏",
                    "neutral": "respond in a casual, friendly way 😊"
                }
                
                base_emotion = dominant_emotion.split()[0].lower()
                tone_instruction = tone_map.get(base_emotion, "respond supportively")
                
                prompt = f"""Given the text: '{text_input}' which expresses {dominant_emotion}, 
                         {tone_instruction}. Keep it to 1-2 sentences and make it conversational."""
                
                response = model.generate_content(prompt)
                
                st.subheader("AI Response")
                st.success(response.text)
                
            except Exception as e:
                st.error(f"Error generating AI response: {str(e)}")
    
    else:
        st.warning("Please enter some text or use voice input to analyze!")

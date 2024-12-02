import streamlit as st
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import numpy as np
import plotly.express as px
import pandas as pd
import google.generativeai as genai
from streamlit_lottie import st_lottie
import requests
import json
import firebase_admin
from firebase_admin import credentials, firestore
import datetime
from google_auth_oauthlib.flow import Flow

# Move page config to top, right after imports
st.set_page_config(
    page_title="Mindful Journal | Emotion Analysis",
    page_icon="🌟",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize Firebase
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(st.secrets["firebase_credentials"])
    except:
        # Temporary development fallback
        st.warning("Running without Firebase authentication")
        class MockDB:
            def collection(self, *args): return self
            def document(self, *args): return self
            def get(self, *args): return None
        db = MockDB()
    else:
        firebase_admin.initialize_app(cred)
        db = firestore.Client()

# Google OAuth Configuration
GOOGLE_CLIENT_ID = "14682309850-htk2no8jma22grbvbpd4qt4gafa8jcb8.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
REDIRECT_URI = "https://feelmitra.streamlit.app/"  # Update this to your actual Streamlit app URL

# Session state initialization for auth
if 'user' not in st.session_state:
    st.session_state.user = None
if 'auth_token' not in st.session_state:
    st.session_state.auth_token = None

def authenticate_user():
    if not st.session_state.user:
        st.markdown("""
        <div style='text-align: center; padding: 2rem;'>
            <h2>Welcome to Mindful Journal</h2>
            <p>Please sign in to continue your journaling journey</p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("🔐 Sign in with Google", key="google_signin"):
            try:
                flow = Flow.from_client_config(
                    {
                        "web": {
                            "client_id": GOOGLE_CLIENT_ID,
                            "client_secret": GOOGLE_CLIENT_SECRET,
                            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            "token_uri": "https://oauth2.googleapis.com/token",
                            "redirect_uris": [REDIRECT_URI],
                            "javascript_origins": [REDIRECT_URI.rstrip("/")]
                        }
                    },
                    scopes=["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
                )
                
                authorization_url, state = flow.authorization_url(
                    access_type='offline',
                    include_granted_scopes='true',
                    prompt='consent',
                    redirect_uri=REDIRECT_URI  # Explicitly set redirect_uri
                )
                
                st.markdown(f'<meta http-equiv="refresh" content="0;url={authorization_url}">', unsafe_allow_html=True)
                
            except Exception as e:
                st.error(f"Authentication failed: {str(e)}")
        return False
    return True

def get_user_streak(user_id):
    """Calculate user's journaling streak"""
    user_ref = db.collection('users').document(user_id)
    journal_ref = user_ref.collection('journal_entries')
    
    # Get all entry dates
    entries = journal_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).get()
    dates = [entry.to_dict()['timestamp'].date() for entry in entries]
    
    if not dates:
        return 0
        
    # Calculate streak
    streak = 1
    today = datetime.date.today()
    
    for i in range(len(dates) - 1):
        if (dates[i] - dates[i + 1]).days == 1:
            streak += 1
        else:
            break
            
    # Check if streak is still active (user journaled today or yesterday)
    if (today - dates[0]).days > 1:
        streak = 0
        
    return streak

def save_journal_entry(text, emotions_data):
    """Save journal entry to Firestore"""
    if st.session_state.user:
        user_id = st.session_state.user['email']
        user_ref = db.collection('users').document(user_id)
        journal_ref = user_ref.collection('journal_entries')
        
        entry_data = {
            'text': text,
            'emotions': emotions_data,
            'timestamp': datetime.datetime.now(),
            'mood': st.session_state.current_mood if 'current_mood' in st.session_state else None
        }
        
        journal_ref.add(entry_data)
        
        # Update user stats
        stats_ref = user_ref.collection('stats').document('journal_stats')
        stats = stats_ref.get()
        
        if stats.exists:
            current_stats = stats.to_dict()
            stats_ref.update({
                'total_entries': current_stats.get('total_entries', 0) + 1,
                'last_entry_date': datetime.datetime.now()
            })
        else:
            stats_ref.set({
                'total_entries': 1,
                'last_entry_date': datetime.datetime.now(),
                'join_date': datetime.datetime.now()
            })

# Add this to your sidebar
def display_user_stats():
    if st.session_state.user:
        with st.sidebar:
            st.divider()
            st.markdown("### 📊 Your Journal Stats")
            
            user_id = st.session_state.user['email']
            streak = get_user_streak(user_id)
            
            # Get user stats from Firestore
            user_ref = db.collection('users').document(user_id)
            stats_ref = user_ref.collection('stats').document('journal_stats')
            stats = stats_ref.get()
            
            if stats.exists:
                stats_data = stats.to_dict()
                total_entries = stats_data.get('total_entries', 0)
                join_date = stats_data.get('join_date', datetime.datetime.now())
                days_since_joining = (datetime.datetime.now() - join_date).days
                
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("✍️ Streak", f"{streak} days")
                with col2:
                    st.metric("📝 Total Entries", total_entries)
                
                st.progress(min(streak/30, 1.0), f"Monthly Goal: {streak}/30 days")
                
                if streak >= 7:
                    st.success(f"🎉 Amazing! You've been journaling for {streak} days straight!")
                elif streak >= 3:
                    st.info(f"🌟 Keep going! You're building a great habit!")
                else:
                    st.info("💫 Start your journaling streak today!")

# Load animation function (move this to the top, after imports)
def load_lottie_url(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

lottie_journal = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_bhebjzpu.json")

# Initialize session state for mood selection
if 'mood_selected' not in st.session_state:
    st.session_state.mood_selected = False
if 'current_mood' not in st.session_state:
    st.session_state.current_mood = None

# Welcome Page with Mood Selection
if not st.session_state.mood_selected:
    # Hide default menu
    st.markdown("""
        <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        .welcome-page {
            text-align: center;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .mood-container {
            margin-top: 2rem;
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
        }
        </style>
    """, unsafe_allow_html=True)

    # Welcome Content
    st.markdown("""
        <div class='welcome-page'>
            <h1>🌟 Welcome to Mindful Journal</h1>
            <p style='font-size: 1.2rem; color: #666;'>
                Your personal space for emotional reflection and growth
            </p>
        </div>
    """, unsafe_allow_html=True)

    # Add animation
    st_lottie(lottie_journal, height=300)

    # Mood Selection Section
    st.markdown("<div class='mood-container'>", unsafe_allow_html=True)
    st.markdown("### How are you feeling today?")
    
    # Create two columns for mood categories
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Positive Emotions")
        positive_moods = {
            "😊 Joyful": "Feeling happy and content",
            "🤩 Excited": "Feeling enthusiastic and energetic",
            "😌 Peaceful": "Feeling calm and serene",
            "🥰 Grateful": "Feeling thankful and blessed",
            "🌟 Inspired": "Feeling creative and motivated"
        }
        positive_mood = st.radio(
            "Select a positive emotion:",
            options=list(positive_moods.keys()),
            label_visibility="collapsed"
        )
        if positive_mood:
            st.info(positive_moods[positive_mood])

    with col2:
        st.markdown("#### Other Emotions")
        other_moods = {
            "😐 Neutral": "Neither positive nor negative",
            "😕 Confused": "Feeling uncertain or puzzled",
            "😔 Sad": "Feeling down or blue",
            "😤 Frustrated": "Feeling annoyed or stuck",
            "😰 Anxious": "Feeling worried or stressed"
        }
        other_mood = st.radio(
            "Select another emotion:",
            options=list(other_moods.keys()),
            label_visibility="collapsed"
        )
        if other_mood:
            st.info(other_moods[other_mood])

    # Mood Intensity Slider
    st.markdown("#### How intense is this feeling?")
    intensity = st.slider("Intensity", 1, 10, 5)
    
    # Additional Context
    st.markdown("#### Would you like to add any context? (Optional)")
    mood_context = st.text_area("", placeholder="What's making you feel this way?", max_chars=200)

    # Continue Button
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        if st.button("Begin Journaling", type="primary", use_container_width=True):
            selected_mood = positive_mood if positive_mood else other_mood
            if selected_mood:
                st.session_state.mood_selected = True
                st.session_state.current_mood = {
                    "mood": selected_mood,
                    "intensity": intensity,
                    "context": mood_context
                }
                st.rerun()
            else:
                st.warning("Please select a mood to continue")

    st.markdown("</div>", unsafe_allow_html=True)

else:
    # Add mood info to sidebar in main journaling page
    with st.sidebar:
        st.markdown("### 🎭 Current Mood")
        mood_info = st.session_state.current_mood
        st.markdown(f"**Mood:** {mood_info['mood']}")
        st.markdown(f"**Intensity:** {'🟦' * mood_info['intensity']}")
        if mood_info['context']:
            st.markdown(f"**Context:** {mood_info['context']}")
        
        if st.button("Change Mood"):
            st.session_state.mood_selected = False
            st.rerun()

    # Your existing main content code goes here...
    # (The rest of your journaling app code)

# Enhanced Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .stButton>button {
        width: 100%;
        border-radius: 15px;
        height: 3.5em;
        background: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);
        color: white;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .css-1v0mbdj {
        margin-top: 1.5em;
    }
    .stTextArea>div>div>textarea {
        border-radius: 10px;
        border: 2px solid #e0e0e0;
        padding: 15px;
        font-size: 16px;
        transition: all 0.3s ease;
    }
    .stTextArea>div>div>textarea:focus {
        border-color: #6a11cb;
        box-shadow: 0 0 10px rgba(106, 17, 203, 0.2);
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

# Simplified sidebar
with st.sidebar:
    st.title("✨ Journey Settings")
    st.divider()
    
    st.markdown("### 📝 Journal Prompts")
    
    def generate_prompt():
        try:
            prompt_request = """Generate a thought-provoking and introspective journaling prompt. 
            Make it personal, emotional, and engaging. Keep it to one sentence. 
            Examples: 'What made you smile today?' or 'Describe a moment that challenged your perspective recently.'"""
            
            response = model.generate_content(prompt_request)
            return response.text.strip()
        except Exception as e:
            # Fallback prompts in case of API issues
            # Generate fallback prompts using Gemini API
            try:
                fallback_prompt = """Generate 4 short journaling prompts that are:
                - Personal and reflective
                - One sentence each
                - End with question marks
                - Focus on emotions and daily experiences
                Format as a Python list."""
                
                fallback_response = model.generate_content(fallback_prompt)
                default_prompts = eval(fallback_response.text)
            except:
                # Ultimate fallback if Gemini API call fails
                default_prompts = [
                    "What made you smile today?",
                    "Describe a challenge you overcame recently?", 
                    "What are you grateful for right now?",
                    "How are your emotions evolving today?"
                ]
            return np.random.choice(default_prompts)
    
    if st.button("Get Random Prompt"):
        ai_prompt = generate_prompt()
        st.info(ai_prompt)

# Main Content
col1, col2 = st.columns([2, 1])
with col1:
    st.title("🌟 Mindful Journal")
    st.markdown("""
    <h3 style='color: #666; font-weight: 400;'>
    Transform your thoughts into emotional insights with AI-powered analysis
    </h3>
    """, unsafe_allow_html=True)
with col2:
    st_lottie(lottie_journal, height=200)

with st.expander("✨ About Your Mindful Journal", expanded=False):
    st.write("""
    Welcome to your personal space for emotional reflection and growth! 
    
    This advanced journaling tool combines:
    - 🤖 AI-powered emotion analysis
    - 📊 Beautiful visualization of your emotional landscape
    - 💭 Personalized AI responses to support your journey
    - 🎯 27+ emotion detection capabilities
    
    Start writing to discover the depths of your emotional world!
    """)

# Initialize session states
if 'entries' not in st.session_state:
    st.session_state.entries = []
if 'text_input' not in st.session_state:
    st.session_state.text_input = ""

# Enhanced Input Section
text_input = st.text_area(
    "🖋️ Write your thoughts...",
    value=st.session_state.text_input,
    height=150,
    placeholder="Let your thoughts flow freely... How are you feeling today?"
)

col1, col2, col3 = st.columns([1,1,1])
with col1:
    analyze_button = st.button("🔮 Analyze Emotions", type="primary", use_container_width=True)
with col2:
    save_button = st.button("💫 Save Entry", use_container_width=True)
with col3:
    clear_button = st.button("🗑 Clear", use_container_width=True)

if clear_button:
    text_input = ""
    st.session_state.text_input = ""
    st.rerun()

# Update session state when text changes
if text_input != st.session_state.text_input:
    st.session_state.text_input = text_input

if save_button and text_input:
    if st.session_state.user:
        # Initialize empty emotions_data
        emotions_data = {
            'top_emotions': [],
            'scores': []
        }
        
        # Only try to get analysis results if they exist in session state
        if 'current_analysis' not in st.session_state:
            st.session_state.current_analysis = None
            
        if st.session_state.current_analysis:
            emotions_data = st.session_state.current_analysis
            
        save_journal_entry(text_input, emotions_data)
        st.success("✨ Entry saved to your journal!")
        display_user_stats()
    else:
        st.warning("Please sign in to save your journal entry")

if analyze_button:
    if text_input:
        with st.spinner("✨ Analyzing your emotional landscape..."):
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
            
            # Enhanced visualization with animations and interactivity
            tab1, tab2, tab3 = st.tabs(["📊 Emotional Landscape", "Detailed Analysis", "📖 Journal Insights"])
            
            with tab1:
                col1, col2 = st.columns(2)
                
                with col1:
                    # Non-interactive Line Chart
                    df_line = pd.DataFrame({
                        'Emotion': [emotions[i] for i in top_emotions],
                        'Score': [scores[i]*100 for i in top_emotions]
                    })
                    fig_line = px.line(df_line, 
                                     x='Emotion', 
                                     y='Score',
                                     title='Top 5 Emotions Detected',
                                     markers=True)
                    
                    fig_line.update_traces(
                        mode='lines+markers+text',
                        text=df_line['Score'].apply(lambda x: f'{x:.1f}%'),
                        textposition='top center',
                        line=dict(width=3),
                        marker=dict(size=10)
                    )
                    
                    fig_line.update_layout(
                        plot_bgcolor='rgba(0,0,0,0)',
                        paper_bgcolor='rgba(0,0,0,0)',
                        font_size=12,
                        height=400,
                        showlegend=False,
                        xaxis_title="",
                        yaxis_title="Confidence Score (%)",
                        title_x=0.5,
                        title_font_size=16,
                        margin=dict(l=20, r=20, t=40, b=20),
                        xaxis=dict(
                            showgrid=False,
                            showline=True,
                            linecolor='rgba(0,0,0,0.2)',
                            fixedrange=True  # Disable zoom/pan
                        ),
                        yaxis=dict(
                            showgrid=True,
                            gridcolor='rgba(0,0,0,0.1)',
                            showline=True,
                            linecolor='rgba(0,0,0,0.2)',
                            zeroline=False,
                            fixedrange=True  # Disable zoom/pan
                        )
                    )
                    
                    # Display as static plot
                    st.plotly_chart(
                        fig_line, 
                        use_container_width=True, 
                        config={
                            'displayModeBar': False,  # Hide the mode bar
                            'staticPlot': True,       # Make plot completely static
                            'responsive': True        # Keep responsiveness for container width
                        }
                    )
                
                with col2:
                    # Enhanced Pie Chart
                    df_pie = pd.DataFrame({
                        'Emotion': [emotions[i] for i in top_emotions],
                        'Score': [scores[i]*100 for i in top_emotions]
                    })
                    fig_pie = px.pie(df_pie, 
                                    values='Score', 
                                    names='Emotion',
                                    title='Emotion Distribution',
                                    hole=0.6,  # Increased donut hole
                                    color_discrete_sequence=px.colors.qualitative.Set3)
                    
                    fig_pie.update_traces(
                        textposition='outside',
                        textinfo='label+percent',
                        hovertemplate='<b>%{label}</b><br>Score: %{value:.1f}%<extra></extra>',
                        marker=dict(line=dict(color='white', width=2)),
                        pull=[0.05 if i == 0 else 0 for i in range(len(top_emotions))],  # Pull out the highest emotion
                        rotation=90
                    )
                    fig_pie.update_layout(
                        plot_bgcolor='rgba(0,0,0,0)',
                        paper_bgcolor='rgba(0,0,0,0)',
                        font_size=12,
                        height=400,
                        showlegend=False,
                        title_x=0.5,
                        title_font_size=16,
                        transition={'duration': 500},
                        annotations=[dict(
                            text=f"{emotions[top_emotions[0]].split()[0]}<br>{scores[top_emotions[0]]*100:.1f}%",
                            x=0.5, y=0.5,
                            font_size=14,
                            showarrow=False
                        )]
                    )
                
                st.plotly_chart(fig_pie, use_container_width=True, config={'displayModeBar': False})

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

            with tab3:
                st.subheader("📝 Your Journaling Stats")
                if st.session_state.entries:
                    entries_df = pd.DataFrame(st.session_state.entries)
                    st.metric("Total Journal Entries", len(entries_df))
                    st.metric("Journaling Streak", f"{min(len(entries_df), 7)} days")
                    
                st.subheader("💭 Reflection Prompts")
                st.info("Based on your emotional analysis, consider reflecting on:")
                st.write("• How does this emotion connect to your recent experiences?")
                st.write("• What triggered these feelings?")
                st.write("• What would help you maintain/improve this emotional state?")

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
                
                # Enhanced tone mapping that considers user's selected mood
                mood_tone_map = {
                    "😊 Joyful": "respond with matching enthusiasm and joy",
                    "🤩 Excited": "respond with high energy and excitement",
                    "😌 Peaceful": "respond with calm and serene energy",
                    "🥰 Grateful": "respond with warmth and appreciation",
                    "🌟 Inspired": "respond with motivational and uplifting energy",
                    " Neutral": "respond in a balanced and thoughtful way",
                    "😕 Confused": "respond with clarity and gentle guidance",
                    "😔 Sad": "respond with extra empathy and support",
                    "😤 Frustrated": "respond with understanding and constructive energy",
                    "😰 Anxious": "respond with calming and reassuring energy"
                }

                # Get user's current mood and intensity
                user_mood = st.session_state.current_mood["mood"]
                mood_intensity = st.session_state.current_mood["intensity"]
                mood_context = st.session_state.current_mood["context"]

                prompt = f"""Given:
                - User's current mood: {user_mood} (intensity: {mood_intensity}/10)
                - Context: {mood_context if mood_context else 'Not provided'}
                - Journal entry: '{text_input}'
                - Detected emotions: primarily {dominant_emotion}

                Provide a personalized, empathetic response that:
                1. Acknowledges their current mood state
                2. {mood_tone_map.get(user_mood, "respond supportively")}
                3. Bridges between their mood and what they wrote

                Keep it to 2-3 sentences and make it conversational."""
                
                response = model.generate_content(prompt)
                
                st.subheader("💭 Personalized Response")
                st.success(response.text)
                
            except Exception as e:
                st.error(f"Error generating AI response: {str(e)}")
            
            # Store analysis results in session state
            st.session_state.current_analysis = {
                'top_emotions': [emotions[i] for i in top_emotions],
                'scores': [float(scores[i]) for i in top_emotions]
            }
    else:
        st.warning("🌟 Your journal awaits your thoughts! Please write something to begin.")

# Add this at the start of your main content
if authenticate_user():
    # Your existing main content code here
    display_user_stats()  # Show user stats in sidebar
    # ... rest of your code ...

# Add logout button to sidebar
if st.session_state.user:
    with st.sidebar:
        if st.button("Logout"):
            st.session_state.user = None
            st.session_state.auth_token = None
            st.rerun()

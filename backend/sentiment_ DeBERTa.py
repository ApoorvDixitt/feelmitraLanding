from transformers import AutoTokenizer, DebertaV2ForSequenceClassification
import torch

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-base", use_fast=False)
model = DebertaV2ForSequenceClassification.from_pretrained("microsoft/deberta-v3-base", num_labels=2)

# Example function to predict sentiment
def predict_sentiment(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    sentiment = torch.argmax(outputs.logits)
    confidence = torch.softmax(outputs.logits, dim=-1).max().item()
    
    # Map sentiment to readable labels
    label_map = {0: "negative", 1: "positive"}
    sentiment_label = label_map[sentiment.item()]
    
    return sentiment_label, confidence

# Sample text for sentiment prediction
text = "Oh, what a fantastic day it’s been! Spilled coffee first thing in the morning? Check..."
label, confidence = predict_sentiment(text)

print(f"Sentiment: {label}, Confidence: {confidence}")

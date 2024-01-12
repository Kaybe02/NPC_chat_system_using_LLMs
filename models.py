from transformers import pipeline
import numpy as np

# 1. whisper | speech - to - text | 39M | Multilingual

whisper = pipeline(
    "automatic-speech-recognition",
    model = "openai/whisper-tiny", 
    device = "cuda:0"
    )

# 2. DistilRoBERTa-base | sentiment | English | anger 🤬| disgust 🤢| fear 😨| joy 😀| neutral 😐| sadness 😭| surprise 😲
sentiment = pipeline(
    "text-classification",
    model = "j-hartmann/emotion-english-distilroberta-base"
)

permitter = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
    )


def speech_to_text(audio_file):
    transcription = whisper(audio_file)
    return transcription

def emotion_detection(text_input):
    return sentiment(text_input)

def checker(question):
    candidate_labels = ['Factual Question Answering', 'Unrelated', 'Video Game NPC Questions', 'Medieval Fantasy']
    answer = checker(question,candidate_labels)
    return answer



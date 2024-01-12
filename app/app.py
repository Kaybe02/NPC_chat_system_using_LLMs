from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import models
import character
app = FastAPI()
origins = ["http://127.0.0.1:5500"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Adjust to restrict specific HTTP methods if needed
    allow_headers=["*"],  # Adjust to restrict specific HTTP headers if needed
)

@app.get("/", tags=['ROOT'])
async def root() -> dict:
    return{"hello": "world"}

@app.post('/uploadwav', tags=['RESPONSE'])
async def create_upload_file(uploaded_file: UploadFile = File(...)):
    file_location = f"D:\voice_Recordings\{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(uploaded_file.file.read())
    return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}


@app.get('/getReply', tags=['TESTING'])
async def getReply(input_text):
    npc_reply = character.chatbot.generate_response(input_text)
    return npc_reply

@app.post("/postAudio")
async def postAudio(recording:UploadFile = File(...)):
    file_location = f"D:/voice_Recordings/{recording.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(recording.file.read())
    print("Audio received!")
    answer = models.speech_to_text(file_location)
    print(answer)
    npc_reply = character.chatbot.generate_response(answer)
    return npc_reply

@app.get('/getSentiment', tags = ['SENTIMENT'])
async def getSentiment(text_input):
    emotion = models.emotion_detection(text_input) 
    print(emotion)
    return emotion[0]['label']













const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')
const dialogue = document.getElementById('message')
const emotion = document.getElementById('emotion')

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''

// mediaRecorder setup for audio
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks = []
            processRecording(blob)
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL

        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    
    application(stateIndex)
}

const downloadAudio = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording')
            break;

        case 'Record':
            clearDisplay()
            clearControls()

            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop Recording')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', 'Record Again')
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}
function changeBotEmotion(input) {

        const encodedMessage = encodeURIComponent(input);
        const urlWithParam = `${"http://127.0.0.1:8000/getSentiment"}?text_input=${encodedMessage}`;
        fetch(urlWithParam, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response received:", data);
        changeEmotionjpeg(data)
      })
      .catch((error) => {
        console.log("Error received:", error);
      });
}
function processRecording(blob) {
    const formData = new FormData();
    console.log("Form Data with audio file:", formData);
    formData.append('recording', blob);
  
    fetch("http://127.0.0.1:8000/postAudio", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response received:", data);
        changeBotEmotion(data)
        dialogue.innerHTML = data
      })
      .catch((error) => {
        console.log("Error received:", error);
      });
  }
function changeEmotionjpeg(prediction){
    if (prediction == "anger") emotion.src = './game assets/player/anger.png';
    if (prediction == "fear") emotion.src = './game assets/player/fear.png';
    if (prediction == "neutral") emotion.src = './game assets/player/neutral.png';
    if (prediction == "joy") emotion.src = './game assets/player/joy.png';
    if (prediction == "sadness") emotion.src = './game assets/player/sad.png';
    if (prediction == "disgust") emotion.src = './game assets/player/disgust.png';
    if (prediction == "surprise") emotion.src = './game assets/player/surprise.png';
}
application(stateIndex)
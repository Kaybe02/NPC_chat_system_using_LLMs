document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const audioPlayer = document.getElementById('audioPlayer');
    let mediaRecorder;
    let audioChunks = [];
  
    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
  
    function startRecording() {
      startButton.disabled = true;
      stopButton.disabled = false;
      audioChunks = [];
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunks.push(e.data);
            }
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendAudioToAPI(audioBlob)
          };
          mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error accessing the microphone:', error);
        });
    }
  
    function stopRecording() {
      startButton.disabled = false;
      stopButton.disabled = true;
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    }
  });

  async function sendAudioToAPI(audioBlob) {
    // Convert the audioBlob to a FormData object
    const formData = new FormData();
    formData.append('uploaded_file', audioBlob, 'audio.wav');
  
    try {
      const response = await fetch('http://127.0.0.1:8000/uploadwav', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json(); // Assuming the response is in JSON format
        console.log('API Response:', data);
      } else {
        console.error('Failed to send audio to API');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
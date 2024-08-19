export async function recordAudio(): Promise<Blob> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        resolve(audioBlob);
      });

      mediaRecorder.addEventListener("error", (event: Event) => {
        if (event instanceof ErrorEvent) {
          reject(event.error);
        } else {
          reject(new Error('Unknown error occurred during recording'));
        }
      });

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
      }, 5000); // Record for 5 seconds
    });
  } catch (error) {
    console.error("Error recording audio:", error);
    throw error;
  }
}

export async function identifySong(audio: Blob): Promise<string> {
  try {
    // This is a placeholder implementation. You'll need to replace this with actual API calls to a music recognition service.
    const formData = new FormData();
    formData.append("audio", audio, "recorded_audio.wav");

    const response = await fetch("https://api.music-recognition-service.com/identify", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.songTitle || "Song not identified";
  } catch (error) {
    console.error("Error identifying song:", error);
    throw error;
  }
}
  
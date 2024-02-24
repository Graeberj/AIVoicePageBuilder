import React, { useState, useRef } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import "font-awesome/css/font-awesome.min.css";
import "./styles.css"; // Ensure this line correctly imports your CSS including the spinner styles

function App() {
  const [htmlContent, setHtmlContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [pageCreated, setPageCreated] = useState(false);
  const mediaRecorderRef = useRef(null);

  const hitEndpoint = async (voiceURL = "") => {
    const endpoint = "https://api-bcbe5a.stack.tryrelevance.com/latest/studios/c3f548a8-50ce-4a80-94ca-9c9d2e5489c4/trigger_limited";
    const project = "82a86f163b9f-4496-bdda-b646e66d6374";

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          params: {
            long_text: "", // Removed the dependency on text input
            voice_prompt: voiceURL,
          },
          project: project,
        }),
      });

      const data = await response.json();
      setHtmlContent(data.output.answer);
      setPageCreated(true);
    } catch (error) {
      console.error("Error fetching the HTML/CSS:", error);
      setHtmlContent("<p>Error loading content.</p>");
    } finally {
      setIsLoading(false); // Ensure loading stops regardless of request outcome
    }
  };

  const uploadRecording = async (blob) => {
    const audioFileName = `recording-${Date.now()}.webm`;
    const audioFileRef = storageRef(storage, `recordings/${audioFileName}`);

    try {
      await uploadBytes(audioFileRef, blob);
      const downloadUrl = await getDownloadURL(audioFileRef);
      hitEndpoint(downloadUrl); // Call the API with the voice URL after upload
    } catch (error) {
      console.error("Error uploading the recording: ", error);
      setIsLoading(false); // Stop loading on error
    }
  };

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        let audioChunks = [];

        recorder.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          uploadRecording(audioBlob); // Upload the recording blob after stopping the recording
        };

        setIsRecording(true);
        recorder.start();
      } catch (err) {
        console.error("Error accessing the microphone:", err);
      }
    } else {
      console.error("MediaDevices API is not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      {!pageCreated && !isLoading && (
      <>
        <h1>Create your website with your voice in 20 seconds</h1>
        {isRecording ? (
          <button onClick={stopRecording} className="recorder-button">
            <i className="fa fa-microphone" style={{ color: "red" }}></i>
          </button>
        ) : (
          <button onClick={startRecording} className="recorder-button">
            <i className="fa fa-microphone"></i>
          </button>
        )}
      </>
      )}
      {isLoading && <div className="loader"></div>} {/* Spinner shown when loading */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default App;

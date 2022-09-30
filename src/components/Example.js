import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";

const MODEL_URL = process.env.PUBLIC_URL + "/models";
const VIDEO_HEIGHT = 480;
const VIDEO_WIDTH = 640;

export const Example = () => {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [expression, setExpression] = useState(undefined);

  useEffect(() => {
    const loadModels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    };

    loadModels();
  }, []);

  const startWebcam = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: VIDEO_WIDTH } })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  const onVideoPlay = () => {
    setInterval(async () => {
      try {
        if (videoRef && videoRef.current) {
          const result = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();

          // TODO: Do something with the result here :) For example:
          const expressions =
            result.length && result[0].expressions.asSortedArray();
          if (expressions && expressions.length) {
            setExpression(expressions[0]);
          }
        }
      } catch (error) {
        console.error("error: ", error);
      }
    }, 100);
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {captureVideo ? (
          <button onClick={closeWebcam}>Close webcam</button>
        ) : (
          <button onClick={startWebcam}>Start webcam</button>
        )}
      </div>
      {captureVideo &&
        (modelsLoaded ? (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <video
                ref={videoRef}
                height={VIDEO_HEIGHT}
                width={VIDEO_WIDTH}
                onPlay={onVideoPlay}
              />
              <div style={{ width: "200px" }}>
                Mood: {expression ? expression.expression : "-"}
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        ))}
    </div>
  );
};

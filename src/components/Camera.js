import * as faceapi from "face-api.js";
import React, {useEffect, useRef, useState} from "react";
import html2canvas from "html2canvas";

const MODEL_URL = process.env.PUBLIC_URL + "/models";
const VIDEO_HEIGHT = 480;
const VIDEO_WIDTH = 640;

export const Camera = () => {
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
            .getUserMedia({video: {width: VIDEO_WIDTH}})
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
                        if (expressions[0] != null) {
                            if (expressions[0].expression === 'happy') {
                                // console.log(expressions[0])
                                // html2canvas(document.body).then(canvas =>
                                //     canvas.toDataURL()
                                // )
                            }
                        }
                        setExpression(expressions[0]);
                    }
                }
            } catch (error) {
                console.error("error: ", error);
            }
        }, 100);
    };

    function captureImage() {
        html2canvas(document.querySelector("#capture")).then(canvas => {
            let c = document.body.getElementsByTagName("canvas")
            console.log(c)
            if (c != null && c.length > 0) {
              c[0].parentElement.removeChild(c[0])
                console.log("C Removed!")
            }
            canvas.style.width = "50vw";
            canvas.style.height = "50vw";
            canvas.style.borderRadius = "100%";
            canvas.style.backgroundPosition = "center center";
            canvas.style.backgroundRepeat = "no-repeat";
            canvas.style.backgroundSize =  "cover";
            canvas.style.objectPosition = "center center";
            canvas.style.objectFit = "cover";
            canvas.style.overflow = "hidden";
            canvas.style.alignItems = "center"
            canvas.style.display = "flex";
            canvas.style.flexDirection = "column";
            canvas.id = "capturedImage"
            document.body.appendChild(canvas)
        });
    }

    return (
        <div>
            <div style={{textAlign: "center", padding: "10px"}}>
                {captureVideo ? (
                    <button onClick={closeWebcam}>Close webcam</button>
                ) : (
                    <button onClick={startWebcam}>Start webcam</button>
                )}
            </div>

            <div style={{textAlign: "center", padding: "10px"}}>
                {captureVideo ? (
                    <button onClick={captureImage}>Capture Image</button>
                ) : (
                    <button>Disabled</button>
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
                                id={"capture"}
                                ref={videoRef}
                                height={VIDEO_HEIGHT}
                                width={VIDEO_WIDTH}
                                onPlay={onVideoPlay}
                            />
                            <div style={{width: "200px"}}>
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
import React, {useEffect, useRef} from 'react'
import * as faceapi from "face-api.js";

const Camera = () => {

    const videoRef = React.useRef();
    const videoHeight = 480;
    const videoWidth = 640;
    let webcam
    const homeRef = useRef();
    // webcam.addEventListener("play", refreshState)
    let isUsingCamera;
    let currentSmileStatus;

    useEffect(() => {
        return () => {
            webcam = document.getElementById("webcam")
            setupFaceDetection()
            setupWebcam()
        };
    }, []);

    async function setupFaceDetection() {
        // event.preventDefault()

        const homeDoc = document.getElementById("home")
        if (homeDoc != null) {
        homeDoc.remove()
        }
        const smileStatusDoc = document.getElementById("smileStatus")
        if (smileStatusDoc != null) {
            smileStatusDoc.style.display = "block"
        }
        await loadModels()
        // setupWebcam()
    }

    async function loadModels() {
        //"https://www.smile-lose.com/models"
        const port = "3000"
        const host = "10.2.7.60"
        const modelsUrl = "http://${host}:${port}/models"
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrl)
        await faceapi.nets.faceExpressionNet.loadFromUri(modelsUrl)
    }

    function setupWebcam() {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(stream => {
                webcam.srcObject = stream
                // if (isFirstRound) startFirstRound()
            })
            .catch(() => {
                document.getElementById("smileStatus").textContent = "camera not found"

                isUsingCamera = false
                // if (isFirstRound) startFirstRound()
            })
    }

    function isSmiling(expressions) {
        // filtering false positive
        const maxValue = Math.max(
            ...Object.values(expressions).filter(value => value <= 1)
        )
        const expressionsKeys = Object.keys(expressions)
        const mostLikely = expressionsKeys.filter(
            expression => expressions[expression] === maxValue
        )
        if (mostLikely[0] && mostLikely[0] == 'happy')
            return true
        return false
    }

    async function refreshState() {
        setInterval(async() => {
            const detections = await faceapi
                .detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions()
            if (detections && detections[0] && detections[0].expressions) {
                isUsingCamera = true
                if (isSmiling(detections[0].expressions)) {
                    currentSmileStatus = true
                    document.getElementById("smileStatus").textContent = "YOU SMILE !"
                } else {
                    document.getElementById("smileStatus").textContent = "not smiling"
                }
            }
        }, 400)
    }

    return(
        <camera >
            <div ref={videoRef}>

            </div>
        </camera>
    )

}


const cameraStyle = {
    margin: '0',
    padding: '0',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const appCanvas = {
    position: 'absolute',
    top: '100px'
}

export default Camera
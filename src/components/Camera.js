import React from 'react'
import { useEffect, useRef } from 'react';
import * as faceapi from "face-api.js";
const Camera = () => {
    const videoRef = useRef();

    useEffect(() => {
        startVideo();
        videoRef && loadModels();
    }, []);
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true    })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
            }).catch((err) => {
            console.error(err)
        });
    }


    const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]).then(() => {
            faceDetection();
        })
    };
    const faceDetection = async () => {
        const detections = await faceapi.detectAllFaces
        (videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        console.log(detections);
    }


    return (
        <camera style = {cameraStyle}>
            <video crossOrigin='anonymous' ref={videoRef} autoPlay>
            </video>
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

export default Camera
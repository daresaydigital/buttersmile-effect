import React from 'react'
import { useEffect, useRef } from 'react';
import * as faceapi from "face-api.js";

const Camera = () => {
    const videoRef = useRef();
    const canvasRef = useRef();

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
        setInterval(async() => {
            const detections = await faceapi.detectAllFaces(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            )
                .withFaceLandmarks()
                .withFaceExpressions()
                .withFaceDescriptors();

            canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
            faceapi.matchDimensions(canvasRef.current, {
                width: 940,
                height: 650,
            })

            const resized = faceapi.resizeResults(detections, {
                width: 940,
                height: 650,
            });

            faceapi.draw.drawDetections(canvasRef.current, resized)
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized)

        }, 1000)
    }


    return (
        <camera style = {cameraStyle}>
            <video crossOrigin='anonymous' ref={videoRef} autoPlay/>
            <canvas ref={canvasRef} width="940" height="650" className='app__canvas' />
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
    alignItems: 'center',
    position: 'absolute'
}

export default Camera
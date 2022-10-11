import React, {Component} from "react";
import './camera-component.scss'
import * as faceApi from "@vladmandic/face-api";
import FaceApiConstants from "../../constants/face-api-constants";
import VideoUtilities from "../../utils/video-utilities";

type State = {
    showCamera: boolean,
}

type Props = {
    streak: number,
    onStreak: Function
}

export class CameraComponent extends Component<Props, State> {

    videoRef = React.createRef<HTMLVideoElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            showCamera: false,
        }
    }

    async componentDidMount() {
        await this.loadModels()
    }

    async loadModels() {
        await Promise.all([
            faceApi.nets.tinyFaceDetector.loadFromUri(FaceApiConstants.MODEL_URL),
            faceApi.nets.faceLandmark68Net.loadFromUri(FaceApiConstants.MODEL_URL),
            faceApi.nets.faceRecognitionNet.loadFromUri(FaceApiConstants.MODEL_URL),
            faceApi.nets.faceExpressionNet.loadFromUri(FaceApiConstants.MODEL_URL),
        ])
    }

    startWebcam() {
        this.setState({showCamera: true});
        navigator.mediaDevices
            .getUserMedia({video: {}})
            .then((stream) => {
                let video: any = this.videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.play();
                }
            }).catch((e) => {
            console.log(e)
        })
    };

    closeWebcam() {
        try {
            this.videoRef?.current?.pause();
            // @ts-ignore
            this.videoRef.current?.srcObject?.getTracks()[0].stop();
            this.setState({showCamera: false});
        } catch (e) {
            console.log(e)
        }
    };


    async onVideoPlay() {
        setInterval(async () => {
            try {
                if (this.videoRef?.current && this.props.streak < 3) {
                    const result = await faceApi
                        .detectSingleFace(
                            this.videoRef.current,
                            new faceApi.TinyFaceDetectorOptions()
                        )
                        .withFaceExpressions();

                    if (result?.expressions) {
                        let bestProbabilityExpression = result.expressions.asSortedArray()[0];
                        if (bestProbabilityExpression.expression === FaceApiConstants.expressionTypes.happy) {

                            let nextStreakValue = this.props.streak + 1
                            this.props.onStreak(nextStreakValue, nextStreakValue === 3 ? this.takeScreenshot() : '')
                            nextStreakValue === 3 && this.closeWebcam();
                        } else {
                            this.props.onStreak(0)
                        }


                    }
                }

                    } catch (error) {
                console.error("error: ", error);
            }
        }, 1100);
    }


    takeScreenshot() {
        let videoElement = document.getElementById('camera');
        if (videoElement) {

            return VideoUtilities.captureScreenshotFromVideo(videoElement)
        } else {
            return ''
        }
    }


    render() {
        return (
            <div className="camera-wrapper">
                <div className="camera-card">
                    {this.state.showCamera ? <video
                        id={"camera"}
                        ref={this.videoRef}
                        onPlay={() => this.onVideoPlay()}
                    /> : <p> Press Start to Begin!</p>}
                </div>
                <desc>Smile For 3 Seconds!</desc>
                <div className="camera-actions">
                    <button onClick={() => this.startWebcam()}>Start Start</button>
                    <button onClick={() => this.closeWebcam()}>Stop Camera</button>
                </div>
            </div>
        );
    }
};
import * as faceApi from '@vladmandic/face-api';
import classNames from 'classnames';
import React, { Component } from 'react';
import FaceApiConstants from '../../constants/face-api-constants';
import VideoUtilities from '../../utils/video-utilities';
import './camera-component.scss';

type State = {
  showCamera: boolean;
};

type Props = {
  streak: number;
  onStreak: Function;
};

export class CameraComponent extends Component<Props, State> {
  videoRef = React.createRef<HTMLVideoElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      showCamera: false,
    };
  }

  async componentDidMount() {
    await this.loadModels();
  }

  async loadModels() {
    await Promise.all([
      faceApi.nets.tinyFaceDetector.loadFromUri(FaceApiConstants.MODEL_URL),
      faceApi.nets.faceLandmark68Net.loadFromUri(FaceApiConstants.MODEL_URL),
      faceApi.nets.faceRecognitionNet.loadFromUri(FaceApiConstants.MODEL_URL),
      faceApi.nets.faceExpressionNet.loadFromUri(FaceApiConstants.MODEL_URL),
    ]);
  }

  startWebcam() {
    this.setState({ showCamera: true });
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video: any = this.videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  closeWebcam() {
    try {
      this.videoRef?.current?.pause();
      // @ts-ignore
      this.videoRef.current?.srcObject?.getTracks()[0].stop();
      this.setState({ showCamera: false });
    } catch (e) {
      console.log(e);
    }
  }

  toggleWebcam() {
    if (!this.state.showCamera) {
      this.startWebcam();
    } else {
      this.closeWebcam();
    }
  }

  async onVideoPlay() {
    setInterval(async () => {
      try {
        if (this.videoRef?.current && this.props.streak < 3) {
          const result = await faceApi
            .detectSingleFace(this.videoRef.current, new faceApi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (result?.expressions) {
            let bestProbabilityExpression = result.expressions.asSortedArray()[0];
            if (bestProbabilityExpression.expression === FaceApiConstants.expressionTypes.happy) {
              let nextStreakValue = this.props.streak + 1;
              this.props.onStreak(
                nextStreakValue,
                nextStreakValue === 3 ? this.takeScreenshot() : ''
              );
              nextStreakValue === 3 && this.closeWebcam();
            } else {
              this.props.onStreak(0);
            }
          }
        }
      } catch (error) {
        console.error('error: ', error);
      }
    }, 1100);
  }

  takeScreenshot() {
    let videoElement = document.getElementById('camera');
    if (videoElement) {
      return VideoUtilities.captureScreenshotFromVideo(videoElement);
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className="camera-wrapper">
        <div
          className={classNames('frame', 'outer')}
          style={{ opacity: this.props.streak > 1 ? 1 : 0 }}
        ></div>
        <div
          className={classNames('frame', 'inner')}
          style={{ opacity: this.props.streak > 0 ? 1 : 0 }}
        ></div>
        <div className="camera-card" onClick={() => this.toggleWebcam()}>
          <span>
            Smile for 3 seconds <br />
            to feed the Monsdare
          </span>
          {this.state.showCamera ? (
            <>
              <span className="emoji">🤔</span>
              <span>Hold on...</span>
              <video id={'camera'} ref={this.videoRef} onPlay={() => this.onVideoPlay()} />
            </>
          ) : (
            <>
              <span className="emoji">😊</span>
              <span>Press to begin!</span>
            </>
          )}
        </div>
      </div>
    );
  }
}

import {Component} from "react";
import './screenshot-modal.scss'

type Props = {
    screenshotURI: string,
    resetStreak: Function

}

export class ScreenshotModal extends Component<Props, any> {

    downloadImage() {

    }

    render() {
        return (
            <div className="screenshot-modal">
                <div className="confetti">
                    {
                        Array.from({length: 300}, (item, index) =>
                            <div className={'confetti-' + index} key={index}/>
                        )
                    }
                </div>
                <div className="screenshot-wrapper">
                    <img src={this.props.screenshotURI} alt=""/>
                    <h1>As Bryant H. McGill Says:
                        <br/> "The greatest self is a peaceful smile, that always sees the world smiling back."</h1>
                    <div className="actions">
                        <button onClick={this.props.resetStreak()}>Reset The Game</button>
                        <a download="you.jpeg" href={this.props.screenshotURI}>
                            <button>Download Image</button>
                        </a>
                    </div>
                </div>

            </div>
        )
    }
}
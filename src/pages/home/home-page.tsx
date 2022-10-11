import {Component} from "react";
import './home-page.scss'
import {CameraComponent} from "../../components/camera/camera-component";
import {ProgressComponent} from "../../components/progress/progress-component";
import {ScreenshotModal} from "../../components/screenshot-modal/screenshot-modal";
import {CSSTransition} from "react-transition-group";

type State = {
    streak: number,
    streakCompleted: boolean,
    screenshotURI: string
}

export class HomePage extends Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            streak: 0,
            streakCompleted: false,
            screenshotURI: ''
        }
    }

    handleStreak(streak: number, imageURL: string) {
        if (this.state.streak !== 3) {
            this.setState({streak: streak})

            if (streak === 3) {
                this.setState({streakCompleted: true, screenshotURI: imageURL})
                console.log(imageURL)
            }
        }
    }

    resetStreak() {
        if (this.state.streak === 3) {
            this.setState({streak: 0, streakCompleted: false, screenshotURI: ''})
        }
    }

    render() {
        return (
            <div className="home">
                <CameraComponent streak={this.state.streak} onStreak={this.handleStreak.bind(this)}/>
                <ProgressComponent streak={this.state.streak}
                />


                <CSSTransition
                    in={this.state.streakCompleted}
                    timeout={300}
                    classNames="fade-in"
                    unmountOnExit
                >
                    <ScreenshotModal screenshotURI={this.state.screenshotURI}
                                     resetStreak={() => this.resetStreak.bind(this)}/>
                </CSSTransition>


            </div>
        )
    }
}
import {Component} from "react";
import './progress-component.scss'

type Props = {
    streak: number,
}

export class ProgressComponent extends Component<Props, any> {

    render() {
        return (
            <div className="progress">
                <ul className="steps">
                    <li className={this.props.streak >= 1 ? 'active' : ''}>1</li>
                    <li className={this.props.streak >= 2 ? 'active' : ''}>2</li>
                    <li className={this.props.streak >= 3 ? 'active' : ''}>3</li>
                </ul>
            </div>
        )
    }
}
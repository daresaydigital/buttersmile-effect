import { Component } from 'react';
import './screenshot-modal.scss';

type Props = {
  screenshotURI: string;
  resetStreak: Function;
};

export class ScreenshotModal extends Component<Props, any> {
  componentDidMount(): void {
    setTimeout(() => {
      this.props.resetStreak();
    }, 1000);
  }

  render() {
    return (
      <div className="screenshot-modal">
        <div className="confetti">
          {Array.from({ length: 300 }, (item, index) => (
            <div className={'confetti-' + index} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

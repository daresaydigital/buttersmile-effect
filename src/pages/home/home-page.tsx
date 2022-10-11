import { Component } from 'react';
import './home-page.scss';
import { CameraComponent } from '../../components/camera/camera-component';
import { ProgressComponent } from '../../components/progress/progress-component';
import { ScreenshotModal } from '../../components/screenshot-modal/screenshot-modal';
import { CSSTransition } from 'react-transition-group';
import supabase from '../../utils/supabase-client';

type State = {
  streak: number;
  streakCompleted: boolean;
  screenshotURI: string;
};

interface SmilesData {
  id: number;
  smile_value: number;
}

export class HomePage extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      streak: 0,
      streakCompleted: false,
      screenshotURI: '',
    };
  }

  // TODO: make a edge function to update with a value.
  // without having to read value first here.
  async updateSmileValue() {
    const SMILE_ADD = 1;
    const { data } = await supabase.from('smiles').select('smile_value').eq('id', 1);

    if (data && data.length > 0) {
      const currentSmiles = data[0].smile_value;

      await supabase
        .from('smiles')
        .update({ smile_value: currentSmiles + SMILE_ADD })
        .match({ id: 1 });
    }
  }

  handleStreak(streak: number, imageURL: string) {
    if (this.state.streak !== 3) {
      this.setState({ streak: streak });

      if (streak === 3) {
        this.setState({ streakCompleted: true, screenshotURI: imageURL });
        this.updateSmileValue();
        console.log(imageURL);
      }
    }
  }

  resetStreak() {
    if (this.state.streak === 3) {
      this.setState({ streak: 0, streakCompleted: false, screenshotURI: '' });
    }
  }

  render() {
    return (
      <div className="home">
        <CameraComponent streak={this.state.streak} onStreak={this.handleStreak.bind(this)} />
        <ProgressComponent streak={this.state.streak} />

        <CSSTransition
          in={this.state.streakCompleted}
          timeout={300}
          classNames="fade-in"
          unmountOnExit
        >
          <ScreenshotModal
            screenshotURI={this.state.screenshotURI}
            resetStreak={() => this.resetStreak.bind(this)}
          />
        </CSSTransition>
      </div>
    );
  }
}

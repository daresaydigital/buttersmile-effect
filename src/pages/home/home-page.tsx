import { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Bubbles } from '../../components/bubbles/bubble';
import { CameraComponent } from '../../components/camera/camera-component';
import { ScreenshotModal } from '../../components/screenshot-modal/screenshot-modal';
import { getImages, storeImage } from '../../utils/images';
import supabase from '../../utils/supabase-client';
import './home-page.scss';

type State = {
  streak: number;
  streakCompleted: boolean;
  screenshotURI: string;
  images: string[];
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
      images: getImages().map((image) => image.url),
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
        storeImage(imageURL);
        this.setState({ images: getImages().map((image) => image.url) });
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
      <>
        <Bubbles images={this.state.images} />
        <div className="home">
          <CameraComponent streak={this.state.streak} onStreak={this.handleStreak.bind(this)} />
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
      </>
    );
  }
}

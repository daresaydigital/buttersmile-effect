import { Component } from 'react';
import { Bubbles } from '../../components/bubbles/bubble';
import { CameraComponent } from '../../components/camera/camera-component';
import Gauge from '../../components/gauge/gauge-component';
import { getImages, storeImage } from '../../utils/images';
import supabase from '../../utils/supabase-client';
import './home-page.scss';

type State = {
  streak: number;
  streakCompleted: boolean;
  screenshotURI: string;
  images: string[];
  smileValue?: number;
};

export class HomePage extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      streak: 0,
      streakCompleted: false,
      screenshotURI: '',
      images: getImages().map((image) => image.url),
      smileValue: undefined,
    };
  }

  // TODO: make a edge function to update with a value.
  // without having to read value first here.
  async updateSmileValue() {
    const SMILE_ADD = 5;
    await supabase.rpc('increment', { x: SMILE_ADD, row_id: 1 });
  }

  async componentDidMount() {
    try {
      const { data } = await supabase.from('smiles').select('smile_value').eq('id', 1);
      if (data && data.length > 0) {
        this.setState((state) => ({ ...state, smileValue: data[0].smile_value }));
      }
    } catch (e) {
      console.log(e);
    }

    supabase
      .channel('public:smiles:id=eq.1')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'smiles', filter: 'id=eq.1' },
        (payload) => {
          // @ts-ignore
          this.setState((state) => ({ ...state, smileValue: payload.new.smile_value }));
        }
      )
      .subscribe();
  }

  handleStreak(streak: number, imageURL: string) {
    if (this.state.streak !== 3) {
      this.setState({ streak: streak });

      if (streak === 3) {
        this.setState({ streakCompleted: true, screenshotURI: imageURL });
        this.updateSmileValue();
        storeImage(imageURL);
        this.setState({ images: getImages().map((image) => image.url) });
        setTimeout(() => {
          this.resetStreak();
        }, 1000);
      }
    }
  }

  resetStreak() {
    if (this.state.streak === 3) {
      this.setState({ streak: 0, streakCompleted: false, screenshotURI: '' });
    }
  }

  render() {
    const { smileValue, images, streak, streakCompleted, screenshotURI } = this.state;
    return (
      <>
        {smileValue && <Gauge value={smileValue} />}
        <Bubbles images={images} />
        <div className="home">
          <CameraComponent streak={streak} onStreak={this.handleStreak.bind(this)} />
          {streakCompleted && (
            <div className="confetti">
              {Array.from({ length: 300 }, (_item, index) => (
                <div className={'confetti-' + index} key={index} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}

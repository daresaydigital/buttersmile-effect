import anime from 'animejs';
import { useEffect, useRef } from 'react';
import './bubble.scss';

const BUBBLE_SIZE = 250;

const getRandomNumber = (min: number, max: number) => Math.random() * (max - min) + min;

export const Bubbles = ({ images = [] }: { images: string[] }) => {
  const refs = useRef([]);
  const aniRef = useRef<anime.AnimeInstance>();

  const MIN_X = 0;
  const MAX_X = window.innerWidth - BUBBLE_SIZE;
  const MIN_Y = 1;
  const MAX_Y = window.innerHeight - BUBBLE_SIZE;

  const animate = () => {
    aniRef.current = anime({
      targets: refs.current,
      translateX: () => anime.random(MIN_X, MAX_X),
      translateY: () => anime.random(MIN_Y, MAX_Y),
      easing: 'easeInOutSine',
      duration: 5000,
      loop: false,
      direction: 'alternate',
      complete: animate,
    });
  };

  useEffect(() => {
    animate();

    return () => {
      // Seems to be the best way to cancel ongoing animations atm: https://github.com/juliangarnier/anime/issues/188
      if (aniRef.current) {
        const activeInstances = anime.running;
        const index = activeInstances.indexOf(aniRef.current);
        activeInstances.splice(index, 1);
      }
    };
  }, []);

  return (
    <>
      {images.map((image, index) => {
        const startX = getRandomNumber(MIN_X, MAX_X);
        const startY = getRandomNumber(MIN_Y, MAX_Y);

        return (
          <div
            key={index}
            // @ts-ignore
            ref={(el) => (refs.current[index] = el)}
            className="bubble"
            style={{
              transform: `translateX(${startX}px) translateY(${startY}px)`,
              width: `${BUBBLE_SIZE}px`,
              height: `${BUBBLE_SIZE}px`,
              backgroundImage: `url(${image})`,
            }}
          ></div>
        );
      })}
    </>
  );
};

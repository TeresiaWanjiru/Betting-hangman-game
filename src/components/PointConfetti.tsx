import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import style from './Keyboard.module.css';

const PointConfetti = () => {
  const { width, height } = useWindowSize();
  const x = 900;
  const y = 500;

  return (
    <Confetti
      className={style.confetti}
      width={width}
      height={height}
      confettiSource={{
        w: 100,
        h: 100,
        x: x,
        y: y,
      }}
      friction={1}
      run={true}
      recycle={false}
      numberOfPieces={700}
      wind={0}
      gravity={0.1}
      initialVelocityX={5}
      initialVelocityY={10}
      opacity={1}
    ></Confetti>
  );
};

export default PointConfetti;

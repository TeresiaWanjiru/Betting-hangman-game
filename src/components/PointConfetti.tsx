import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import style from './Keyboard.module.css';

const PointConfetti = () => {
  const { width, height } = useWindowSize();
  const x = 1800;
  const y = 620;

  return (
    <Confetti
      className={style.confetti}
      width={width}
      height={height}
      confettiSource={{
        w: 10,
        h: 10,
        x: x,
        y: y,
      }}
      friction={1}
      run={true}
      recycle={true}
      numberOfPieces={200}
      wind={0}
      gravity={0.1}
      initialVelocityX={2}
      initialVelocityY={5}
      opacity={1}
    ></Confetti>
  );
};

export default PointConfetti;

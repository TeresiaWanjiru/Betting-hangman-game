import style from './Keyboard.module.css';
type TimerProps = {
  timeRemaining: number;
};

const Timer = ({ timeRemaining }: TimerProps) => {
  return (
    <>
      <div className={style.timer}>Timer: {timeRemaining} seconds</div>
    </>
  );
};

export default Timer;

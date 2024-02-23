type TimerProps = {
  timeRemaining: number;
};

const Timer = ({ timeRemaining }: TimerProps) => {
  return (
    <>
      <div
        style={{
          fontSize: '30px',
          fontWeight: '700',
          color: 'black',
        }}
      >
        Timer: {timeRemaining} seconds
      </div>
    </>
  );
};

export default Timer;

type timerProps = {
  timeRemaining: number;
};

const Timer = ({ timeRemaining }: timerProps) => {
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

const HEAD = (
  <div
    style={{
      height: '50px',
      width: '50px',
      border: '10px solid purple',
      borderRadius: '50%',
      top: '50px',
      right: '-29px',
      position: 'absolute',
    }}
  ></div>
);
const BODY = (
  <div
    style={{
      height: '100px',
      width: '10px',
      background: 'purple',
      top: '110px',
      right: '0',
      position: 'absolute',
    }}
  ></div>
);
const LEFT_ARM = (
  <div
    style={{
      height: '10px',
      width: '100px',
      background: 'purple',
      top: '150px',
      right: '-100px',
      position: 'absolute',
      rotate: '-30deg',
      transformOrigin: 'left bottom',
    }}
  ></div>
);
const RIGHT_ARM = (
  <div
    style={{
      height: '10px',
      width: '100px',
      background: 'purple',
      top: '150px',
      right: '5px',
      position: 'absolute',
      rotate: '30deg',
      transformOrigin: 'right bottom',
    }}
  ></div>
);
const LEFT_LEG = (
  <div
    style={{
      height: '10px',
      width: '100px',
      background: 'purple',
      top: '195px',
      right: '0px',
      position: 'absolute',
      rotate: '240deg',
      transformOrigin: 'right bottom',
    }}
  ></div>
);
const RIGHT_LEG = (
  <div
    style={{
      height: '10px',
      width: '100px',
      background: 'purple',
      top: '200px',
      right: '0px',
      position: 'absolute',
      rotate: '-60deg',
      transformOrigin: 'right bottom',
    }}
  ></div>
);

type HangmanProps = {
  numbersGuessed: number;
  wordToGuess: string;
};

const BODY_PARTS = [HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG];

const HangmanDrawing = ({ numbersGuessed }: HangmanProps) => {
  return (
    <div style={{ position: 'relative' }}>
      {BODY_PARTS.slice(0, numbersGuessed).map((part, index) => (
        <div key={index}>{part}</div>
      ))}
      <div
        style={{
          height: '50px',
          width: '10px',
          background: 'purple',
          top: '0',
          right: '0',
          position: 'absolute',
        }}
      />
      <div
        style={{
          height: '10px',
          width: '200px',
          background: 'purple',
          marginLeft: '97.50px',
        }}
      />
      <div
        style={{
          height: '400px',
          width: '10px',
          background: 'purple',
          marginLeft: '97.50px',
        }}
      />
      <div style={{ height: '10px', width: '200px', background: 'purple' }} />
    </div>
  );
};

export default HangmanDrawing;

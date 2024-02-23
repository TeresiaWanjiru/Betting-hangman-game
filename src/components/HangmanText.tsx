import style from '../components/Keyboard.module.css';

type HangmanTextProps = {
  lettersGuessed: string[];
  wordToGuess: string;
  reveal: boolean;
};

const HangmanText = ({
  lettersGuessed,
  wordToGuess,
  reveal = false,
}: HangmanTextProps) => {
  return (
    <div
      className={`${style.poppins}`}
      style={{
        display: 'flex',
        gap: '2rem',
        fontSize: '4rem',
        textTransform: 'uppercase',
      }}
    >
      {wordToGuess.split('').map((letter, index) => (
        <span style={{ borderBottom: '.15em solid black' }} key={index}>
          <span
            style={{
              visibility:
                lettersGuessed.includes(letter) || reveal
                  ? 'visible'
                  : 'hidden',
              color:
                !lettersGuessed.includes(letter) && reveal ? 'purple' : 'black',
            }}
          >
            {' '}
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
};

export default HangmanText;

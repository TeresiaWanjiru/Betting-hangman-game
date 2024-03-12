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
    <div className={`${style.hangmanText}`}>
      {wordToGuess.split('').map((letter, index) => (
        <span className={style.underline} key={index}>
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

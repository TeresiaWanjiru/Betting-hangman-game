import styles from './Keyboard.module.css';

const startCharCode = 'a'.charCodeAt(0);
const endCharCode = 'z'.charCodeAt(0);

const KEYS: string[] = Array.from(
  { length: endCharCode - startCharCode + 1 },
  (_, index) => String.fromCharCode(startCharCode + index),
);

// console.log(KEYS);

type keyboardProps = {
  addGuessedLetter: (letter: string) => void;
  activeLetters: string[];
  inactiveLetters: string[];
  disabled: boolean;
};
const HangmanKeyboard = ({
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
  disabled = false,
}: keyboardProps) => {
  return (
    <div
      className={`${styles.poppins}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(75px,1fr))',
        gap: '.5rem',
        alignItems: 'center',
        alignSelf: 'stretch',
      }}
    >
      {KEYS.map((key, index) => {
        const isActive = activeLetters.includes(key);
        const isNotActive = inactiveLetters.includes(key);
        return (
          <button
            className={`${styles.btn} ${isActive ? styles.active : ''} ${isNotActive ? styles.inactive : ''}`}
            disabled={isActive || isNotActive || disabled}
            key={index}
            onClick={() => addGuessedLetter(key)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default HangmanKeyboard;

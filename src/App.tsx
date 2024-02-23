import { useCallback, useEffect, useRef, useState } from 'react';
import words from './wordlist.json';
import HangmanDrawing from './components/HangmanDrawing';
import HangmanText from './components/HangmanText';
import HangmanKeyboard from './components/HangmanKeyboard';
import style from './components/Keyboard.module.css';
import BackgroundImage from './components/BackgroundImage';
import Timer from './components/Timer';
import Points from './components/Points';
import BettingLogic from './components/BettingLogic';

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [lettersGuessed, setLettersGuessed] = useState<string[]>([]);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number | undefined>(undefined);
  const [points, setPoints] = useState<number>(0);
  const [betAddedBack, setBetAddedBack] = useState<boolean>(false);
  const [placeBetClicked, setPlaceBetClicked] = useState<boolean>(false);
  const [showBetText, setShowBetText] = useState<boolean>(false);
  const [inputActive, setInputActive] = useState<boolean>(false); //ensures the input for placing bet is active upon playagain

  //timing states
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);

  console.log(wordToGuess);

  const wrongGuesses = lettersGuessed.filter((letter) => {
    return !wordToGuess.includes(letter);
  });

  const isLoser = wrongGuesses.length >= 6;
  const isWinnerRef = useRef<boolean>(false);
  isWinnerRef.current = isWinnerRef.current = wordToGuess
    .split('')
    .every((letter) => lettersGuessed.includes(letter));

  //capturing key presses on physical board
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (isLoser) return;

      setLettersGuessed((currentLetters) => {
        if (currentLetters.includes(letter)) {
          return currentLetters;
        }

        const updatedLetters = [...currentLetters, letter];
        const guessedWord = wordToGuess
          .split('')
          .map((char) => (updatedLetters.includes(char) ? char : '_'))
          .join('');

        if (guessedWord === wordToGuess) {
          setPoints(points + 1);
        }
        return updatedLetters;
      });
    },
    [isLoser, wordToGuess, points],
  );

  console.log('points', points);

  //handling any keypress
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (sessionActive && bet) {
        const key = e.key;

        if (!key.match(/^[a-z]$/)) return;
        e.preventDefault();

        addGuessedLetter(key);
      }
    };
    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [lettersGuessed]);

  //handling enter key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (key !== 'Enter' && !sessionActive) return;
      e.preventDefault();

      setWordToGuess(getWord());
      setLettersGuessed([]);
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [lettersGuessed, sessionActive]);

  //function that handles the betting balance when user wins
  const wonBet = useCallback(() => {
    if (points === 3 && !betAddedBack) {
      setBalance((prevBalance) => prevBalance + bet);
      setBetAddedBack(true); // this prevents further additions
    }
  }, [points, bet, betAddedBack]);

  useEffect(() => {
    setBetAddedBack(false);
  }, [points]);

  function handleTimeUp() {
    setSessionActive(false);
    wonBet();
    setShowBetText(false);
  }

  useEffect(() => {
    wonBet();
  }, [points, wonBet]);

  const handleBetCreate = useCallback((newBet: number) => {
    setPlaceBetClicked(true);
    setBet(newBet);
    setBalance((prevBalance) => prevBalance - newBet);
    setBetAddedBack(true);
    setShowBetText(true);
  }, []);
  const timer = useRef<number | undefined>(undefined);

  //on clicking the place bet button the timer and session starts
  const handleStartSession = useCallback(() => {
    console.log('Session has started');

    setSessionActive(true);
    setSessionStarted(true);
    const id = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(id);
          // setIsPlayAgainButtonClicked(true);
          console.log('Game Over!');
          handleTimeUp();
          return 0;
        }
      });
    }, 1000);

    timer.current = id;
  }, []);

  return (
    <>
      <div className={style.hangmanBackgroundContainer}>
        <BackgroundImage />
        <Timer timeRemaining={timeRemaining} />
        <div className={style.hangmanBackground}>
          <div
            className={`${style.game_result} ${isLoser ? style.glow_lose : isWinnerRef.current ? style.glow_win : ''} `}
          >
            {wordToGuess
              .split('')
              .every((letter) => lettersGuessed.includes(letter))
              ? 'Correct!-Enter for next word'
              : ''}
            {isLoser ? 'Wrong-Enter for next word' : ''}
          </div>
          <HangmanDrawing
            numbersGuessed={wrongGuesses.length}
            wordToGuess={wordToGuess}
          />
          <HangmanText
            reveal={isLoser}
            lettersGuessed={lettersGuessed}
            wordToGuess={wordToGuess}
          />
          <HangmanKeyboard
            disabled={isLoser || isWinnerRef.current || !sessionActive || !bet}
            activeLetters={lettersGuessed.filter((letter) =>
              wordToGuess.includes(letter),
            )}
            inactiveLetters={wrongGuesses}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </div>
      <Points points={points} />
      <BettingLogic
        onCreate={handleBetCreate}
        onStartSession={handleStartSession}
        setPoints={setPoints}
        points={points}
        balance={balance}
        // setBalance={setBalance}
        bet={bet}
        setBet={setBet}
        wonBet={wonBet}
        betAddedBack={betAddedBack}
        setBetAddedBack={setBetAddedBack}
        placeBetClicked={placeBetClicked}
        // setPlaceBetClicked={setPlaceBetClicked}
        // setShowBetText={setShowBetText}
        showBetText={showBetText}
        inputActive={inputActive}
      />
    </>
  );
}

export default App;

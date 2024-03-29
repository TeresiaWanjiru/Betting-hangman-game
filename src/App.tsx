import { useCallback, useEffect, useRef, useState } from 'react';
import words from './wordlist.json';
import HangmanDrawing from './components/HangmanDrawing';
import HangmanText from './components/HangmanText';
import HangmanKeyboard from './components/HangmanKeyboard';
import style from './components/Keyboard.module.css';
import BackgroundImage from './components/BackgroundImage';
import Timer from './components/Timer';
import BettingLogic from './components/BettingLogic';

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [lettersGuessed, setLettersGuessed] = useState<string[]>([]);
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(1000);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [betAddedBack, setBetAddedBack] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [showHangmanKeyboard, setShowHangmanKeyboard] = useState<boolean>(
    window.innerWidth >= 600,
  );
  //win/lose and place bet clicked states
  const [gamePlayState, setGamePlayState] = useState<{
    gameResult: string | null;
    placeBetClicked: boolean;
    gameSessionEnded: boolean;
  }>({ gameResult: null, placeBetClicked: false, gameSessionEnded: false });

  console.log(wordToGuess);

  const wrongGuesses = lettersGuessed.filter((letter) => {
    return !wordToGuess.includes(letter);
  });

  const isWordLoser = wrongGuesses.length >= 6;
  const isWordWinnerRef = useRef<boolean>(false);
  isWordWinnerRef.current = isWordWinnerRef.current = wordToGuess
    .split('')
    .every((letter) => lettersGuessed.includes(letter));

  //capturing key presses on physical board
  const handleAddGuessedLetter = useCallback(
    (letter: string) => {
      if (isWordLoser) return;

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
    [isWordLoser, wordToGuess, points],
  );

  //handling any keypress
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (sessionActive && betAmount) {
        const key = e.key;

        if (!key.match(/^[a-z]$/)) return;
        e.preventDefault();

        handleAddGuessedLetter(key);
      }
    };
    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [handleAddGuessedLetter, sessionActive, betAmount]);

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

  //handling screen size
  useEffect(() => {
    const handleResize = () => {
      setShowHangmanKeyboard(window.innerWidth >= 700);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // handles the bet balance when user wins
  const handleWonBet = useCallback(() => {
    if (points === 3 && !betAddedBack) {
      setBalance((prevBalance) => prevBalance + betAmount);
      setBetAddedBack(true);
    }
  }, [points, betAmount, betAddedBack]);

  useEffect(() => {
    handleWonBet();
  }, [points, handleWonBet]);

  useEffect(() => {
    if (points >= 3 && gamePlayState.gameSessionEnded) {
      setGamePlayState((prevState) => ({
        ...prevState,
        gameResult: 'won',
      }));
    } else if (!sessionActive && gamePlayState.gameSessionEnded) {
      setGamePlayState((prevState) => ({
        ...prevState,
        gameResult: 'lost',
      }));
    }
  }, [points, sessionActive, gamePlayState.gameSessionEnded]);

  function handleTimeUp() {
    setBalance(1000);
    setWordToGuess(getWord());
    setLettersGuessed([]);
    setSessionActive(false);
    setBetAmount(0);
    setTimeRemaining(30);
    setBetAddedBack(false);
    setGamePlayState((prevState) => ({
      ...prevState,
      placeBetClicked: false,
      gameSessionEnded: true,
    }));
  }

  const handleBetCreate = (newBet: number) => {
    setGamePlayState((prevState) => ({
      ...prevState,
      gameSessionEnded: false,
    }));
    setGamePlayState((prevState) => ({
      ...prevState,
      placeBetClicked: true,
      gameResult: null,
    }));
    setPoints(0);
    setBetAmount(newBet);
    setBalance((prevBalance) => prevBalance - newBet);
  };

  const timer = useRef<number | undefined>(undefined);

  //timer and session starts after clicking place bet
  const handleStartSession = useCallback(() => {
    setSessionActive(true);
    const id = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(id);
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
            className={`${style.game_result} ${isWordLoser ? style.glow_lose : isWordWinnerRef.current ? style.glow_win : ''} `}
          >
            {wordToGuess
              .split('')
              .every((letter) => lettersGuessed.includes(letter))
              ? 'Correct!-Enter for next word'
              : ''}
            {isWordLoser ? 'Wrong-Enter for next word' : ''}
          </div>
          <HangmanDrawing
            numbersGuessed={wrongGuesses.length}
            wordToGuess={wordToGuess}
          />
          <HangmanText
            reveal={isWordLoser}
            lettersGuessed={lettersGuessed}
            wordToGuess={wordToGuess}
          />
          {showHangmanKeyboard && (
            <HangmanKeyboard
              disabled={
                isWordLoser ||
                isWordWinnerRef.current ||
                !sessionActive ||
                !betAmount
              }
              activeLetters={lettersGuessed.filter((letter) =>
                wordToGuess.includes(letter),
              )}
              inactiveLetters={wrongGuesses}
              OnAddGuessedLetter={handleAddGuessedLetter}
            />
          )}
        </div>
      </div>
      {/* <Points points={points} /> */}
      <BettingLogic
        balance={balance}
        betAmount={betAmount}
        onBetAmountChange={setBetAmount}
        onCreate={handleBetCreate}
        onStartSession={handleStartSession}
        gamePlayState={gamePlayState}
        points={points}
      />
      {betAddedBack && gamePlayState.placeBetClicked && (
        <div
          className={`${style.betAddedBackText} ${betAddedBack ? style.betAddedBackTextVisible : ''}`}
        >
          Your bet has been added back!
        </div>
      )}
    </>
  );
}

export default App;

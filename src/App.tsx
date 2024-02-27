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
  const [gameSessionEnded, setGameSessionEnded] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(1000);
  const [bet, setBet] = useState<number | undefined>(undefined);
  const [points, setPoints] = useState<number>(0);
  const [betAddedBack, setBetAddedBack] = useState<boolean>(false);

  //timing states
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  //win/lose and place bet clicked states
  const [gamePlayState, setGamePlayState] = useState<{
    gameResult: string | null;
    placeBetClicked: boolean;
  }>({ gameResult: null, placeBetClicked: false });

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
      if (sessionActive && bet) {
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
  }, [handleAddGuessedLetter, sessionActive, bet]);

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

  // handles the betting balance when user wins
  const handleWonBet = useCallback(() => {
    if (points === 3 && !betAddedBack) {
      setBalance((prevBalance) => prevBalance + bet);
      setBetAddedBack(true);
    }
  }, [points, bet, betAddedBack]);

  useEffect(() => {
    handleWonBet();
  }, [points]);

  function handleResetGame() {
    setBalance(1000);
    setWordToGuess(getWord());
    setLettersGuessed([]);
    setSessionActive(false);
    setBet(undefined);
    setTimeRemaining(60);
    setBetAddedBack(false);
  }
  useEffect(() => {
    if (points >= 3 && gameSessionEnded) {
      setGamePlayState((prevState) => ({
        ...prevState,
        gameResult: 'won',
      }));
    } else if (!sessionActive && gameSessionEnded) {
      setGamePlayState((prevState) => ({
        ...prevState,
        gameResult: 'lost',
      }));
    }
  }, [points, sessionActive, gameSessionEnded]);

  function handleTimeUp() {
    handleResetGame();
    setGamePlayState((prevState) => ({
      ...prevState,
      placeBetClicked: false,
    }));
    setGameSessionEnded(true);
  }
  const handleBetCreate = useCallback((newBet: number) => {
    setGamePlayState((prevState) => ({
      ...prevState,
      placeBetClicked: true,
    }));
    setPoints(0);
    setBet(newBet);
    setBalance((prevBalance) => prevBalance - newBet);
    setGamePlayState((prevState) => ({
      ...prevState,
      gameResult: null,
    }));
  }, []);
  const timer = useRef<number | undefined>(undefined);

  //timer and session starts after clicking place bet
  const handleStartSession = useCallback(() => {
    console.log('Session has started');

    setSessionActive(true);
    const id = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(id);
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
          <HangmanKeyboard
            disabled={
              isWordLoser || isWordWinnerRef.current || !sessionActive || !bet
            }
            activeLetters={lettersGuessed.filter((letter) =>
              wordToGuess.includes(letter),
            )}
            inactiveLetters={wrongGuesses}
            OnAddGuessedLetter={handleAddGuessedLetter}
          />
        </div>
      </div>
      <Points points={points} />
      <BettingLogic
        onCreate={handleBetCreate}
        onStartSession={handleStartSession}
        balance={balance}
        bet={bet}
        onCreateBet={setBet}
        gamePlayState={gamePlayState}
      />
      {betAddedBack && (
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

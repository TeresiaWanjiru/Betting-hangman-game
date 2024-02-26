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
  const [placeBetClicked, setPlaceBetClicked] = useState<boolean>(false);
  const [showBetText, setShowBetText] = useState<boolean>(false);

  //timing states
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  //win or lose game states
  const [gameResult, setGameResult] = useState<string | null>(null);

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

  console.log('points', points);

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
    setBetAddedBack(false); //balance back to false so that the bet amount is added back only once after user wins
  }, [points]);

  function handleResetGame() {
    setBalance(1000);
    setWordToGuess(getWord());
    setLettersGuessed([]);
    setSessionActive(false);
    setBet(undefined);
    setTimeRemaining(60);
  }
  useEffect(() => {
    if (points >= 3 && gameSessionEnded) {
      setGameResult('won');
    } else if (!sessionActive && gameSessionEnded) {
      setGameResult('lost');
    }
  }, [points, sessionActive, gameSessionEnded]);

  function handleTimeUp() {
    handleResetGame();
    setShowBetText(false);
    setPlaceBetClicked(false);
    setGameSessionEnded(true);
  }

  const handleBetCreate = useCallback((newBet: number) => {
    setPlaceBetClicked(true);
    setPoints(0);
    setBet(newBet);
    setBalance((prevBalance) => prevBalance - newBet);
    setBetAddedBack(true);
    setShowBetText(true);
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
        setBet={setBet}
        showBetText={showBetText}
        placeBetClicked={placeBetClicked}
        gameResult={gameResult}
        sessionActive={sessionActive}
      />
    </>
  );
}

export default App;

import React, { ChangeEvent, useEffect, useRef } from 'react';
import style from './Keyboard.module.css';
import PointConfetti from './PointConfetti';

type BettingLogicProps = {
  balance: number;
  bet: number;
  setBet: React.Dispatch<React.SetStateAction<number>>;
  onCreate: (betAmount: number) => void;
  onStartSession: () => void;
  placeBetClicked: boolean;
  showBetText: boolean;
  gameResult: string | null;
  sessionActive: boolean;
};

const BettingLogic: React.FC<BettingLogicProps> = ({
  balance,
  bet,
  setBet,
  placeBetClicked,
  showBetText,
  onCreate,
  onStartSession,
  gameResult,
  sessionActive,
}: BettingLogicProps) => {
  const gameResultWonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameResultWonRef.current) {
      const rect = gameResultWonRef.current.getBoundingClientRect();
      const x = rect.left;
      const y = rect.top;
      console.log('x and y of won text', x, y);
    }
  }, [gameResult]);

  const placeBet = () => {
    if (isNaN(bet) || bet <= 0 || bet > balance) {
      console.error('Invalid bet amount');
      return;
    }
    if (bet > balance) {
      console.error('Insufficient balance');
      return;
    }

    onCreate(bet);
    onStartSession();
  };

  const handleLocalValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value.replace(/[^0-9]/g, '');
    setBet(Number(inputText));
  };

  return (
    <>
      <div className={style.bettingLogic}>
        <p>Balance: {balance}</p>
        <span>
          Bet Amount :
          <input
            className={`${style.betInput}`}
            type="number"
            value={isNaN(bet) ? '' : bet}
            onChange={handleLocalValueChange}
            disabled={placeBetClicked}
          />
        </span>
        {bet <= 0 && <div className={style.errorText}>Invalid bet amount</div>}

        {bet >= 1000 && (
          <div className={style.errorText}>Invalid bet amount</div>
        )}

        <button
          className={style.placeBetBtn}
          onClick={placeBet}
          disabled={placeBetClicked}
        >
          Place bet
        </button>
      </div>
      {showBetText && (
        <div className={style.animatedText}>
          You bet <span>{bet}</span> points!
        </div>
      )}
      {gameResult === 'won' && !sessionActive && (
        <>
          <div className={style.gameResult_won} ref={gameResultWonRef}>
            You won! Congratulations!
          </div>
        </>
      )}
      <PointConfetti />
      {gameResult === 'lost' && !sessionActive && (
        <div className={style.gameResult_lost}>You lost.Try again</div>
      )}
    </>
  );
};

export default BettingLogic;

import React, { ChangeEvent } from 'react';
import style from './Keyboard.module.css';
import PointConfetti from './PointConfetti';

type BettingLogicProps = {
  balance: number;
  bet: number;
  onCreateBet: React.Dispatch<React.SetStateAction<number>>;
  onCreate: (betAmount: number) => void;
  onStartSession: () => void;
  placeBetClicked: boolean;
  gamePlayState: {
    gameResult: string | null;
    placeBetClicked: boolean;
  };
};

const BettingLogic: React.FC<BettingLogicProps> = ({
  balance,
  bet,
  onCreateBet,
  onCreate,
  onStartSession,
  gamePlayState,
}: BettingLogicProps) => {
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
    onCreateBet(Number(inputText));
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
            disabled={gamePlayState.placeBetClicked}
          />
        </span>
        {bet <= 0 && <div className={style.errorText}>Invalid bet amount</div>}

        {bet >= 1000 && (
          <div className={style.errorText}>Amount exceeds balance</div>
        )}

        <button
          className={style.placeBetBtn}
          onClick={placeBet}
          disabled={gamePlayState.placeBetClicked}
        >
          Place bet
        </button>
      </div>
      {gamePlayState.placeBetClicked && (
        <div className={style.animatedText}>
          You bet <span>{bet}</span> points!
        </div>
      )}
      {gamePlayState.gameResult === 'won' && (
        <>
          <div className={style.gameResult_won}>You won! Congratulations!</div>
          <PointConfetti />
        </>
      )}
      {gamePlayState.gameResult === 'lost' && (
        <div className={style.gameResult_lost}>You lost. Try again</div>
      )}
    </>
  );
};

export default BettingLogic;

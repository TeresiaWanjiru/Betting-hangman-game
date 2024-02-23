import React, { ChangeEvent } from 'react';
import style from './Keyboard.module.css';

type BettingLogicProps = {
  balance: number;
  bet: number;
  setBet: React.Dispatch<React.SetStateAction<number>>;
  onCreate: (betAmount: number) => void;
  onStartSession: () => void;
  placeBetClicked: boolean;
  showBetText: boolean;
};

const BettingLogic: React.FC<BettingLogicProps> = ({
  balance,
  bet,
  setBet,
  placeBetClicked,
  showBetText,
  onCreate,
  onStartSession,
}: BettingLogicProps) => {
  const placeBet = () => {
    if (isNaN(bet) || bet <= 0 || bet > balance) {
      console.error('Invalid bet amount');
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
        {bet === 0 ? (
          <div className={style.errorText}>Invalid bet amount</div>
        ) : null}

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
    </>
  );
};

export default BettingLogic;

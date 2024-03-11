import React, { ChangeEvent } from 'react';
import style from './Keyboard.module.css';
import PointConfetti from './PointConfetti';

export type BettingLogicProps = {
  balance: number;
  betAmount: number;
  onBetAmountChange: React.Dispatch<React.SetStateAction<number>>;
  onCreate: (betAmount: number) => void;
  onStartSession: () => void;
  gamePlayState: {
    gameResult: string | null;
    placeBetClicked: boolean;
    gameSessionEnded: boolean;
  };
};

const BettingLogic: React.FC<BettingLogicProps> = ({
  balance,
  betAmount,
  onBetAmountChange,
  onCreate,
  onStartSession,
  gamePlayState,
}: BettingLogicProps) => {
  const placeBet = () => {
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
      console.error('Invalid bet amount');
      return;
    }
    if (betAmount > balance) {
      console.error('Insufficient balance');
      return;
    }

    onCreate(betAmount);
    onStartSession();
  };

  const handleLocalValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value.replace(/[^0-9]/g, '');
    const inputNumber = Number(inputText);
    onBetAmountChange(inputNumber);
    e.target.value = inputText;
  };
  const handleInputFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    e.target.value = '';
  };

  return (
    <>
      <div className={style.bettingLogic}>
        <p data-testid="balance">Balance: {balance}</p>
        <span>
          Bet Amount :
          <input
            className={`${style.betInput}`}
            type="number"
            value={betAmount}
            onFocus={handleInputFocus}
            onChange={handleLocalValueChange}
            disabled={gamePlayState.placeBetClicked}
            data-testid="bet_amount_input"
          />
        </span>
        {betAmount < 0 && (
          <div className={style.errorText}>Invalid bet amount</div>
        )}

        {betAmount >= 1000 && (
          <div className={style.errorText}>Amount exceeds balance</div>
        )}

        <button
          className={style.neonBtn}
          onClick={placeBet}
          disabled={gamePlayState.placeBetClicked}
          data-testid="place_bet_button"
        >
          Place bet
        </button>
      </div>
      {gamePlayState.placeBetClicked && (
        <div className={style.animatedText}>
          You bet <span>{betAmount}</span> points!
        </div>
      )}
      {gamePlayState.gameResult === 'won' && gamePlayState.gameSessionEnded && (
        <>
          <div className={style.gameResultWon}>You won! Congratulations!</div>
          <PointConfetti />
        </>
      )}
      {gamePlayState.gameResult === 'lost' && (
        <div className={style.gameResultLost}>You lost. Try again</div>
      )}
    </>
  );
};

export default BettingLogic;

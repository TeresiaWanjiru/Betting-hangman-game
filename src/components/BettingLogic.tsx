import React, { ChangeEvent } from 'react';
import style from './Keyboard.module.css';
import PointConfetti from './PointConfetti';

export type BettingLogicProps = {
  balance: number;
  betAmount: number;
  onCreateBetAmount: React.Dispatch<React.SetStateAction<number>>;
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
  onCreateBetAmount,
  onCreate,
  onStartSession,
  gamePlayState,
}: BettingLogicProps) => {
  // const [inputValue, setInputValue] = useState<number>(0);
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

  // useEffect(() => {
  //   if (betAmount === 0) {
  //     setInputValue(0);
  //   }
  // }, [betAmount]);

  const handleLocalValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputText = e.target.value.replace(/[^0-9]/g, '');
    inputText = inputText.replace(/^0+/, '');
    // setInputValue(Number(inputText));

    onCreateBetAmount(Number(inputText));
    e.target.value = inputText;
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
            value={betAmount}
            onChange={handleLocalValueChange}
            disabled={gamePlayState?.placeBetClicked}
          />
        </span>
        {betAmount < 0 && (
          <div className={style.errorText}>Invalid bet amount</div>
        )}

        {betAmount >= 1000 && (
          <div className={style.errorText}>Amount exceeds balance</div>
        )}

        <button
          className={style.neon_btn}
          onClick={placeBet}
          disabled={gamePlayState?.placeBetClicked}
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

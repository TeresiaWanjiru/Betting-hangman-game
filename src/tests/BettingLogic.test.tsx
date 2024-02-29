import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import BettingLogic, { BettingLogicProps } from '../components/BettingLogic';
// import matchers from '@testing-library/jest-dom';
// expect.extend(matchers);

describe('BettingLogic component', () => {
  const mockProps: BettingLogicProps = {
    balance: 100,
    betAmount: 10,
    onCreateBetAmount: vitest.fn(),
    onCreate: vitest.fn(),
    onStartSession: vitest.fn(),
    gamePlayState: {
      gameResult: null,
      placeBetClicked: false,
      gameSessionEnded: false,
    },
  };
  it('renders correctly', () => {
    render(<BettingLogic {...mockProps} />);
  });
});

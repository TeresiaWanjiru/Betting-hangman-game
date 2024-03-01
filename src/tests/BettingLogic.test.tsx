import { describe, it } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import BettingLogic, { BettingLogicProps } from '../components/BettingLogic';

describe('BettingLogic component', () => {
  const mockProps: BettingLogicProps = {
    balance: 990,
    betAmount: 10,
    onChangeBetAmount: vitest.fn(),
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

  it('disables input field when placeBetClicked is true', () => {
    const updatedProps = {
      ...mockProps,
      gamePlayState: { ...mockProps.gamePlayState, placeBetClicked: true },
    };

    const { getByTestId } = render(<BettingLogic {...updatedProps} />);

    const inputElement = getByTestId('bet_amount_input');

    expect(inputElement).toBeDisabled();
  });
  it('updates balance when a user places a bet', async () => {
    const { getByTestId } = render(<BettingLogic {...mockProps} />);
    const inputElement = getByTestId('bet_amount_input');
    const balanceElement = getByTestId('balance');
    const betButton = getByTestId('place_bet_button');

    fireEvent.change(inputElement, { target: { value: 10 } });
    fireEvent.click(betButton);

    await waitFor(() => {
      expect(balanceElement).toHaveTextContent('Balance: 990');
    });
  });
});

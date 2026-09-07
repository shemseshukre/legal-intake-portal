import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import LegalIntakePage from './LegalIntakePage';

describe('LegalIntakePage', () => {
  it('allows the user to switch between request types', async () => {
    const user = userEvent.setup();

    render(<LegalIntakePage />);

    expect(
      screen.getByRole('heading', {
        name: 'Request Details',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Legal Research/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Legal Research Request',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Compliance/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Compliance Request',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /^Other/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Other Legal Request',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Contract Review/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Request Details',
      }),
    ).toBeInTheDocument();
  });
});


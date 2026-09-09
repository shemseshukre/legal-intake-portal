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
        name: /Ask a Legal Question/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Legal Question',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Privacy Request/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Privacy Request',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Employment Matter/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Employment Matter',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Intellectual Property/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Intellectual Property',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Corporate Legal Request/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Corporate Legal Request',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Policy Review/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Policy Review',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Report a Legal Issue/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Report a Legal Issue',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Request an NDA/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'NDA Request',
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /Review a Contract/i,
      }),
    );

    expect(
      screen.getByRole('heading', {
        name: 'Contract Review Request',
      }),
    ).toBeInTheDocument();
  });
});
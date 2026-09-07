import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ContractReviewForm from './ContractReviewForm';

describe('ContractReviewForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();

    render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const submitButton =
      screen.getByRole('button', {
        name: 'Submit Request',
      });

    await user.click(submitButton);

    expect(
      screen.getByText(
        'Request title is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select a contract type.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Requester name is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Requester email is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Required date is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select a priority.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Description is required.',
      ),
    ).toBeInTheDocument();
  });

  it('submits successfully after confirmation', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={handleSubmit}
      />,
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Request Title/i,
      }),
      'Employment Contract Review',
    );

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: /Contract Type/i,
      }),
      'employment',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Name/i,
      }),
      'John Doe',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Email/i,
      }),
      'john@example.com',
    );

    await user.type(
      screen.getByLabelText(/Required By/i),
      '2099-12-31',
    );

    await user.click(
      screen.getByRole('radio', {
        name: /High/i,
      }),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Description/i,
      }),
      'Please review this employment contract before it is signed.',
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Submit Request',
      }),
    );

    expect(
      screen.getByRole('dialog'),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'Confirm Submission',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Submitting...',
      }),
    ).toBeInTheDocument();

    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
      },
      {
        timeout: 5000,
      },
    );
  });

  it('saves the current form data as a draft', async () => {
    const user = userEvent.setup();
    const handleSaveDraft = vi.fn();

    render(
      <ContractReviewForm
        onSaveDraft={handleSaveDraft}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Request Title/i,
      }),
      'Draft Contract Review',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Name/i,
      }),
      'Jane Doe',
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Save Draft',
      }),
    );

    expect(
      handleSaveDraft,
    ).toHaveBeenCalledTimes(1);

    const savedData =
      handleSaveDraft.mock.calls[0][0];

    expect(savedData.title).toBe(
      'Draft Contract Review',
    );

    expect(savedData.requesterName).toBe(
      'Jane Doe',
    );
  });

  it('accepts a valid PDF file upload', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const file = new File(
      ['sample contract content'],
      'contract.pdf',
      {
        type: 'application/pdf',
      },
    );

    const fileInput =
      container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    expect(fileInput).toBeInTheDocument();

    await user.upload(
      fileInput,
      file,
    );

    await waitFor(() => {
      expect(
        screen.getByText('contract.pdf'),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('23 B'),
    ).toBeInTheDocument();
  });

  it('rejects an invalid file type', async () => {
    const { container } = render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const invalidFile = new File(
      ['image content'],
      'contract.png',
      {
        type: 'image/png',
      },
    );

    const fileInput =
      container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    expect(fileInput).toBeInTheDocument();

    fireEvent.change(
      fileInput,
      {
        target: {
          files: [invalidFile],
        },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Only PDF, DOC, and DOCX files are allowed.',
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        'contract.png',
      ),
    ).not.toBeInTheDocument();
  });

  it('rejects a file larger than 10 MB', async () => {
    const { container } = render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const largeFileContent =
      new Uint8Array(
        10 * 1024 * 1024 + 1,
      );

    const largeFile = new File(
      [largeFileContent],
      'large-contract.pdf',
      {
        type: 'application/pdf',
      },
    );

    const fileInput =
      container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    expect(fileInput).toBeInTheDocument();

    fireEvent.change(
      fileInput,
      {
        target: {
          files: [largeFile],
        },
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'File size must be 10 MB or less.',
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        'large-contract.pdf',
      ),
    ).not.toBeInTheDocument();
  });

  it('removes an uploaded supporting document', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const file = new File(
      ['sample contract content'],
      'contract-to-remove.pdf',
      {
        type: 'application/pdf',
      },
    );

    const fileInput =
      container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    expect(fileInput).toBeInTheDocument();

    await user.upload(
      fileInput,
      file,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'contract-to-remove.pdf',
        ),
      ).toBeInTheDocument();
    });

    const removeButton =
      screen.getByRole('button', {
        name: /Remove contract-to-remove.pdf/i,
      });

    await user.click(removeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(
          'contract-to-remove.pdf',
        ),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(
        'Choose a file or drag and drop',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'PDF, DOC, DOCX up to 10MB',
      ),
    ).toBeInTheDocument();
  });

  it('opens the confirmation dialog when a valid form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Request Title/i,
      }),
      'Contract Review Request',
    );

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: /Contract Type/i,
      }),
      'vendor',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Name/i,
      }),
      'John Doe',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Email/i,
      }),
      'john@example.com',
    );

    await user.type(
      screen.getByLabelText(/Required By/i),
      '2099-12-31',
    );

    await user.click(
      screen.getByRole('radio', {
        name: /Medium/i,
      }),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Description/i,
      }),
      'Please review this vendor contract carefully.',
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Submit Request',
      }),
    );

    expect(
      screen.getByRole('dialog'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Submit Legal Request?',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Confirm Submission',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Review Request',
      }),
    ).toBeInTheDocument();
  });

  it('cancels the confirmation dialog without submitting', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={handleSubmit}
      />,
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Request Title/i,
      }),
      'Contract Review Request',
    );

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: /Contract Type/i,
      }),
      'nda',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Name/i,
      }),
      'John Doe',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Email/i,
      }),
      'john@example.com',
    );

    await user.type(
      screen.getByLabelText(/Required By/i),
      '2099-12-31',
    );

    await user.click(
      screen.getByRole('radio', {
        name: /Low/i,
      }),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Description/i,
      }),
      'Please review this NDA before approval.',
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Submit Request',
      }),
    );

    expect(
      screen.getByRole('dialog'),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'Review Request',
      }),
    );

    expect(
      screen.queryByRole('dialog'),
    ).not.toBeInTheDocument();

    expect(
      handleSubmit,
    ).not.toHaveBeenCalled();

    expect(
      screen.getByRole('textbox', {
        name: /Request Title/i,
      }),
    ).toHaveValue(
      'Contract Review Request',
    );
  });

  it('updates the description character counter', async () => {
    const user = userEvent.setup();

    render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByText('0/1000'),
    ).toBeInTheDocument();

    const description =
      screen.getByRole('textbox', {
        name: /Description/i,
      });

    await user.type(
      description,
      'Review this contract',
    );

    expect(
      screen.getByText('20/1000'),
    ).toBeInTheDocument();
  });

  it('shows the submitting loading state after confirmation', async () => {
    const user = userEvent.setup();

    render(
      <ContractReviewForm
        onSaveDraft={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Request Title/i,
      }),
      'Loading State Test',
    );

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: /Contract Type/i,
      }),
      'partnership',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Name/i,
      }),
      'John Doe',
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Requester Email/i,
      }),
      'john@example.com',
    );

    await user.type(
      screen.getByLabelText(/Required By/i),
      '2099-12-31',
    );

    await user.click(
      screen.getByRole('radio', {
        name: /High/i,
      }),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: /Description/i,
      }),
      'Testing the loading state during submission.',
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Submit Request',
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Confirm Submission',
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Submitting...',
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', {
        name: 'Save Draft',
      }),
    ).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: 'Submit Request',
        }),
      ).toBeInTheDocument();
    });
  });
});


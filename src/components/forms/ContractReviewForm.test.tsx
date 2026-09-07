import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ContractReviewForm from './ContractReviewForm';

const fillValidForm = async () => {
  const user = userEvent.setup();

  await user.type(
    screen.getByLabelText(/request title/i),
    'Review vendor service agreement',
  );

  await user.selectOptions(
    screen.getByLabelText(/contract type/i),
    'vendor',
  );

  await user.type(
    screen.getByLabelText(/business unit/i),
    'Sales',
  );

  await user.type(
    screen.getByLabelText(/counterparty/i),
    'ABC Corporation',
  );

  await user.type(
    screen.getByLabelText(/contract value/i),
    '50000',
  );

  await user.type(
    screen.getByLabelText(/requester name/i),
    'John Smith',
  );

  await user.type(
    screen.getByLabelText(/requester email/i),
    'john.smith@example.com',
  );

  await user.type(
    screen.getByLabelText(/required by/i),
    '2026-12-31',
  );

  await user.click(
    screen.getByRole('radio', {
      name: 'Yes',
    }),
  );

  const customerTypeGroup = screen.getByRole('group', {
    name: /customer type/i,
  });

  await user.click(
    customerTypeGroup.querySelector(
      'input[value="new"]',
    ) as HTMLElement,
  );

  const riskLevelGroup = screen.getByRole('group', {
    name: /risk level/i,
  });

  await user.click(
    riskLevelGroup.querySelector(
      'input[value="medium"]',
    ) as HTMLElement,
  );

  const priorityGroup = screen.getByRole('group', {
    name: 'Priority',
  });

  await user.click(
    priorityGroup.querySelector(
      'input[value="high"]',
    ) as HTMLElement,
  );

  await user.type(
    screen.getByLabelText(/description/i),
    'Please review the vendor agreement and identify any important legal risks or obligations before signing.',
  );

  const fileInput =
    document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

  const file = new File(
    ['test contract content'],
    'contract.pdf',
    {
      type: 'application/pdf',
    },
  );

  await user.upload(fileInput, file);
};

describe('ContractReviewForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const onSubmit = vi.fn();
    const onSaveDraft = vi.fn();

    render(
      <ContractReviewForm
        onSubmit={onSubmit}
        onSaveDraft={onSaveDraft}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit request/i,
      }),
    );

    expect(
      await screen.findByText(
        'Request title is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select the contract type.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Business unit is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Counterparty is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Contract value is required.',
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
        'Required by date is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select whether personal data is involved.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select the customer type.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select the risk level.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please select a priority.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Description must be at least 20 characters.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Please upload a contract.',
      ),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully after confirmation', async () => {
    const onSubmit = vi.fn();
    const onSaveDraft = vi.fn();

    render(
      <ContractReviewForm
        onSubmit={onSubmit}
        onSaveDraft={onSaveDraft}
      />,
    );

    await fillValidForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit request/i,
      }),
    );

    expect(
      await screen.findByRole('dialog'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /confirm submission/i,
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        requestType: 'contract-review',
        title: 'Review vendor service agreement',
        contractType: 'vendor',
        businessUnit: 'Sales',
        counterparty: 'ABC Corporation',
        contractValue: '50000',
        requesterName: 'John Smith',
        requesterEmail: 'john.smith@example.com',
        dueDate: '2026-12-31',
        personalDataInvolved: 'yes',
        customerType: 'new',
        riskLevel: 'medium',
        priority: 'high',
      }),
    );
  });

  it('saves current form data as draft', async () => {
    const onSubmit = vi.fn();
    const onSaveDraft = vi.fn();

    render(
      <ContractReviewForm
        onSubmit={onSubmit}
        onSaveDraft={onSaveDraft}
      />,
    );

    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/request title/i),
      'Draft contract review',
    );

    await user.click(
      screen.getByRole('button', {
        name: /save draft/i,
      }),
    );

    await waitFor(() => {
      expect(onSaveDraft).toHaveBeenCalledTimes(1);
    });

    expect(onSaveDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        requestType: 'contract-review',
        title: 'Draft contract review',
      }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('accepts a valid PDF file', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const file = new File(
      ['pdf content'],
      'agreement.pdf',
      {
        type: 'application/pdf',
      },
    );

    await userEvent.upload(fileInput, file);

    expect(
      screen.getByText('agreement.pdf'),
    ).toBeInTheDocument();
  });

  it('accepts a valid DOC file', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const file = new File(
      ['doc content'],
      'agreement.doc',
      {
        type: 'application/msword',
      },
    );

    await userEvent.upload(fileInput, file);

    expect(
      screen.getByText('agreement.doc'),
    ).toBeInTheDocument();
  });

  it('accepts a valid DOCX file', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const file = new File(
      ['docx content'],
      'agreement.docx',
      {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    );

    await userEvent.upload(fileInput, file);

    expect(
      screen.getByText('agreement.docx'),
    ).toBeInTheDocument();
  });

  it('rejects an invalid file type', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const file = new File(
      ['image content'],
      'image.png',
      {
        type: 'image/png',
      },
    );

    await userEvent.upload(fileInput, file);

    expect(
      screen.getByText(
        'Only PDF, DOC, and DOCX files are allowed.',
      ),
    ).toBeInTheDocument();
  });

  it('rejects files larger than 50 MB', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const largeFile = new File(
      ['x'],
      'large-contract.pdf',
      {
        type: 'application/pdf',
      },
    );

    Object.defineProperty(
      largeFile,
      'size',
      {
        value: 50 * 1024 * 1024 + 1,
      },
    );

    await userEvent.upload(
      fileInput,
      largeFile,
    );

    expect(
      screen.getByText(
        'File size must be 50 MB or less.',
      ),
    ).toBeInTheDocument();
  });

  it('accepts a file exactly 50 MB', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const file = new File(
      ['x'],
      '50mb-contract.pdf',
      {
        type: 'application/pdf',
      },
    );

    Object.defineProperty(
      file,
      'size',
      {
        value: 50 * 1024 * 1024,
      },
    );

    await userEvent.upload(fileInput, file);

    expect(
      screen.getByText(
        '50mb-contract.pdf',
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'File size must be 50 MB or less.',
      ),
    ).not.toBeInTheDocument();
  });

  it('removes an uploaded supporting document', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const fileInput =
      document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

    const file = new File(
      ['contract content'],
      'contract.pdf',
      {
        type: 'application/pdf',
      },
    );

    await userEvent.upload(fileInput, file);

    expect(
      screen.getByText('contract.pdf'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /remove/i,
      }),
    );

    expect(
      screen.queryByText('contract.pdf'),
    ).not.toBeInTheDocument();
  });

  it('opens the confirmation dialog before submission', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    await fillValidForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit request/i,
      }),
    );

    expect(
      await screen.findByRole('dialog'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /are you sure you want to submit/i,
      ),
    ).toBeInTheDocument();
  });

  it('cancels the confirmation dialog', async () => {
    const onSubmit = vi.fn();

    render(
      <ContractReviewForm
        onSubmit={onSubmit}
        onSaveDraft={vi.fn()}
      />,
    );

    await fillValidForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit request/i,
      }),
    );

    expect(
      await screen.findByRole('dialog'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /cancel/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog'),
      ).not.toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('updates the description character counter', async () => {
    render(
      <ContractReviewForm
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
      />,
    );

    const user = userEvent.setup();

    const description =
      screen.getByLabelText(/description/i);

    await user.type(
      description,
      'This is a test description.',
    );

    expect(
      screen.getByText(
        /27\s*\/\s*2000/i,
      ),
    ).toBeInTheDocument();
  });

  it('shows the submitting loading state', async () => {
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(resolve, 100);
        }),
    );

    render(
      <ContractReviewForm
        onSubmit={onSubmit}
        onSaveDraft={vi.fn()}
      />,
    );

    await fillValidForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit request/i,
      }),
    );

    expect(
      await screen.findByRole('dialog'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /confirm submission/i,
      }),
    );

    expect(
      await screen.findByRole('button', {
        name: /submitting/i,
      }),
    ).toBeDisabled();
  });
});



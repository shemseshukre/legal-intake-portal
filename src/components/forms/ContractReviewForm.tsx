import { useState } from 'react';
import type {
  ContractType,
  FormErrors,
  LegalRequest,
  LegalRequestFormData,
  Priority,
} from '../../types/legalRequest';
import ConfirmationDialog from '../ConfirmationDialog';
import FormActions from './FormActions';
import FileUpload from './FileUpload';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import RadioGroup from './RadioGroup';
import TextArea from './TextArea';

interface ContractReviewFormProps {
  onSaveDraft: (request: LegalRequestFormData) => void;
  onSubmit: (request: LegalRequest) => void;
}

const initialFormData: LegalRequestFormData = {
  requestType: 'contract-review',
  title: '',
  contractType: '',
  priority: '',
  description: '',
  requesterName: '',
  requesterEmail: '',
  dueDate: '',
  file: null,
};

const contractTypeOptions = [
  {
    value: 'employment',
    label: 'Employment Contract',
  },
  {
    value: 'vendor',
    label: 'Vendor Agreement',
  },
  {
    value: 'nda',
    label: 'Non-Disclosure Agreement',
  },
  {
    value: 'partnership',
    label: 'Partnership Agreement',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const priorityOptions = [
  {
    value: 'low',
    label: 'Low',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'high',
    label: 'High',
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function validateForm(
  formData: LegalRequestFormData,
): FormErrors {
  const errors: FormErrors = {};

  if (!formData.title.trim()) {
    errors.title = 'Request title is required.';
  }

  if (!formData.contractType) {
    errors.contractType =
      'Please select a contract type.';
  }

  if (!formData.requesterName.trim()) {
    errors.requesterName =
      'Requester name is required.';
  }

  if (!formData.requesterEmail.trim()) {
    errors.requesterEmail =
      'Requester email is required.';
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.requesterEmail,
    )
  ) {
    errors.requesterEmail =
      'Please enter a valid email address.';
  }

  if (!formData.dueDate) {
    errors.dueDate =
      'Required date is required.';
  } else {
    const selectedDate = new Date(
      `${formData.dueDate}T00:00:00`,
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.dueDate =
        'Required date cannot be in the past.';
    }
  }

  if (!formData.priority) {
    errors.priority =
      'Please select a priority.';
  }

  if (!formData.description.trim()) {
    errors.description =
      'Description is required.';
  } else if (
    formData.description.trim().length < 20
  ) {
    errors.description =
      'Description must contain at least 20 characters.';
  }

  if (formData.file) {
    if (
      !ALLOWED_FILE_TYPES.includes(
        formData.file.type,
      )
    ) {
      errors.file =
        'Only PDF, DOC, and DOCX files are allowed.';
    } else if (
      formData.file.size > MAX_FILE_SIZE
    ) {
      errors.file =
        'File size must be 10 MB or less.';
    }
  }

  return errors;
}

function ContractReviewForm({
  onSaveDraft,
  onSubmit,
}: ContractReviewFormProps) {
  const [formData, setFormData] =
    useState<LegalRequestFormData>(
      initialFormData,
    );

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const [pendingRequest, setPendingRequest] =
    useState<LegalRequest | null>(null);

  const updateField = <
    K extends keyof LegalRequestFormData
  >(
    field: K,
    value: LegalRequestFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const updatedErrors = { ...current };

      delete updatedErrors[field];

      return updatedErrors;
    });
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors =
      validateForm(formData);

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    const validRequest: LegalRequest = {
      requestType: formData.requestType,
      title: formData.title.trim(),
      contractType:
        formData.contractType as ContractType,
      priority:
        formData.priority as Priority,
      description:
        formData.description.trim(),
      requesterName:
        formData.requesterName.trim(),
      requesterEmail:
        formData.requesterEmail.trim(),
      dueDate: formData.dueDate,
      file: formData.file,
    };

    setPendingRequest(validRequest);
    setIsConfirmationOpen(true);
  };

  const handleCancelSubmit = () => {
    setIsConfirmationOpen(false);
    setPendingRequest(null);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingRequest || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setIsConfirmationOpen(false);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000),
    );

    onSubmit(pendingRequest);

    setFormData(initialFormData);
    setErrors({});
    setPendingRequest(null);
    setIsSubmitting(false);
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };

  return (
    <>
      <form
        className="contract-review-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="form-introduction">
          <div>
            <h3>Request Details</h3>

            <p>
              Provide the information below so the
              legal team can review and process your
              request.
            </p>
          </div>

          <span className="required-fields-note">
            <span aria-hidden="true">*</span>{' '}
            Required fields
          </span>
        </div>

        <section
          className="form-section"
          aria-labelledby="request-details-heading"
        >
          <h3
            id="request-details-heading"
            className="form-section-title"
          >
            Request Information
          </h3>

          <div className="form-grid">
            <FormInput
              id="request-title"
              label="Request Title"
              value={formData.title}
              placeholder="Enter a short title for your request"
              required
              error={errors.title}
              onChange={(value) =>
                updateField('title', value)
              }
            />

            <FormSelect
              id="contract-type"
              label="Contract Type"
              value={formData.contractType}
              options={contractTypeOptions}
              placeholder="Select contract type"
              required
              error={errors.contractType}
              onChange={(value) =>
                updateField(
                  'contractType',
                  value as ContractType | '',
                )
              }
            />

            <FormInput
              id="requester-name"
              label="Requester Name"
              value={formData.requesterName}
              placeholder="Enter your full name"
              required
              error={errors.requesterName}
              onChange={(value) =>
                updateField(
                  'requesterName',
                  value,
                )
              }
            />

            <FormInput
              id="requester-email"
              label="Requester Email"
              type="email"
              value={formData.requesterEmail}
              placeholder="name@example.com"
              required
              error={errors.requesterEmail}
              onChange={(value) =>
                updateField(
                  'requesterEmail',
                  value,
                )
              }
            />

            <FormInput
              id="required-by"
              label="Required By"
              type="date"
              value={formData.dueDate}
              required
              error={errors.dueDate}
              onChange={(value) =>
                updateField('dueDate', value)
              }
            />

            <RadioGroup
              name="priority"
              label="Priority"
              value={formData.priority}
              options={priorityOptions}
              required
              error={errors.priority}
              onChange={(value) =>
                updateField(
                  'priority',
                  value as Priority | '',
                )
              }
            />
          </div>
        </section>

        <section
          className="form-section"
          aria-labelledby="description-heading"
        >
          <h3
            id="description-heading"
            className="form-section-title"
          >
            Request Description
          </h3>

          <TextArea
            id="description"
            label="Description"
            value={formData.description}
            placeholder="Describe what you need the legal team to review..."
            maxLength={1000}
            required
            error={errors.description}
            onChange={(value) =>
              updateField(
                'description',
                value,
              )
            }
          />
        </section>

        <section
          className="form-section"
          aria-labelledby="documents-heading"
        >
          <h3
            id="documents-heading"
            className="form-section-title"
          >
            Supporting Documents
          </h3>

          <FileUpload
            file={formData.file}
            accept=".pdf,.doc,.docx"
            error={errors.file}
            onChange={(file) =>
              updateField('file', file)
            }
          />
        </section>

        <FormActions
          onSaveDraft={handleSaveDraft}
          isSubmitting={isSubmitting}
        />
      </form>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        title="Submit Legal Request?"
        message="Please confirm that the information you provided is correct. Once submitted, this request will be sent to the legal team for review."
        confirmLabel="Confirm Submission"
        cancelLabel="Review Request"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />
    </>
  );
}

export default ContractReviewForm;
import { useState } from 'react';
import { Send } from 'lucide-react';

import ConfirmationDialog from '../ConfirmationDialog';
import FileUpload from './FileUpload';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import RadioGroup from './RadioGroup';
import TextArea from './TextArea';

import type {
  ContractType,
  CustomerType,
  LegalRequestFormData,
  PersonalDataInvolved,
  Priority,
  RiskLevel,
} from '../../types/legalRequest';

interface ContractReviewFormProps {
  onSubmit: (
    data: LegalRequestFormData,
  ) => void | Promise<void>;

  onSaveDraft: (
    data: LegalRequestFormData,
  ) => void | Promise<void>;

  isSubmitting?: boolean;
}

const initialFormData: LegalRequestFormData = {
  requestType: 'contract-review',
  title: '',
  contractType: '',
  priority: '',
  description: '',
  requesterName: '',
  requesterEmail: '',
  businessUnit: '',
  counterparty: '',
  contractValue: '',
  dueDate: '',
  personalDataInvolved: '',
  customerType: '',
  riskLevel: '',
  file: null,
};

const businessUnitOptions = [
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  {
    value: 'human-resources',
    label: 'Human Resources',
  },
  { value: 'operations', label: 'Operations' },
  {
    value: 'information-technology',
    label: 'Information Technology',
  },
  { value: 'other', label: 'Other' },
];

const contractTypeOptions: {
  value: ContractType;
  label: string;
}[] = [
  {
    value: 'master-service-agreement',
    label: 'Master Service Agreement',
  },
  {
    value: 'employment',
    label: 'Employment Agreement',
  },
  {
    value: 'vendor',
    label: 'Vendor / Supplier Agreement',
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

const riskLevelOptions: {
  value: RiskLevel;
  label: string;
}[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const priorityOptions: {
  value: Priority;
  label: string;
}[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const personalDataOptions: {
  value: PersonalDataInvolved;
  label: string;
}[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const customerTypeOptions: {
  value: CustomerType;
  label: string;
}[] = [
  {
    value: 'new',
    label: 'New Customer',
  },
  {
    value: 'existing',
    label: 'Existing Customer',
  },
];

function ContractReviewForm({
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
}: ContractReviewFormProps) {
  const [formData, setFormData] =
    useState<LegalRequestFormData>(
      initialFormData,
    );

  const [errors, setErrors] = useState<
    Partial<
      Record<
        keyof LegalRequestFormData,
        string
      >
    >
  >({});

  const [fileError, setFileError] =
    useState('');

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const updateField = <
    K extends keyof LegalRequestFormData,
  >(
    field: K,
    value: LegalRequestFormData[K],
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      return next;
    });
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<
        keyof LegalRequestFormData,
        string
      >
    > = {};

    if (!formData.title.trim()) {
      nextErrors.title =
        'Request title is required.';
    }

    if (!formData.businessUnit) {
      nextErrors.businessUnit =
        'Please select a business unit.';
    }

    if (!formData.counterparty.trim()) {
      nextErrors.counterparty =
        'Counter party is required.';
    }

    if (!formData.contractType) {
      nextErrors.contractType =
        'Please select the contract type.';
    }

    if (!formData.contractValue.trim()) {
      nextErrors.contractValue =
        'Contract value is required.';
    }

    if (!formData.dueDate) {
      nextErrors.dueDate =
        'Deadline is required.';
    }

    if (!formData.personalDataInvolved) {
      nextErrors.personalDataInvolved =
        'Please select whether personal data is involved.';
    }

    if (!formData.customerType) {
      nextErrors.customerType =
        'Please select the customer type.';
    }

    if (!formData.riskLevel) {
      nextErrors.riskLevel =
        'Please select a risk level.';
    }

    if (!formData.priority) {
      nextErrors.priority =
        'Please select a priority.';
    }

    if (!formData.description.trim()) {
      nextErrors.description =
        'Description is required.';
    } else if (
      formData.description.trim().length < 20
    ) {
      nextErrors.description =
        'Description must be at least 20 characters.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (
    file: File | null,
  ) => {
    setFileError('');

    if (!file) {
      updateField('file', null);
      return;
    }

    const maxFileSize =
      50 * 1024 * 1024;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const allowedExtensions =
      /\.(pdf|doc|docx)$/i;

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.test(file.name)
    ) {
      setFileError(
        'Only PDF, DOC, and DOCX files are allowed.',
      );
      return;
    }

    if (file.size > maxFileSize) {
      setFileError(
        'File size must be 50 MB or less.',
      );
      return;
    }

    updateField('file', file);
  };

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    if (!validate()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setShowConfirmation(false);

    await onSubmit(formData);
  };

  const handleSaveDraft = async () => {
    if (isSubmitting) {
      return;
    }

    await onSaveDraft(formData);
  };

  return (
    <>
      <form
        className="contract-review-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        {/* Request Details */}
        <section className="form-section">
          <div className="form-grid">
            <FormInput
              id="request-title"
              label="Request Title"
              value={formData.title}
              onChange={(value) =>
                updateField(
                  'title',
                  value,
                )
              }
              error={errors.title}
              required
              placeholder="Enter request title"
            />

            <FormSelect
              id="business-unit"
              label="Business Unit"
              value={formData.businessUnit}
              options={businessUnitOptions}
              onChange={(value) =>
                updateField(
                  'businessUnit',
                  value,
                )
              }
              error={errors.businessUnit}
              required
              placeholder="Select business unit"
            />

            <FormInput
              id="counterparty"
              label="Counterparty"
              value={formData.counterparty}
              onChange={(value) =>
                updateField(
                  'counterparty',
                  value,
                )
              }
              error={errors.counterparty}
              required
              placeholder="Enter counterparty"
            />

            <FormSelect
              id="contract-type"
              label="Contract Type"
              value={formData.contractType}
              options={contractTypeOptions}
              onChange={(value) =>
                updateField(
                  'contractType',
                  value as ContractType,
                )
              }
              error={errors.contractType}
              required
              placeholder="Select contract type"
            />

            <div className="currency-field">
              <FormInput
                id="contract-value"
                label="Contract Value"
                value={formData.contractValue}
                onChange={(value) =>
                  updateField(
                    'contractValue',
                    value,
                  )
                }
                error={errors.contractValue}
                required
                placeholder="0.00"
                type="text"
                inputMode="decimal"
              />

              <span
                className="currency-symbol"
                aria-hidden="true"
              >
                $
              </span>
            </div>

            <FormInput
              id="deadline"
              label="Deadline"
              value={formData.dueDate}
              onChange={(value) =>
                updateField(
                  'dueDate',
                  value,
                )
              }
              error={errors.dueDate}
              required
              type="date"
            />
          </div>
        </section>

        {/* Additional Information */}
        <section className="form-section">
          <div className="form-grid">
            <RadioGroup
              name="personal-data"
              label="Is Personal Data Involved?"
              value={
                formData.personalDataInvolved
              }
              options={personalDataOptions}
              onChange={(value) =>
                updateField(
                  'personalDataInvolved',
                  value as PersonalDataInvolved,
                )
              }
              error={
                errors.personalDataInvolved
              }
              required
            />

            <RadioGroup
              name="customer-type"
              label="Is this a New or Existing Customer?"
              value={formData.customerType}
              options={customerTypeOptions}
              onChange={(value) =>
                updateField(
                  'customerType',
                  value as CustomerType,
                )
              }
              error={errors.customerType}
              required
            />

            <FormSelect
              id="risk-level"
              label="Risk Level"
              value={formData.riskLevel}
              options={riskLevelOptions}
              onChange={(value) =>
                updateField(
                  'riskLevel',
                  value as RiskLevel,
                )
              }
              error={errors.riskLevel}
              required
              placeholder="Select risk level"
            />

            <FormSelect
              id="priority"
              label="Priority"
              value={formData.priority}
              options={priorityOptions}
              onChange={(value) =>
                updateField(
                  'priority',
                  value as Priority,
                )
              }
              error={errors.priority}
              required
              placeholder="Select priority"
            />
          </div>
        </section>

        {/* Description */}
        <section className="form-section">
          <TextArea
            id="description"
            label="Description"
            value={formData.description}
            onChange={(value) =>
              updateField(
                'description',
                value,
              )
            }
            error={errors.description}
            required
            placeholder="Describe your legal request..."
            minLength={20}
          />
        </section>

        {/* Upload Contract */}
        <section className="form-section">
          <FileUpload
            file={formData.file}
            onFileChange={handleFileChange}
            error={fileError}
          />
        </section>

        {/* Submission */}
        <div className="submission-area">
          <div className="submission-message">
            <div
              className="submission-message-icon"
              aria-hidden="true"
            >
              ✓
            </div>

            <p>
              After submission you will receive a
              confirmation email with your request
              number. You can track the status of your
              request from your dashboard.
            </p>
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </button>

          <button
            type="submit"
            className="button button-primary submit-request-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="button-spinner"
                  aria-hidden="true"
                />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>Submit Request</span>
              </>
            )}
          </button>
        </div>
      </form>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Submit Legal Request?"
        message="Are you sure you want to submit this legal request? Please make sure all information is correct before submitting."
        confirmLabel="Confirm Submission"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSubmit}
        onCancel={() =>
          setShowConfirmation(false)
        }
      />
    </>
  );
}

export default ContractReviewForm;

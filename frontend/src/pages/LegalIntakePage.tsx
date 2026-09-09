import { useEffect, useState } from 'react';
import {
  Building2,
  CircleHelp,
  ClipboardList,
  Copyright,
  FileText,
  Shield,
  ShieldCheck,
  TriangleAlert,
  Users,
} from 'lucide-react';

import Header from '../components/Header/Header';
import RequestTypeSidebar from '../components/RequestTypeSidebar/RequestTypeSidebar';
import ContractReviewForm from '../components/forms/ContractReviewForm';
import FeedbackMessage from '../components/FeedbackMessage';

import {
  saveLegalRequestDraft,
  submitLegalRequest,
} from '../services/legalRequestService';

import type {
  LegalRequest,
  LegalRequestFormData,
  RequestType,
} from '../types/legalRequest';

const requestTypeContent: Record<
  Exclude<RequestType, 'contract-review'>,
  {
    title: string;
    description: string;
    icon: typeof FileText;
    features: string[];
  }
> = {
  'nda-request': {
    title: 'NDA Request',
    description:
      'Request a new Non-Disclosure Agreement or legal review of an existing NDA.',
    icon: ShieldCheck,
    features: [
      'Request a new NDA',
      'Review an existing NDA',
      'Get guidance on confidentiality requirements',
    ],
  },

  'legal-question': {
    title: 'Legal Question',
    description:
      'Ask the Legal team for guidance on a specific legal question or issue.',
    icon: CircleHelp,
    features: [
      'Ask a specific legal question',
      'Request legal guidance',
      'Get help understanding legal requirements',
    ],
  },

  'privacy-request': {
    title: 'Privacy Request',
    description:
      'Submit a request related to data privacy, personal information, or privacy regulations.',
    icon: Shield,
    features: [
      'Request privacy guidance',
      'Ask about GDPR or CCPA requirements',
      'Request assistance with personal data matters',
    ],
  },

  'employment-matter': {
    title: 'Employment Matter',
    description:
      'Submit an employment-related legal request or ask for guidance on an employment issue.',
    icon: Users,
    features: [
      'Request employment legal guidance',
      'Ask about employment agreements',
      'Report or discuss an employment matter',
    ],
  },

  'intellectual-property': {
    title: 'Intellectual Property',
    description:
      'Submit a request related to intellectual property, trademarks, copyrights, or other IP matters.',
    icon: Copyright,
    features: [
      'Request trademark guidance',
      'Ask about copyright matters',
      'Request intellectual property review',
    ],
  },

  'corporate-legal-request': {
    title: 'Corporate Legal Request',
    description:
      'Submit a request related to corporate governance, business structure, or other corporate legal matters.',
    icon: Building2,
    features: [
      'Request corporate legal guidance',
      'Ask about corporate governance',
      'Request assistance with corporate matters',
    ],
  },

  'policy-review': {
    title: 'Policy Review',
    description:
      'Request legal review of a company policy, procedure, or internal guideline.',
    icon: ClipboardList,
    features: [
      'Review an existing company policy',
      'Request legal guidance on a policy',
      'Check policies for legal or regulatory requirements',
    ],
  },

  'legal-issue': {
    title: 'Report a Legal Issue',
    description:
      'Report a legal, compliance, or regulatory issue that requires attention from the Legal team.',
    icon: TriangleAlert,
    features: [
      'Report a legal issue',
      'Report a compliance concern',
      'Provide information about a potential legal risk',
    ],
  },
};

function LegalIntakePage() {
  const [selectedRequestType, setSelectedRequestType] =
    useState<RequestType>('contract-review');

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, []);

  const handleRequestTypeChange = (
    requestType: RequestType,
  ) => {
    setSelectedRequestType(requestType);
  };

  const handleSaveDraft = async (
    request: LegalRequestFormData,
  ) => {
    try {
      const savedDraft =
        saveLegalRequestDraft(request);

      console.log(
        'Draft saved:',
        savedDraft,
      );

      setFeedback({
        type: 'success',
        title: 'Draft Saved',
        message: `Your draft was saved successfully. Draft ID: ${savedDraft.id}`,
      });
    } catch (error) {
      console.error(
        'Draft save failed:',
        error,
      );

      setFeedback({
        type: 'error',
        title: 'Save Failed',
        message:
          error instanceof Error
            ? error.message
            : 'We could not save your draft. Please try again.',
      });
    }
  };

  const handleSubmit = async (
    request: LegalRequestFormData,
  ) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      /*
       * LegalRequestFormData contains empty-string values
       * while the form is being edited. Validation in the
       * form guarantees these fields have valid values
       * before this function is called.
       */
      const legalRequest: LegalRequest = {
        ...request,
        contractType:
          request.contractType as LegalRequest['contractType'],
        priority:
          request.priority as LegalRequest['priority'],
        personalDataInvolved:
          request.personalDataInvolved as LegalRequest['personalDataInvolved'],
        customerType:
          request.customerType as LegalRequest['customerType'],
        riskLevel:
          request.riskLevel as LegalRequest['riskLevel'],
      };

      const submittedRequest =
        await submitLegalRequest(
          legalRequest,
        );

      console.log(
        'Request submitted:',
        submittedRequest,
      );

      setFeedback({
        type: 'success',
        title: 'Request Submitted',
        message: `Your legal request was submitted successfully. Request ID: ${submittedRequest.id}`,
      });
    } catch (error) {
      console.error(
        'Request submission failed:',
        error,
      );

      setFeedback({
        type: 'error',
        title: 'Submission Failed',
        message:
          error instanceof Error
            ? error.message
            : 'We could not submit your legal request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isContractReview =
    selectedRequestType === 'contract-review';

  return (
    <div className="app">
      <Header />

      <div className="app-layout">
        <RequestTypeSidebar
          selectedRequestType={selectedRequestType}
          onRequestTypeChange={
            handleRequestTypeChange
          }
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

        <div className="main-area">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open request type navigation"
            aria-expanded={isSidebarOpen}
            onClick={() =>
              setIsSidebarOpen(true)
            }
          >
            <span aria-hidden="true">
              ☰
            </span>

            <span>
              Request Types
            </span>
          </button>

          <main className="main-content">
            {feedback && (
              <FeedbackMessage
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={() =>
                  setFeedback(null)
                }
              />
            )}

            {isContractReview ? (
              <>
                <div className="page-heading">
                  <div>
                    <span className="page-eyebrow">
                      Legal Request
                    </span>

                    <h2>
                      Contract Review Request
                    </h2>

                    <p>
                      Complete the form below to submit
                      your contract review request.
                    </p>
                  </div>

                  <span className="request-status">
                    {isSubmitting
                      ? 'Submitting...'
                      : 'New Request'}
                  </span>
                </div>

                <ContractReviewForm
                  onSaveDraft={
                    handleSaveDraft
                  }
                  onSubmit={handleSubmit}
                  isSubmitting={
                    isSubmitting
                  }
                />
              </>
            ) : (
              <RequestTypeInformation
                requestType={
                  selectedRequestType
                }
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

interface RequestTypeInformationProps {
  requestType: Exclude<
    RequestType,
    'contract-review'
  >;
}

function RequestTypeInformation({
  requestType,
}: RequestTypeInformationProps) {
  const content =
    requestTypeContent[requestType];

  const Icon = content.icon;

  return (
    <div className="request-information">
      <div className="request-information-header">
        <div
          className="request-information-icon"
          aria-hidden="true"
        >
          <Icon
            size={28}
            strokeWidth={2}
          />
        </div>

        <div>
          <span className="page-eyebrow">
            Legal Request
          </span>

          <h2>{content.title}</h2>

          <p>
            {content.description}
          </p>
        </div>
      </div>

      <div className="request-information-body">
        <h3>What you can request</h3>

        <ul>
          {content.features.map(
            (feature) => (
              <li key={feature}>
                {feature}
              </li>
            ),
          )}
        </ul>

        <div className="coming-soon-message">
          <strong>
            Request workflow
          </strong>

          <p>
            This request type is available
            for navigation. The dedicated
            form can be connected using the
            same reusable form components
            used by Contract Review.
          </p>

          <div className="workflow-note">
            <span
              className="workflow-note-icon"
              aria-hidden="true"
            >
              i
            </span>

            <span>
              Select{' '}
              <strong>
                Review a Contract
              </strong>{' '}
              from the request types menu
              to access the currently
              available request form.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalIntakePage;


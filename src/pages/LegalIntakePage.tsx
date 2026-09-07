
import { useEffect, useState } from 'react';
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
    icon: string;
    features: string[];
  }
> = {
  'legal-research': {
    title: 'Legal Research Request',
    description:
      'Submit a request for legal research, case analysis, or assistance with a legal question.',
    icon: '🔍',
    features: [
      'Research a specific legal question',
      'Request case law or statute analysis',
      'Get assistance with legal research',
    ],
  },

  compliance: {
    title: 'Compliance Request',
    description:
      'Submit a request related to regulatory requirements, policies, or compliance matters.',
    icon: '✓',
    features: [
      'Review compliance requirements',
      'Request regulatory guidance',
      'Review internal compliance policies',
    ],
  },

  other: {
    title: 'Other Legal Request',
    description:
      'Submit a legal request that does not fit into the other available request categories.',
    icon: '•••',
    features: [
      'Describe your legal need',
      'Provide relevant background information',
      'Attach supporting documents',
    ],
  },
};

function LegalIntakePage() {
  const [selectedRequestType, setSelectedRequestType] =
    useState<RequestType>('contract-review');

  const [isSidebarOpen, setIsSidebarOpen] =
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

  const handleSaveDraft = (
    request: LegalRequestFormData,
  ) => {
    const savedDraft = saveLegalRequestDraft(request);

    console.log('Draft saved:', savedDraft);

    setFeedback({
      type: 'success',
      title: 'Draft Saved',
      message: `Your draft was saved successfully. Draft ID: ${savedDraft.id}`,
    });
  };

  const handleSubmit = (request: LegalRequest) => {
    const submittedRequest = submitLegalRequest(request);

    console.log(
      'Request submitted:',
      submittedRequest,
    );

    setFeedback({
      type: 'success',
      title: 'Request Submitted',
      message: `Your legal request was submitted successfully. Request ID: ${submittedRequest.id}`,
    });
  };

  const isContractReview =
    selectedRequestType === 'contract-review';

  return (
    <div className="app">
      <Header />

      <div className="app-layout">
        <RequestTypeSidebar
          selectedRequestType={selectedRequestType}
          onRequestTypeChange={handleRequestTypeChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="main-area">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open request type navigation"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
          >
            <span aria-hidden="true">☰</span>
            <span>Request Types</span>
          </button>

          <main className="main-content">
            {feedback && (
              <FeedbackMessage
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={() => setFeedback(null)}
              />
            )}

            {isContractReview ? (
              <>
                <div className="page-heading">
                  <div>
                    <span className="page-eyebrow">
                      Legal Request
                    </span>

                    <h2>Contract Review Request</h2>

                    <p>
                      Complete the form below to submit
                      your contract review request.
                    </p>
                  </div>

                  <span className="request-status">
                    New Request
                  </span>
                </div>

                <ContractReviewForm
                  onSaveDraft={handleSaveDraft}
                  onSubmit={handleSubmit}
                />
              </>
            ) : (
              <RequestTypeInformation
                requestType={selectedRequestType}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

interface RequestTypeInformationProps {
  requestType: Exclude<RequestType, 'contract-review'>;
}

function RequestTypeInformation({
  requestType,
}: RequestTypeInformationProps) {
  const content = requestTypeContent[requestType];

  return (
    <div className="request-information">
      <div className="request-information-header">
        <div
          className="request-information-icon"
          aria-hidden="true"
        >
          {content.icon}
        </div>

        <div>
          <span className="page-eyebrow">
            Legal Request
          </span>

          <h2>{content.title}</h2>

          <p>{content.description}</p>
        </div>
      </div>

      <div className="request-information-body">
        <h3>What you can request</h3>

        <ul>
          {content.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

<div className="coming-soon-message">
  <strong>Request workflow</strong>

  <p>
    This request type is available for navigation.
    The dedicated form can be connected using the
    same reusable form components used by Contract
    Review.
  </p>

  <div className="workflow-note">
    <span
      className="workflow-note-icon"
      aria-hidden="true"
    >
      i
    </span>

    <span>
      Select <strong>Contract Review</strong> from
      the request types menu to access the currently
      available request form.
    </span>
  </div>
</div>
      </div>
    </div>
  );
}

export default LegalIntakePage;


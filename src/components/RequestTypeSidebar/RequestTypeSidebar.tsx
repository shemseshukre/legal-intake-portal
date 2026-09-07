import type { RequestType } from '../../types/legalRequest';
import RequestTypeCard from './RequestTypeCard';

interface RequestTypeSidebarProps {
  selectedRequestType: RequestType;
  onRequestTypeChange: (requestType: RequestType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const requestTypes: {
  id: RequestType;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'contract-review',
    title: 'Contract Review',
    description: 'Review contracts and agreements',
    icon: '📄',
  },
  {
    id: 'legal-research',
    title: 'Legal Research',
    description: 'Research legal questions and issues',
    icon: '🔍',
  },
  {
    id: 'compliance',
    title: 'Compliance',
    description: 'Compliance and regulatory requests',
    icon: '✓',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Other legal requests',
    icon: '•••',
  },
];

function RequestTypeSidebar({
  selectedRequestType,
  onRequestTypeChange,
  isOpen,
  onClose,
}: RequestTypeSidebarProps) {
  const handleRequestTypeChange = (
    requestType: RequestType,
  ) => {
    onRequestTypeChange(requestType);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close request type navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`request-sidebar ${
          isOpen ? 'request-sidebar--open' : ''
        }`}
      >
        <div className="sidebar-heading">
          <div className="sidebar-heading-top">
            <div>
              <h2>Request Type</h2>
              <p>
                Select the type of legal assistance you
                need.
              </p>
            </div>

            <button
              type="button"
              className="sidebar-close-button"
              aria-label="Close request type navigation"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <nav aria-label="Legal request types">
          <div className="request-type-list">
            {requestTypes.map((requestType) => (
              <RequestTypeCard
                key={requestType.id}
                title={requestType.title}
                description={requestType.description}
                icon={requestType.icon}
                selected={
                  selectedRequestType === requestType.id
                }
                onClick={() =>
                  handleRequestTypeChange(
                    requestType.id,
                  )
                }
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default RequestTypeSidebar;
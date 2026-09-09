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
  icon: typeof FileText;
}[] = [
  {
    id: 'contract-review',
    title: 'Review a Contract',
    description: 'Request legal review of a contract or agreement',
    icon: FileText,
  },
  {
    id: 'nda-request',
    title: 'Request an NDA',
    description: 'Create or review a Non-Disclosure Agreement',
    icon: ShieldCheck,
  },
  {
    id: 'legal-question',
    title: 'Ask a Legal Question',
    description: 'Get legal advice on a specific issue',
    icon: CircleHelp,
  },
  {
    id: 'privacy-request',
    title: 'Privacy Request',
    description: 'Request related to data privacy (GDPR, CCPA)',
    icon: Shield,
  },
  {
    id: 'employment-matter',
    title: 'Employment Matter',
    description: 'Employment-related legal request',
    icon: Users,
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    description: 'IP, trademark or copyright related request',
    icon: Copyright,
  },
  {
    id: 'corporate-legal-request',
    title: 'Corporate Legal Request',
    description: 'Corporate governance or legal matters',
    icon: Building2,
  },
  {
    id: 'policy-review',
    title: 'Policy Review',
    description: 'Request review of company policies',
    icon: ClipboardList,
  },
  {
    id: 'legal-issue',
    title: 'Report a Legal Issue',
    description: 'Report a compliance or legal issue',
    icon: TriangleAlert,
  },
];

function RequestTypeSidebar({
  selectedRequestType,
  onRequestTypeChange,
  isOpen,
  onClose,
}: RequestTypeSidebarProps) {
  const handleRequestTypeChange = (requestType: RequestType) => {
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
                Select the type of legal assistance you need.
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
                  handleRequestTypeChange(requestType.id)
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
import type { LucideIcon } from 'lucide-react';

interface RequestTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

function RequestTypeCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: RequestTypeCardProps) {
  return (
    <button
      type="button"
      className={`request-type-card ${
        selected ? 'request-type-card--selected' : ''
      }`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="request-type-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </span>

      <span className="request-type-content">
        <span className="request-type-title">{title}</span>

        <span className="request-type-description">
          {description}
        </span>
      </span>
    </button>
  );
}

export default RequestTypeCard;
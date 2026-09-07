export type RequestType =
  | 'contract-review'
  | 'nda-request'
  | 'legal-question'
  | 'privacy-request'
  | 'employment-matter'
  | 'intellectual-property'
  | 'corporate-legal-request'
  | 'policy-review'
  | 'legal-issue';

export type Priority =
  | 'low'
  | 'medium'
  | 'high';

export type ContractType =
  | 'employment'
  | 'vendor'
  | 'nda'
  | 'partnership'
  | 'other';

export type CustomerType =
  | 'new'
  | 'existing';

export type RiskLevel =
  | 'low'
  | 'medium'
  | 'high';

export type PersonalDataInvolved =
  | 'yes'
  | 'no';

export interface LegalRequest {
  requestType: RequestType;
  title: string;
  contractType: ContractType;
  priority: Priority;
  description: string;
  requesterName: string;
  requesterEmail: string;
  businessUnit: string;
  counterparty: string;
  contractValue: string;
  dueDate: string;
  personalDataInvolved: PersonalDataInvolved;
  customerType: CustomerType;
  riskLevel: RiskLevel;
  file: File | null;
}

export interface LegalRequestFormData {
  requestType: RequestType;
  title: string;
  contractType: ContractType | '';
  priority: Priority | '';
  description: string;
  requesterName: string;
  requesterEmail: string;
  businessUnit: string;
  counterparty: string;
  contractValue: string;
  dueDate: string;
  personalDataInvolved: PersonalDataInvolved | '';
  customerType: CustomerType | '';
  riskLevel: RiskLevel | '';
  file: File | null;
}

export type FormErrors = Partial<
  Record<keyof LegalRequestFormData, string>
>;
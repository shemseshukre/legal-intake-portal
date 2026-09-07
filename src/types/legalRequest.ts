export type RequestType =
  | 'contract-review'
  | 'legal-research'
  | 'compliance'
  | 'other';

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

export interface LegalRequest {
  requestType: RequestType;
  title: string;
  contractType: ContractType;
  priority: Priority;
  description: string;
  requesterName: string;
  requesterEmail: string;
  dueDate: string;
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
  dueDate: string;
  file: File | null;
}

export type FormErrors = Partial<
  Record<keyof LegalRequestFormData, string>
>;
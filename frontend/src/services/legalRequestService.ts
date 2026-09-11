import type {
  LegalRequest,
  LegalRequestFormData,
} from '../types/legalRequest';

const DRAFT_STORAGE_KEY = 'legal-intake-drafts';

const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:8000/api';

export interface SavedDraft {
  id: string;
  data: LegalRequestFormData;
  createdAt: string;
  updatedAt: string;
}

export interface SubmittedRequest
  extends LegalRequest {
  id: string;
  submittedAt: string;
}

function generateId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function getDrafts(): SavedDraft[] {
  const storedDrafts = localStorage.getItem(
    DRAFT_STORAGE_KEY,
  );

  if (!storedDrafts) {
    return [];
  }

  try {
    return JSON.parse(
      storedDrafts,
    ) as SavedDraft[];
  } catch {
    return [];
  }
}

export function saveLegalRequestDraft(
  data: LegalRequestFormData,
): SavedDraft {
  const drafts = getDrafts();

  const now = new Date().toISOString();

  const draft: SavedDraft = {
    id: generateId(),
    data,
    createdAt: now,
    updatedAt: now,
  };

  drafts.push(draft);

  localStorage.setItem(
    DRAFT_STORAGE_KEY,
    JSON.stringify(drafts),
  );

  return draft;
}

export async function submitLegalRequest(
  data: LegalRequest,
): Promise<SubmittedRequest> {
  const formData = new FormData();

  formData.append(
    'request_title',
    data.title,
  );

  formData.append(
    'business_unit',
    data.businessUnit,
  );

  formData.append(
    'counterparty',
    data.counterparty,
  );

  formData.append(
    'contract_type',
    data.contractType,
  );

  formData.append(
    'contract_value',
    data.contractValue,
  );

  formData.append(
    'required_by_date',
    data.dueDate,
  );

  formData.append(
    'personal_data_involved',
    data.personalDataInvolved,
  );

  formData.append(
    'customer_type',
    data.customerType,
  );

  formData.append(
    'risk_level',
    data.riskLevel,
  );

  formData.append(
    'priority',
    data.priority,
  );

  formData.append(
    'description',
    data.description,
  );

  formData.append(
    'status',
    'submitted',
  );

  if (data.file) {
    formData.append(
      'file',
      data.file,
    );
  }

  const response = await fetch(
    `${API_URL}/legal-requests`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const result = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ??
        'Failed to submit legal request',
    );
  }

  const createdRequest = result?.data;

  return {
    ...data,
    id: String(
      createdRequest?.insertId ??
        generateId(),
    ),
    submittedAt:
      new Date().toISOString(),
  };
}

export function getSavedDrafts(): SavedDraft[] {
  return getDrafts();
}
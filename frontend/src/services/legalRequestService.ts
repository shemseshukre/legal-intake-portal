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

export interface SubmittedRequest extends LegalRequest {
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
  const response = await fetch(
    `${API_URL}/legal-requests`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_title: data.title,
        business_unit: data.businessUnit,
        counterparty: data.counterparty,
        contract_type: data.contractType,
        contract_value: data.contractValue,
        required_by_date: data.dueDate,
        personal_data_involved:
          data.personalDataInvolved,
        customer_type: data.customerType,
        risk_level: data.riskLevel,
        priority: data.priority,
        description: data.description,
        status: 'submitted',
      }),
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
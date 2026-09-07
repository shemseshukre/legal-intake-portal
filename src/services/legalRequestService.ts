import type {
  LegalRequest,
  LegalRequestFormData,
} from '../types/legalRequest';

const DRAFT_STORAGE_KEY = 'legal-intake-drafts';
const REQUEST_STORAGE_KEY = 'legal-intake-requests';

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

  return JSON.parse(storedDrafts) as SavedDraft[];
}

function getSubmittedRequests(): SubmittedRequest[] {
  const storedRequests = localStorage.getItem(
    REQUEST_STORAGE_KEY,
  );

  if (!storedRequests) {
    return [];
  }

  return JSON.parse(
    storedRequests,
  ) as SubmittedRequest[];
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

export function submitLegalRequest(
  data: LegalRequest,
): SubmittedRequest {
  const requests = getSubmittedRequests();

  const submittedRequest: SubmittedRequest = {
    ...data,
    id: generateId(),
    submittedAt: new Date().toISOString(),
  };

  requests.push(submittedRequest);

  localStorage.setItem(
    REQUEST_STORAGE_KEY,
    JSON.stringify(requests),
  );

  return submittedRequest;
}

export function getSavedDrafts(): SavedDraft[] {
  return getDrafts();
}

export function getSubmittedLegalRequests(): SubmittedRequest[] {
  return getSubmittedRequests();
}
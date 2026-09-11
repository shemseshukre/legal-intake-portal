import pool from "../config/database.js";

export interface LegalRequest {
  id?: number;
  request_title: string;
  business_unit: string;
  counterparty: string;
  contract_type: string;
  contract_value: string;
  required_by_date: string;
  personal_data_involved: string;
  customer_type: string;
  risk_level: string;
  priority: string;
  description: string;
  status?: string;

  file_original_name?: string | null;
  file_stored_name?: string | null;
  file_path?: string | null;
  file_mime_type?: string | null;
  file_size?: number | null;

  created_at?: Date;
  updated_at?: Date;
}

export async function getAllLegalRequests() {
  const [rows] = await pool.query(
    "SELECT * FROM legal_requests ORDER BY created_at DESC",
  );

  return rows;
}

export async function getLegalRequestById(
  id: number,
) {
  const [rows] = await pool.query(
    "SELECT * FROM legal_requests WHERE id = ?",
    [id],
  );

  return rows;
}

export async function createLegalRequest(
  request: LegalRequest,
) {
  const [result] = await pool.query(
    `INSERT INTO legal_requests
    (
      request_title,
      business_unit,
      counterparty,
      contract_type,
      contract_value,
      required_by_date,
      personal_data_involved,
      customer_type,
      risk_level,
      priority,
      description,
      status,
      file_original_name,
      file_stored_name,
      file_path,
      file_mime_type,
      file_size
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      request.request_title,
      request.business_unit,
      request.counterparty,
      request.contract_type,
      request.contract_value,
      request.required_by_date,
      request.personal_data_involved,
      request.customer_type,
      request.risk_level,
      request.priority,
      request.description,
      request.status ?? "submitted",

      request.file_original_name ?? null,
      request.file_stored_name ?? null,
      request.file_path ?? null,
      request.file_mime_type ?? null,
      request.file_size ?? null,
    ],
  );

  return result;
}
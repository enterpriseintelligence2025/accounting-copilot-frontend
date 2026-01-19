/*
	invoiceConstants.js
	- Action type constants for invoice flows and file uploads.
	- Keep strings stable to avoid reducer mismatches.
*/
export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_FILE_FAIL = "UPLOAD_FILE_FAIL";

export const GENERATE_INVOICE_REQUEST = "GENERATE_INVOICE_REQUEST";
export const GENERATE_INVOICE_SUCCESS = "GENERATE_INVOICE_SUCCESS";
export const GENERATE_INVOICE_FAIL = "GENERATE_INVOICE_FAIL";

// Note: the original files had a typo in the RECONCILIATION constants (RECONCILIE). Keep stable names here.
export const RECONCILIATION_REQUEST = "RECONCILIATION_REQUEST";
export const RECONCILIATION_SUCCESS = "RECONCILIATION_SUCCESS";
export const RECONCILIATION_FAIL = "RECONCILIATION_FAIL";

export const UPLOAD_PO_REQUEST = "UPLOAD_PO_REQUEST";
export const UPLOAD_PO_SUCCESS = "UPLOAD_PO_SUCCESS";
export const UPLOAD_PO_FAIL = "UPLOAD_PO_FAIL";

export const UPLOAD_INVOICE_REQUEST = "UPLOAD_INVOICE_REQUEST";
export const UPLOAD_INVOICE_SUCCESS = "UPLOAD_INVOICE_SUCCESS";
export const UPLOAD_INVOICE_FAIL = "UPLOAD_INVOICE_FAIL";
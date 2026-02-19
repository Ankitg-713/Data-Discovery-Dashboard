/**
 * Mock NLP processing for converting natural language policy requests
 * into structured JSON policies. Replace with actual API in production.
 */

export type PolicyAction =
  | "view"
  | "read"
  | "write"
  | "edit"
  | "delete"
  | "tokenize"
  | "detokenize"
  | "analyze";

export interface TimeRestriction {
  duration: number;
  unit: "hours" | "days" | "minutes";
}

export interface GeneratedPolicy {
  role: string[];
  data_field: string[];
  action: PolicyAction;
  data_transformation: string;
  restrictions?: string[];
  restricted_fields?: string[];
  time_restriction?: TimeRestriction;
  conditional_access?: string;
}

const ROLES: Record<string, string> = {
  // Existing
  admin: "admin",
  admins: "admin",
  administrator: "admin",
  doctor: "doctor",
  doctors: "doctor",
  senior_doctor: "senior_doctor",
  senior_doctors: "senior_doctor",
  medical_staff: "medical_staff",
  analytics_team: "analytics_team",
  insurance_verification_team: "insurance_verification_team",
  insurance_team: "insurance_verification_team",
  support: "support",
  customer_support: "support",
  manager: "manager",
  managers: "manager",
  nurse: "medical_staff",
  nurses: "medical_staff",
  // Executive & leadership
  cto: "cto",
  chief_technology_officer: "cto",
  ceo: "ceo",
  chief_executive_officer: "ceo",
  security_officer: "security_officer",
  compliance_officer: "compliance_officer",
  // Tech & operations
  devops_engineer: "devops_engineer",
  system_administrator: "system_administrator",
  sysadmin: "system_administrator",
  developer: "developer",
  dev: "developer",
  // Business roles
  finance_manager: "finance_manager",
  product_manager: "product_manager",
  operations_manager: "operations_manager",
  data_analyst: "data_analyst",
  analyst: "analyst",
  support_engineer: "support_engineer",
  auditor: "auditor",
  // HR & viewer
  hr: "hr",
  human_resources: "hr",
  viewer: "viewer",
  read_only: "viewer",
  "read-only": "viewer",
  // Medical – specific first so they win over generic "doctor"
  chief_medical_officer: "chief_medical_officer",
  cmo: "chief_medical_officer",
  medical_director: "medical_director",
  attending_physician: "attending_physician",
  consultant_physician: "consultant_physician",
  resident_doctor: "resident_doctor",
  surgeon: "surgeon",
  nurse_practitioner: "nurse_practitioner",
  clinical_admin: "clinical_admin",
  radiologist: "radiologist",
  pathologist: "pathologist",
  lab_technician: "lab_technician",
  laboratory_technician: "lab_technician",
  pharmacist: "pharmacist",
  medical_auditor: "medical_auditor",
};

const DATA_FIELDS: Record<string, string> = {
  // Patient & clinical
  patient_record: "patient_record",
  patient_records: "patient_record",
  patient_trends: "patient_record",
  patient_data: "patient_record",
  health_record: "patient_record",
  health_records: "patient_record",
  medical_record: "patient_record",
  medical_records: "patient_record",
  clinical_data: "patient_record",
  clinical_records: "patient_record",
  diagnosis: "patient_record",
  diagnosis_documents: "patient_record",
  documents: "patient_record",
  prescription: "prescription",
  prescriptions: "prescription",
  lab_result: "lab_result",
  lab_results: "lab_result",
  laboratory_result: "lab_result",
  laboratory_results: "lab_result",
  test_result: "lab_result",
  test_results: "lab_result",
  imaging_result: "imaging_result",
  imaging_results: "imaging_result",
  radiology_report: "imaging_result",
  // Contact & identity
  phone_number: "phone_number",
  phone_numbers: "phone_number",
  telephone: "phone_number",
  mobile_number: "phone_number",
  email: "email",
  emails: "email",
  email_address: "email",
  name: "name",
  names: "name",
  full_name: "name",
  first_name: "name",
  last_name: "name",
  date_of_birth: "date_of_birth",
  dob: "date_of_birth",
  birth_date: "date_of_birth",
  // Financial & identifiers
  card_number: "card_number",
  card_numbers: "card_number",
  credit_card: "card_number",
  payment_card: "card_number",
  national_id: "national_id",
  national_ids: "national_id",
  social_security: "national_id",
  ssn: "national_id",
  social_security_number: "national_id",
  government_id: "national_id",
  tax_id: "national_id",
  // Location & demographics
  address: "address",
  addresses: "address",
  mailing_address: "address",
  residential_address: "address",
  demographics: "demographics",
  demographic_data: "demographics",
  // PII & sensitive
  pii: "pii",
  direct_identifiers: "pii",
  identifiers: "pii",
  personal_data: "pii",
  personal_information: "pii",
  sensitive_data: "pii",
  confidential_data: "pii",
  // Billing & claims
  billing: "billing",
  billing_record: "billing",
  billing_records: "billing",
  billing_info: "billing",
  claim: "claim",
  claims: "claim",
  insurance_claim: "claim",
  insurance_claims: "claim",
  financial_data: "financial_data",
  financial_records: "financial_data",
  payment_info: "financial_data",
  insurance_info: "insurance_info",
  insurance_information: "insurance_info",
  coverage: "insurance_info",
  // Audit & compliance
  audit_log: "audit_log",
  audit_logs: "audit_log",
  access_log: "audit_log",
  access_logs: "audit_log",
  compliance_record: "compliance_record",
  compliance_records: "compliance_record",
};

const ACTIONS: Record<string, PolicyAction> = {
  // view
  view: "view",
  access: "view",
  see: "view",
  browse: "view",
  inspect: "view",
  look_at: "view",
  open: "view",
  // read
  read: "read",
  retrieve: "read",
  fetch: "read",
  load: "read",
  query: "read",
  export: "read",
  download: "read",
  // write
  write: "write",
  create: "write",
  add: "write",
  insert: "write",
  create_new: "write",
  // edit
  edit: "edit",
  modify: "edit",
  change: "edit",
  update: "edit",
  alter: "edit",
  // delete
  delete: "delete",
  remove: "delete",
  erase: "delete",
  purge: "delete",
  // tokenize
  tokenize: "tokenize",
  tokenization: "tokenize",
  mask: "tokenize",
  anonymize: "tokenize",
  pseudonymize: "tokenize",
  // detokenize
  detokenize: "detokenize",
  detokenization: "detokenize",
  unmask: "detokenize",
  reveal: "detokenize",
  de_tokenize: "detokenize",
  // analyze
  analyze: "analyze",
  analysis: "analyze",
  analytics: "analyze",
  analyze_team: "analyze",
  report: "analyze",
  aggregate: "analyze",
  run_analytics: "analyze",
  run_reports: "analyze",
};

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/\s+/g, "_").trim();
}

function extractRoles(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [key, role] of Object.entries(ROLES)) {
    const regex = new RegExp(`\\b${key.replace(/_/g, "\\s*")}\\b`, "gi");
    if (regex.test(lower)) {
      found.add(role);
    }
  }

  if (found.size === 0) found.add("admin");
  return Array.from(found);
}

function extractDataFields(text: string, excludeRestricted: string[] = []): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const [key, field] of Object.entries(DATA_FIELDS)) {
    const regex = new RegExp(`\\b${key.replace(/_/g, "\\s*")}\\b`, "gi");
    if (regex.test(lower) && !excludeRestricted.includes(field)) {
      found.add(field);
    }
  }

  if (found.size === 0) found.add("patient_record");
  return Array.from(found);
}

function extractAction(text: string): PolicyAction {
  const lower = text.toLowerCase();
  for (const [key, action] of Object.entries(ACTIONS)) {
    const regex = new RegExp(`\\b${key.replace(/_/g, "\\s*")}\\b`, "gi");
    if (regex.test(lower)) return action;
  }
  return "view";
}

function extractRestrictedFields(text: string): string[] {
  const lower = text.toLowerCase();
  const restricted: string[] = [];
  const restrictPatterns = [
    /restrict\s+(?:access\s+to\s+)?([^.]+?)(?:\.|$|,|and|but)/gi,
    /restrict\s+([^.]+?)(?:\.|$|,|and|but)/gi,
    /(?:direct\s+)?identifiers?\s+like\s+([^.]+?)(?:\.|$|,|and|but)/gi,
    /(?:except|excluding)\s+([^.]+?)(?:\.|$|,|and|but)/gi,
  ];

  for (const pattern of restrictPatterns) {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(lower)) !== null) {
      const part = m[1];
      for (const [key, field] of Object.entries(DATA_FIELDS)) {
        const regex = new RegExp(`\\b${key.replace(/_/g, "\\s*")}\\b`, "gi");
        if (regex.test(part)) restricted.push(field);
      }
    }
  }

  const directMentions = ["name", "phone", "email", "phone_number", "card_number", "national_id", "address"];
  for (const d of directMentions) {
    const re = new RegExp(`\\b${d.replace(/_/g, "\\s*")}\\b`, "gi");
    if (re.test(lower) && lower.includes("restrict")) {
      const normalized = DATA_FIELDS[d] ?? d;
      if (!restricted.includes(normalized)) restricted.push(normalized);
    }
  }

  return [...new Set(restricted)];
}

function extractTimeRestriction(text: string): TimeRestriction | undefined {
  const patterns = [
    /(\d+)\s*(hour|hours)/i,
    /(\d+)\s*(day|days)/i,
    /(\d+)\s*(minute|minutes)/i,
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      const duration = parseInt(m[1], 10);
      const unit = m[2].toLowerCase().startsWith("h")
        ? "hours"
        : m[2].toLowerCase().startsWith("d")
        ? "days"
        : "minutes";
      return { duration, unit: unit as TimeRestriction["unit"] };
    }
  }
  return undefined;
}

function extractConditionalAccess(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (/\bactive\s+consultation\s+session/i.test(lower)) return "active_consultation_session";
  if (/\b(?:only\s+)?for\s+treatment\s+purposes/i.test(lower)) return "treatment_purposes_only";
  if (/\b(?:only\s+)?for\s+claim\s+validation/i.test(lower)) return "claim_validation_only";
  if (/\b(?:during\s+)?business\s+hours/i.test(lower)) return "business_hours";
  return undefined;
}

function inferDataTransformation(action: PolicyAction, text: string): string {
  const lower = text.toLowerCase();
  if (action === "tokenize" || lower.includes("tokeniz")) return "tokenization";
  if (action === "detokenize" || lower.includes("detokeniz")) return "detokenization";
  if (lower.includes("encrypt")) return "encryption";
  if (lower.includes("mask")) return "masked";
  if (action === "analyze" || lower.includes("analyze")) return "aggregated";
  return "none";
}

/**
 * Parses natural language input and returns a structured policy object.
 */
export function generatePolicy(input: string): GeneratedPolicy {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      role: ["admin"],
      data_field: ["patient_record"],
      action: "view",
      data_transformation: "none",
    };
  }

  const restricted_fields = extractRestrictedFields(trimmed);
  const role = extractRoles(trimmed);
  const data_field = extractDataFields(trimmed, restricted_fields);
  const action = extractAction(trimmed);
  const data_transformation = inferDataTransformation(action, trimmed);
  const time_restriction = extractTimeRestriction(trimmed);
  const conditional_access = extractConditionalAccess(trimmed);

  const dataFieldFiltered = data_field.filter((f) => f !== "pii");
  const restrictedFieldsFiltered = restricted_fields.filter((f) => f !== "pii");

  const restrictions: string[] = [];
  if (restrictedFieldsFiltered.length > 0) restrictions.push("restrict_identifiers");
  if (time_restriction) restrictions.push("time_limited");
  if (conditional_access) restrictions.push("conditional");

  const policy: GeneratedPolicy = {
    role,
    data_field: dataFieldFiltered.length > 0 ? dataFieldFiltered : ["patient_record"],
    action,
    data_transformation,
  };
  if (restrictions.length > 0) policy.restrictions = restrictions;
  if (restrictedFieldsFiltered.length > 0) policy.restricted_fields = restrictedFieldsFiltered;
  if (time_restriction) policy.time_restriction = time_restriction;
  if (conditional_access) policy.conditional_access = conditional_access;

  return policy;
}

export type RiskLevel = "Low" | "Medium" | "High";

/**
 * Calculates risk level based on policy attributes.
 */
export function assessRisk(policy: GeneratedPolicy): RiskLevel {
  let score = 0;

  if (policy.action === "delete" || policy.action === "write" || policy.action === "edit") score += 3;
  else if (policy.action === "detokenize") score += 2;
  else if (policy.action === "view" || policy.action === "read") score += 1;
  else if (policy.action === "analyze" || policy.action === "tokenize") score += 1;

  if (policy.data_field.includes("pii") || policy.data_field.includes("national_id") || policy.data_field.includes("card_number"))
    score += 2;
  if (policy.role.includes("admin")) score += 1;
  if (!policy.restrictions || policy.restrictions.length === 0) score += 1;
  if (policy.restricted_fields && policy.restricted_fields.length > 0) score -= 1;
  if (policy.time_restriction) score -= 1;
  if (policy.conditional_access) score -= 1;

  if (score <= 2) return "Low";
  if (score <= 4) return "Medium";
  return "High";
}

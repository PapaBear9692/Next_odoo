export interface OdooSessionInfo {
  uid: number;
  is_system: boolean;
  is_admin: boolean;
  is_public: boolean;
  is_internal_user: boolean;
  user_context: {
    lang: string;
    tz: string;
  };
  db: string;
  server_version: string;
  name: string;
  username: string;
  partner_id: number;
  "web.base.url": string;
  max_file_upload_size: number;
  home_action_id: boolean | number;
  currencies: Record<string, unknown>;
  user_companies: Record<string, unknown>;
  show_effect: boolean;
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: "call";
  params: Record<string, unknown>;
  id: number | null;
}

export interface JsonRpcResponse<T = unknown> {
  jsonrpc: "2.0";
  result?: T;
  error?: {
    code: number;
    message: string;
    data: {
      code: string;
      debug: string;
    };
  };
  id: number | null;
}

export interface Employee {
  id: number;
  name: string;
  work_email?: string;
  work_phone?: string;
  mobile_phone?: string;
  department_id?: [number, string];
  job_id?: [number, string];
  job_title?: string;
  parent_id?: [number, string];
  coach_id?: [number, string];
  company_id?: [number, string];
  work_location_id?: [number, string];
  work_location_name?: string;
  work_location_type?: string;
  avatar_128?: string;
  image_1920?: string;
  hr_presence_state?: string;
  hr_icon_display?: string;
  newly_hired?: boolean;
  active: boolean;
  category_ids?: number[];
  category_names?: string[];
  birthday?: string;
  contract_date_start?: string;
  contract_date_end?: string;
  wage?: number;
  employee_type?: string;
  contract_type_id?: [number, string];
  structure_type_id?: [number, string];
  resource_calendar_id?: [number, string];
  user_id?: [number, string];
  address_id?: [number, string];
  private_email?: string;
  private_phone?: string;
  legal_name?: string;
  country_id?: [number, string];
  identification_id?: string;
  passport_id?: string;
  marital?: string;
  children?: number;
  emergency_contact?: string;
  emergency_phone?: string;
  certificate?: string;
  study_field?: string;
  study_school?: string;
  barcode?: string;
  pin?: string;
  tz?: string;
  color?: number;
  distance_home_work?: number;
  distance_home_work_unit?: string;
  place_of_birth?: string;
  country_of_birth?: [number, string];
  sex?: string;
  private_street?: string;
  private_street2?: string;
  private_city?: string;
  private_state_id?: [number, string];
  private_zip?: string;
  private_country_id?: [number, string];
  visa_no?: string;
  visa_expire?: string;
  permit_no?: string;
  work_permit_expiration_date?: string;
}

export interface Department {
  id: number;
  name: string;
  complete_name?: string;
  active: boolean;
  company_id?: [number, string];
  parent_id?: [number, string];
  child_ids?: number[];
  manager_id?: [number, string];
  member_ids?: number[];
  total_employee?: number;
  jobs_ids?: number[];
  note?: string;
  color?: number;
}

export interface Job {
  id: number;
  name: string;
  active: boolean;
  sequence?: number;
  expected_employees?: number;
  no_of_employee?: number;
  no_of_recruitment?: number;
  description?: string;
  requirements?: string;
  user_id?: [number, string];
  department_id?: [number, string];
  company_id?: [number, string];
  contract_type_id?: [number, string];
}

export interface WorkLocation {
  id: number;
  name: string;
  active: boolean;
  company_id?: [number, string];
  location_type?: string;
  address_id?: [number, string];
  location_number?: string;
}

export interface ContractType {
  id: number;
  name: string;
  code?: string;
  sequence?: number;
  country_id?: [number, string];
}

export interface EmployeeCategory {
  id: number;
  name: string;
  color?: number;
  employee_ids?: number[];
}

export interface DepartureReason {
  id: number;
  name: string;
  sequence?: number;
  country_id?: [number, string];
}

export interface AppItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface SearchReadOptions {
  domain?: unknown[][];
  fields?: string[];
  offset?: number;
  limit?: number;
  order?: string;
  context?: Record<string, unknown>;
}

export interface SearchReadResult<T = unknown> {
  length: number;
  records: T[];
}

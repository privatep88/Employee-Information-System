
export interface EmployeeFormData {
  // Metadata
  submission_date?: string;

  // Personal Info
  emp_id: string;
  profile_picture: File | null;
  nationality: string;
  name_ar: string;
  name_en: string;
  marital_status: string;
  dob: string;

  // Education
  degree: string;
  specialization: string;
  education_certificate_file: File | null;

  // Contact
  phone: string;
  email: string;

  // Official Documents
  passport_no: string;
  passport_expiry: string;
  emirates_id: string;
  emirates_expiry: string;
  gcc_id: string;
  gcc_id_expiry: string;
  license_type: string;
  license_expiry: string;
  passport_file: File | null;
  eid_file: File | null;
  license_file: File | null;
  gcc_id_file: File | null;

  // Emergency
  emergency_name: string;
  emergency_relation: string;
  emergency_phone: string;

  // Declaration
  declaration_accepted: boolean;
}

export const INITIAL_STATE: EmployeeFormData = {
  emp_id: '',
  profile_picture: null,
  nationality: '',
  name_ar: '',
  name_en: '',
  marital_status: '',
  dob: '',
  degree: '',
  specialization: '',
  education_certificate_file: null,
  phone: '',
  email: '',
  passport_no: '',
  passport_expiry: '',
  emirates_id: '',
  emirates_expiry: '',
  gcc_id: '',
  gcc_id_expiry: '',
  license_type: '',
  license_expiry: '',
  passport_file: null,
  eid_file: null,
  license_file: null,
  gcc_id_file: null,
  emergency_name: '',
  emergency_relation: '',
  emergency_phone: '',
  declaration_accepted: false,
};
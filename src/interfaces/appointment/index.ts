import { PatientInterface } from 'interfaces/patient';
import { DoctorInterface } from 'interfaces/doctor';
import { NurseInterface } from 'interfaces/nurse';
import { HospitalInterface } from 'interfaces/hospital';
import { GetQueryInterface } from 'interfaces';

export interface AppointmentInterface {
  id?: string;
  appointment_date: any;
  appointment_time: string;
  patient_id: string;
  doctor_id: string;
  nurse_id: string;
  hospital_id: string;
  created_at?: any;
  updated_at?: any;

  patient?: PatientInterface;
  doctor?: DoctorInterface;
  nurse?: NurseInterface;
  hospital?: HospitalInterface;
  _count?: {};
}

export interface AppointmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  appointment_time?: string;
  patient_id?: string;
  doctor_id?: string;
  nurse_id?: string;
  hospital_id?: string;
}

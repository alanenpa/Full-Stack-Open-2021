import patients from '../../data/patients';
import {v1 as uuid} from 'uuid';

import { Patient, NewPatient, PublicPatient, Entry, NewEntry } from '../types';

const patientsArray: Array<Patient> = patients;

const getAllData = (): Array<Patient> => {
  return patientsArray;
};

const getPublicEntries = (): Array<PublicPatient> => {
  return patientsArray.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patientsArray.find(p => p.id === id);
  return patient;
};


const addPatient = ( patient : NewPatient ): Patient => {
  const newPatient = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    id: uuid(),
    ...patient
  };

  patientsArray.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry : NewEntry) : Entry => {
  const patient = patientsArray.find(p => p.id === patientId);
  const newEntry = {
    id: uuid(),
    ...entry
  };
  patient?.entries.push(newEntry);
  return newEntry;
};

export default {
  getAllData,
  getPublicEntries,
  addPatient,
  addEntry,
  findById
};
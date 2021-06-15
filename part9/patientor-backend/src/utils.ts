import { NewPatient, Gender, Entry, Diagnosis, Discharge, SickLeave, HealthCheckRating, NewEntry } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseField = (value: unknown, fieldName: string): string => {
  if (!value || !isString(value)) {
    throw new Error('Incorrect or missing field: ' + fieldName + ', (' + value + ')');
  }

  return value;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender ' + gender);
  }
  return gender;
};

type PatientFields = {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown,
  entries: Entry[]
};

export const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation, entries }: PatientFields): NewPatient => {
  const newEntry: NewPatient = {
    name: parseField(name, 'name'),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseField(ssn, 'ssn'),
    gender: parseGender(gender),
    occupation: parseField(occupation, 'occupation'),
    entries: entries
  };

  return newEntry;
};

type EntryFields = {
  type: unknown,
  description: unknown,
  date: unknown,
  specialist: unknown,
  diagnosisCodes: Array<Diagnosis['code']>,
  employerName?: string,
  sickLeave?: SickLeave,
  discharge?: Discharge,
  healthCheckRating: HealthCheckRating
};

export const toNewEntry = ({ type, description, date, specialist, diagnosisCodes, employerName, sickLeave, discharge, healthCheckRating }: EntryFields): NewEntry => {
  const baseEntry = {
    type: parseEntryType(type),
    description: parseField(description, 'description'),
    date: parseDate(date),
    specialist: parseField(specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes)
  };

  switch (baseEntry.type) {
    case "Hospital":
      return {
        ...baseEntry,
        type: baseEntry.type,
        discharge: parseDischarge(discharge)
      } as NewEntry;
    case "OccupationalHealthcare":
      return {
        ...baseEntry,
        type: baseEntry.type,
        employerName: parseField(employerName, 'employerName'),
        sickLeave: parseSickLeave(sickLeave)
      } as NewEntry;
    case "HealthCheck":
      return {
        ...baseEntry,
        type: baseEntry.type,
        healthCheckRating: parseHealthCheckRating(healthCheckRating)
      } as NewEntry;
    default:
      return baseEntry as NewEntry;
  }
};

const parseEntryType = (type: unknown): string => {
  if (type === "Hospital") {
    return "Hospital";
  } else if (type === "OccupationalHealthcare") {
    return "OccupationalHealthcare";
  } else if (type === "HealthCheck") {
    return "HealthCheck";
  } else {
    throw new Error('Incorrect or missing type');
  }
};

const parseDiagnosisCodes = (codes: unknown): string[] => {
  if (codes === undefined) return [] as string[];

  if (Array.isArray(codes) === false) {
    throw new Error('Incorrect form of diagnosis codes');
  }

  if (!(codes as string[]).every(c => isString(c))) {
    throw new Error('All diagnosis codes must be in string format');
  }
  return codes as string[];
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!(typeof discharge === "object" && discharge !== null)) {
    throw new Error("Incorrect or missing discharge");
  }

  if (!("date" in discharge && "criteria" in discharge)) {
    throw new Error("Discharge object doesn't include the correct fields");
  }

  const dischargeObject = discharge as { date: unknown; criteria: unknown };

  return {
    criteria: parseField(dischargeObject.criteria, 'discharge.criteria'),
    date: parseDate(dischargeObject.date)
  };
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
  if (sickLeave === undefined) return undefined;

  if (!(typeof sickLeave === "object" && sickLeave !== null)) {
    throw new Error("Incorrect or missing sick leave property");
  }

  if (!("startDate" in sickLeave && "endDate" in sickLeave)) {
    throw new Error("SickLeave object doesn't include the required fields");
  }

  const sickLeaveObject = sickLeave as { startDate: unknown; endDate: unknown };

  return {
    startDate: parseDate(sickLeaveObject.startDate),
    endDate: parseDate(sickLeaveObject.endDate),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === undefined || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing healthCareRating');
  }
  return rating;
};
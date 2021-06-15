import React from 'react';
import axios from "axios";

import { apiBaseUrl } from "../constants";

import { useParams } from "react-router-dom";
import { useStateValue, addPatient, addEntryForPatient } from "../state";
import { Patient, Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from '../types';
import AddEntryModal from '../AddEntryModal';
import { Button } from 'semantic-ui-react';
import { HealthCheckEntryValues } from '../AddEntryModal/AddEntryForm';
import { parseError } from '../App';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const setHealthStatusColor = (rating: number) => {
  switch (rating) {
    case 0:
      return (
        <div>
          health rating: <span style={{ color: "green", fontWeight: "bold" }}>{rating}</span>
        </div>
      );
    case 1:
      return (
        <div>
          health rating: <span style={{ color: "blue", fontWeight: "bold" }}>{rating}</span>
        </div>
      );
    case 2:
      return (
        <div>
          health rating: <span style={{ color: "yellow", fontWeight: "bold" }}>{rating}</span>
        </div>
      );
    case 3:
      return (
        <div>
          health rating: <span style={{ color: "gray", fontWeight: "bold" }}>{rating}</span>
        </div>
      );
  }
};

const HospitalEntryComponent: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <div>
      <h3 style={{ marginBottom: "0px" }}>{entry.date}: {entry.type}</h3>
      {entry.description}
      <ul style={{ listStyleType: 'initial' }}>
        {entry.diagnosisCodes?.map(code => {
          const diagnosis = diagnoses.find(d => d.code === code);
          return <li key={code} >{code} {diagnosis?.name}</li>;
        })}
      </ul>
      <strong>discharge:</strong> {entry.discharge.date}, {entry.discharge.criteria}
    </div>
  );
};

const HealthCheckEntryComponent: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <div>
      <h3 style={{ marginBottom: "0px" }}>{entry.date}: {entry.type}</h3>
      {entry.description}
      <ul style={{ listStyleType: 'initial' }}>
        {entry.diagnosisCodes?.map(code => {
          const diagnosis = diagnoses.find(d => d.code === code);
          return <li key={code} >{code} {diagnosis?.name}</li>;
        })}
        {setHealthStatusColor(entry.healthCheckRating)}
      </ul>
    </div>
  );
};

const OccupationalHealthcareEntryComponent: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();

  const sickLeave = entry.sickLeave
    ? `Sick leave admitted from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}`
    : null;

  return (
    <div>
      <h3 style={{ marginBottom: "0px" }}>{entry.date}: {entry.type}</h3>
      {entry.description}
      <ul style={{ listStyleType: 'initial' }}>
        {entry.diagnosisCodes?.map(code => {
          const diagnosis = diagnoses.find(d => d.code === code);
          return <li key={code} >{code} {diagnosis?.name}</li>;
        })}
      </ul>
      {sickLeave}
    </div>
  );
};

const EntryDetails = (entry: Entry) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryComponent entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryComponent entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryComponent entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const IndividualPatientView = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: HealthCheckEntryValues) => {
    try {
      const { data: NewEntry } = await axios.post<HealthCheckEntry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntryForPatient(id, NewEntry));
      closeModal();
    } catch (e) {
      const error = parseError(e.response.data);
      console.error(e.response?.data || 'Unknown Error');
      setError(error || 'Unknown error');
    }
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (!(Object.values(patients).find(p => p.id === id)?.ssn)) {
        const patient = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(addPatient(patient.data));
      }
    };
    void fetchPatient();
  }, []);

  const patient = Object.values(patients).find(p => p.id === id);
  if (!patient) {
    return null;
  }

  const intersectDiagnoses = () => {
    const arr: Array<string> = [];
    patient.entries?.map(e => e.diagnosisCodes?.forEach(c => {
      if (!arr.includes(c)) {
        arr.push(c);
      }
    }));
  };

  intersectDiagnoses();

  const setIcon = () => {
    if (patient.gender === "male") {
      return (
        <i className="mars icon"></i>
      );
    } else if (patient.gender === "female") {
      return (
        <i className="venus icon"></i>
      );
    } else {
      return (
        <i className="genderless icon"></i>
      );
    }
  };

  return (
    <div>
      <h1>{patient.name} {setIcon()}</h1>
      <h4>ssn: {patient.ssn} <br /> occupation: {patient.occupation}</h4>
      <h3>entries</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {patient.entries?.map(e =>
          <li key={e.id}>{EntryDetails(e)} <br /></li>
        )}
      </ul>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default IndividualPatientView;

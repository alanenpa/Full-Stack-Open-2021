/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import { toNewPatientEntry, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getPublicEntries();
  res.send(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  patient ? res.send(patient) : res.send(404);
});

router.post('/:id/entries', (req, res) => {
  const patientId = req.params.id;
  const newEntry = toNewEntry(req.body);
  const addedEntry = patientService.addEntry(patientId, newEntry);
  res.json(addedEntry);
});

router.post('/', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newPatient = toNewPatientEntry(req.body);
  const addedPatient = patientService.addPatient(newPatient);
  res.json(addedPatient);
});

export default router;
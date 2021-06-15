import diagnosesData from '../../data/diagnoses.json';

import { Diagnosis } from '../types';

const getEntries = (): Array<Diagnosis> => {
  return diagnosesData;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
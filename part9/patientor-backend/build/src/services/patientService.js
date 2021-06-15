"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const patientsArray = patients_1.default;
const getAllData = () => {
    return patientsArray;
};
const getPublicEntries = () => {
    return patientsArray.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};
const findById = (id) => {
    const patient = patientsArray.find(p => p.id === id);
    return patient;
};
const addPatient = (patient) => {
    const newPatient = Object.assign({ 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        id: uuid_1.v1() }, patient);
    patientsArray.push(newPatient);
    return newPatient;
};
const addEntry = (patientId, entry) => {
    const patient = patientsArray.find(p => p.id === patientId);
    const newEntry = Object.assign({ id: uuid_1.v1() }, entry);
    patient === null || patient === void 0 ? void 0 : patient.entries.push(newEntry);
    return newEntry;
};
exports.default = {
    getAllData,
    getPublicEntries,
    addPatient,
    addEntry,
    findById
};

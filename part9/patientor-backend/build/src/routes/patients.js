"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    const patients = patientService_1.default.getPublicEntries();
    res.send(patients);
});
router.get('/:id', (req, res) => {
    const patient = patientService_1.default.findById(req.params.id);
    patient ? res.send(patient) : res.send(404);
});
router.post('/:id/entries', (req, res) => {
    const patientId = req.params.id;
    const newEntry = utils_1.toNewEntry(req.body);
    const addedEntry = patientService_1.default.addEntry(patientId, newEntry);
    res.json(addedEntry);
});
router.post('/', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newPatient = utils_1.toNewPatientEntry(req.body);
    const addedPatient = patientService_1.default.addPatient(newPatient);
    res.json(addedPatient);
});
exports.default = router;

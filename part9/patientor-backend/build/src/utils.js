"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatientEntry = void 0;
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseField = (value, fieldName) => {
    if (!value || !isString(value)) {
        throw new Error('Incorrect or missing field: ' + fieldName + ', (' + value + ')');
    }
    return value;
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date ' + date);
    }
    return date;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param) => {
    return Object.values(types_1.Gender).includes(param);
};
const parseGender = (gender) => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender ' + gender);
    }
    return gender;
};
const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation, entries }) => {
    const newEntry = {
        name: parseField(name, 'name'),
        dateOfBirth: parseDate(dateOfBirth),
        ssn: parseField(ssn, 'ssn'),
        gender: parseGender(gender),
        occupation: parseField(occupation, 'occupation'),
        entries: entries
    };
    return newEntry;
};
exports.toNewPatientEntry = toNewPatientEntry;
const toNewEntry = ({ type, description, date, specialist, diagnosisCodes, employerName, sickLeave, discharge, healthCheckRating }) => {
    const baseEntry = {
        type: parseEntryType(type),
        description: parseField(description, 'description'),
        date: parseDate(date),
        specialist: parseField(specialist, 'specialist'),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes)
    };
    switch (baseEntry.type) {
        case "Hospital":
            return Object.assign(Object.assign({}, baseEntry), { type: baseEntry.type, discharge: parseDischarge(discharge) });
        case "OccupationalHealthcare":
            return Object.assign(Object.assign({}, baseEntry), { type: baseEntry.type, employerName: parseField(employerName, 'employerName'), sickLeave: parseSickLeave(sickLeave) });
        case "HealthCheck":
            return Object.assign(Object.assign({}, baseEntry), { type: baseEntry.type, healthCheckRating: parseHealthCheckRating(healthCheckRating) });
        default:
            return baseEntry;
    }
};
exports.toNewEntry = toNewEntry;
const parseEntryType = (type) => {
    if (type === "Hospital") {
        return "Hospital";
    }
    else if (type === "OccupationalHealthcare") {
        return "OccupationalHealthcare";
    }
    else if (type === "HealthCheck") {
        return "HealthCheck";
    }
    else {
        throw new Error('Incorrect or missing type');
    }
};
const parseDiagnosisCodes = (codes) => {
    if (codes === undefined)
        return [];
    if (Array.isArray(codes) === false) {
        throw new Error('Incorrect form of diagnosis codes');
    }
    if (!codes.every(c => isString(c))) {
        throw new Error('All diagnosis codes must be in string format');
    }
    return codes;
};
const parseDischarge = (discharge) => {
    if (!(typeof discharge === "object" && discharge !== null)) {
        throw new Error("Incorrect or missing discharge");
    }
    if (!("date" in discharge && "criteria" in discharge)) {
        throw new Error("Discharge object doesn't include the correct fields");
    }
    const dischargeObject = discharge;
    return {
        criteria: parseField(dischargeObject.criteria, 'discharge.criteria'),
        date: parseDate(dischargeObject.date)
    };
};
const parseSickLeave = (sickLeave) => {
    if (sickLeave === undefined)
        return undefined;
    if (!(typeof sickLeave === "object" && sickLeave !== null)) {
        throw new Error("Incorrect or missing sick leave property");
    }
    if (!("startDate" in sickLeave && "endDate" in sickLeave)) {
        throw new Error("sick leave object doesn't include the required fields");
    }
    const sickLeaveObject = sickLeave;
    return {
        startDate: parseDate(sickLeaveObject.startDate),
        endDate: parseDate(sickLeaveObject.endDate),
    };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param) => {
    return Object.values(types_1.HealthCheckRating).includes(param);
};
const parseHealthCheckRating = (rating) => {
    if (rating === undefined || !isHealthCheckRating(rating)) {
        throw new Error('incorrect or missing healthCareRating');
    }
    return rating;
};

import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue, setPatientList, setDiagnosisList } from "./state";
import { Diagnosis, Patient } from "./types";

import PatientListPage from "./PatientListPage";
import IndividualPatientView from "./components/IndividualPatientView";

export const parseError = (errorResponseData: string) => {
  const element = document.createElement('html');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  element.innerHTML = errorResponseData;
  element.getElementsByTagName('pre');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const message = element.children[1].children[0].childNodes[0].textContent?.substr(7);
  return message;
};

const App = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientListAndDiagnoses = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        const { data: diagnosesListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setPatientList(patientListFromApi));
        dispatch(setDiagnosisList(diagnosesListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientListAndDiagnoses();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/patients/:id">
              <IndividualPatientView />
            </Route>
            <Route path="/">
              <PatientListPage />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;

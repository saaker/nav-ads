import React from 'react';
import ReactDOM from 'react-dom';
import GetRepos from './GetRepos/GetRepos';
//import './App/App';
//import App from './App/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './index.css';

function App() {
  return (
    <Container>
    <div>
      <h1>100 nyeste annonser</h1>
      <GetRepos />
    </div>
    </Container>
  );
}


ReactDOM.render(<App />, document.getElementById('root'));
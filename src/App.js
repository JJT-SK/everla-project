import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import CreateProtocol from './components/CreateProtocol';
import ProtocolCatalogue from './components/ProtocolCatalogue';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/protocols/create" element={<CreateProtocol />} />
          <Route path="/protocols/catalogue" element={<ProtocolCatalogue />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
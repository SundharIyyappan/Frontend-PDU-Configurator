import React from 'react';
import '../styles/components/header.css';
import hyperLogo from '../assets/hyper_logo.png';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo d-flex align-items-center">
        <img src={hyperLogo} alt="Hyper PDU Logo" className="hyper-logo" />
        {/* <span className="ms-2">HYPER</span> */}
      </div>
      <div className="title">
        Hyper PDU Configurator
      </div>
      <div className="subtitle d-none d-md-block">
        UL Schema: PDU-60-16003112206-SQD-400
      </div>
    </header>
  );
};

export default Header;

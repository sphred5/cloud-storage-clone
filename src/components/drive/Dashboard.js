import React from 'react';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';

const Dashboard = () => {
  return (
    <>
      <NavBar />
      <Container fluid>
        Content
      </Container>
    </>
  );
}

export default Dashboard;

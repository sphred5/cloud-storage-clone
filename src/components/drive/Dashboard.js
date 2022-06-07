import React from 'react';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';
import AddFolderButton from './AddFolderButton';

const Dashboard = () => {
  return (
    <>
      <NavBar />
      <Container fluid>
        <AddFolderButton/>
      </Container>
    </>
  );
}

export default Dashboard;

import React from 'react';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';
import { useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';

const Dashboard = () => {

  const { folder } = useFolder();

  return (
    <>
      <NavBar />
      <Container fluid>
        <AddFolderButton currentFolder={folder}/>
      </Container>
    </>
  );
}

export default Dashboard;

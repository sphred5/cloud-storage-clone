import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';
import { useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';
import Folder from '../Folder';


const Dashboard = () => {
  const {folderId} = useParams();
  const { folder, childFolders } = useFolder(folderId);

  return (
    <>
      <NavBar />
      <Container fluid>
        <AddFolderButton currentFolder={folder} />
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: '250px' }}
                className="p-2">
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export default Dashboard;

import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';
import { useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';
import Folder from './Folder';
import File from './File';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import AddFileButton from './AddFileButton';

const Dashboard = () => {
  const { folderId } = useParams();
  let { state } = useLocation();
  if (state === null) {
    state = {}
  };



  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);

  return (
    <>
      <NavBar />
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
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
        {childFolders.length > 0 && childFiles.length > 0 && <hr/>}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: '250px' }}
                className="p-2">
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export default Dashboard;

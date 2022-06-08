import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { Link } from 'react-router-dom';

const FolderBreadcrumbs = ({ currentFolder }) => {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, currentFolder.path];
  return (
    <Breadcrumb 
    className="flex-grow-1 ps-1 m-1"
    >{path.map((folder, index) => (
      <Breadcrumb.Item
      key={folder.id}
      linkAs={Link}
      linkProps={{
        to: folder.id ? `/folder/${folder.id}` : "/", 
       }}
      className="text-truncate d-inline-block"
      style={{ maxWidth: '150px' }}
    >
      {folder.name}
    </Breadcrumb.Item>
   ))}
    </Breadcrumb>

    // <Breadcrumb>
    //  {currentFolder && (
    //     <Breadcrumb.Item
    //       className="text-truncate d-inline-block"
    //       style={{ maxWidth: '200px' }}
    //       active
    //     >
    //       {currentFolder.name}
    //     </Breadcrumb.Item>
    //   )}
    // </Breadcrumb>
  );
}

export default FolderBreadcrumbs;

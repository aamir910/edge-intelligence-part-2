import React, { useState } from 'react';
import Navbar from '../NavBar/NavBar';
import axios from 'axios';
import './FileUploadSection.css'; // Import the CSS file for styling

const FileUploadSection = () => {
  const [entityFiles, setEntityFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [linkFiles, setLinkFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [iconFiles, setIconFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);

  console.log(entityFiles , linkFiles , "linkFiles linkFiles " )
  const handleFileChange = (event, files, setFiles, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedFiles = [...files];
      updatedFiles[index] = { file: file, name: file.name, loaded: true };
      setFiles(updatedFiles);
    }
  };

  const handleSubmit = async (files, endpoint) => {
    for (const fileData of files) {
      if (fileData.loaded && fileData.file) {
        const formData = new FormData();
        formData.append('file', fileData.file);

        try {
          const response = await axios.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          console.log('Server response:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  };

  const renderFileList = (files, setFiles, acceptType) => (
    <div style={{ height: 300, overflowY: 'auto' }}>
      {files.map((file, index) => (
        <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept={acceptType}
            onChange={(event) => handleFileChange(event, files, setFiles, index)}
            style={{ marginLeft: '20px' }}
          />
          {file.loaded && (
            <button onClick={() => console.log(`Edit file ${file.name}`)}>Edit</button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar image="newedgeintelligence.png" color="#f0f0f0" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '80%', padding: '20px', textAlign: 'center', background: "#f2f2f2" }}>
          <h2>File Upload Sections</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            {/* Entity Section */}
            <div style={{ width: '30%', padding: '10px' }}>
              <h3 style={{ background: 'orange' }}>ENTITY</h3>
              {renderFileList(entityFiles, setEntityFiles, ".csv")}
              <button onClick={() => setEntityFiles([...entityFiles, { file: null, name: '', loaded: false }])}>
                Add More File
              </button>
              <button onClick={() => handleSubmit(entityFiles, 'http://localhost/React_php/edge.php')}>
                Submit Entity Files
              </button>
            </div>

            {/* Link Section */}
            <div style={{ width: '30%', padding: '10px' }}>
              <h3 style={{ background: 'yellow' }}>LINK</h3>
              {renderFileList(linkFiles, setLinkFiles, ".csv")}
              <button onClick={() => setLinkFiles([...linkFiles, { file: null, name: '', loaded: false }])}>
                Add More File
              </button>
              <button onClick={() => handleSubmit(linkFiles, 'http://localhost/React_php/edge.php')}>
                Submit Link Files
              </button>
            </div>

            {/* Icon Section */}
            <div style={{ width: '30%', padding: '10px', border: "2px solid black" }}>
              <h3 style={{ background: '#3cb9eb' }}>ICON</h3>
              {renderFileList(iconFiles, setIconFiles, ".png,.jpg,.jpeg")}
              <button onClick={() => setIconFiles([...iconFiles, { file: null, name: 'Enter file', loaded: false }])}>
                Add More File
              </button>
              <button onClick={() => handleSubmit(iconFiles, 'http://localhost/React_php/edge.php')}>
                Submit Icon Files
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadSection;

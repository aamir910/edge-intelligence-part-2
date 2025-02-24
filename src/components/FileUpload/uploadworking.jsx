import React, { useState } from 'react';
import { Upload, Button, Card, Row, Col, Typography, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from "../NavBar/NavBar";
import './FileUploadSection.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Buttons/SIdeBar';
import { Link } from 'react-router-dom';
import DeleteFilesButton from './DeleteFilesButton';
const { Text } = Typography;

const FileUploadSection = () => {
  const [entityFiles, setEntityFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [linkFiles, setLinkFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [iconFiles, setIconFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [uploadPercentage, setUploadPercentage] = useState(0); // Track upload progress
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const uploadDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
  const maxPercentage = 99;
  const navigate = useNavigate();

  const beforeUpload = (file, files, setFiles, index) => {
    const fileName = file.name;
    const updatedFiles = [...files];
    updatedFiles[index] = { file: file, name: fileName, loaded: true };
    setFiles(updatedFiles);

    message.success(`${fileName} uploaded successfully`);
    return false; // Prevent automatic upload
  };

  const handleLoadClick = (files, setFiles, index) => {
    const updatedFiles = [...files];
    updatedFiles[index].loaded = false;
    setFiles(updatedFiles);
  };

  const renderFileList = (files, setFiles, acceptType) => (
    <div style={{ borderRadius: 0, height: 300, overflowY: 'auto' }}>
      {files.map((file, index) => (
        <Row key={index} style={{ marginBottom: '10px' }}>
          <Col span={12}>
            <Text>{file.name}</Text>
          </Col>
          <Col span={8}>
            {!file.loaded ? (
              <Upload
                accept={acceptType}
                beforeUpload={(file) => beforeUpload(file, files, setFiles, index)}
                fileList={[]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            ) : (
              <Button type="primary" onClick={() => handleLoadClick(files, setFiles, index)}>
                Edit
              </Button>
            )}
          </Col>
        </Row>
      ))}
    </div>
  );

  const handleSubmit = async () => {
    setIsUploading(true); // Start uploading
    const formData = new FormData();

    // Append entity files
    entityFiles.forEach((file, index) => {
      if (file.file) {
        formData.append(`entityFiles_${index}`, file.file);
      }
    });

    // Append link files
    linkFiles.forEach((file, index) => {
      if (file.file) {
        formData.append(`linkFiles_${index}`, file.file);
      }
    });

    // Append icon files
    iconFiles.forEach((file, index) => {
      if (file.file) {
        formData.append(`iconFiles_${index}`, file.file);
      }
    });

  // Initialize progress at 1%
  setUploadPercentage(1);
  let progress = 1;

  // Function to increment progress by 1% every 7 seconds, up to 99%
  const incrementProgress = setInterval(() => {
    if (progress < 99) {
      progress += 1;
      setUploadPercentage(progress);
    } else {
      clearInterval(incrementProgress); // Stop incrementing at 99%
    }
  }, 7000);

  try {
    await axios.post('https://213.21.189.116/EDGE_INTELLIGENCE/edge.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        // When upload is done, clear the interval and set progress to 100%
        // if (progressEvent.loaded === progressEvent.total) {
        //   clearInterval(incrementProgress);
        //   setUploadPercentage(100);
        // }
      },
    });
    message.success("Files uploaded successfully!");
  } catch (error) {
    console.error("Error uploading files:", error);
    message.error("Error uploading files");
  } finally {
    setIsUploading(false); // Stop uploading
    setUploadPercentage(0); // Reset progress after completion
    navigate('/visualize');
  }
};
 


  return (
    <>
      <div style={{ height: '100%' }}>
        <Navbar image="newedgeintelligence.png" color="white" />
      
            {isUploading ? (
           <div
           style={{
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             height: '100vh',
             backgroundColor: 'white',
           }}
         >
           <Progress type="circle" percent={uploadPercentage} status="active" />
           <p style={{ marginTop: '20px', fontSize: '16px', color: '#555' }}>
             This may take several minutes.
           </p>
         </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
              <Card
                title="File Upload Sections"
                bordered={true}
                style={{ width: '80%', padding: '10px', textAlign: 'center', background: "#f2f2f2", height: '80%' }}
              >
              
              <Row gutter={[24, 24]} justify="center">
                <Col xs={24} sm={4} md={4}>
                  <button style={{ backgroundColor: '#2a5594', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                    <Link to="/visualize" style={{ color: 'white', textDecoration: 'none' }}>
                      VISUALIZE
                    </Link>
                  </button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card
                    title={<div style={{ color: "white", backgroundColor: '#2a5594', padding: '1px', borderRadius: '4px' }}>ENTITY</div>}
                  >
                    {renderFileList(entityFiles, setEntityFiles, ".csv")}
                    <Button onClick={() => setEntityFiles([...entityFiles, { file: null, name: 'Enter file', loaded: false }])} type="dashed" block>
                      Add More File
                    </Button>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card
                    title={<div style={{ color: "white", backgroundColor: '#2a5594', padding: '1px', borderRadius: '4px' }}>LINK</div>}
                  >
                    {renderFileList(linkFiles, setLinkFiles, ".csv")}
                    <Button onClick={() => setLinkFiles([...linkFiles, { file: null, name: 'Enter file', loaded: false }])} type="dashed" block>
                      Add More File
                    </Button>
                  </Card>
                </Col>
              </Row>
            <div style={{ gap: "50px", display: "flex", justifyContent: "center" }}>
              <DeleteFilesButton />
              <Button type="primary" onClick={handleSubmit} style={{ marginTop: '20px', backgroundColor: '#2a5594' }}>
                Submit
              </Button>
            </div>
          </Card>
        </div>
            )}
      </div>
    </>
  );
};

export default FileUploadSection;

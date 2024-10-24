
import React from 'react';
import { Button, message } from 'antd'; // Import the message component

const DeleteFilesButton = () => {
  const handleSubmit = async () => {
    try {
        const response = await fetch('https://entertainmentbuz.com/EDGE_INTELLIGENCE/delete_directory.php', {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        message.success('Directory deleted successfully!', 2); // Success message with 2 seconds duration
      } else {
        message.success('Directory already deleted : ' + (result.message),
         2); // Error message with dynamic error
      }
    } catch (error) {
      console.error('Error deleting directory:', error);
      message.error('An error occurred while deleting the directory.', 2);
    }
  };

  return (
    <Button type="primary" onClick={handleSubmit} style={{ marginTop: '20px', backgroundColor: 'red' }}>
      Delete All Files
    </Button>
  );
};

export default DeleteFilesButton;

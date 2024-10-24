import React from 'react';
import { Button, message, Modal } from 'antd'; // Import Modal

const { confirm } = Modal;

const DeleteFilesButton = () => {
  const showConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete all files?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: handleSubmit,
      onCancel() {
        console.log('Cancel deletion');
      },
    });
  };

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
        message.warning('Directory already deleted: ' + result.message, 2); // Error message with dynamic error
      }
    } catch (error) {
      console.error('Error deleting directory:', error);
      message.error('An error occurred while deleting the directory.', 2);
    }
  };

  return (
    <Button type="primary" onClick={showConfirm} style={{ marginTop: '20px', backgroundColor: 'red' }}>
      Delete All Files
    </Button>
  );
};

export default DeleteFilesButton;

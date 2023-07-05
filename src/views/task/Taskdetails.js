import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './TaskList.css';
import axios from 'axios';
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { useDropzone } from 'react-dropzone';



const Taskdetails = () => {
  const { taskId } = useParams();
  const [taskDetails, setTaskDetails] = useState();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [command, setCommand] = useState('');
  const [submittedCommands, setSubmittedCommands] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const navigate = useNavigate();
  const [commandError, setCommandError] = useState(false);
  
  const formattedCreatedAt = taskDetails?.createdAt
  ? new Date(taskDetails.createdAt).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  : '';
  const formattedupdatedAt = taskDetails?.updatedAt
  ? new Date(taskDetails.updatedAt).toLocaleString(undefined,{
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  : '';
  const duedate = taskDetails?.duedate
  ? new Date(taskDetails.duedate).toLocaleString(undefined,{
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  : '';
  const handleCommentCancelButtonClick = () => {
    setShowCommentBox(false);
    setCommand('');
    setSelectedFile(null);
    setSelectedImageUrl('');
    setCommandError(false);
  };

  const chan = (e, id) => {
    navigate('/edittask/' + id);
  };

  useEffect(() => {
    axios
      .get(`https://node-mongodb-api-oncp.onrender.com/task/task-list/${taskId}`)
      .then((response) => {
        const res = response.data;
        setTaskDetails(res[0]);
      })
      .catch((error) => {
        console.error('Error fetching task details:', error);
      });
  }, [taskId]);

 useEffect(() => {
  const storedCommands = localStorage.getItem(`submittedCommands_${taskId}`);
  if (storedCommands) {
    setSubmittedCommands(JSON.parse(storedCommands));
  }
}, [taskId]);

useEffect(() => {
  const storeCommandsInAPI = async () => {
    try {
      console.log(taskId)
      await axios.post(`https://node-mongodb-api-oncp.onrender.com/task/task-list/${taskId}`, {
        submittedCommands
      });
      console.log('Commands stored in API successfully!');
    } catch (error) {
      console.error('Error storing commands in API:', error);
    }
  };

  storeCommandsInAPI();
}, [submittedCommands, taskId]);

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
    setCommandError(false); // Hide the error message when the user starts typing
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();

    if (command.trim() === '') {
      setCommandError(true); // Set the command error state to true if command is empty
      return;
    }

    const formData = new FormData();
    formData.append('command', command);
    formData.append('file', selectedFile);
    console.log(command);
    fetch(`https://node-mongodb-api-oncp.onrender.com/task/create-task/${taskId}`,{
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.error('Error submitting command:', error);
      });

    setCommand('');
    setSelectedFile(null);
    setSubmittedCommands([...submittedCommands, command]);
    setCommandError(false);
    setCommand('');
  setSelectedFile(null);
  setSubmittedCommands([...submittedCommands, command]);
  setCommandError(false); 
  setShowCommentBox(false);
  };
  const handleCommentButtonClick = () => {
    setShowCommentBox(true);
  };
  const handleCommandEdit = (index) => {
    setCommand(submittedCommands[index]);
    setEditingIndex(index);
    setShowCommentBox(true);
  };
  const handleCommandSave = (index) => {
    const updatedCommands = [...submittedCommands];
    updatedCommands[index] = command;
    setSubmittedCommands(updatedCommands);
    setEditingIndex(-1);
    setCommand('');
    setShowCommentBox(false);

  };

  const handleCommandDelete = (index) => {
    const updatedCommands = [...submittedCommands];
    updatedCommands.splice(index, 1);
    setSubmittedCommands(updatedCommands);
  };

  const handleFileSelect = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setSelectedImageUrl(URL.createObjectURL(file));
  };

  const uploadImageToServer = () => {
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('taskId', taskId);

    fetch('https://node-mongodb-api-oncp.onrender.com/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        localStorage.setItem(`uploadedImage_${taskId}`, selectedImageUrl);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImageToServer();
    }
  }, [selectedFile, taskId]);

  useEffect(() => {
    const storedImageUrl = localStorage.getItem(`uploadedImage_${taskId}`);
    if (storedImageUrl) {
      setSelectedImageUrl(storedImageUrl);
    }
  }, [taskId]);

  useEffect(() => {
    return () => {
      deleteImageFromServer(taskId);
    };
  }, [taskId]);

  const deleteImageFromServer = (taskId) => {
    fetch(`https://node-mongodb-api-oncp.onrender.com/delete-image/${taskId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        localStorage.removeItem(`uploadedImage_${taskId}`);
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  const onDrop = (acceptedFiles) => {
    handleFileSelect(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const back= () => {
    navigate('/tasklist');
  };

  if (!taskDetails) {
    return (
      <div>
        <Stack sx={{ color: 'grey.500', width: '100%', height: '80vh', justifyContent: 'center', alignItems: 'center' }} spacing={9} direction="row">
          <CircularProgress color="secondary" />
        </Stack>
      </div>
    );
  }

  const handleImageLoad = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };


  return (
    <MainCard className="split-details" title={taskDetails.Project}>
     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        sx={{
          position: 'absolute',
          color: '#5e35b1',
            backgroundColor: '#ede7f6',
        }}
        onClick={(e) => chan(e, taskDetails._id)}
      >
        Edit
      </Button>
      </div>

      <Grid container spacing={2}>
      <Grid item xs={7} className="task-details-grid">
  <h2 className="Heading-taskdetails">Details</h2>
  <div className="task-details-content">
    <p><b>Task Summary<span className='colon-dets'>:</span></b> <span className='colon-det'>{taskDetails.taskname}</span></p>
    <p><b>Type<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.type}</span></p>
    <p><b>Priority<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.priority}</span></p>
    <p><b>Story Points<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.story}</span></p>
    <p><b>Delivery Team<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.deliveryteam}</span></p>
    <p><b>Sprint<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.sprint}</span></p>
    <p><b>Target Release<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.targetrelease}</span></p>
    <p><b>Status<span className='colon-dets'>:</span></b> <span className='colon-det'> {taskDetails.status}</span></p>
    <p><b>Due Date<span className='colon-dets'>:</span></b> <span className='colon-det'> {duedate ? duedate : 'N/A'}</span></p>
    <p><b>Description<span className='colon-dets'>:</span></b> <span className='colon-det'>{taskDetails.description}</span></p>
  </div>
</Grid>
        <Grid item xs={3}>
          <h2 className="Heading-taskdetails">People</h2>
          <p><b>Assignee<span className='colon-'>:</span></b> <span className='colon-det-people'>{taskDetails.assignee}</span></p>
          <p><b>Reporter<span className='colon-'>:</span></b> <span className='colon-det-people'>{taskDetails.reporter}</span></p>
         
        </Grid>
      </Grid>

      <Grid item xs={4}>
  <h2 className="Heading-taskdetails">Dates</h2>
  <p>
    <b>Created<span className='colon-dets'>:</span></b>{' '}
    <span className='colon-det'>
      {formattedCreatedAt ? formattedCreatedAt : 'N/A'}
    </span>
  </p>
  <p>
    <b>Updated <span className='colon-dets'>:</span></b>{' '}
    <span className='colon-det'>{formattedupdatedAt ? formattedupdatedAt : 'N/A'}</span>
  </p>
</Grid>

      <Grid item xs={4}></Grid>
      <h2 className="Heading-taskdetails">Comments</h2>
      <div>
  <div className="command-list">
    {submittedCommands.map((cmd, index) => (
      <div key={index} className="command-item">
        <div className="command-details">
         
        </div>
        <div className="button-container">
        <p className="command-text"> {cmd}</p>
          {editingIndex === index ? (
            <Button
              sx={{ color: '#5e35b1', marginRight: '10px' }}
              onClick={() => handleCommandSave(index)}
            >
              Save
            </Button>
          ) : (
            <Button
              sx={{ color: '#5e35b1', marginRight: '10px' }}
              onClick={() => handleCommandEdit(index)}>
              Edit
            </Button>
          )}
          <Button className="delete-icon" onClick={() => handleCommandDelete(index)}>
            Delete
          </Button>
          </div>
      </div>
    ))}
  </div>
</div>
      <div className="command-box">
      {showCommentBox ? (
        <form onSubmit={handleCommandSubmit}> 
          <textarea
            value={command}
            onChange={handleCommandChange}
            placeholder="Enter a comment"
            onFocus={() => setCommandError(false)}
            rows={5}
            cols={50}
            className="command-textarea"
          />
           {commandError && <p className="error-message">No Comments</p>} {/* Render error message */}
           <div className='submit-cancel'>
           <button 
        style={{
          marginRight:'20px'

        }}
          className="submit-button" type="submit"
          
          >
            Save
          </button> 
           <button
              className="submit-button"
              type="button"
              onClick={handleCommentCancelButtonClick}
            >
              Cancel
            </button>
          
            </div>
          <div 
          className='Attachment'
          {...getRootProps()} >
            {/* className="file-dropzone" */}
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag and drop files here, or click to select files</p>
            )}
          </div>
          {selectedImageUrl && (
            <img
              src={selectedImageUrl}
              alt="Selected File"
              className="selected-image"
              onLoad={() => handleImageLoad(selectedImageUrl)}
            />
          )}
        </form>
        ) : (
          <button className="submit-button-add" onClick={handleCommentButtonClick}>
          Add Comment
        </button>
      )}
       
       <div style={{
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'fixed',
  bottom: 40,
  right: 80,
  zIndex: 9999,
}}>
  <Button
    sx={{
      color: '#5e35b1',
      backgroundColor: '#ede7f6'  
    }}
    onClick={back}
  >
    Back
  </Button>
</div>
      </div>
    
    </MainCard>
    
    
  );
};
export default Taskdetails;
 
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProjectList.css';
import MainCard from 'ui-component/cards/MainCard';
import { Stack, Button } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
const Projectdetails = () => {
  const { taskId } = useParams();
  console.log(taskId);
  const [projectDetails, setProjectDetails] = useState();
  const [command, setCommand] = useState('');
  const [submittedCommands, setSubmittedCommands] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`https://node-mongodb-api-oncp.onrender.com/server/project/${taskId}`)
      .then((response) => {
        const res = response.data.data;
        console.log('This is response', res);

        if (Array.isArray(res)) {
          setProjectDetails(res);
        } else if (typeof res === 'object') {
          setProjectDetails([res]);
        } else {
          console.error('Invalid project details data:', res);
        }
      })
      .catch((error) => {
        console.error('Error fetching project details:', error);
      });
  }, [taskId]);

  console.log('Project Details:', projectDetails);
  useEffect(() => {
    const storedCommands = localStorage.getItem(`submittedCommands_${taskId}`);
    if (storedCommands) {
      setSubmittedCommands(JSON.parse(storedCommands));
    }
  }, [taskId]);

  useEffect(() => {
    localStorage.setItem(`submittedCommands_${taskId}`, JSON.stringify(submittedCommands));
  }, [submittedCommands, taskId]);
  const handleCommandSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('command', command);
    formData.append('file', selectedFile);

    fetch(`https://node-mongodb-api-oncp.onrender.com/server/project/${taskId}`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the response data here
        console.log(responseData);
      })
      .catch((error) => {
        console.error('Error submitting command:', error);
      });

    setCommand('');
    setSelectedFile(null);
    setSubmittedCommands([...submittedCommands, command]);
  };

 

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedImageUrl(URL.createObjectURL(file));
  };

  if (!projectDetails) {
    return (
      <div>
        {' '}
        <Stack
          sx={{ color: 'grey.500', width: '100%', height: '80vh', justifyContent: 'center', alignItems: 'center' }}
          spacing={9}
          direction="row"
        >
          <CircularProgress color="secondary" />
        </Stack>
      </div>
    );
  }
  const EditForm = (id) => {
    navigate('/newproject/' + id);
  };
  const back = () => {
    navigate(`/projectlist`);
  };
  return (
    // <div className="project-details-container">
    <div className="project-details">
      {projectDetails.map((project) => (
        <>
          <MainCard title={project.name}>
            <Button
              onClick={() => EditForm(taskId)}
              sx={{
                position: 'absolute',
                top: '125px',
                right: '50px',
                color: '#5e35b1',
                '&:hover': {
                  backgroundColor: '#ede7f6'
                }
              }}
            >
              Edit
            </Button>

            <div className="projectbox">
              <div className="firstdetail">
                <h2 key={project.projectId}> Project Details</h2>
                <p>
                  <b>
                    Project Id <span className="colon">:</span>
                  </b>
                  <span className="detailsdata">{project.projectId}</span>
                </p>
                <p>
                  <b>
                    Project Lead<span className="colon">:</span>
                  </b>
                  <span className="detailsdata">{project.lead}</span>
                </p>
                <p>
                  <b>
                    scrum Master<span className="colon">:</span>{' '}
                  </b>
                  <span className="detailsdata">{project.scrum}</span>
                </p>
                <p>
                  <b>
                    Project Owner<span className="colon">:</span>
                  </b>
                  <span className="detailsdata">{project.powner}</span>
                </p>
                <p>
                  <b>
                    Description<span className="colon">:</span>
                  </b>{' '}
                  <span className="detailsdata">{project.description}</span>
                </p>
                <p>
                  <b>
                    project Status<span className="colon">:</span>
                  </b>
                  <span className="detailsdata"> {project.status}</span>
                </p>
              </div>
              <div className="team">
                <h2>Team Members</h2>
                In Progress
                {/* <p>
                <b>{project.memb[0]}</b>
              </p>
              <p>
                <b>{project.memb[1]}</b>
              </p>
              <p>
                <b>{project.memb[2]}</b>
              </p> */}
              </div>
            </div>
            <div>
              <h2 className="date">Dates</h2>
              <p>
                <b>
                  Created<span className="colon">:</span>{' '}
                </b>
                <span className="detailsdata">{project.createdAt}</span>
              </p>
              <p>
                <b>
                  updated<span className="colon">:</span>
                </b>
                <span className="detailsdata">{project.updatedAt}</span>
              </p>
            </div>
            <div className="command-box">
              <form onSubmit={handleCommandSubmit}>
                <input type="file" className="file-input" onChange={handleFileSelect} />
                {selectedImageUrl && (
                  <div className="selected-file">
                    <img src={selectedImageUrl} alt="Selected File" className="selected-image" />
                  </div>
                )}
                <Button className="submit" type="submit">
                  Submit
                </Button>

                <div
                  style={{
                    position: 'fixed',
                    bottom: 30,
                    right: 50,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
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
              
              </form>
            </div>
          </MainCard>
        </>
      ))}
    </div>
    // </div>
  );
};

export default Projectdetails;

import React, { useState,useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { Grid, Box, Button, MenuItem, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { FaFileUpload } from 'react-icons/fa';
import './TaskList.css';



const AddTaskForm = () => {
  const theme = useTheme();
  const [Project, setProject] = useState('');
  // const [issueType, setIssueType] = useState('');
  const [taskname, setTaskname] = useState('');
  const [summary, setSummary] = useState('');
  const [reporter, setReporter] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [duedate, setDue] = useState('');
  const [type, setType] = useState('');
  const [story, setStory] = useState('');
  const [deliveryteam, setDeliveryteam] = useState('');
  const [sprint, setSprint] = useState('');
  const [targetrelease, setTargetvalue] = useState('');
  const [projectdet, setProjectdet] = useState([{}]);
  const [pdf, setPdf] = useState(null)
  const [errors, setErrors] = useState('')
  console.log(errors)
  const [isTaskNameExists, setIsTaskNameExists] = useState(false);
  const fileInputRef = useRef(null);
  const handleResumeClick = () => {
    fileInputRef.current.click();
  };
  const handleResumeChange = (e) => {
    console.log(e.target.files)
    setPdf(e.target.files[0]);
  };


  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch("https://node-mongodb-api-oncp.onrender.com/task/task-list/" + id).then((res) => {
      return res.json();
    }).then((resp) => {
      setProject(resp[0].Project);
      setTaskname(resp[0].taskname)
      // setIssueType(resp[0].issueType);
      setSummary(resp[0].summary);
      setReporter(resp[0].reporter);
      setAssignee(resp[0].assignee);
      setPriority(resp[0].priority);
      setDue(resp[0].due)
      setDescription(resp[0].description);
      setType(resp[0].type);
      setStory(resp[0].story);
      setDeliveryteam(resp[0].deliveryteam);
      setSprint(resp[0].sprint);
      setTargetvalue(resp[0].targetrelease);
    }).catch((err) => {
      console.log(err.message)
    })
  }, [id])
  useEffect(() => {
    // Fetch tasks by project and check if the entered taskname exists
    const fetchTasksByProject = async () => {
      try {
        const response = await axios.get(`https://node-mongodb-api-oncp.onrender.com/task/task-list?Project=${Project}`);
        const tasks = response.data;
        const taskExists = tasks.some(task => task.taskname === taskname);
        setIsTaskNameExists(taskExists);
      } catch (error) {
        console.log(error);
      }
    };

    if (Project && taskname) {
      fetchTasksByProject();
    }
  }, [Project, taskname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit")

    if (isTaskNameExists) {
      Swal.fire({
        icon: 'error',
        text: 'Task name already exists for the selected project.'
      });
      return;
    }
    const task = {
      Project,
      taskname,
      reporter,
      assignee,
      priority,
      duedate,
      description,
      summary,
      story,
      deliveryteam,
      type,
      sprint,
      targetrelease,
      pdf
    };
    console.log(task)
    if (id) {
      console.log("Id", id)
      const updatedTask = {
        Project,
        taskname,
        // issueType,
        summary,
        reporter,
        assignee,
        priority,
        description,
        duedate,
        type,
        story,
        deliveryteam,
        sprint,
        targetrelease,
        pdf
      }

      try {
        await axios.put('https://node-mongodb-api-oncp.onrender.com/task/task-list/' + id, updatedTask);
        setProject('');
        setTaskname('')
        // setIssueType('');
        setSummary('');
        setReporter('');
        setAssignee('');
        setPriority('');
        setDescription('');
        setDue('');
        setType('');
        setStory('');
        setDeliveryteam('');
        setSprint('');
        setTargetvalue('');
        setPdf('');
        Swal.fire({
          icon: 'success',
          text: "Task Updated Successfully.",
        }).then(() => {
          navigate('/tasklist');
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "Error Updating Task"
        })
      }
    } else {
      try {
        console.log(task)
        await axios.post('https://node-mongodb-api-oncp.onrender.com/task/create-task/', task);
        setProject('');
        setTaskname('')
        // setIssueType('');
        setSummary('');
        setReporter('');
        setAssignee('');
        setPriority('');
        setDescription('');
        setDue('');
        setType('');
        setStory('');
        setDeliveryteam('');
        setSprint('');
        setTargetvalue('');
      setPdf('');
        Swal.fire({
          icon: 'success',
          text: "Task Created Successfully",
        }).then(() => {
          navigate('/tasklist');
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: "Error Creating Task"
        })
      }
    }
  };

  const handleDeadline = (e) => {
    const selectedDate = e.target.value;
    const currentDate = new Date().toISOString().split('T')[0];
    if (selectedDate < currentDate) {
      setErrors((prev) => ({
        ...prev,
        Deadline: 'Please select a future date.'
      }));
    } else {
      setDue(selectedDate);
      setErrors((prev) => ({
        ...prev,
        Deadline: ''
      }));
    }
  };


  useEffect(() => {
    fetch("https://node-mongodb-api-oncp.onrender.com/server/project").then((res) => {
      return res.json();
    }).then((resp) => {
      setProjectdet(resp.project)
    }).catch((err) => {
      console.log(err.message);
    })
  }, [])

  console.log(projectdet)
  if (!projectdet) {
    return (
      <div>
        <Stack sx={{ color: 'grey.500', width: '100%', height: '80vh', justifyContent: 'center', alignItems: 'center' }} spacing={9} direction="row">
          <CircularProgress color="secondary" />
        </Stack>
      </div>
    );
  }

  return (
    <MainCard title="Task Form">
      <ValidatorForm onSubmit={(e) => { handleSubmit(e) }} >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <SelectValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={Project}
                label="Project"
                onChange={(e) => setProject(e.target.value)}
                validators={['required']}
                errorMessages={['Project is required']}
                variant="outlined"
              >

                {projectdet.map(x => {
                  return (
                    <MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>
                  )
                })
                }


              </SelectValidator>
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={taskname}
                label="Task Summary"
                onChange={(e) => setTaskname(e.target.value)}
                validators={['required']}
                errorMessages={['Task Nane  is required']}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={4}>
              <TextValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={story}
                label="story"
                onChange={(e) => setStory(e.target.value)}
                validators={['required']}
                errorMessages={['Story is required']}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={4}>
              <TextValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={deliveryteam}
                label="Delivery-Team "
                onChange={(e) => setDeliveryteam(e.target.value)}
                validators={['required']}
                errorMessages={['Delivery-team  is required']}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={4}>
              <TextValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={sprint}
                label="Sprint"
                onChange={(e) => setSprint(e.target.value)}
                validators={['required']}
                errorMessages={['Sprint is required']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={targetrelease}
                label="target Release"
                onChange={(e) => setTargetvalue(e.target.value)}
                validators={['required']}
                errorMessages={['Target-value is required']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <SelectValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={type}
                label="Issue Type"
                onChange={(e) => setType(e.target.value)}
                validators={['required']}
                errorMessages={['Issue Type is required']}
                variant="outlined"
              >
                <MenuItem value="Story">Story</MenuItem>
                <MenuItem value="QA Task">QA Task</MenuItem>
                <MenuItem value="Bug">Bug</MenuItem>
                <MenuItem value="Research">Research</MenuItem>
                <MenuItem value="Documentation">Documentation</MenuItem>
              </SelectValidator>
            </Grid>
            <Grid item xs={4}>
              <TextValidator
                sx={{ minWidth: '100%' }}
                id="outlined-start-adornment"
                label="Due Date"
                variant="outlined"
                type="date"
                validators={['required']}
                errorMessages={['Due Date is required']}
                value={duedate}
                error={errors && errors.Deadline}
                helperText={errors && errors.Deadline}
                onChange={(e) => handleDeadline(e)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"></InputAdornment>
                }}

              />
            </Grid>
            <Grid item xs={4}>
              <SelectValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={reporter}
                label="Reporter"
                onChange={(e) => setReporter(e.target.value)}
                validators={['required']}
                errorMessages={['Reporter is required']}
                variant="outlined"
              >
                <MenuItem value="Prem">Prem</MenuItem>
                <MenuItem value="Priya">Priya</MenuItem>
                <MenuItem value="Gayathri">Gayathri</MenuItem>
                <MenuItem value="Harish">Harish</MenuItem>
              </SelectValidator>
            </Grid>
            <Grid item xs={4}>
              <SelectValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={assignee}
                label="Assignee"
                onChange={(e) => setAssignee(e.target.value)}
                validators={['required']}
                errorMessages={['Assignee is required']}
                variant="outlined"
              >
                <MenuItem value="Prem">Prem</MenuItem>
                <MenuItem value="Priya">Priya</MenuItem>
                <MenuItem value="Gayathri">Gayathri</MenuItem>
                <MenuItem value="Harish">Harish</MenuItem>
              </SelectValidator>
            </Grid>
            <Grid item xs={4}>
              <SelectValidator
                sx={{ minWidth: '100%' }}
                id="outlined-basic"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
                validators={['required']}
                errorMessages={['Priority is required']}
                variant="outlined"
              >
                <MenuItem value="Highest">Highest</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Lowest">Lowest</MenuItem>
              </SelectValidator>
            </Grid>
            <Grid item xs={8}>
              <TextValidator
                sx={{ minWidth: '151%' }}
                id="outlined-basic"
                value={summary}
                label="Summary"
                onChange={(e) => setSummary(e.target.value)}
                validators={['required']}
                errorMessages={['Summary is required']}
                multiline
                rows={2}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={8}>
              <TextValidator
                sx={{ minWidth: '151%' }}
                id="outlined-basic"
                value={description}
                label="Description"
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        <div
        className='Attachment'
        style={{ display: 'none', flexDirection: 'column' }}>
          <label htmlFor="resume" style={{ paddingBottom: '8px' }}>
           Attachments 
          </label>
          <div
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
            }}
            onClick={handleResumeClick}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleResumeClick();
              }
            }}
          >
            <FaFileUpload size={24} color="red" style={{ marginRight: '8px' }} />
            {pdf ? <p style={{ margin: '0' }}>{pdf.name}</p> : <p style={{ margin: '0' }}>No file selected</p>}
          </div>
          <input
            id="pdf"
            name="resume"
            type="file"
            onChange={handleResumeChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
        </div>
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  boxShadow: 'none',
                  minWidth: '100%',
                  borderRadius: 2,
                  padding: 1.5,
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light,
                  '&:hover': {
                    background: theme.palette.secondary.dark,
                    color: theme.palette.secondary.light
                  }
                }}
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ValidatorForm>
    </MainCard>
  );
};

export default AddTaskForm;
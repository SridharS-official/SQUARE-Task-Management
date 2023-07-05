import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {
  Grid,
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Autocomplete,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { userSchema } from './Validation';

const AddProject = () => {
  const theme = useTheme();
  const [name, setname] = useState('');
  const [lead, setlead] = useState('');
  const [memb, setmemb] = useState([]);
  console.log('memb', memb);
  const [powner, setpowner] = useState('');
  const [status, setstatus] = useState('');
  const [scrum, setscrum] = useState('');
  const [description, setdescription] = useState('');
  const [error, seterror] = useState({});
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [data, setdata] = useState([]);

  const Submit = async (e) => {
    console.log(id + 'sdsd');
    e.preventDefault();
    const empdata = { name, lead, scrum, status, description, powner, memb };
    console.log(empdata);
    try {
      await userSchema.validate({ name, powner, lead, scrum, status }, { abortEarly: false });
      const userExist = await CheckProjectExist(name);
      if (userExist) {
        seterror((prev) => ({ ...prev, name: 'Project Name Already Exist' }));
      } else {
        await axios.post('https://node-mongodb-api-oncp.onrender.com/server/project', empdata);
        Swal.fire('Created!', 'Project Created Sucessfully.', 'success');
        navigate('/projectlist');
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationerr = {};
        error.inner.forEach((err) => {
          validationerr[err.path] = err.message;
        });
        seterror(validationerr);
        console.log(validationerr);
      } else {
        console.log(error);
      }
    }
  };

  const Update = (e) => {
    e.preventDefault();
    const empdata = { name, lead, scrum, status, description, powner, memb };
    fetch('https://node-mongodb-api-oncp.onrender.com/server/project/' + id, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(empdata)
    })
      .then(() => {
        Swal.fire('Updated!', 'Project Updated Successfully.', 'success');
        navigate('/projectlist');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://node-mongodb-api-oncp.onrender.com/server/employee');
        const data = await response.json();
        console.log('this is the rep', data);
        setdata(data.employee);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetch(`https://node-mongodb-api-oncp.onrender.com/server/project/` + id)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log(resp.data);
        setname(resp.data.name);
        setlead(resp.data.lead);
        setmemb(resp.data.memb);
        setpowner(resp.data.powner);
        setstatus(resp.data.status);
        setscrum(resp.data.scrum);
        setdescription(resp.data.description);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const CheckProjectExist = async (name) => {
    try {
      const response = await axios.get(`https://node-mongodb-api-oncp.onrender.com/server/project`);
      const resData = response.data.project;
      const userExist = resData.some((x) => x.name === name);
      return userExist;
    } catch (error) {
      console.log(error);
    }
  };
  const handleName = (e) => {
    setname(e.target.value);
    seterror((prev) => ({
      ...prev,
      name: ''
    }));
  };
  const handleProjectowner = (e) => {
    setpowner(e.target.value);
    seterror((prev) => ({
      ...prev,
      powner: ''
    }));
  };
  const handleTeamlead = (e) => {
    setlead(e.target.value);
    seterror((prev) => ({
      ...prev,
      lead: ''
    }));
  };
  const handleScrum = (e) => {
    setscrum(e.target.value);
    seterror((prev) => ({
      ...prev,
      scrum: ''
    }));
  };
  const handlestatus = (e) => {
    setstatus(e.target.value);
    seterror((prev) => ({
      ...prev,
      status: ''
    }));
  };
  return (
    <MainCard title="Add New Project">
      <form>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                sx={{ minWidth: '100%' }}
                value={name}
                error={error && error.name}
                helperText={error && error.name}
                onChange={((e) => setname(e.target.value), handleName)}
                id="outlined-basic"
                label="Project Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl sx={{ minWidth: '100%' }} error={error && error.powner}>
                <InputLabel>Project Owner</InputLabel>
                <Select
                  value={powner}
                  onChange={((e) => setpowner(e.target.value), handleProjectowner)}
                  input={<OutlinedInput label="Project Owner" />}
                >
                  {data.map((x) => {
                    return (
                      <MenuItem key={x.name} value={x.name}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>

                <FormHelperText>{error && error.powner}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl sx={{ minWidth: '100%' }} error={error && error.lead}>
                <InputLabel>Team Lead</InputLabel>
                <Select
                  value={lead}
                  onChange={((e) => setlead(e.target.value), handleTeamlead)}
                  input={<OutlinedInput label="Team Lead" />}
                >
                  {data.map((x) => {
                    return (
                      <MenuItem key={x.name} value={x.name}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{error && error.lead}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl sx={{ minWidth: '100%' }} error={error && error.scrum}>
                <InputLabel>Scrum Master</InputLabel>
                <Select
                  value={scrum}
                  onChange={((e) => setscrum(e.target.value), handleScrum)}
                  input={<OutlinedInput label="Scrum Master" />}
                >
                  {data.map((x) => {
                    return (
                      <MenuItem key={x.name} value={x.name}>
                        {x.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{error && error.scrum}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl sx={{ minWidth: '100%' }} error={error && error.status}>
                <InputLabel>Project Status</InputLabel>
                <Select
                  value={status}
                  onChange={((e) => setstatus(e.target.value), handlestatus)}
                  input={<OutlinedInput label="Project Status" />}
                >
                  <MenuItem value={'In-progress'}>In-Progress</MenuItem>
                  <MenuItem value={'Not-Started'}>Not Started</MenuItem>
                  <MenuItem value={'Completed'}>Completed</MenuItem>
                </Select>
                <FormHelperText>{error && error.status}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <FormControl sx={{ minWidth: '100%' }}>
                <Autocomplete
                  multiple
                  options={data}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.name} - {option.role}
                    </Box>
                  )}
                  disableCloseOnSelect
                  onChange={(event, newmemb) => {
                    setmemb(newmemb);
                    console.log(newmemb);
                  }}
                  onInputChange={(event, newmemb) => {
                    setmemb(newmemb);
                    console.log(newmemb);
                  }}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="Team Members" placeholder="Team Members" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rows={6}
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                fullWidth
                id="summaryinput"
                label="Project Description"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              {id != null ? (
                <Button
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
                  onClick={(e) => Update(e)}
                >
                  Update
                </Button>
              ) : (
                <Button
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
                  onClick={(e) => Submit(e)}
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
    </MainCard>
  );
};

export default AddProject;

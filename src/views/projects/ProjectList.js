import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search';
// import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import RecyclingIcon from '@mui/icons-material/Recycling';
import Pagination from '@mui/material/Pagination';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './ProjectList.css'; // Import the CSS file for styling
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
const filterOptions = [
  { value: '', label: 'All' },
  { value: 'Not-Started', label: 'Not Started' },
  { value: 'In-Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' }
];

const ProjectList = () => {
  const [project, setProject] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [tasksPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [filterOption, setFilterOption] = useState('');
  // const [edata, setedata] = useState([]);
  const navigate = useNavigate();
  // const theme = useTheme();
  // const theme = useTheme();
  const [showTaskBar, setShowTaskBar] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [loader, setLoader] = useState(false)
  const Add = () => {
    navigate('/newproject');
  };
  const fetchProject = async () => {
    setLoader(true);
    try {
      const response = await axios.get('https://node-mongodb-api-oncp.onrender.com/server/project');
      console.log('this is fetching data', response.data.project);
      const updatedTasks = response.data.project.map((task) => ({
        ...task,
        selected: false
      }));
      setProject(updatedTasks);
    } catch (error) {
      console.log('Error retrieving task data:', error);
     
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleCheckboxChange = (event, proId) => {
    const updatedTasks = project.map((task) => {
      if (task.projectId === proId) {
        return {
          ...task,
          selected: event.target.checked
        };
      }
      return task;
    });
    setProject(updatedTasks);

    const allSelected = updatedTasks.every((task) => task.selected);
    setSelectAll(allSelected);

    const anySelected = updatedTasks.some((task) => task.selected);
    setShowTaskBar(anySelected); // Show the task bar if any task is selected

    const selectedTaskCount = updatedTasks.filter((task) => task.selected).length;
    setSelectedCount(selectedTaskCount);
  };

  const handleSelectAll = () => {
    const updatedTasks = project.map((task) => ({
      ...task,
      selected: !selectAll
    }));
    setProject(updatedTasks);
    setSelectAll(!selectAll);
    const anySelected = updatedTasks.some((task) => task.selected);
    setShowTaskBar(anySelected); // Show the task bar if any task is selected

    const selectedTaskCount = updatedTasks.filter((task) => task.selected).length;
    setSelectedCount(selectedTaskCount); // Show the task bar if any task is selected

    if (!selectAll) {
      ShowTaskBar();
    } else {
      hideTaskBar();
    }
  };

  const ShowTaskBar = () => {
    const taskBar = document.querySelector('.task-bar');

    if (taskBar) {
      taskBar.classList.add('show');
    }
  };

  const handleDelete = async () => {
    const selectedProjects = project.filter((pro) => pro.selected);
    if (selectedProjects.length === 0) {
      return;
    }

    try {
      const projectIds = selectedProjects.map((pro) => pro._id);
      await axios.delete(`https://node-mongodb-api-oncp.onrender.com/server/project/${projectIds.join(',')}`);
      fetchProject();
      setSelectAll(false);
      setShowTaskBar(false);

      Swal.fire('Deleted!', 'The data has been deleted.', 'success');
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClick = () => {
    const selectedProjects = project.filter((pro) => pro.selected);
    if (selectedProjects.length === 0) {
      return;
    }

    Swal.fire({
      title: 'CONFIRMATION',
      text: 'Are you sure you want to delete the selected data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };
  // const sortData = (data, column) => {
  //   return [...data].sort((a, b) => {
  //     if (column === 'name') {
  //       return a.name.localeCompare(b.name);
  //     } else if (column === 'powner') {
  //       return a.powner.localeCompare(b.powner);
  //     } else if (column === 'scrum') {
  //       return a.scrum.localeCompare(b.scrum);
  //     } else if (column === 'sno') {
  //       return a.sno.localeCompare(b.sno);
  //     }
  //   });
  // };

  const hideTaskBar = () => {
    const taskBar = document.querySelector('.task-bar');
    if (taskBar) {
      taskBar.classList.remove('show');
    }
  };

  const handleRecycleBinClick = () => {
    navigate('/RecycleBin');
  };
  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };
  const handleSortOption = (option) => {
    if (option === sortOption) {
      setSortOption(null);
      setSortDirection(null);
    } else {
      setSortOption(option);
      setSortDirection('asc');
    }
  };
  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
    setCurrentPage(1);
  };

  const filteredTasks = project.filter((task) => {
    const lowerSearchText = searchText.toLowerCase();
    const lowerFilterOption = filterOption.toLowerCase();
    return (
      Object.values(task).some((value) => value && value.toString().toLowerCase().includes(lowerSearchText)) &&
      (lowerFilterOption === '' || lowerFilterOption === task.status.toLowerCase())
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'project id') {
      return a.projectId.localeCompare(b.projectId) * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'project Name') {
      return a.name.localeCompare(b.name) * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'Project Owner') {
      return a.powner.localeCompare(b.powner) * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'Scrum master') {
      return a.scrum.localeCompare(b.scrum) * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'Project Status') {
      return a.status.localeCompare(b.status) * (sortDirection === 'asc' ? 1 : -1);
    }
    return 0;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const tasksForCurrentPage = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const getSortIcon = (option) => {
    if (option === sortOption) {
      if (sortDirection === 'asc') {
        return <ArrowUpwardIcon className="sort-icon sort-icon-up" />;
      } else if (sortDirection === 'desc') {
        return <ArrowDownwardIcon className="sort-icon sort-icon-down" />;
      }
    } else if (
      option === 'project id' ||
      option === 'project Name' ||
      option === 'Project Owner' ||
      option === 'Scrum master' ||
      option === 'Project Status'
    ) {
      return <ArrowDownwardIcon className="sort-icon" />;
    }
    return null;
  };

  const idclick = (proId) => {
    // const selectedTask = project.find((task) => task.id === proId);
    console.log(proId);
    const selectedTask = project.find((task) => task.projectId === proId);
    navigate(`/projectdetails/${proId}`, { state: { task: selectedTask } });
  };

  const handleProjectClick = (proId) => {
    const selectedTask = project.find((task) => task.projectId === proId);
    navigate(`/projectdetails/${proId}`, { state: { task: selectedTask } });
  };
  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
        <TextField
            sx={{
              width: "420px",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#5e35b1',
                },
                '&:hover fieldset': {
                  borderColor: '#5e35b1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#5e35b1',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#5e35b1',
              },
              '& .MuiInputLabel-root': {
                color: '#5e35b1',
              },
              '& .MuiIconButton-root': {
                color: '#5e35b1',
              },
            }}
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={Add}
            sx={{
              mt: '6px',
              mr: '20px',
              backgroundColor: '#ede7f6',
              color: '#5e35b1',
              '&:hover': {
                backgroundColor: '#ede7f6'
              }
            }}
          >
            Add
          </Button>

          <Button
            variant="contained"
            startIcon={<RecyclingIcon />}
            onClick={handleRecycleBinClick}
            sx={{
              mt: '6px',
              mr: '20px',
              backgroundColor: '#ede7f6',
              color: '#5e35b1',
              '&:hover': {
                backgroundColor: '#ede7f6'
              }
            }}
          >
            Recycle Bin
          </Button>

          <FormControl variant="outlined" className="filter-icon">
            <InputLabel id="filter-label">
              <FilterAltIcon
                sx={{
                  color: '#5e35b1',
                  '&:hover': {
                    backgroundColor: '#ede7f6'
                  }
                }}
              />
            </InputLabel>
            <Select
              sx={{ pl: '12px' }}
              labelId="filter-label"
              id="filter-select"
              value={filterOption}
              onChange={handleFilterChange}
              label="Filter"
            >
              {filterOptions.map((option) => (
                <MenuItem
                  sx={{
                    color: '#5e35b1',
                    '&:hover': {
                      backgroundColor: '#ede7f6'
                    }
                  }}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {loader ? <Stack sx={{ width: '100%', height: 'calc(100vh - 300px)', justifyContent: 'center', alignItems: 'center' }} spacing={9} direction="row">
        <CircularProgress color="secondary" />
      </Stack> :
      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  sx={{
                    color: '#5e35b1',
                    '&.Mui-checked': {
                      color: '#5e35b1'
                    }
                  }}
                  checked={selectAll}
                  onChange={handleSelectAll}
                  inputProps={{ 'aria-label': 'Select all project' }}
                />
              </TableCell>
              <TableCell onClick={() => handleSortOption('project id')}>Project ID {getSortIcon('project id')}</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Owner </TableCell>
              <TableCell>Scrum Master </TableCell>
              <TableCell onClick={() => handleSortOption('Project Status')}>Project Status{getSortIcon('Project Status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksForCurrentPage.map((task) => (
              <TableRow key={task._id}>
                <TableCell>
                  <Checkbox
                    sx={{
                      color: '#5e35b1',
                      '&.Mui-checked': {
                        color: '#5e35b1'
                      }
                    }}
                    checked={task.selected}
                    onChange={(event) => handleCheckboxChange(event, task.projectId)}
                    inputProps={{ 'aria-label': 'Select task' }}
                  />
                </TableCell>
                <TableCell className="clickproid" onClick={() => idclick(task._id)}>
                  {task.projectId}{' '}
                </TableCell>
                <TableCell className="clickproid" onClick={() => handleProjectClick(task._id)}>
                  {task.name}{' '}
                </TableCell>
                <TableCell>{task.powner}</TableCell>
                <TableCell>{task.scrum}</TableCell>

                <TableCell>
                  <div className={`task-bar ${showTaskBar ? 'show' : ''}`}>
                    <Typography className="selected-count">{selectedCount} selected</Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        className="task-bar-icon"
                        style={{ color: '#5e35b1', backgroundColor: '#ede7f6', marginTop: '6px' }}
                        onClick={handleDeleteClick}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </div>
                  <span>{task.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
   }
   {!loader &&
     <Pagination
       count={totalPages}
       page={currentPage}
       onChange={(event, page) => handlePageChange(page)}
       sx={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}
     />}
    
    </div>
  );
};

export default ProjectList;

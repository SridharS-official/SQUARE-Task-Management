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
  Typography,
 
} from '@mui/material';
import Swal from 'sweetalert2';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RecyclingIcon from '@mui/icons-material/Recycling';
import Pagination from '@mui/material/Pagination';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './TaskList.css'; // Import the CSS file for styling
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';



const priorityOrder = {
  highest: 1,
  high: 2,
  medium: 3,
  low: 4,
  lowest: 5,
};


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [tasksPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [filterOption, setFilterOption] = useState('');
  const navigate = useNavigate();
  const [showTaskBar, setShowTaskBar] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [filterproject, setFilterproject] = useState([]);
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    fetch("https://node-mongodb-api-oncp.onrender.com/server/project")
      .then((res) => res.json())
      .then((resp) => {
        setFilterproject(resp.project);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const Add = () => {
    navigate('/addtask');
  };
  const Listview = () => {
    navigate('/tasklist');
  };
  const Boardview = () => {
    navigate('/kanban');
  };

  const fetchTask = async () => {
    setLoader(true)
    await axios
      .get('https://node-mongodb-api-oncp.onrender.com/task/task-list')
      .then((res) => {
        const updatedTasks = res.data.map((task) => ({
          ...task,
          selected: false,
        }));
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.log('Error retrieving task data: ', error);
      });
    setLoader(false)

  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleCheckboxChange = (event, taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        return {
          ...task,
          selected: event.target.checked,
        };
      }
      return task;
    });


    setTasks(updatedTasks);
    const allSelected = updatedTasks.every((task) => task.selected);
    setSelectAll(allSelected);
    const anySelected = updatedTasks.some((task) => task.selected);
    setShowTaskBar(anySelected); // Show the task bar if any task is selected

    const selectedTaskCount = updatedTasks.filter((task) => task.selected).length;
    setSelectedCount(selectedTaskCount);
  };


  const handleSelectAll = () => {
    const updatedTasks = tasks.map((task) => ({
      ...task,
      selected: !selectAll,
    }));
    setTasks(updatedTasks);
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
    const selectedTasks = tasks.filter((task) => task.selected);
    if (selectedTasks.length === 0) {
      // No tasks selected
      return;
    }

    try {
      const taskIds = selectedTasks.map((task) => task._id);
      await axios.delete(`https://node-mongodb-api-oncp.onrender.com/task/task-list/${taskIds.join(',')}`);
      fetchTask();

      // Reset selectAll and showTaskBar
      setSelectAll(false);
      setShowTaskBar(false);

      Swal.fire('Deleted!', 'The data has been deleted.', 'success');
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteClick = () => {
    const selectedTasks = tasks.filter((task) => task.selected);
    if (selectedTasks.length === 0) {
      // No tasks selected
      return;
    }

    Swal.fire({
      title: 'CONFIRMATION',
      text: 'Are you sure you want to delete the selected data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  const hideTaskBar = () => {
    const taskBar = document.querySelector('.task-bar');
    if (taskBar) {
      taskBar.classList.remove('show');
    }
  };

  const handleRecycleBinClick = () => {
    navigate('/recyclebin');
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };
  const handleSortOption = (option) => {
    if (option === sortOption) {
      setSortOption(null);
      setSortDirection(null);
    } else if (option === 'taskId' || option === 'status') {
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilterOption(selectedFilter);
    setCurrentPage(1);

    if (selectedFilter === '') {
      // No filter selected, fetch all tasks
      fetchTask();
    } else {
      // Fetch tasks filtered by project
      axios
        .get(`https://node-mongodb-api-oncp.onrender.com/task/task-list?project=${selectedFilter}`)
        .then((res) => {
          const updatedTasks = res.data.map((task) => ({
            ...task,
            selected: false,
          }));
          setTasks(updatedTasks);
        })
        .catch((error) => {
          console.log('Error retrieving filtered task data: ', error);
        });
    }
  };
  useEffect(() => {
    if (filterOption === '') {
      fetchTask();
    }
  }, [filterOption]);

  const filteredTasks = tasks.filter((task) => {
    const lowerSearchText = searchText ? searchText.toLowerCase() : '';
    const lowerFilterOption = filterOption ? filterOption.toLowerCase() : '';

    return (
      Object.values(task).some(
        (value) => value && value.toString().toLowerCase().includes(lowerSearchText)
      ) &&
      (lowerFilterOption === '' || (task.Project && task.Project.toLowerCase() === lowerFilterOption))
    );
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'taskId') {
      return (a.taskId ?? '').localeCompare(b.taskId ?? '') * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'status') {
      const statusA = (a.status ?? '').toLowerCase();
      const statusB = (b.status ?? '').toLowerCase();
      return statusA.localeCompare(statusB) * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'assignee') {
      return (a.assignee ?? '').localeCompare(b.assignee ?? '') * (sortDirection === 'asc' ? 1 : -1);
    } else if (sortOption === 'priority') {
      const priorityA = priorityOrder[(a.taskId ?? '').toLowerCase()];
      const priorityB = priorityOrder[(b.taskId ?? '').toLowerCase()];
      return (priorityA - priorityB) * (sortDirection === 'asc' ? 1 : -1);
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

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'highest':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      case 'lowest':
        return 'blue';
      default:
        return 'black';
    }
  };
  const getSortIcon = (option) => {
    if (option === sortOption) {
      if (sortDirection === 'asc') {
        return <ArrowUpwardIcon className="sort-icon sort-icon-up" />;
      } else if (sortDirection === 'desc') {
        return <ArrowDownwardIcon className="sort-icon sort-icon-down" />;
      }
    } else if (option === 'taskId' || option === 'status') {
      return <ArrowDownwardIcon className="sort-icon" />;
    }
    return null;
  };
  const handleSummaryClick = (taskId) => {
    // const selectedTask = tasks.find((task) => task.id === taskId);
    console.log(taskId)
    navigate('/Taskdetails/' + taskId);
  };

  const handleProjectClick = (taskId) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    navigate(`/Taskdetails/${taskId}`, { state: { task: selectedTask } });
  };

  if (!tasks) {
    return (
      <div>
        <Stack sx={{ color: 'grey.500', width: '100%', height: '80vh', justifyContent: 'center', alignItems: 'center' }} spacing={9} direction="row">
          <CircularProgress color="secondary" />
        </Stack>
      </div>
    );
  }


  return (
    <div>
      <Tabs
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Tab
          onClick={Listview}
          label={<span style={{ borderBottom: '2px solid #5e35b1' }}>List View</span>}
          value="list"
        />
        <Tab onClick={Boardview} label="Board View" value="board" />
      </Tabs>
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
                backgroundColor: '#ede7f6',
              },
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
                backgroundColor: '#ede7f6',
              },
            }}
          >
            Recycle Bin
          </Button>
          <FormControl
            sx={{
              width: "140px",
              height: "5px",
            }}
            variant="outlined"
          >
            <InputLabel
              id="filter-label"
              sx={{
                color: '#5e35b1', // Text color
                '&:hover': {
                  backgroundColor: '#ede7f6', // Background color on hover
                },
              }}
            >
              All Projects
            </InputLabel>
            <Select

              sx={{
                color: '#5e35b1', // Text color

                backgroundColor: '#ede7f6', // Background color on hover,
              }}
              labelId="filter-label"
              id="filter-select"
              value={filterOption}
              onChange={handleFilterChange}
              label="Filter"
            >
              <MenuItem
                sx={{
                  color: '#5e35b1',
                  '&:hover': {
                    backgroundColor: '#ede7f6',
                  },
                }}
                value=""
              >
                All
              </MenuItem>
              {filterproject.map((option) => (
                <MenuItem
                  sx={{
                    color: '#5e35b1', // Text color
                    '&:hover': {
                      backgroundColor: '#ede7f6', // Background color on hover
                    },
                  }}
                  key={option._id}
                  value={option.name}
                >
                  {option.name}
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

                <TableCell className="tablecell-hover">
                  <Checkbox
                  sx={{ color:'#5e35b1','&.Mui-checked': {
                    color:'#5e35b1',
                  },}}
                    checked={selectAll}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'Select all tasks' }}
                    className="checkbox-color"
                  />
                </TableCell>

                <TableCell className="tablecell-hover"
                  onClick={() => handleSortOption('taskId')}
                >
                  Task Id {getSortIcon('taskId')}
                </TableCell>

                <TableCell className="tablecell-hover"

                >
                  Task Summary
                </TableCell>

                <TableCell className="tablecell-hover"


                >
                  Assignee
                </TableCell>
                <TableCell className="tablecell-hover"

                >
                  Priority
                </TableCell>
                <TableCell className="tablecell-hover"
                  // onClick={() => handleSortOption('status')}
                >
                  Status
                  {/* {getSortIcon('status')} */}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              
              {
                !tasksForCurrentPage.length?
                <Typography sx={{display:'flex',alignItems:'center',justifyContent:'center',ml:'500px',mt:'30px',mb:'20px'}}><b>No data found</b></Typography>
                :
                tasksForCurrentPage.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className='tablecell-hover'>
                      <Checkbox
                      sx={{ color:'#5e35b1','&.Mui-checked': {
                        color:'#5e35b1',
                      },}}
                        checked={task.selected}
                        onChange={(event) => handleCheckboxChange(event, task._id)}
                        inputProps={{ 'aria-label': 'Select task' }}
                        className="checkbox-color" // Add the checkbox-color class
                      />
                    </TableCell>
                    <TableCell className="tablecell-hover"

                      onClick={() => handleSummaryClick(task._id)}><b>{task.taskId}</b></TableCell>
                    <TableCell className="tablecell-hover"

                      onClick={() => handleProjectClick(task._id)} ><b>{task.taskname}</b></TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <div className='down'> 
                    <TableCell className='tablecell-hover'>
                      <div className={`task-bar ${showTaskBar ? 'show' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography className="selected-count" style={{ marginLeft: '8px' }}>
                          <span><b>{selectedCount}</b></span> <b>selected</b>
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Button variant="contained" className="task-bar-icon" style={{ color: '#5e35b1', backgroundColor: '#ede7f6', marginTop: '6px' }} onClick={handleDeleteClick} >
                            Delete
                          </Button>
                        </Stack>
                      </div>
                      <AssistantPhotoIcon style={{ color: getPriorityColor(task.priority), marginLeft: '8px' }} />
                    </TableCell></div>
                    <TableCell>
                      <span style={{ border: '2px solid #5e35b1', backgroundColor: '#ede7f6', borderRadius: '2px', padding: '6px 12px' }}>
                        <b>{task.status}</b>
                      </span>
                    </TableCell>
                  </TableRow>

                ))
              }
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

export default TaskList;


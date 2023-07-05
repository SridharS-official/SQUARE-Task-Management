import React, { useState, useEffect } from 'react';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Grid, Typography, Card, Avatar, Paper, CircularProgress, Tab, Tooltip,Button,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import './Kanban.css';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RecyclingIcon from '@mui/icons-material/Recycling';

const Kanban = () => {
  const ItemTypes = {
    TASK: 'task'
  };
  const [filterOption, setFilterOption] = useState('');
  const [filterproject, setFilterproject] = useState([]);
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
  const navigate = useNavigate();

  const Listview = () => {
    navigate('/tasklist');
  };
  const Boardview = () => {
    navigate('/kanban');
  };
  const handleSummaryClick = (taskId) => {
    // const selectedTask = tasks.find((task) => task.id === taskId);
    console.log(taskId);
    navigate('/Taskdetails/' + taskId);
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilterOption(selectedFilter);

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

  const [isLoading, setIsLoading] = useState(false); // Loading state for update process

  const moveTask = async (taskId, newStatus) => {
    setIsLoading(true); // Set loading state to true before the update

    try {
      await axios.put(`https://node-mongodb-api-oncp.onrender.com/task/task-list/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false); // Set loading state to false after the update
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('https://node-mongodb-api-oncp.onrender.com/task/task-list');
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const Task = ({ task }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.TASK,
      item: { id: task._id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }));
    const [isHovered, setIsHovered] = useState(false);
    const flag = () => {
      const priority = task.priority ? task.priority.toLowerCase() : '';

      const handleMouseEnter = () => {
        setIsHovered(true);
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
      };
      console.log(isHovered);
      return (
        <div className="flag">
          {priority === 'highest' && (
            <>
              <Tooltip title={task.priority} placement="bottom">
                <AssistantPhotoIcon
                  fontSize="small"
                  className="highestPriority"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </Tooltip>
            </>
          )}
          {priority === 'high' && (
            <>
              <Tooltip title={task.priority} placement="bottom">
                <AssistantPhotoIcon
                  fontSize="small"
                  className="highPriority"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </Tooltip>
            </>
          )}
          {priority === 'medium' && (
            <>
              <Tooltip title={task.priority} placement="bottom">
                <AssistantPhotoIcon
                  fontSize="small"
                  className="mediumPriority"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </Tooltip>
            </>
          )}
          {priority === 'low' && (
            <>
              <Tooltip title={task.priority} placement="bottom">
                <AssistantPhotoIcon
                  fontSize="small"
                  className="lowPriority"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </Tooltip>
            </>
          )}
          {priority === 'lowest' && (
            <>
              <Tooltip title={task.priority} placement="bottom">
                <AssistantPhotoIcon
                  fontSize="small"
                  className="lowestPriority"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </Tooltip>
            </>
          )}
        </div>
      );
    };
    const [TypeHovered, setTypeHovered] = useState(false);

    const handleTypeEnter = () => {
      setTypeHovered(true);
    };
    const handleTypeLeave = () => {
      setTypeHovered(false);
    };
    console.log(TypeHovered);
    const detais = () => {
      const type = task.type ? task.type.toLowerCase() : '';
      return (
        <div onMouseEnter={handleTypeEnter} onMouseLeave={handleTypeLeave}>
          {type === 'bug' && (
            <>
              {' '}
              <Tooltip title={task.type} placement="bottom">
                <div className="box bugtype">
                  <div className="round"></div>
                </div>
              </Tooltip>
            </>
          )}

          {type === 'story' && (
            <>
              <Tooltip className='popup' title={task.type} placement="bottom">
                <div className="box storytype">
                  <div className="round"></div>
                </div>
              </Tooltip>
            </>
          )}

          {type === 'qa task' && (
            <>
              <Tooltip title={task.type} placement="bottom">
                <div className="box qa_type">
                  <div className="round"></div>
                </div>
              </Tooltip>
            </>
          )}

          {type === 'research' && (
            <>
              <Tooltip title={task.type} placement="bottom">
                <div className="box research_type">
                  <div className="round"></div>
                </div>
              </Tooltip>
            </>
          )}

          {type === 'documentation' && (
            <>
              <Tooltip  sx={{ ml: 1 }} title={task.type} placement="bottom">
                <div className="box documentationh_type">
                  <div className="round"></div>
                </div>
              </Tooltip>
            </>
          )}
        </div>
      );
    };

    const [AvatarHovered, setAvatarHovered] = useState(false);
    const handleAvatarEnter = () => {
      setAvatarHovered(true);
    };

    const handleAvatarLeave = () => {
      setAvatarHovered(false);
    };

    console.log(AvatarHovered);
    return (
      <div className="cards whole ">
        <Paper elevation={3}>
          <Box
            onClick={() => handleSummaryClick(task._id)}
            className="cardhover"
            ref={drag}
            sx={{
              pt: 1,
              pr: 1,
              pl: 1,
              pb: 1,
              borderRadius: 2,
              bgcolor: '#fff',
              opacity: isDragging ? 0.5 : 1,
              marginBottom: 2,
              boxShadow: ' 0 1px 1px 0 rgba(0, 0, 0, 0.2)'
            }}
          >
            <div>
              <div>
                <div className="cardalign">
                  <Typography className="id taskhover" onClick={() => handleSummaryClick(task._id)}>
                    {task.taskId}
                  </Typography>
                  <div className="assingealign">
                    <Typography
                      className="taskhover project"
                      onClick={() => handleSummaryClick(task._id)}
                      sx={{ fontSize: 13, fontWeight: 400 }}
                    >
                      {task.taskname}
                    </Typography>
                  </div>{' '}
                </div>
                <div className="aligning">
                  {' '}
                  <div className="flagalign">
                    <div>{detais()}</div> <div className="flag">{flag()}</div>{' '}
                  </div>{' '}
                  <Tooltip title={task.assignee} placement="bottom">
                    <Avatar className="assigne" onMouseEnter={handleAvatarEnter} onMouseLeave={handleAvatarLeave}>
                      {task.assignee.charAt(0)}
                    </Avatar>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Box>
        </Paper>
      </div>
    );
  };

  const Column = ({ title, bgcolor, status }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.TASK,
      drop: (item) => {
        moveTask(item.id, title, status);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }));

    const [count, setCount] = useState(0); // State for counting tasks in the column

    useEffect(() => {
      setCount(tasks.filter((task) => task.status === title).length);
    }, [tasks, title]);

    let backgroundColor = bgcolor;

    if (isOver) {
      backgroundColor = '#D6D6D6';
    }

    const titleCheck = (title) => {
      let titleStatus;
      switch (title) {
        case 'icebox':
          titleStatus = 'ICEBOX';
          break;
        case 'development':
          titleStatus = 'DEVELOPMENT';
          break;
        case 'blocked':
          titleStatus = 'BLOCKED';
          break;
        case 'done':
          titleStatus = 'DONE';
          break;
      }
      return titleStatus;
    };

    const columnStyles = {
      borderRadius: 0.5,

      textAlign: 'center',

      height: 37,
      bgcolor: backgroundColor,
      borderTop: ''
    };

    switch (title) {
      case 'icebox':
        columnStyles.borderTop = '3.5px solid blue';
        columnStyles.borderTopLeftRadius = '9px';
        columnStyles.borderTopRightRadius = '9px';
        break;
      case 'development':
        columnStyles.borderTop = '3.5px solid #F29727';
        columnStyles.borderTopLeftRadius = '9px';
        columnStyles.borderTopRightRadius = '9px';
        break;
      case 'blocked':
        columnStyles.borderTop = '3.5px solid #FF0303';
        columnStyles.borderTopLeftRadius = '9px';
        columnStyles.borderTopRightRadius = '9px';
        break;
      case 'done':
        columnStyles.borderTop = '3.5px solid #16FF00';
        columnStyles.borderTopLeftRadius = '9px';
        columnStyles.borderTopRightRadius = '9px';
        break;
      default:
        columnStyles.borderTop = '';
    }

    return (
      <Box ref={drop} sx={{ opacity: isOver ? 0.5 : 1 }}>
        <Paper elevation={4}>
          <div style={columnStyles} className="textalign">
            {titleCheck(title)} {count > 0 && <Avatar className="count">{count}</Avatar>}
          </div>
        </Paper>

        <Card
          ref={drop}
          sx={{
            mt: 2.5,
            opacity: isLoading ? 0.65 : 1,
            bgcolor: '#eef2f6',
            mb: 2,
            p: 0.1,
            pl: 0.1,
            pr: 0.3,

            justifyContent: 'flex-start',

            height: 370, // Reduced height to accommodate scrollbar

            overflow: 'auto',
            scrollbarWidth: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
              paddingTop: '0px',
              paddingBottom: '0px'
              // Added margin between cards and scrollbar
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '0.2px' // Added border radius to scrollbar thumb
            }
          }}
        >
          {' '}
          {isLoading && (
            <Box
              sx={{
                // Loading spinner container styles here
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                mt: 6,
                ml: 11,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999
              }}
            >
              <CircularProgress size={30} />
            </Box>
          )}
          {tasks
            .filter((task) => task.status === title)
            .map((task) => (
              <Task key={task._id} task={task} />
            ))}
        </Card>
        {/* Show loading icon if the update process is ongoing */}
      </Box>
    );
  };
  const Add = () => {
    navigate('/addtask');
  };
  const handleRecycleBinClick=()=>{
    navigate('/recyclebin')
  }
  return (
    <>
      <div className='alignHeader'>
       <div className="navigatetext"><Tab onClick={Listview} label="List View" value="list" />
        <Tab onClick={Boardview} label={<span style={{ borderBottom: '2px solid #090580' }}>Board View</span>} value="board" /></div> 
       <div className='sidebutton'> <Button size='small'
            variant="contained"
            startIcon={<AddIcon />}
            onClick={Add}
            sx={{
              backgroundColor: '#ede7f6',
              color: '#5e35b1',
              '&:hover': {
                backgroundColor: '#ede7f6',
              },
            }}
          >
            Add
            </Button>
            <Button size='medium'
            variant="contained"
            startIcon={<RecyclingIcon />}
            onClick={handleRecycleBinClick}
            sx={{ 
              mr:2,
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
          sx={{display:'none'}}
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

          </div>

      </div>
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ flexGrow: 1, mt:1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Column title="icebox" status="icebox" bgcolor="#fff" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Column title="development" status="development" bgcolor="#fff" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Column title="blocked" status="blocked" bgcolor="#fff" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Column title="done" status="done" bgcolor="#fff" />
            </Grid>
          </Grid>
        </Box>
      </DndProvider>
    </>
  );
};

export default Kanban;

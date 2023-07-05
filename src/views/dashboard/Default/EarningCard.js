import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Menu,MenuItem,  Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import CircularProgress from '@mui/material/CircularProgress';
// assets
// import EarningIcon from 'assets/images/icons/earning.svg';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BlockIcon from '@mui/icons-material/Block';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import InfoIcon from '@mui/icons-material/Info';
import ListAltIcon from '@mui/icons-material/ListAlt';
// import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
// import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
// import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Code } from '@mui/icons-material';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [totaltask,settotaltask] = useState();
  // const [task,settask] = useState();
  const [select,setselect] = useState('Total Tasks');
  const navigate = useNavigate();
  const [loader,setloader]=useState(true)
  console.log(loader)
  const handletask = ()=>{
    navigate('/tasklist')
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAll = () => {
    setselect('Total Tasks')
    setloader(true)
    axios.get("https://node-mongodb-api-oncp.onrender.com/task/task-list/")
    .then((res)=>{
      settotaltask(res.data.length)
      setloader(false)
    })
  };
  const handleIcebox = () => {
    setselect('Icebox / Total')
    setloader(true)
    axios.get("https://node-mongodb-api-oncp.onrender.com/task/task-list/")
    .then((res)=>{
      var total = res.data.length;
      var count=0;
      for(var i=0;i<res.data.length;i++)
      {
        
        if(res.data[i].status=="icebox")
        {
          count++;
        }
      }
      var str= count + "/" + total
      settotaltask(str)
      setloader(false)
    })
  };

  const handleprogress = () => {
    setselect('Development / Total')
    setloader(true)
    axios.get("https://node-mongodb-api-oncp.onrender.com/task/task-list/")
    .then((res)=>{
      var total = res.data.length;
      var count=0;
      for(var i=0;i<res.data.length;i++)
      {
        if(res.data[i].status=="development")
        {
          count++;
        }
      }
      var str= count + "/" + total
      settotaltask(str)
      setloader(false)
    })
  };

  const handleblocked = () => {
    setselect('Blocked / Total')
    setloader(true)
    axios.get("https://node-mongodb-api-oncp.onrender.com/task/task-list/")
    .then((res)=>{
      var total = res.data.length;
      var count=0;
      for(var i=0;i<res.data.length;i++)
      {
        if(res.data[i].status=="blocked")
        {
          count++;
        }
      }
      var str= count + "/" + total
      settotaltask(str)
      setloader(false)
    })
  };

  useEffect(()=>{
    axios.get("https://node-mongodb-api-oncp.onrender.com/task/task-list/")
    .then((res)=>{
      settotaltask(res.data.length)
      setloader(false)
    })
},[])
  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1
                      }}
                    >
                      <AssignmentIcon sx={{color:'white'}}/>
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary[200],
                        zIndex: 1
                      }}
                      aria-controls="menu-earning-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                    <Menu
                      id="menu-earning-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem onClick={handleAll}>
                        All
                      </MenuItem>
                      <MenuItem onClick={handleIcebox}>
                      <ListAltIcon sx={{ mr: 1.75 }} /> Icebox
                      </MenuItem>
                      <MenuItem onClick={handleprogress}>
                      <Code sx={{ mr: 1.75 }} /> Development
                      </MenuItem>
                      <MenuItem onClick={handleblocked}>
                        <BlockIcon sx={{ mr: 1.75 }} /> Blocked
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                  {loader && (
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <CircularProgress size={30} />
          </Box>
        )}
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{totaltask}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.secondary[200]
                  }}
                >
                  {select}
                </Typography>
                <Button
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    margin: '0px',
                    padding: '0px'
                  }}
                  onClick={()=>handletask()}
                >
                  View Details
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;

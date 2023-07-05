// assets
import { IconKey } from '@tabler/icons';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

// constant
const icons = {
  IconKey,
  BadgeOutlinedIcon,
  AssignmentOutlinedIcon,
  PermIdentityOutlinedIcon,
  AccountTreeOutlinedIcon,
  BarChartOutlinedIcon
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  // caption: 'Pages Caption',
  type: 'group',
  children: [
    // {
    //   id: 'authentication',
    //   title: 'Authentication',
    //   type: 'collapse',
    //   icon: icons.IconKey,

    //   children: [
    //     {
    //       id: 'login3',
    //       title: 'Login',
    //       type: 'item',
    //       url: '/pages/login/login3',
    //       target: true
    //     },
    //     {
    //       id: 'register3',
    //       title: 'Register',
    //       type: 'item',
    //       url: '/pages/register/register3',
    //       target: true
    //     }
    //   ]
    // },
    // {
    //   id: 'sample',
    //   title: 'Samples',
    //   type: 'collapse',
    //   icon: icons.AccountTreeOutlinedIcon,

    //   children: [
    //     {
    //       id: 'sampleslist',
    //       title: 'Sample List',
    //       type: 'item',
    //       url: '/samplelist'
    //     },
    //     {
    //       id: 'newsample',
    //       title: 'Add Sample',
    //       type: 'item',
    //       url: '/newsample'
    //     }
    //   ]
    // },
    {
      id: 'projects',
      title: 'Projects',
      type: 'collapse',
      icon: icons.AccountTreeOutlinedIcon,

      children: [
        {
          id: 'projectlist',
          title: 'Project List',
          type: 'item',
          url: '/projectlist'
        },
        {
          id: 'newproject',
          title: 'Add Project',
          type: 'item',
          url: '/newproject'
        }
      ]
    },
    {
      id: 'tasks',
      title: 'Tasks',
      type: 'collapse',
      icon: icons.AssignmentOutlinedIcon,

      children: [
        {
          id: 'tasklist',
          title: 'Task List',
          type: 'item',
          url: '/tasklist'
        },
        {
          id: 'addtask',
          title: 'Add Task',
          type: 'item',
          url: '/addtask'
        }
      ]
    },
    // {
    //   id:'chart',
    //   title:'Chart',
    //   type:'item',
    //   url:'/chart',
    //   icon:icons.BarChartOutlinedIcon,
    // }
    // {
    //   id: 'employees',
    //   title: 'Employees',
    //   type: 'collapse',
    //   icon: icons.BadgeOutlinedIcon,

    //   children: [
    //     {
    //       id: 'employeelist',
    //       title: 'Employee List',
    //       type: 'item',
    //       url: '/Addemployeetable'
    //     },
    //     {
    //       id: 'newemployee',
    //       title: 'Add New Emp',
    //       type: 'item',
    //       url: '/newemployee'
    //     }
    //   ]
    // },
    // {
    //   id: 'users',
    //   title: 'Users',
    //   type: 'collapse',
    //   icon: icons.PermIdentityOutlinedIcon,

    //   children: [
    //     {
    //       id: 'userlist',
    //       title: 'User List',
    //       type: 'item',
    //       url: '/UserList'
    //     },
    //   ]
    // }
  ]
};

export default pages;

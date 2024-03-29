import React from 'react';
import clsx from 'clsx';
import {createStyles, makeStyles, useTheme, Theme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import HistoryIcon from '@material-ui/icons/History';
import AssignmentIcon from "@material-ui/icons/Assignment";
import CurrentActivities from "../activities/activities";
import BacklogList from "../backlog/backlog";
import {NoteAdd} from "@material-ui/icons";
import NewSprint from "../sprint/sprint";
import {Switch, Route, NavLink} from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      activityContent: {
         display: 'flex',
      },
      appBar: {
         zIndex: theme.zIndex.drawer + 1,
         transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
         }),
      },
      appBarShift: {
         marginLeft: drawerWidth,
         width: `calc(100% - ${drawerWidth}px)`,
         transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
         }),
      },
      menuButton: {
         marginRight: 36,
      },
      hide: {
         display: 'none',
      },
      drawer: {
         width: drawerWidth,
         flexShrink: 0,
         whiteSpace: 'nowrap',
      },
      drawerOpen: {
         width: drawerWidth,
         transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
         }),
      },
      drawerClose: {
         transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
         }),
         overflowX: 'hidden',
         width: theme.spacing(7) + 1,
         [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
         },
      },
      toolbar: {
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'flex-end',
         padding: theme.spacing(0, 1),
         // necessary for content to be below app bar
         ...theme.mixins.toolbar,
      },
      content: {
         flexGrow: 1,
         padding: 26,
      },
      link: {
         textDecoration: 'none',
         color: theme.palette.text.primary,
      }
   }),
);

export default function Content() {
   const classes = useStyles();
   const theme = useTheme();
   const [open, setOpen] = React.useState(false);

   const handleDrawerOpen = () => {
      setOpen(true);
   };

   const handleDrawerClose = () => {
      setOpen(false);
   };

   return (
      <div className={classes.activityContent}>
         <CssBaseline/>
         <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
               [classes.appBarShift]: open,
            })}
         >
            <Toolbar>
               <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                     [classes.hide]: open,
                  })}
               >
                  <MenuIcon/>
               </IconButton>
               <Typography variant="h6" noWrap>
                  Activity Management
               </Typography>
            </Toolbar>
         </AppBar>
         <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
               [classes.drawerOpen]: open,
               [classes.drawerClose]: !open,
            })}
            classes={{
               paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
               }),
            }}
         >
            <div className={classes.toolbar}>
               <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
               </IconButton>
            </div>
            <Divider/>
            <List>
               <NavLink to="/" className={classes.link}>
                  <ListItem button>
                     <ListItemIcon><AssignmentIcon/></ListItemIcon>
                     <ListItemText primary={'Current Activity'}/>
                  </ListItem>
               </NavLink>
               <NavLink to="/backlog" className={classes.link}>
                  <ListItem button>
                     <ListItemIcon><ListIcon/></ListItemIcon>
                     <ListItemText primary={'Backlog'}/>
                  </ListItem>
               </NavLink>
               <NavLink to="/history" className={classes.link}>
                  <ListItem button>
                     <ListItemIcon><HistoryIcon/></ListItemIcon>
                     <ListItemText primary={'History'}/>
                  </ListItem>
               </NavLink>
               <Divider/>
               <NavLink to="/sprint" className={classes.link}>
                  <ListItem button>
                     <ListItemIcon><NoteAdd/></ListItemIcon>
                     <ListItemText primary={'Create Sprint'}/>
                  </ListItem>
               </NavLink>
            </List>
         </Drawer>
         <main className={classes.content}>
            <div className={classes.toolbar}/>
            <Switch>
               <Route exact path={"/"}>
                  <CurrentActivities/>
               </Route>
               <Route path="/backlog">
                  <BacklogList/>
               </Route>
               <Route path="/history">
                  <BacklogList/>
               </Route>
               <Route path="/sprint">
                  <NewSprint/>
               </Route>
            </Switch>
         </main>
      </div>
   );
}

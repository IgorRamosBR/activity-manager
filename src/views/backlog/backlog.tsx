import React, {FormEvent, useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Box, Breadcrumbs, ListItemSecondaryAction, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SendIcon from '@material-ui/icons/Send';
import * as activity from "../../repositories/activity";
import IconButton from "@material-ui/core/IconButton";
import Link from '@material-ui/core/Link';
import TaskList from "../../components/list/list";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      backlogContent: {
         width: '100%',
         maxWidth: 300,
         backgroundColor: theme.palette.background.paper,
      },
      leftText: {
         textAlign: "center",
      },
      breadcrumb: {
         marginBottom: 20,
      }
   }),
);

export default function BacklogList() {
   const classes = useStyles();
   const [activities, setActivities] = useState<Array<activity.Activity>>([]);
   const [activityName, setActivityName] = useState('');
   const [currentActivity, setCurrentActivity] = useState({} as activity.Activity);

   const handleCurrentActivity = (value: activity.Activity) => () => {
      setCurrentActivity(value);
   };

   useEffect(() => {
      fetchDraftActivities();
   }, []);

   const fetchDraftActivities = async () => {
      setActivities([]);

      const _activities = await activity.allDraft();
      setActivities(_activities);
   };

   const onSubmit = async (e: FormEvent) => {
      // prevent form reload the page
      e.preventDefault();

      let newActivity = {name: activityName, draft: true} as activity.Activity
      await activity.create(newActivity);

      // clean the form
      setActivityName("");
      await fetchDraftActivities();
   };

   function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
      event.preventDefault();
      setCurrentActivity({} as activity.Activity)
   }

   return (
      <Box>
         <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
            <Link color="inherit" href="#" onClick={handleClick}>
               Backlog
            </Link>
            {Object.keys(currentActivity).length ? <Typography color="textPrimary">{currentActivity.name}</Typography> : <Typography/> }
         </Breadcrumbs>

         {!Object.keys(currentActivity).length ?
            <Box className={classes.backlogContent}>
            <Typography variant={"h6"} gutterBottom className={classes.leftText}>
               Backlog
            </Typography>
            <List className={classes.backlogContent}>
               <Divider/>
               {activities.map((activity) => {
                  return (
                     <ListItem key={activity.name} role={undefined} dense button onClick={handleCurrentActivity(activity)}>
                        <ListItemText primary={activity.name} />
                     </ListItem>
                  );
               })}
               <ListItem dense button>
                  <form onSubmit={onSubmit}>
                  <TextField id="new-activity" label="New Activity" value={activityName} onChange={event => setActivityName(event.target.value)}/>
                  <ListItemSecondaryAction>
                     <IconButton type={"submit"} edge="end" aria-label="send">
                        <SendIcon />
                     </IconButton>
                  </ListItemSecondaryAction>
                  </form>
               </ListItem>
            </List>
            </Box>
         : <TaskList activity={currentActivity}/> }
      </Box>
   );
}

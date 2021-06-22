import React, {FormEvent, useEffect, useState} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from "@material-ui/core/Typography";
import {Box, ListItemSecondaryAction, TextField} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import * as repository from "../../repositories/activity";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import * as activity from "../../repositories/activity";
import {Task} from "../../repositories/activity";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      listContent: {
         width: '100%',
         maxWidth: 300,
         backgroundColor: theme.palette.background.paper,
         display: 'inline-block',
         marginRight: 20,
      },
      leftText: {
         textAlign: "center"
      },
   }),
);

type TaskListProps = {
   activity: repository.Activity,
}

export default function TaskList(props: TaskListProps) {
   const classes = useStyles();
   const [taskName, setTaskName] = useState('');
   const [currentActivity, setCurrentActivity] = useState(props.activity)
   //const [checked, setChecked] = React.useState([0]);

   useEffect(() => {
      setCurrentActivity(props.activity)
   }, [props])

   const handleToggle = async (task: Task) => {
    /*  const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
         newChecked.push(value);
      } else {
         newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);*/
      currentActivity.tasks?.map(t => t.name === task.name ? updateTask(t) : t)
      let updatedActivity = await activity.update(currentActivity.id, currentActivity);
      setCurrentActivity(updatedActivity);
   };

   const updateTask = (task: activity.Task) => {
      task.done = !task.done;
      return task;
   }
   const onSubmit = async (e: FormEvent) => {
      // prevent form reload the page
      e.preventDefault();

      if (props.activity.tasks) {
         props.activity.tasks.push({name: taskName, done: false});
      } else {
         props.activity.tasks = new Array({name: taskName, done: false});
      }

      let newActivity = await activity.update(props.activity.id, props.activity);
      setCurrentActivity(newActivity);

      // clean the form
      setTaskName("");
   };

   return (
      <Box className={classes.listContent}>
      <Typography variant={"h6"} gutterBottom className={classes.leftText}>
         {currentActivity.name}
      </Typography>
      <List>
         <Divider/>
         {currentActivity.tasks?.map((task) => {
            const labelId = `checkbox-list-label-${task.name}`;

            return (
               <ListItem key={task.name} role={undefined} dense button onClick={async () => handleToggle(task)}>
                  <ListItemText id={labelId} primary={task.name} />
                  <ListItemIcon>
                     <Checkbox
                        edge="start"
                        checked={task.done}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                     />
                  </ListItemIcon>
               </ListItem>
            );
         })}
         <ListItem dense button>
            <form onSubmit={onSubmit}>
               <TextField label="New Task" value={taskName} onChange={event => setTaskName(event.target.value)}/>
               <ListItemSecondaryAction>
                  <IconButton type={"submit"} edge="end" aria-label="send">
                     <SendIcon />
                  </IconButton>
               </ListItemSecondaryAction>
            </form>
         </ListItem>
      </List>
      </Box>
   );
}

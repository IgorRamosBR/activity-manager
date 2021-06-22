import React, {useEffect, useState} from 'react';
import TaskList from "../../components/list/list";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import * as SprintRepository from "../../repositories/sprint";
import * as ActivityRepository from "../../repositories/activity";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      activityContent: {
         display: 'inline',
         listStyle: 'none',
         height: '100%',
         width: '100%',
         textAlign: 'left',
         padding: 0,
      },
      root: {
         '& > *': {
            paddingRight: 100,
            flexGrow: 1,
         },
      },
   }),
);

export default function CurrentActivities() {
   const classes = useStyles();
   const [activities, setActivities] = useState<Array<ActivityRepository.Activity>>([]);

   useEffect(() => {
      fetchActivities();
   }, []);

   const fetchActivities = async () => {
      setActivities([]);

      const _sprint = await SprintRepository.current();
      setActivities(_sprint.activities?.length > 0 ? _sprint.activities : []);
   };

   return (
      <div className={classes.root}>
         <Grid container spacing={1}>
            {activities.map((activity) => {
                  return (
                  <Grid item xs={12} lg={2}>
                     <TaskList key={activity.id} activity={activity}/>
                  </Grid>
                  )
            })}
         </Grid>
      </div>
   );
}
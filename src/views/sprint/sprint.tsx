import React, {FormEvent} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
   MuiPickersUtilsProvider,
   KeyboardDatePicker,
} from '@material-ui/pickers';
import MultipleSelect from "../../components/list/select";
import * as ActivityRepository from "../../repositories/activity";
import * as SprintRepository from "../../repositories/sprint";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         '& > *': {
            paddingRight: 100,
            flexGrow: 1,
         },
      },
      fully: {
         width: '100%',
      },
   }),
);

export default function NewSprint() {
   const classes = useStyles();
   const today = new Date(Date.now());
   const todayPlusTwoWeeks = new Date(Date.now()).getTime() + (1000 * 60 * 60 * 24 * 14)
   const [selectedBeginDate, setSelectedBeginDate] = React.useState<Date | null>(today);
   const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(new Date(todayPlusTwoWeeks));
   const [sprintName, setSprintName] = React.useState('');
   const [selectedActivities, setSelectedActivities] = React.useState<Array<ActivityRepository.Activity>>([]);
   let history = useHistory();

   const handleBeginDateChange = (date: Date | null) => {
      setSelectedBeginDate(date);
   };

   const handleEndDateChange = (date: Date | null) => {
      setSelectedEndDate(date);
   };

   const handleChange = (activities: ActivityRepository.Activity[]) => {
      setSelectedActivities(activities);
   };

   const onSubmit = async (e: FormEvent) => {
      e.preventDefault();
      let finishedActivities = await ActivityRepository.finishActivities(selectedActivities);
      history.push("/");
      await SprintRepository.create({
         name: sprintName,
         beginDate: selectedBeginDate,
         endDate: selectedEndDate,
         activities: finishedActivities,
         finished: false,
      } as SprintRepository.Sprint)
   }

      return (
      <div className={classes.root}>
         <form className={classes.root} onSubmit={onSubmit} noValidate autoComplete="off">
         <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
               <TextField id="standard-basic" label="Name" onChange={(event) => setSprintName(event.target.value)} className={classes.fully}/>
            </Grid>
            <Grid item lg={6}>
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12} lg={3}>
               <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Begin Date"
                  value={selectedBeginDate}
                  onChange={handleBeginDateChange}
                  KeyboardButtonProps={{
                     'aria-label': 'change date',
                  }}
                  className={classes.fully}
               />
            </Grid>
            <Grid item xs={12} lg={3}>
               <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="End Date"
                  format="MM/dd/yyyy"
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                     'aria-label': 'change date',
                  }}
                  className={classes.fully}
               />
            </Grid>
            <Grid item lg={6}>
            </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={12} lg={6}>
               <MultipleSelect onChange={handleChange}/>
            </Grid>
            <Grid item lg={6}>
            </Grid>
            <Grid item xs={6} lg={2}>
               <Button type={"submit"} variant="contained" color="primary">
                  Start Sprint
               </Button>
            </Grid>
         </Grid>
         </form>
      </div>
   );
}

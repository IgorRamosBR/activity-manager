import React, {useEffect} from 'react';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import * as activity from "../../repositories/activity";
import * as ActivityRepository from "../../repositories/activity";
import {Activity} from "../../repositories/activity";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      formControl: {
         margin: theme.spacing(1),
         minWidth: 120,
         width: '100%',
      },
      chips: {
         display: 'flex',
         flexWrap: 'wrap',
      },
      chip: {
         margin: 2,
      },
      noLabel: {
         marginTop: theme.spacing(3),
      },
   }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
   PaperProps: {
      style: {
         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
         width: 250,
      },
   },
};

type TransferListProps = {
   onChange: (selectedActivities: Activity[]) => void
}

function getStyles(name: string, personName: string[], theme: Theme) {
   return {
      fontWeight:
         personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
   };
}

export default function MultipleSelect(props: TransferListProps) {
   const classes = useStyles();
   const theme = useTheme();
   const [personName, setPersonName] = React.useState<string[]>([]);
   const [activities, setActivities] = React.useState<Array<activity.Activity>>([])

   useEffect(() => {
      fetchDraftActivities();
   }, []);

   const fetchDraftActivities = async () => {
      setActivities([]);

      const _activities = await ActivityRepository.allDraft();
      setActivities(_activities);
   };

   const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      let activitiesName = event.target.value as string[];
      setPersonName(activitiesName);
      let selectedActivities:ActivityRepository.Activity[] = activities.filter(a => activitiesName.includes(a.name))
      props.onChange(selectedActivities);
   };

   return (
      <div>
         <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">Activities</InputLabel>
            <Select
               labelId="demo-mutiple-chip-label"
               id="demo-mutiple-chip"
               multiple
               value={personName}
               onChange={handleChange}
               input={<Input id="select-multiple-chip" />}
               renderValue={(selected) => (
                  <div className={classes.chips}>
                     {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} className={classes.chip} />
                     ))}
                  </div>
               )}
               MenuProps={MenuProps}
            >
               {activities.map((activities) => (
                  <MenuItem key={activities.name} value={activities.name} style={getStyles(activities.name, personName, theme)}>
                     {activities.name}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>
      </div>
   );
}

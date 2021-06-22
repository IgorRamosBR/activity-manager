import {db} from "../firebase/firebase";

const COLLECTION_NAME = "activities";

export type Activity = {
   id?: string;
   name: string;
   draft: boolean
   tasks?: Task[];
};

export type Task = {
   name: string;
   done: boolean;
}

// retrieve all todos
export const all = async (): Promise<Array<Activity>> => {
   const snapshot = await db.collection(COLLECTION_NAME).where('draft', '==', false).get();
   const data: Array<any> = [];

   snapshot.docs.map((_data) => (
      data.push({
         id: _data.id, // because id field in separate function in firestore
         ..._data.data(), // the remaining fields
      })
   ));

   // return and convert back it array of todo
   return data as Array<Activity>;
};

export const allDraft = async (): Promise<Array<Activity>> => {
   const snapshot = await db.collection(COLLECTION_NAME).where('draft', '==', true).get();
   const data: Array<any> = [];

   snapshot.docs.map((_data) => (
      data.push({
         id: _data.id, // because id field in separate function in firestore
         ..._data.data(), // the remaining fields
      })
   ));

   // return and convert back it array of todo
   return data as Array<Activity>;
};

export const create = async (activity: Activity): Promise<Activity> => {
   const docRef = await db.collection(COLLECTION_NAME).add(activity);

   return {
      id: docRef.id,
      ...activity,
   } as Activity;
};

export const update = async (id: string | undefined, activity: Activity): Promise<Activity> => {
   await db.collection(COLLECTION_NAME).doc(id).update(activity);

   // return updated todo
   return {
      id: id,
      ...activity,
   } as Activity;
};

export const finishActivities = async (activities: Activity[]): Promise<Activity[]> => {
   let updatedActivities = new Array<Activity>()
   for (let activity of activities) {
      activity.draft = false;
      await db.collection(COLLECTION_NAME).doc(activity.id).update(activity);
      updatedActivities.push(activity);
   }

   return updatedActivities;
};


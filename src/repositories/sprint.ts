import {db} from "../firebase/firebase";
import {Activity} from "./activity";

const COLLECTION_NAME = "sprints";

export type Sprint = {
   id?: string;
   name: string;
   beginDate: Date;
   endDate: Date;
   activities: Activity[];
   finished?: boolean
};

export const create = async (sprint: Sprint): Promise<Sprint> => {
   const docRef = await db.collection(COLLECTION_NAME).add(sprint);
   return {
      id: docRef.id,
      ...sprint,
   } as Sprint;
};

export const current = async (): Promise<Sprint> => {
   const snapshot = await db.collection(COLLECTION_NAME).where('finished', '==', false).get();
   const data: Array<any> = [];

   snapshot.docs.map((_data) => (
      data.push({
         id: _data.id, // because id field in separate function in firestore
         ..._data.data(), // the remaining fields
      })
   ));

   // return and convert back it array of todo
   return data.length > 0 ? data[0] : {} as Sprint ;
};
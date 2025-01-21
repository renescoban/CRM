import { getActivities } from "@/lib/actions"
import ActivitiesClient from "./ActivitiesClient"
import { Activity } from "@/types";
export const metadata = {

  title: "Activities",
  description: "...",
};
export default async function Page(){
    const activities = await getActivities() as Activity[]
    return (

    <ActivitiesClient activities={activities} />
    )
}
import { ActivityModel } from "@/models/ActivityModel";
import { Activity } from "@/types";
import dynamic from "next/dynamic";
import { Suspense } from "react";
export const metadata = {

  title: "Activities",
  description: "...",
};

const ActivitiesClient = dynamic(() => import('./ActivitiesClient'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
});

const getActivities = async () => {
  try {
    return await ActivityModel.getAll();
  } catch {
    return [];
  }
};
export default async function Page() {
  const activities = await getActivities() as Activity[]
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
      <ActivitiesClient activities={activities} />
    </Suspense>

  )
}
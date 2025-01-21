"use client"
import { Activity } from "@/types";
import Link from "next/link";
interface ActivityProps {
    activities: Activity[]
  }

export default function ActivitiesClient( {activities} : ActivityProps ){



    const recentActivities = activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    return (
        <ul className="space-y-2 max-w-xl">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="text-sm">
                    <span className="font-semibold capitalize">{activity.type}</span> with <Link className='font-semibold text-blue-600 hover:underline' href={`/contacts/${activity.contact_id}`}>{activity.contacts.name}</Link> 
                    <br />
                    {activity.description}...
                    <br />
                    <span className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                    <hr />
                  </li>
                ))}
              </ul>
    )
}
import { getActivities, getTags } from '@/lib/actions'
import ReportsClient from './client'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Reports",
  description: "...",
};

export default async function Reports() {

  try {
    const [activities, tags] = await Promise.all([getActivities(), getTags()])
    return <ReportsClient initialActivities={activities} initialTags={tags} />
  } catch (error) {
    console.error('Error fetching report data:', error)
    return <div>Error loading report data. Please try again later.</div>
  }
}
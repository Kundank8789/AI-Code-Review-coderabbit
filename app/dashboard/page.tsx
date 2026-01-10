'use client'
import React from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {BarChart, Bar ,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {GitCommit, GitPullRequest, MessageSquare, GitBranch} from "lucide-react"
import {useQuery} from "@tanstack/react-query";
import { getDashboardStats,getMonthlyActivity } from '@/module/dashboard/actions';

const MainPage = () => {
  const {data: stats, isLoading} = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn:async () => await getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  const {data: monthlyActivity, isLoading: isLoadingActivity} = useQuery({
    queryKey: ["monthly-activity"],
    queryFn:async () => await getMonthlyActivity(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>Overview of your coding activity and AI reviews</p>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-center space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Repositories</CardTitle>
              <GitBranch className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{isLoading ? "..." : stats?.totalRepos || 0}</div>
            <p className='text-xs text-muted-foreground'>Connected repositories</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MainPage
"use client";
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { DB } from '../../../utils/dbConfig';
import { Budgets } from '../../../utils/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


function DashboardLayout({children}) {

  const {user}=useUser();
  const router = useRouter();
  useEffect(() => {
    user&&checkUserBudgets();
  }, [user])

  const checkUserBudgets = async() => {
    const result =await DB.select()
    .from(Budgets)
    .where(eq(Budgets.createdBY, user?.primaryEmailAddress?.emailAddress))

    console.log(result);
    if(result?.length==0){
      router.replace('/Dashboard/budgets')
    }
  }


  return (
    <div>
        <div className='fixed md:w-64 hidden md:block '>
            <SideNav />
        </div>
        <div className='md:ml-64 '>
            <DashboardHeader />
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout;

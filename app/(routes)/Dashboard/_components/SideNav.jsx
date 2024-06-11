"use client";
import { use, useEffect } from 'react'
import Image from 'next/image'
import {LayoutGrid, PiggyBank, ReceiptText, ShieldCheck} from 'lucide-react'
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function SideNav() {

    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path:'/Dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path:'/Dashboard/budgets'
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path:'/Dashboard/expenses/page'
        },
        {
            id: 4,
            name: 'Upgrade',
            icon: ShieldCheck,
            path:'/Dashboard/upgrade'
        }
    ]

    const path = usePathname();
    useEffect(() => {
        console.log(path);
    },[path])

  return (
    <div className='h-screen p-5 border shadow-sm'>
      <Image src={'/logo1.svg'}
      alt='logo'
      width={300}
      height={250}
      />

        <div className='mt-5'>
        {menuList.map((menu,index)=>(
            <Link href={menu.path}>
            <h2 className={`flex gap-2 items-center text-gray-500 font-medium 
            mb-2 p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100  
            ${path==menu.path&&'text-primary bg-blue-100'} `}>
                <menu.icon/>
                {menu.name}
            </h2>
            </Link>
        ))}
      </div>

        <div className='fixed bottom-10 p-5 flex gap-2 items-center hover:bg-blue-50 rounded-xl'>
            <UserButton/>
            Profile
        </div>
        
    </div>
  )
}

export default SideNav

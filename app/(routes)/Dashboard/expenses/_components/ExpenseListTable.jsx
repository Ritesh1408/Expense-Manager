import React from 'react'
import { Expenses } from '../../../../../utils/schema'
import { index } from 'drizzle-orm/pg-core'
import { Trash } from 'lucide-react'
import { DB } from '../../../../../utils/dbConfig'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'


function ExpenseListTable({ExpensesList,refreshData}) {

    const deleteExpense=async(Expense)=>{
        const result = await DB.delete(Expenses).where(eq(Expenses.id,Expense.id)).returning();

        if(result){
            toast.success('Expense Deleted Successfully!');
            refreshData();
        }
    }

  return (
    <div className='mt-3'>
        <h2 className='font-bold text-lg'>Latest Expenses</h2>
        <div className='grid grid-cols-4 bg-slate-200 p-2 rounded-md mt-3'>
            <h2 className='font-bold'>Name</h2>
            <h2 className='font-bold'>Amount</h2>
            <h2 className='font-bold'>Date</h2>
            <h2 className='font-bold'>Action</h2>
        </div>
        {ExpensesList.map((Expenses,index)=>(
            <div className='grid grid-cols-4 bg-slate-50 p-2 rounded-md'>
            <h2>{Expenses.name}</h2>
            <h2>{Expenses.amount}</h2>
            <h2>{Expenses.createdAt}</h2>
            <h2>
                <Trash className='text-red-600 cursor-pointer hover:text-red-800'
                onClick={()=>deleteExpense(Expenses)}
                />
            </h2>
        </div>
        ))}
      
    </div>
  )
}

export default ExpenseListTable

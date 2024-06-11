"use client";

import React, { useEffect, useState } from 'react';
import { DB } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '../../../../../@/components/ui/button';
import { Trash } from 'lucide-react';
import EditBudget from '../../expenses/_components/EditBudget';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [BudgetInfo, setBudgetInfo] = useState(null);
  const [ExpensesList, setExpensesList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    console.log('User:', user);
    console.log('Params:', params);
    if (user && params.id) {
      getBudgetInfo(parseInt(params.id, 10));
    }
  }, [user, params.id]);

  const getBudgetInfo = async (budgetId) => {
    try {
      const result = await DB.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number)
      })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBY, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, budgetId))
        .groupBy(Budgets.id);

      console.log('Budget Info:', result);

      setBudgetInfo(result[0]);
      getExpensesList(budgetId);  // Pass budgetId to getExpensesList
    } catch (error) {
      console.error('Error fetching budget info:', error);
    }
  };

  const getExpensesList = async (budgetId) => {
    try {
      const result = await DB.select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, budgetId))
        .orderBy(desc(Expenses.id));
      console.log('Expenses List:', result);
      setExpensesList(result);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const deleteBudget = async () => {
    try {
      const budgetId = parseInt(params.id, 10);
      const deleteExpenseResult = await DB.delete(Expenses).where(eq(Expenses.budgetId, budgetId)).returning();

      if (deleteExpenseResult) {
        await DB.delete(Budgets).where(eq(Budgets.id, budgetId)).returning();
        toast.success('Budget Deleted Successfully');
        route.push('/Dashboard/budgets');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Error deleting budget');
    }
  };

  if (!params.id) {
    return <div>Error: No budget ID provided</div>;
  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>
        My Expenses
        <div className='flex gap-2 items-center'>
          <EditBudget 
            BudgetInfo={BudgetInfo}
            refreshData={() => getBudgetInfo(parseInt(params.id, 10))}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 hover:text-red-100" variant="destructive">
                <Trash /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='m-20'>
              <AlertDialogHeader>
                <AlertDialogTitle className='font-bold'>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your budgets along with expenses
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className='gap-2 items-end justify-center'>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {BudgetInfo ? (
          <BudgetItem budget={BudgetInfo} />
        ) : (
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>
        )}
        <AddExpense budgetId={params.id} user={user} refreshData={() => getBudgetInfo(parseInt(params.id, 10))} />
      </div>
      <div className='mt-4'>
        <ExpenseListTable ExpensesList={ExpensesList} refreshData={() => getBudgetInfo(parseInt(params.id, 10))} />
      </div>
    </div>
  );
}

export default ExpensesScreen;

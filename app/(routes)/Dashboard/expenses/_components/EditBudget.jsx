"use client";
import React, { useEffect, useState } from 'react'
import { Button } from '../../../../../@/components/ui/button'
import { PenBox } from 'lucide-react'
import { Input } from '../../../../../@/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "../../../../../@/components/ui/dialog";
import { useUser } from '@clerk/nextjs';
import { DB } from '../../../../../utils/dbConfig';
import { Budgets } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

function EditBudget({ BudgetInfo,refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(BudgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const { user } = useUser();

  useEffect(() => {
    if (BudgetInfo){
      setEmojiIcon(BudgetInfo?.icon);
      setName(BudgetInfo?.name);
      setAmount(BudgetInfo?.amount);
    }
    
  }, [BudgetInfo]);

  const onUpdateBudget = async () => {
    // Your update logic here
    const result = await DB.update(Budgets).set({
      name:name,
      amount:amount,
      icon:emojiIcon,
    }).where(eq(Budgets.id, BudgetInfo.id))
    .returning();

    if(result){
      refreshData();
      toast.success('Budget updated successfully');
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='flex gap-2'><PenBox />Edit</Button>
        </DialogTrigger>
        <DialogContent className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative bg-white p-6 rounded-md'>
            <DialogHeader>
              <DialogTitle>Update Budget</DialogTitle>
              <DialogDescription>
                <div className='mt-5'>
                  <Button 
                    variant="outline" 
                    className="text-lg"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {emojiIcon}
                  </Button>
                  {openEmojiPicker && (
                    <div className='absolute z-20'>
                      <EmojiPicker 
                        onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                    <Input 
                      placeholder="e.g. Home Decor" 
                      defaultValue={BudgetInfo?.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                    <Input 
                      placeholder="e.g. 5000$"
                      defaultValue={BudgetInfo?.amount}
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    disabled={!(name && amount)}
                    onClick={onUpdateBudget}
                    className="mt-5 w-full"
                  >
                    Update Budget
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute right-4 top-4">
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditBudget;

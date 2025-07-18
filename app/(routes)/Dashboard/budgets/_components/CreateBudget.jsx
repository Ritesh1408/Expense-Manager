"use client"

import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../../../@/components/ui/dialog";
import { Input } from '../../../../../@/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '../../../../../components/ui/button';
import { Budgets } from '../../../../../utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { DB } from '../../../../../utils/dbConfig';

function CreateBudget({refreshData}) {

  const [emojiIcon, setEmojiIcon] = useState('🤑');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const {user} = useUser();
  /**
   * used to craete New Budget
   */
  const onCreateBudget = async() => {
    const result = await DB.insert(Budgets).values({
      name:name,
      amount:amount,
      createdBY:user?.primaryEmailAddress?.emailAddress,
      icon:emojiIcon
    }).returning({insertedId:Budgets.id})

    if(result){
      refreshData();
      toast('New Budget Created Successfully!')
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative bg-white p-6 rounded-md'>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>
                <div className='mt-5'>
                  <Button variant = "outline" 
                  className="text-lg"
                  onClick ={()=>setOpenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                  <div className='absolute z-20'>
                    <EmojiPicker 
                    open={openEmojiPicker}
                    onEmojiClick={(e)=>{
                      setEmojiIcon(e.emoji)
                      setOpenEmojiPicker(false)
                    }}
                    />
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                    <Input placeholder="e.g. Home Decor" onChange={(e)=>setName(e.target.value)}/>
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                    <Input placeholder="e.g. 5000$"
                    type="number"
                    onChange={(e)=>setAmount(e.target.value)}/>
                  </div>
                  <Button disabled={!(name && amount)}
                  onClick={()=>onCreateBudget()}
                  className="mt-5 w-full">Create Budget</Button>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div>
              {/* Add your form or content here */}
            </div>
            <DialogClose className="absolute right-4 top-4">
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget

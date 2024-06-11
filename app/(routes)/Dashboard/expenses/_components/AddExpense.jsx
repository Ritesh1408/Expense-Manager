import React, { useState } from 'react';
import { Input } from '../../../../../@/components/ui/input';
import { Button } from '../../../../../components/ui/button';
import { DB } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import moment from 'moment';
import { Loader } from 'lucide-react';

function AddExpense({ budgetId, user,refreshData }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const addNewExpense = async () => {
        setLoading(true);
        try {
            console.log('Attempting to insert new expense...');
            const result = await DB.insert(Expenses).values({
                name: name,
                amount: amount,
                budgetId: budgetId,
                createdAt: moment().format('DD-MM-YYYY'),
            }).returning({ insertedId: Budgets.id });

            setAmount('');
            setName('');

            console.log('Insert result:', result);
            if (result && result.length > 0) {
                setLoading(false);
                refreshData();
                toast.success('New Expense Added Successfully!');
            } else {
                console.error('Insertion did not return a valid result:', result);
            }
        } catch (error) {
            console.error('Error while adding new expense:', error);
        }
        setLoading(false);
    };

    // Test the toast function independently
    const testToast = () => {
        toast.success('Toast is working!');
    };

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input
                    placeholder="e.g. Bedroom Decor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input
                    placeholder="e.g. 1250"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button
                disabled={!(name && amount) || loading}
                onClick={addNewExpense}
                className='mt-3 w-full'
            >
                {loading ? 
                    <Loader className='animate-spin'/>:"Add New Expense"
                
                }
                
            </Button>

            {/* Button to test toast independently
            <Button onClick={testToast} className='mt-3 w-full'>
                Test Toast
            </Button> */}
        </div>
    );
}

export default AddExpense;

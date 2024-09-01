import { Info } from 'lucide-react';

interface FormInfoProps  {
    message?:string
}

export const FormInfo = ( {message} : FormInfoProps ) => {
    if (!message) return null;

    return (
        <div className='bg-yellow-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-yellow-700'>
            <Info className='flex-shrink-0 h-4 w-4'></Info>
            {message}
        </div>
    )
};
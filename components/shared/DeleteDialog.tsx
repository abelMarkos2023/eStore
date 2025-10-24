'use client'

import { useState, useTransition } from "react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader, Trash } from "lucide-react";
import { toast } from "sonner";

const DeleteDialog = ({id,action}:{id:string,action:(id:string)=> Promise<{success:boolean,message:string}>}) => {
    const [open,setOpen] = useState(false);
    const [isPending,startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            const result = await action(id);
            if(!result.success){
               toast.error(result.message || 'Something went wrong'); 
            }
            toast.success(result.message);
        })
    }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button variant='destructive' size='sm' className="ml-2 cursor-pointer">
                Delete
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This Action Can&apos;t be undone</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                variant='destructive'
                size='sm'
                className="ml-2 cursor-pointer"
                onClick={handleClick}
                >
                    {
                        isPending? (
                            <>
                            <Loader className='mr-2 h-4 w-4 animate-spin' /> 
                            <span>Deleting...</span></>
                        ):(
                            <><Trash className='mr-2 h-4 w-4' /> <span>Delete</span></>
                        )
                    }
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog
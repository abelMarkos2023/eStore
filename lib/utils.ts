import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const convertToPlainObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const formatDecimal = (num:number):string => {

  const [int,decimal] = num.toString().split('.');

  return decimal ? `${int}.${decimal.padEnd(2,'0')}` : `${int}.00`;
} 

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error:any) =>{

  if(error.name === 'ZodError' ){
      // const errorMessagesArray = error.errors?.map((error : any) => error.message) || [];

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMessagesArray = error.issues?.map((issue: any) => {
      const field = issue.path?.length > 0 ? issue.path.join('.') : 'field';
      return `${field}: ${issue.message}`;
    }) || [];
   console.log(errorMessagesArray)

   const errorMessage = errorMessagesArray.join(', ');
   return errorMessage || 'Validation error occurred';

  }
  else if(error?.name === 'PrismaClientKnownRequestError' && error?.code === 'P2002'){
  return `Unique constraint failed: ${error?.meta?.target?.join(', ') || 'unknown field'}`;
  }
  return error?.message || 'An unexpected error occurred';
  

}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

export const roundToTwoDecimal = (num:number | string) => {

  if(typeof num === 'string'){
    return Math.round(Number((num + Number.EPSILON)) * 100) / 100;
  }
  else if(typeof num === 'number'){
    return Math.round((num + Number.EPSILON) * 100) / 100; 
  }
  else{
    throw new Error('Input must be a number or a string');
  }
  
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value:number | string | null){
  if(typeof value === 'number'){
    return CURRENCY_FORMATTER.format(value);
  }
  else if(typeof value === 'string'){
    return CURRENCY_FORMATTER.format(Number(value));
  }else{
    return "NaN"
  }
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(number:number){
  return NUMBER_FORMATTER.format(number);
}

export const formatId = (id:string) => {
  return `..${id.substring(id.length - 6)}`
}

export const formatDate = (date:Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
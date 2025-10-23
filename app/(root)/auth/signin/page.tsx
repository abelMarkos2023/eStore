
import SignIn from '@/components/SignInFor'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SignInPage = async ({searchParams}:{searchParams:Promise<{callbackUrl:string}>}) => {

    const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

    const session = await auth();
    const {callbackUrl} = await searchParams

    

    if(session){
        if(!callbackUrl){
        return redirect(`${url}/`);
    }

    console.log(callbackUrl)
       return redirect(`/${callbackUrl}` || '/');
    }


  return (
    <div className="mt-4 rounded-lg shadow-xl bg-primary">
        <Card className='bg-primary'>
            <CardHeader>
               
            </CardHeader>
            <CardContent>
                 <SignIn />
            </CardContent>
        </Card>
     
    </div>
  )
}

export default SignInPage
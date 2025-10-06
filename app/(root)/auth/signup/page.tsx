
import SignIn from '@/components/SignInFor'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignUp from '@/components/SignUp';

const SignUpPage = async ({searchParams}:{searchParams:Promise<{callbackUrl:string}>}) => {

    const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

    const session = await auth();
    const {callbackUrl} = await searchParams

    

    if(session){
        if(!callbackUrl){
        return redirect(`${url}/`);
    }
       return redirect(`${url}/${callbackUrl}` || '/');
    }


  return (
    <div className="mt-4 max-w-xl rounded-lg shadow-xl bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <Card className='bg-primary'>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent>
                 <SignUp />
            </CardContent>
        </Card>
     
    </div>
  )
}

export default SignUpPage


import NextAuth , { type DefaultSession }from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id:string;
      address: string;
      role: string;

      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]

    
  }
}

// Define the User type for type safety
interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
       email: { label: 'Email', type: 'email' },
       password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials:Partial<Record<"email" | "password", unknown>>): Promise<AuthUser | null> => {
        if (!credentials) return null;
        let user = null;

        // logic to salt and hash password
        if (credentials) {
          user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });
        }

        if (!user || !user.password) {
          throw new Error("User not found or password not set");
        }

        const isMatch = compareSync(credentials.password as string, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(), // Ensure ID is a string for NextAuth
          name: user.name,
          email: user.email,
          role: user.role || null,
        };
      },
    }),
  ],
   callbacks: {
    session({ session, token, user,trigger }) {
      // `session.user.address` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      session.user.id = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name as string

      if(trigger === 'update'){
        session.user.name = user.name
      }

      console.log(token)
      return {
        ...session,
        user: {
          ...session.user,
        },
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({token,user,trigger,session}:any){
        
      if(user){
        token.role = user.role
      

      if(user.name === 'No_NAME'){
        token.name = user.email?.split('@')[0];

        await prisma.user.update({
          where:
          {id:user.id},
          data:
          {name:token.name}
        })
      }

      if(trigger === 'signIn' || trigger === 'signUp'){
        const cookieObject = await cookies();
        const cartSessionId = cookieObject.get('cartSessionId')?.value;

        if(cartSessionId){
          const cart = await prisma.cart.findFirst({
          where:{sessionId:cartSessionId}
        });
        if(cart){
          await prisma.cart.deleteMany({
            where:{userId:user.id}
          })
          await prisma.cart.update({
          where :{id:cart.id},
          data : {userId:user.id}
        })
        }


     
        
        }
      }
    }
     if(session?.user && trigger === 'update'){
      token.name = session.user.name
    }
   
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({request,auth}:any){

      const protectedPath = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/user\/(.*)/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/
      ]
      const {pathname} = request.nextUrl;

        if(!auth && protectedPath.some(path => path.test(pathname))) return false;

        
      //for setting cart session Id cookie
      if(!request.cookies.get('cartSessionId')){
        
        const sessionId = crypto.randomUUID();
        
        const newRequestHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request:{
            headers:newRequestHeaders
          
          }
        });

        //setting the session Id cookie
        response.cookies.set('cartSessionId', sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });

        return response
      }else{
        return true
      }
    }
  },
});

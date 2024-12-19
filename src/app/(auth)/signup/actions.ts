"user server"

import { lucia } from "@/auths"
import prisma from "@/lib/prisma"
import { signUpSchema, SignUpValue } from "@/lib/validation"
import { generateIdFromEntropySize } from "lucia"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { hash } from "@node-rs/argon2"

export async function signup(
    credentials: SignUpValue

): Promise<{error: string}>{
    try{
        const {username, email, password} = signUpSchema.parse(credentials)

        const passwordHash = await hash(password,{
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })

        const userId = generateIdFromEntropySize(10);
            
         const existingUsername = await prisma.user.findFirst({   
            where: {
                username: {
                    equals: username,
                    mode: "insensitive",
                }
            }
        })

        if(existingUsername){
            return{
                error: "Username already taken"
            }
        }

        const existingEmailAddress = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive"
                }
            }
        })
        if(existingEmailAddress){
            return{
        error: "Email address already taken"
    }
}

  await prisma.user.create({
    data:{
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash
    }
  })

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id)
  ;(await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect('/')
    }catch(error){
        console.error(error);
        return{
            error: "Something went wrong. Please try again"
        }
    }
}

    

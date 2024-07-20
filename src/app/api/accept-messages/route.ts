import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"User not login"
        },{status:400})
    }
    const userId = user._id
    const {acceptMessages}=await request.json()
    try {
       const UpdatedUser = await UserModel.findByIdAndUpdate(
            user,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if(!UpdatedUser){
            return Response.json({
                success:false,
                message:"User not found"
                },
                {status:401}
            )}
            
            return Response.json({
                success:true,
                message:"Messages acceptance status updated successfully"
                },
                {status:200}
            )
            
        
    } catch (error) {
        console.error("Failed to update user status to accept messages",error)
        return Response.json({
            success:false,
            message:"Failed to update user status to accept messages"
        },{status:500})
    }
}
export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user :User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"User not login"
        },{status:400})
    }
    const userId = user._id
   try {
     const foundUser = await UserModel.findById(userId)
     if(!foundUser){
         return Response.json({
             success:false,
             message:"User not login"
         },{status:404})
     }
     
         return Response.json({
             success:true,
             isAcceptingMessage: foundUser.isAcceptingMessage    
         },{status:200})
         
   } catch (error) {
    console.error("Error is getting message acceptance status",error)
    return Response.json({
        success:false,
        message:"Failed to update user status to accept messages"
    },{status:500})
   }
}
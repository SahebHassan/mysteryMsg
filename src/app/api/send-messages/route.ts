import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()

    const{username,content}=await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        //is accepting message
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User not accepting message"
            },{status:403})
        }
        const newMessages = {content, createdAt : new Date()}
        user.messages.push(newMessages as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"Message send successfully"
        },{status:200})
    } catch (error) {
        console.log("Error addind message")
        return Response.json({
            success:false,
            message:"Error addind message"
        },{status:500})
    }
}
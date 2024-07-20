import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import  bcrypt  from "bcryptjs"


export async function POST(request:Request){
    await dbConnect()

    try {
        const{username,email,password}=await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username already exists"
            },
            {
                status:400
            })
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 +Math.random()* 900000).toString()

        if (existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "User already exist with this email"
                },{status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password= hashedPassword,
                existingUserByEmail.verifyCode= verifyCode,
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                password:hashedPassword,
                email,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage : true,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse= await sendVerificationEmail(
            username,
            email,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:400})
        }
        return Response.json({
            success:true,
            message: "User registered Sucessfully. Please verify the email"
        },{status:201})
        
    } catch (error) {
        console.error("Error during registering user");
        return Response.json(
            {
                success:false,
                message:"Error during registring user"
            },
            {
                status:500
            }
        )}
        
    }

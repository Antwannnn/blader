import User from '@models/user';
import { connectToDatabase } from "@utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(request){
    const { name, email, image } = await request.json();
    console.log( name, email, image);
    try{
        await connectToDatabase();
        const userExists = User.findOne({email: email});
        if(!userExists){
            await User.create({ name, email, image });
            return new Response("User created", {status: 201});
        } else {
            return new Response("User already exists", {status: 200});
        }


    } catch(error){
        console.log(error);
        return new Response("An error occurred", {status: 500});
    }
}
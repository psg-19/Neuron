import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { slug } = await req.json();
    try{
        const contractPath = path.join(process.cwd(),`${slug}.sol`);
        if(!fs.existsSync(contractPath)){
            return NextResponse.json({error: "Contract not found"}, {status: 404});
        }
        const contract = fs.readFileSync(contractPath, "utf-8");
        return NextResponse.json({contract}, {status: 200});
    }
    catch(err){
        return NextResponse.json({error: "Contract not found"}, {status: 404});
    }
}
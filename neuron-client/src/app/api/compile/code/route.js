import path from "path";
import fs from "fs";

export async function POST(req) {
    const { slug } = await req.json();
    const contractPath = path.join(process.cwd(),`${slug}.sol`);
    if(!)
}
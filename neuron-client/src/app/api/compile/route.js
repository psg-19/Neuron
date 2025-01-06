import { NextResponse } from "next/server";
import solc from "solc";

export async function POST(request) {
  try {
    const data = await request.json();
    const { sources } = data;
    console.log(sources);

    if (!sources || typeof sources !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const input = {
      language: "Solidity",
      sources,
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      const errors = output.errors.map((err) => err.formattedMessage).join("\n");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    return NextResponse.json({ compiled: output });
  } catch (error) {
    console.error("Compilation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
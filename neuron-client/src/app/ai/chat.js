import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDeL4VNEsyYacR1YX7zi8W-LxBKYdcFzMk");
let chat = null;
function initializeModel(code) {
  let codeJSON = { data: code };
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an AI helper for an IDE coding platform in .sol.Your prmary role is to execute functions, the user will pass function and its arguments...you have to give the desired output by reading the provided code.
    Here is the code of available ${JSON.stringify(codeJSON)}. From temp object you will get function name and arguments. You will also get an object named data,you will get existing varibale values inside it. Return data object only in josn format. You have to update the variable or create new ones if not present inside it after executing the function.
    If data is being read and vairbale is not present in data then return object with null inside it but first try to read data from inside. Also give another key as return as name of variable which is being returned inside that function(if none then give null).`,
    generationConfig: {
      maxOutputTokens: 350,
    },
  });
  const chat = model.startChat();
  return chat;
}

export async function resolveQuery(data,temp, code) {
  if (!chat) {
    chat = initializeModel(code);
  }
  const result = await chat.sendMessage(`${JSON.stringify(temp)}, ${JSON.stringify(data)}`);
  const response = await result.response;
  const texts = response.text();
  const cleanString = texts.replace(/```json|```/g, "").trim();
  console.log(cleanString);
  return cleanString;
}

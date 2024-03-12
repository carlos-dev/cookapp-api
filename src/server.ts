import express, { Request } from "express";
import bodyParser from "body-parser";
import { RsnChat } from "rsnchat";

const app = express();
const rsnchat = new RsnChat(process.env.CHAT_GPT_API_KEY);

app.use(bodyParser.json());

function formatIngredients(ingredientsList: string[]): string {
  if (ingredientsList.length === 0) {
    return "";
  }

  const formattedList = ingredientsList.join(", ");
  const lastIndex = formattedList.lastIndexOf(",");

  if (lastIndex !== -1) {
    return `${formattedList.slice(0, lastIndex)} e${formattedList.slice(
      lastIndex + 1
    )}`;
  }

  return formattedList;
}

app.post("/", async (req: Request, res) => {
  try {
    const ingredients = req.body.ingredients as string[];
    if (!ingredients || !Array.isArray(ingredients)) {
      throw new Error("A lista de ingredientes não é válida.");
    }
    console.log(req.body);
    const formattedIngredients = formatIngredients(ingredients);

    res.send("Hello World!");
    const gptResponse = await rsnchat.gpt(
      `Com esses ingredientes ${formattedIngredients} qual receita posso fazer? Descreva o passo a passo de uma receita com esses ingredientes.`
    );
    console.log(gptResponse.message);

    return gptResponse.message;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro:", error.message);
    }
    res.status(500).send("Erro interno no servidor.");
  }
});

export { app };

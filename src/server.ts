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

    const formattedIngredients = formatIngredients(ingredients);

    const geminiResponse = await rsnchat.gemini(
      `Dadas as seguintes condições, gostaria de receber uma ou mais receitas que possam ser preparadas apenas com os seguintes ingredientes: ${formattedIngredients}. Cada receita deve ser representada como um objeto contendo os seguintes campos: name, description, minutes, e steps. O campo name deve conter o nome da receita, description deve conter uma breve descrição da receita, minutes deve conter o tempo estimado de preparo da receita em minutos, e steps deve ser um array contendo os passos para preparar a receita. Por favor, forneça apenas o array de receitas, sem qualquer conteúdo adicional antes ou depois.`
    );

    console.log(geminiResponse.message);

    res.json({ data: JSON.parse(geminiResponse.message) });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro:", error.message);
    }
    res.status(500).send("Erro interno no servidor.");
  }
});

export { app };

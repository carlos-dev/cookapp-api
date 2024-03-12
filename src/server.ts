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

    const gptResponse = await rsnchat.gpt(
      `Com esses ingredientes ${formattedIngredients} qual receita posso fazer? Descreva o passo a passo receitas com esses ingredientes. Além disso, quero que sua resposta seja array de receitas, onde cada item será um objeto com os campos: name, descritpion, minutes, e steps. O campo name deve conter o nome da receita, o campo description deve conter a descrição da receita, o campo minutes deve conter o tempo de preparo da receita, e o campo steps deve conter um array com os passos da receita. Preciso que sua resposta seja apenas os array de receitas, pois vou mandar para o front end da minha aplicação, então não escreva nada antes ou após os arrays
      `
    );
    console.log(gptResponse.message);

    res.json({ data: gptResponse.message });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro:", error.message);
    }
    res.status(500).send("Erro interno no servidor.");
  }
});

export { app };

import inquirer from "inquirer";

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: "confirm",
    name: "submit",
    message: "Create order on IPFS?",
    prefix: "📦"
  }
];

export async function confirmOrder(): Promise<boolean> {
  const { submit } = await prompt(questions);
  return submit;
}

import inquirer from "inquirer";

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: "input",
    name: "signature",
    describe: "Add your signature:",
    prefix: "🔏"
  }
];

export async function getSignature(): Promise<string> {
  const { signature } = await prompt(questions);
  return signature;
}

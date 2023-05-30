import inquirer from "inquirer";

const prompt = inquirer.createPromptModule();

const questions = [
  {
    type: "list",
    name: "format",
    describe: "How would you like to sign this order?",
    choices: ["message", "psbt"],
    prefix: "🔏"
  }
];

export async function getSignatureFormat(): Promise<"message" | "psbt"> {
  const { format } = await prompt(questions);
  return format;
}

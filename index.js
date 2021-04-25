#!/usr/bin/env node

const fs = require("fs");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const readline = require("readline");
const VARIANT_ANSWER = ["1", "2"];
const {
  getRandomNumber,
  variantAnswer,
  checkFileName,
  setLog,
  game,
  errors,
} = require("./modules.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = yargs(hideBin(process.argv))
  .option("name", {
    alias: "filename",
    demandOption: true,
    describe: "Название файла для лога игры",
    type: "string",
  })
  .check((argv) => {
    const result = checkFileName(argv.filename);
    if (result.hasError) {
      errors(result.msg);
      process.exit(-1);
    }
    if (result.msg) {
      console.log(result.msg);
    }
    rl.setPrompt("Начинаем игру \n");
    rl.prompt();
    return true;
  })
  .strict()
  .help().argv;

rl.output.write(
  `Введите ответ ${VARIANT_ANSWER[0]}-Орел или ${VARIANT_ANSWER[1]}-Решка \n`
);
let answers = [];

rl.on("line", (answer) => {
  const targetNumber = getRandomNumber(VARIANT_ANSWER);

  let logAnswer = {
    date: new Date().toLocaleString("ru-RU"),
    targetNumber,
    answer,
  };

  if (!VARIANT_ANSWER.includes(answer)) {
    setLog(logAnswer, "errors");
    errors("Недопустимое число, игра закончена");
  }

  const { msg, isWin } = game(answer, targetNumber);
  answers.push({ ...logAnswer, isWin });

  console.log(msg);
});

process.on("exit", () => {
  if (!answers.length) return;

  setLog(answers, options.filename);
});

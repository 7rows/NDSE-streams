const fs = require("fs");
const path = require("path");

const DIR = "log";

const generateRandomNum = (variant) =>
  variant[Math.floor(Math.random() * variant.length)].toString();

const createDirectory = () => {
  let msg = "";
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);
    msg = "директория для логирования создана";
  }
  return msg;
};

const checkFileName = (fileName) => {
  let hasError = false;
  let msg = "";
  if (!fileName) {
    hasError = true;
    msg = "Имя файла не должно быть пустым";
  } else {
    msg = createDirectory();
  }

  return { hasError, msg };
};

const game = (answer, number) => {
  let isWin = false;
  let msg = "";
  if (answer !== number) {
    msg = `Вы не угадали! Загаданное число ${number}, ваше ${answer}`;
  } else {
    msg = `Вы угадали! Загаданное число ${number}, ваше ${answer}`;
    isWin = true;
  }
  return { msg, isWin };
};
const getFilePath = (filename) => path.join(__dirname, DIR, `${filename}.json`);
const storeWriteData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const storeAppendData = (data, path) => {
  try {
    fs.appendFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const setLog = (log, fileName) => {
  const file = getFilePath(fileName);
  if (fs.existsSync(file)) {
    storeAppendData({ date: new Date().toDateString(), log }, file);
  } else {
    storeWriteData({ date: new Date().toDateString(), log }, file);
  }
};

const errors = (errorText) => {
  console.error(errorText);
  process.exit(-1);
};

module.exports = {
  getRandomNumber: generateRandomNum,
  checkFileName,
  game,
  setLog,
  errors,
};

const readline = require('readline');
let rl = null;

let { questions } = require('./qConfig');

function _createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function _askQuestion(question, key, defaultValue, resolve) {
  rl.question(question, (value) => {
    valueMap[key] = ((value == null || value === '') ? defaultValue : value);
    resolve({ valueMap, rl });
  });
}

async function _runWizard(callback) {
  const questionOb = quesGen.next();
  const response = await ask(questionOb.value);
  if (questionOb.done) {
    if (typeof callback === 'function') {
      const result = answers(response);
      callback(result);
    }
  } else {
    _runWizard(callback);
  }
}

function* quesGenFn() {
  for (const q of questions) {
    yield q;
  }
}

let quesGen = quesGenFn();

let valueMap = {};

function ask({ question = '', defaultValue, key = question } = {}) {
  if (typeof question !== 'string') throw new TypeError('Question should be valid string');
  return new Promise((resolve, reject) => {
    if (!question.trim()) {
      resolve({ valueMap, rl });
    } else {
      const formattedQues = defaultValue ? `${question} (${defaultValue}) ` : `${question} `;
      try {
        _askQuestion(formattedQues, key, defaultValue, resolve);
      } catch (e) {
        rl = _createInterface();
        _askQuestion(formattedQues, key, defaultValue, resolve);
      }
    }
  });
}

function answers({ valueMap, rl }) {
  rl.close();
  const questions = [];
  for (key in valueMap) {
    questions.push({
      key,
      answer: valueMap[key]
    });
  }
  valueMap = null;
  return questions;
}

// Run question wizard to read from config
function _wizard(callback, config) {
  if (config) {
    questions = config.questions;
    quesGen = quesGenFn();
  }
  _runWizard(callback);
}

function wizard(config) {
  return new Promise(function (resolve, reject) {
    if (rl === null) {
      _wizard(resolve, config);
    } else if (rl) {
      try {
        if (rl.closed) throw new Error('01: Attempt to re-run wizard on existing steam');
      } catch (e) {
        reject(e.message);
      }
    }
  });
}

exports.ask = ask;
exports.answers = answers;
exports.wizard = wizard;

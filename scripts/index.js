const sys = require('sys')
const exec = require('child_process').exec
const child

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN
const deployCmd = process.env.DEPLOY_CMD

// Setup polling way
const bot = new TelegramBot(token, {polling: true});

// Matches /deploy [whatever]
bot.onText(/\/run (.+)/, (msg, match) => {
  //const fromId = msg.from.id;
  const fromId = msg.chat.id
  const resp = match[1]

  if (isNaN(resp)) {
    resp = 900
  }

  bot.sendMessage(fromId, "Daddy, I will ping you after " + resp + " seconds")
  setTimeout( () => {
    bot.sendMessage(fromId, "Daddy, let's come home and feed me");
  }, resp * 1000)
})

// Matches /deploy [whatever]
bot.onText(/\/deploy (.+)/, (msg, match) => {
  //const fromId = msg.from.id;
  const fromId = msg.chat.id
  const resp = match[1]

  const child = exec(deployCmd,
           (error, stdout, stderr) => {
             if (error !== null) {
               console.log(`exec error: ${error}`)
             }
             bot.sendMessage(fromId, `Daddy, Deployment is done. \n ${stderr} ${stdout}`)
           })
  bot.sendMessage(fromId, "Daddy, I'm sleeping, will deploy in 5 mins")
})

bot.onText(/\/server (.+)/, (msg, match) => {
  //const fromId = msg.from.id;
  const fromId = msg.chat.id
  const deployCmd = match[1]

  const cmdMap = {
    'mem': 'free',
    'disk': 'df',
    'mount': 'mount',
  }

  const child = exec(cmdMap[deployCmd],
           (error, stdout, stderr) => {
             if (error !== null) {
               console.log(`exec error: ${error}`)
             }
             bot.sendMessage(fromId, `Daddy, server ${deployCmd}. \n ${stderr} ${stdout}`)
           })
})

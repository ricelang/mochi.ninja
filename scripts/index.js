var sys = require('sys')
var exec = require('child_process').exec
var child

var TelegramBot = require('node-telegram-bot-api');

var token = process.env.TELEGRAM_TOKEN
var deployCmd = process.env.DEPLOY_CMD

// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /deploy [whatever]
bot.onText(/\/run (.+)/, function (msg, match) {
  console.log(msg)
  //var fromId = msg.from.id;
  var fromId = msg.chat.id;
  var resp = match[1];
  console.log(resp)

  if (isNaN(resp)) {
    resp = 900
  }
  bot.sendMessage(fromId, "Daddy, I will ping you after " + resp + " seconds");
  setTimeout(function() {
    bot.sendMessage(fromId, "Daddy, let's come home and feed me");
  }, resp * 1000)

});

// Matches /deploy [whatever]
bot.onText(/\/deploy (.+)/, function (msg, match) {
  console.log(msg)
  //var fromId = msg.from.id;
  var fromId = msg.chat.id;
  var resp = match[1];
  console.log(msg)

  const child = exec(deployCmd,
           (error, stdout, stderr) => {
             console.log(`stdout: ${stdout}`);
             console.log(`stderr: ${stderr}`);
             if (error !== null) {
               console.log(`exec error: ${error}`);
             }
             bot.sendMessage(fromId, `Daddy, Deployment is done. \n ${stderr} ${stdout}`);
           })
  bot.sendMessage(fromId, "Daddy, I'm sleeping, will deploy in 5 mins");
});

bot.onText(/\/server (.+)/, function (msg, match) {
  console.log(msg)
  //var fromId = msg.from.id;
  var fromId = msg.chat.id;
  var deployCmd = match[1];
  console.log(msg)

  var cmdMap = {
    'mem': 'free',
    'disk': 'df',
    'mount': 'mount',
  }

  const child = exec(cmdMap[deployCmd],
           (error, stdout, stderr) => {
             console.log(`stdout: ${stdout}`);
             console.log(`stderr: ${stderr}`);
             if (error !== null) {
               console.log(`exec error: ${error}`);
             }
             bot.sendMessage(fromId, `Daddy, server ${deployCmd}. \n ${stderr} ${stdout}`);
           })
});


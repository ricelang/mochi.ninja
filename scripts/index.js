var sys = require('sys')
var exec = require('child_process').exec
var child

var TelegramBot = require('node-telegram-bot-api');

var token = process.env.TELEGRAM_TOKEN
var deployCmd = process.env.DEPLOY_CMD
var weatherToken = process.env.OPENWEATHERMAP

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

bot.onText(/\/quote (.+)/, function (msg, match) {
  console.log(msg)
  //var fromId = msg.from.id;
  var fromId = msg.chat.id;
  var q = match[1];
  var cmd = "curl -s -XPOST -d 'method=getQuote&key=457653&format=json&lang=en' http://api.forismatic.com/api/1.0/ | jq '.[\"quoteText\"]'"

  const child = exec(cmd,
           (error, stdout, stderr) => {
             console.log(`stdout: ${stdout}`);
             console.log(`stderr: ${stderr}`);
             if (error !== null) {
               console.log(`exec error: ${error}`);
             }
             bot.sendMessage(fromId, `${stderr} ${stdout}`);
           })
});

bot.onText(/\/lapa (.+)/, function (msg, match) {
  console.log(msg)
  //var fromId = msg.from.id;
  var fromId = msg.chat.id;
  var q = match[1];
  var page = Math.floor(Math.random() * 10) + 1
  if (q == 'random') {
	  if (page == 1) {
	    page = ""
	   } else {
	    page = "page/" + page + "/"
	  }
  } else {
    page = Math.floor(Math.random() * 10) + 1
    if ( q == 'app') {
      page = "category/app/page/" + page     
    } else {
      page = "category/" + q + "/"
    }
  }
  
  var cmd = "curl -s http://lapa.ninja/" + page + " | grep \"data-original\" | awk '{print $3}' | awk -F = '{print $2}' | sed  's/\"//g' | shuf -n 21 | head -n 1"
  console.log(cmd) 

  const child = exec(cmd,
           (error, stdout, stderr) => {
             console.log(`stdout: ${stdout}`);
             console.log(`stderr: ${stderr}`);
             if (error !== null) {
               console.log(`exec error: ${error}`);
             }
             bot.sendMessage(fromId, `http://lapa.ninja/${stdout}`);
           })
});


bot.onText(/\/weather (.+)/, function (msg, match) {
  var fromId = msg.chat.id
  var q = match[1]
  var cmd = "curl -s \"http://api.openweathermap.org/data/2.5/weather?q=" + q + "&APPID=" +  weatherToken + "\" | jq -r '.'"

  const child = exec(cmd,
           (error, stdout, stderr) => {
             console.log(`stdout: ${stdout}`)
             bot.sendMessage(fromId, `${stderr} ${stdout}`)
           })
});



// Any kind of message
//bot.on('message', function (msg) {
//  console.log(msg)
//  var chatId = msg.chat.id;
//  // photo can be: a file path, a stream or a Telegram file_id
//  var photo = 'cats.png';
//  bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
//});


const linebot = require('linebot');
const express = require('express');
const line = require('@line/bot-sdk');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();
app.post('/linewebhook', linebotParser);

const linebotParser = bot.parser();

const message = {
	type: 'text',
	text: 'Hello World!'
};

/*
app.get('/',function(req,res){
    res.send('Succeed!');
});
*/

const message = {
	type: 'text',
	text: 'Hello World!'
};

reply_token = params['events'][0]['replyToken']

bot.replyMessage(reply_token, message)
  .then(() => {
    console.log('Success');
})
  .catch((err) => {
    console.log('Error', error);
  });

/*
//--reply the same message--
bot.on('message', function (event) {
	event.reply(event.message.text).then(function (data) {
		console.log('Success', data);
	}).catch(function (error) {
		console.log('Error', error);
	});
});*/
//--------------------------

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});
'use strict';

var linebot = require('linebot');
const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables

var bot = linebot({
  channelId: '1593876483',
  channelSecret: '01ac1bb252593c63605da3942b9baabc',
  channelAccessToken: 'g93gFjGS2nxtZtwdGYwFg2Sd+i7eO7C1imlK96heyVGV76dLwRPXO1qseNi4R7poSpv3P1KnNsQle4MStyTrTgd8O2eGK+6yUnJkTELfeQPp1y9hj/MB+S03z99VpKL3IO8JUbuS2G7jRwJ8WqmKSgdB04t89/1O/w1cDnyilFU='
});


// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);

//--------------------------------
// 可直接取用檔案的資料夾
//--------------------------------
app.use(express.static('public'));

//--------------Main Start---------------------

//--------------------------
  // 機器人接受回覆的處理
  //--------------------------
  bot.on('postback', function(event) { 
    var data = event.postback.data;
    var userId = event.source.userId;

    event.source.profile().then(function (profile) {
        userName = profile.displayName;
    
        return event.reply([
            {
                "type": "text",
                "text": data
            },
            {
                "type": "text",
                "text": userId
            },
            {
                "type": "text",
                "text": userName
            }
        ]);		
    });
  });

  //--------------------------------
// 機器人接受訊息的處理
//--------------------------------
bot.on('message', function(event) {
	event.reply({
        "type": "template",
        "altText": "This is a buttons template",
        "template": {
            "type": "buttons",
            "thumbnailImageUrl": "https://test0921107511.herokuapp.com/imgs/1.jpg",
            "imageAspectRatio": "rectangle",
            "imageSize": "cover",
            "imageBackgroundColor": "#FFFFFF",
            "title": "這是什麼花?",
            "text": "是菊科向日葵屬的植物。別名太陽花。",
            "defaultAction": {
                "type": "uri",
                "label": "檢視網頁",
                "uri": "https://zh.wikipedia.org/wiki/向日葵"
            },
            "actions": [
                {
                    "type": "postback",
                    "label": "鳶尾花",
                    "data": "1"
                },
                {
                    "type": "postback",
                    "label": "向日葵",
                    "data": "2"
                }				
            ]
        }
    });
});


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
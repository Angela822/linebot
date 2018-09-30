//--------------------------------
// 載入必要的模組
//--------------------------------
var linebot = require('linebot');
//const line = require('@line/bot-sdk');
const express = require('express');

//--------------------------------
// 填入自己在linebot的channel值
//--------------------------------
var bot = linebot({
    channelId: '1593876483',
    channelSecret: '01ac1bb252593c63605da3942b9baabc',
    channelAccessToken: 'g93gFjGS2nxtZtwdGYwFg2Sd+i7eO7C1imlK96heyVGV76dLwRPXO1qseNi4R7poSpv3P1KnNsQle4MStyTrTgd8O2eGK+6yUnJkTELfeQPp1y9hj/MB+S03z99VpKL3IO8JUbuS2G7jRwJ8WqmKSgdB04t89/1O/w1cDnyilFU='
  });


//--------------------------
// 機器人接受回覆的處理
//--------------------------
bot.on('message',function(event) {
    switch(event.message.text){
        case '你會做什麼' :
            return event.reply({
                "type": "template",
                "altText": "我會做這些事...",
                "template": {
                    "type": "buttons",
                    "title": "我會做這些事",
                    "text": "請選擇",
                    "actions": [
                        {
                        "type": "message",
                        "label": "我有要查的書!",
                        "text": "我有要查的書!"
                        },
                        {
                        "type": "message",
                        "label": "好想找本書看ㄚ~",
                        "text": "好想找本書看ㄚ~"
                        },
                        {
                        "type": "message",
                        "label": "讓機器人推薦給你吧",
                        "text": "讓機器人推薦給你吧"
                        },
                        {
                        "type": "uri",
                        "label": "快來看看Take Book網站",
                        "uri": "http://140.131.114.176/"
                        }
                    ]
                }
            });
            break;
        
        case '我有要查的書!' :
            return event.reply({
                "type": "template",
                "altText": "查詢",
                "template": {
                    "type": "buttons",
                    "text": "查詢",
                    "actions": [
                        {
                        "type": "message",
                        "label": "關鍵字找書",
                        "text": "關鍵字找書"
                        }
                    ]
                } 
            });
            break;
s
        default:
            return event.reply({
                "type": 'template', 
                "altText": "你可以試著打'你會做什麼'",
                "template": {
                    "type": "buttons",
                    "title": "你可以試著打'你會做什麼'",
                    "text": "請選擇",
                    "actions": [
                        {
                        "type": "message",
                        "label": "你會做什麼",
                        "text": "你會做什麼"
                        }
                    ]
                }
            })
    }


});



//--------------------------------
// 建立一個網站應用程式app
// 如果連接根目錄, 交給機器人處理
//--------------------------------
const app = express();
const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);


//--------------------------------
// 可直接取用檔案的資料夾
//--------------------------------
app.use(express.static('public'));


//--------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//--------------------------------
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log("正在監聽埠號:", port);
});
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

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/linewebhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

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

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  // create a echoing text message
  const echo = { 
		"type": 'template', 
    //text: '你可以試著打"你會做什麼"'//event.message.text 
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
  }
　
  //收集使用者的喜好
  const habit = {
    "type": "template",
    "altText": "喜歡這本書嗎?",
    "template": {
      "type": "confirm",
      "text": "喜歡這本書嗎?",//提示字，會出現在選項的上面
      "actions": [
        {
          "type": "postback",
          "label": "喜歡",
          "data": "1"
        },
        {
          "type": "postback",
          "label": "不喜歡",
          "data": "0"
        }
      ]
    }
  }

  //查詢
  const require = {
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
  }

  //找書
  const findBook = {
    "type": "template",
    "altText": "找書",
    "template": {
        "type": "buttons",
        "text": "找書",
        "actions": [
            {
              "type": "message",
              "label": "用類別找書",
              "text": "用類別找書"
            },
            {
              "type": "message",
              "label": "新書",
              "text": "新書"
            },
            {
              "type": "message",
              "label": "書本排行榜",
              "text": "書本排行榜"
            }
        ]
    }
  }

  //用類別找書
  const typeBook = {
    type: 'text',
    text: '我想看：XX,XX,XX (Ex.我想看：文學,生活風格,藝術設計)'
  }

  const typeFalse = {
    type: 'text',
    text: '你這樣不對喔，要按照格式打~'
  }

  const typeTrue = {
    type: 'text',
    text: '好的好的~'
  }

  //新書推薦
  const newBook = {
    "type": "template",
    "altText": "新書推薦",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/我有破壞自己的權利.jpg",
              "imageAspectRatio": "rectangle",
              "imageSize": "cover",
              "imageBackgroundColor": "#FFFFFF",
              "title": "<<我有破壞自己的權利>>",
              "text": "類別：文學",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://140.131.114.176/"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "Like or Dislike?",
                      "text": "Like or Dislike?"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "https://www.books.com.tw/products/0010794069?loc=P_011_0_101"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/甜素烘焙實驗室.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<甜素烘焙實驗室>>",
              "text": "類別：飲食料理",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://140.131.114.176/"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "Like or Dislike?",
                      "text": "Like or Dislike?"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010794498?loc=P_016_0_102"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/願你的深情，能被溫柔以待.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<願你的深情，能被溫柔以待>",
              "text": "類別：心理勵志",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://140.131.114.176/"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "Like or Dislike?",
                      "text": "Like or Dislike?"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010794010?loc=P_017_005"
                  }
              ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
    }
  }

  //機器人推薦書本
  const recommend = {
    "type": "template",
    "altText": "推薦給您...",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/没問題，我可以搞定.jpg",
              "imageBackgroundColor": "#FFFFFF",
              "title": "<<没問題，我可以搞定>>",
              "text": "類別：生活教育",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://140.131.114.176/"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "Like or Dislike?",
                      "text": "Like or Dislike?"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010792988?loc=P_002_012"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/讓男人追著妳跑.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<讓男人追著妳跑>>",
              "text": "類別：心理勵志",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://140.131.114.176/"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "Like or Dislike?",
                      "text": "Like or Dislike?"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010779366?loc=P_002_001"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/跟著阿滴滴妹說出溜英文.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<跟著阿滴滴妹說出溜英文>",
              "text": "類別：語言／字辭典",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://140.131.114.176/"
              },
              "actions": [
                  {
                      "type": "message",
                      "label": "Like or Dislike?",
                      "text": "Like or Dislike?"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010790130?loc=P_002_017"
                  }
              ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
    }
  }

  //takebook機器人功能選單
  const botMenu = {
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
              "label": "告訴我你想看什麼類的書吧",
              "text": "讓機器人推薦給你吧"
            },
            {
              "type": "uri",
              "label": "快來看看Take Book網站",
              "uri": "http://140.131.114.176/"
            }
        ]
    }
  }

  /*Wrong 
  const chooseType = [];
  chooseType.push(event.postback.postback.data);
  */

  //----------關鍵字回覆---------------
  var received_text = event.message.text;

  if(received_text == 'Like or Dislike?'){
    return client.replyMessage(event.replyToken, habit);
  }else if(received_text == '讓機器人推薦給你吧'){
    return client.replyMessage(event.replyToken, recommend);
  }else if(received_text == '你會做什麼'){
    return client.replyMessage(event.replyToken, botMenu);
  }else if(received_text == '好想找本書看ㄚ~'){
    return client.replyMessage(event.replyToken, findBook);
  }else if(received_text == '新書'){
    return client.replyMessage(event.replyToken, newBook);
  }else if(received_text == '我有要查的書!'){
    return client.replyMessage(event.replyToken, require);
  }else if(received_text == '用類別找書'){
    return client.replyMessage(event.replyToken, typeBook);
  }else if(received_text.substring(0,4) == '我想看：'){
    return client.replyMessage(event.replyToken, typeTrue);
  }
  // use reply API
  return client.replyMessage(event.replyToken, echo);
  
  /*
  if(received_text.substring(0,4) == '我想看：'){
    return client.replyMessage(event.replyToken, typeTrue);
  }else{
    return client.replyMessage(event.replyToken, typeFalse);
  }
  */


  //-------------------------------
  /*
  const bookType = event.postback.postback.data;
  if(bookType == 'bookType=01'){
    return client.replyMessage(event.replyToken, '文學');
  }*/
   
}

//--------------Main End---------------------

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
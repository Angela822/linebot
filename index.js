'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
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
//--------------Main---------------------

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
  };
　
  //收集使用者的喜好
  const habit = {
    "type": "template",
    "altText": "Like or Dislike?",
    "template": {
      "type": "confirm",
      "text": "喜歡這本書嗎?",//提示字，會出現在選項的上面
      "actions": [
        {
          "type": "message",
          "label": "Like",
          "text": "like"
        },
        {
          "type": "message",
          "label": "Dislike",
          "text": "dislike"
        }
      ]
    }
  };

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
              "label": "推薦書本",
              "text": "推薦書本"
            }
        ]
    }
  }

  //推薦書本
  const recommend = {
    "type": "template",
    "altText": "推薦給您...",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#FFFFFF",
              "title": "<<没問題，我可以搞定>>",
              "text": "類別：生活教育",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://takebook107511.herokuapp.com/"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Like",
                      "data": "action=buy&itemid=111"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010792988?loc=P_002_012"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<讓男人追著妳跑>>",
              "text": "類別：心理勵志",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://takebook107511.herokuapp.com/"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Like",
                      "data": "action=buy&itemid=222"
                  },
                  {
                      "type": "uri",
                      "label": "看更多...",
                      "uri": "http://www.books.com.tw/products/0010779366?loc=P_002_001"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<跟著阿滴滴妹說出溜英文>",
              "text": "類別：語言／字辭典",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://takebook107511.herokuapp.com/"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Like",
                      "data": "action=buy&itemid=222"
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
              "type": "postback",
              "label": "查詢",
              "data": "action=buy&itemid=123"
            },
            {
              "type": "message",
              "label": "找書",
              "text": "找書"
            },
            {
              "type": "uri",
              "label": "表單分析",
              "uri":"https://goo.gl/forms/usqTTQ8nyVnqfdqi1" //Google Forms:書本類型取向
            },
            {
              "type": "uri",
              "label": "瀏覽Take Book網站",
              "uri": "http://takebook107511.herokuapp.com/"
            }
        ]
    }
  }

  //----------關鍵字回覆---------------
  if(event.message.text == 'like'){
    return client.replyMessage(event.replyToken, habit);
  }else if(event.message.text == '推薦書本'){
    return client.replyMessage(event.replyToken, recommend);
  }else if(event.message.text == '你會做什麼'){
    return client.replyMessage(event.replyToken, botMenu);
  }else if(event.message.text == '找書'){
    return client.replyMessage(event.replyToken, findBook);
  }
  //-------------------------------

  // use reply API
  return client.replyMessage(event.replyToken, echo);

}

//--------------Main---------------------

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
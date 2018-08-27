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
//--------------Main Start---------------------

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
    "altText": "喜歡這本書嗎?",
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
            },
            {
              "type": "message",
              "label": "書本排行榜",
              "text": "書本排行榜"
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
              "label": "機器人推薦書本",
              "text": "機器人推薦書本"
            }
        ]
    }
  }

  //用類別找書
  const typeBook = {
    "type": "template",
    "altText": "用類別找書",
    "template": {
        "type": "buttons",
        "text": "用類別找書",
        "actions": [
            {
              "type": "postback",
              "label": "文學",
              "data": "bookType=01"
            },
            {
              "type": "postback",
              "label": "財經企管",
              "data": "bookType=02",
              "text": "財經企管"
            },
            {
              "type": "message",
              "label": "飲食料理",
              "text": "飲食料理"
            },
            {
              "type": "message",
              "label": "旅遊",
              "text": "旅遊"
            }
        ]
    }
  }

  //新書推薦
  const newBook = {
    "type": "template",
    "altText": "新書推薦",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://github.com/Angela822/linebot/blob/master/images/%E6%88%91%E6%9C%89%E7%A0%B4%E5%A3%9E%E8%87%AA%E5%B7%B1%E7%9A%84%E6%AC%8A%E5%88%A9.jpg",
              "imageBackgroundColor": "#FFFFFF",
              "title": "<<我有破壞自己的權利>>",
              "text": "類別：文學",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://takebook107511.herokuapp.com/"
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
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<甜素烘焙實驗室>>",
              "text": "類別：飲食料理",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://takebook107511.herokuapp.com/"
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
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#000000",
              "title": "<<願你的深情，能被溫柔以待>",
              "text": "類別：心理勵志",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://takebook107511.herokuapp.com/"
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
              "thumbnailImageUrl": "https://github.com/Angela822/linebot/blob/master/images/img01.jpg",
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
              "label": "查詢",
              "text": "查詢"
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
  if(event.message.text == 'Like or Dislike?'){
    return client.replyMessage(event.replyToken, habit);
  }else if(event.message.text == '機器人推薦書本'){
    return client.replyMessage(event.replyToken, recommend);
  }else if(event.message.text == '你會做什麼'){
    return client.replyMessage(event.replyToken, botMenu);
  }else if(event.message.text == '找書'){
    return client.replyMessage(event.replyToken, findBook);
  }else if(event.message.text == '新書'){
    return client.replyMessage(event.replyToken, newBook);
  }else if(event.message.text == '查詢'){
    return client.replyMessage(event.replyToken, require);
  }else if(event.message.text == '用類別找書'){
    return client.replyMessage(event.replyToken, typeBook);
  }else if(event.postback.data == 'bookType=01'){
    return client.replyMessage(event.replyToken, '文學');
  }
  //-------------------------------
  /*
  const bookType = event.postback.postback.data;
  if(bookType == 'bookType=01'){
    return client.replyMessage(event.replyToken, '文學');
  }*/
  
  // use reply API
  return client.replyMessage(event.replyToken, echo);

}

//--------------Main End---------------------

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
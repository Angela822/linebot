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
		type: 'text', 
		text: '收到!'//event.message.text 
  };

  const habit = {
    "type": "template",
    "altText": "This is a confirm template",
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

  const imageMessage = {
    "type": "template",
    "altText": "推薦給您...",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "http://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/079/29/0010792988.jpg&v=5b446ea1&w=348&h=348",
              "imageBackgroundColor": "#FFFFFF",
              "title": "<<没問題，我可以搞定>>",
              "text": "I can Hadle it",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/123"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&itemid=111"
                  },
                  {
                      "type": "postback",
                      "label": "Add to cart",
                      "data": "action=add&itemid=111"
                  },
                  {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/111"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "http://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/077/93/0010779366.jpg&v=5a7c42c9&w=348&h=348",
              "imageBackgroundColor": "#000000",
              "title": "<<讓男人追著妳跑>>",
              "text": "男には「愛の首輪」をつけなさい",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&itemid=222"
                  },
                  {
                      "type": "postback",
                      "label": "Add to cart",
                      "data": "action=add&itemid=222"
                  },
                  {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/222"
                  }
              ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
    }
  }

  if(event.message.text == '你會做什麼'){
    return client.replyMessage(event.replyToken, habit);
  }else if(event.message.text == '推薦什麼'){
    return client.replyMessage(event.replyToken, imageMessage);
  }

  // use reply API
  return client.replyMessage(event.replyToken, echo);

}

//--------------Main---------------------

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
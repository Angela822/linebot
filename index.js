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
    "altText": "image Message",
    "template": {
      "type": "carousel",
      "columns": [
        {
          "text": "推薦給您",
          "actions": [
            {
              "type": "message",
              "label": "讓男人追著妳跑",
              "text": "book01"
            }
          ]
        },
        {
          "text": "生活教育",
          "actions": [
            {
              "type": "message",
              "label": "没問題，我可以搞定",
              "text": "book02"
            }
          ]
        }
      ]
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
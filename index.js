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
    switch (event.message.type){
        //event.message.type==text
        case 'text' :
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
                
                case '好想找本書看ㄚ~' :
                    return event.reply({
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
                    });
                    break;
                
                case '用類別找書' :
                    return event.reply({
                        type: 'text',
                        text: '我想看：XX,XX,XX (Ex.我想看：文學,生活風格,藝術設計)'
                    });
                    break;
            
                case '新書' :
                    return event.reply({
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
                                        "label": "喜歡/不喜歡?",
                                        "text": "喜歡/不喜歡?"
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
                                        "label": "喜歡/不喜歡?",
                                        "text": "喜歡/不喜歡?"
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
                                        "label": "喜歡/不喜歡?",
                                        "text": "喜歡/不喜歡?"
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
                    })
                    break;

                case '讓機器人推薦給你吧' :
                    return event.reply({
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
                                        "label": "喜歡/不喜歡?",
                                        "text": "喜歡/不喜歡?"
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
                                        "label": "喜歡/不喜歡?",
                                        "text": "喜歡/不喜歡?"
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
                                        "label": "喜歡/不喜歡?",
                                        "text": "喜歡/不喜歡?"
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
                    })
                    break;

                case ''    

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
            break;
        
        //event.message.type==sticker
        case 'sticker' :
            event.reply({
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
            });
            break;
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
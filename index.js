//--------------------------------
// 載入必要的模組
//--------------------------------
var linebot = require('linebot');
//const line = require('@line/bot-sdk');
const express = require('express');
const { Client } = require('pg');

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
/*
//自訂function
function selectBook(profile) {	
    //取得使用者資料及傳回文字
    var userName = profile.displayName;
    var userId = profile.userId;
    var no = event.message.text;		

          //建立資料庫連線           
        var client = new Client({
            connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
            ssl: true,
        })
    
    client.connect(); 
}*/


//--------------------------
// 機器人接受回覆的處理
//--------------------------
bot.on('message',function(event) {           
      
    //event.message.type==text
    if (event.message.type == 'text'){      
        if (event.message.text == '你會做什麼'){
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
        }else if (event.message.text == '我有要查的書!'){
                return event.reply([
                    {
                        type: 'text', 
                        text: '好的!'
                    },
                    {
                        type: 'text', 
                        text: '請輸入書名'
                    }
                ]);
        }else if (event.message.text == '好想找本書看ㄚ~'){    
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
        }else if(event.message.text == '用類別找書'){
            return event.reply({
                type: 'text',
                text: '我想看：XX,XX,XX (Ex.我想看：文學,生活風格,藝術設計)'
            });
        }else if(event.message.text.substring(0,4) == '我想看：'){
            return event.reply([
                {
                    "type": "text",
                    "text": '收到了~'
                }
            ]);
        }else if(event.message.text == '新書'){
            event.source.profile().then(
                function (profile) {	
                           
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    
                    //查詢資料
                    //(資料庫欄位名稱不使用駝峰命名, 否則可能出錯)
                        client.query("select * from book ORDER BY date DESC", (err, results) => {    
                            console.log(results);
                            
                            //for(var i=0; i<9; i++){
                                //回覆查詢結果		
                                var type=results.rows[2].type;
                                var bookname=results.rows[2].bookname;
                                //var content=results.rows[i].content;
                                //event.reply(bookname1 + '\n' + bookname2 + '\n' + bookname3); 
                                
                                return event.reply({
                                    "type": "template",
                                    "altText": "新書推薦",
                                    "template": {
                                        "type": "carousel",
                                        "columns": [
                                            {
                                            "thumbnailImageUrl": "http://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/076/02/0010760228.jpg&v=597577d4&w=348&h=348",
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname +">>",
                                            "text": type,
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
                                });
                            //};
                            //關閉連線
                            client.end();
                        });  
                }
            );
            /*
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
            });*/
        }else if (event.message.text == '讓機器人推薦給你吧'){
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
        }else if (event.message.text == '喜歡/不喜歡?'){
            return event.reply({
                "type": "template",
                "altText": "喜歡這本書嗎?",
                "template": {
                    "type": "confirm",
                    "text": "喜歡這本書嗎?",
                    "actions": [
                    {
                        "type": "postback",
                        "label": "喜歡",
                        "data": "喜歡"
                    },
                    {
                        "type": "postback",
                        "label": "不喜歡",
                        "data": "不喜歡"
                    }
                    ]
                }
            })
        }else if (event.message.text == event.message.text){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userName = profile.displayName;
                    var userId = profile.userId;
                    var no = event.message.text;		
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    
                    //查詢資料
                    //(資料庫欄位名稱不使用駝峰命名, 否則可能出錯)
                        client.query("select * from book where bookname = $1", [no], (err, results) => {    
                            console.log(results);
                            
                            //回覆查詢結果
                            if (err || results.rows.length==0){
                                event.reply('查不到這本書耶( ´ﾟДﾟ`)'+'\n'+'要不要換個關鍵字或乾脆換本書?');
                            }else{						
                                var bookname=results.rows[0].bookname;
                                var content=results.rows[0].content;
                                event.reply(bookname +content);  
                            }
            
                            //關閉連線
                            client.end();
                        });  
                }
            );
        }else{
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
    }    
    //event.message.type==sticker
    else if (event.message.type == 'sticker'){
        event.reply([
        {
            type: 'text', 
            text: 'Hi！'
        },
        {
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
        }]);
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
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

//--------------------------------
// 加入
//--------------------------------
bot.on('follow', function (event){
    event.source.profile().then(
        function (profile) {

            //建立資料庫連線           
            var client = new Client({
                connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                ssl: true,
            })
            
            client.connect();

            var userId = event.source.userId;
            userName = profile.displayName;
            client.query("INSERT INTO users(userid, username)VALUES ($1, $2)",[userId,userName] ,(err, results) =>{
                if(err){
                    console.log('錯了!!!!!!!!!!!!!!!!!!'+err);
                }else{
                    console.log('Gooooooooooooooooooooood');
                }
                //關閉連線
                client.end();
            });
        }
    );
});

//-----------------------------------------
// 處理event.postback，喜歡/不喜歡button的資訊收集
//-----------------------------------------
bot.on('postback', function(event) { 
    event.source.profile().then(
        function (profile) {
            userName = profile.displayName;
            var type = event.postback.data.substring(3).trim(); //type
            //var type='商業理財';
            var userId = event.source.userId;
            var typeno;
            //將類別文字轉成數值(typeno)
            switch(type){
                case '商業理財':
                case '商業':
                case '理財':
                    typeno=1;
                    break;
                case '心理勵志':
                case '心理':
                case '勵志':
                    typeno=2;
                    break;
                case '文學':
                case '小說':
                case '文學小說':
                    typeno=3;
                    break;
                case '旅遊':
                    typeno=4;
                    break; 
                case '生活': 
                case '風格': 
                case '生活風格':
                    typeno=5;
                    break;
                case '藝術':
                case '設計':
                case '藝術設計':
                    typeno=6;
                    break;
                case '親子教養':
                case '親子':
                case '教育':
                    typeno=7;
                    break;
                case '語言':
                case '辭典':
                case '參考書':
                    typeno=8;
                    break;
                case '醫療保健':
                case '醫療':
                case '保健':
                    typeno=9;
                    break
                case '飲食':
                case '料理':
                case '飲食料理':
                    typeno=10;
                    break;
            }

            //建立資料庫連線           
            var client = new Client({
                connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                ssl: true,
            })
            
            client.connect();

            //--------------like-----------------
            if(event.postback.data.substring(0,3) == '我喜歡'){
                console.log(typeno+'!!!!!!!!!!!!!!!!!!!'+type)
                client.query("select * from userhabits a, type b  where a.typeno = b.typeno AND b.typename = $1 AND a.userid = $2 ",[type,userId] ,(err, results) =>{
                    if(err || results.rows.length==0){
                        client.query("insert into userhabits(userid,typeno,count)values($1,$2,101)",[userId,typeno], (err, results) =>{
                            if(err){
                                console.log('喜歡新增失敗'+userName);
                            }else{
                                console.log('喜歡新增成功'+userName);
                            }

                            //關閉連線
                            client.end();
    
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "知道了！你放心，我記住了" + "(≧▽≦)"
                                }
                            ]);
                        });
                    }else{
                        client.query("update userhabits set count = count + 1 where typeno = $1 AND userid = $2", [typeno,userId], (err, results) => {    
                            
                            //回覆查詢結果
                            if (err){
                                console.log('喜歡更新失敗'+userName);
                            }else{						
                                console.log('喜歡更新成功'+userName); 
                            }
    
                            //關閉連線
                            client.end();
    
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "知道了！你放心，我記住了" + "(≧▽≦)"
                                }
                            ]);
                        });
                    }
                });  
            //--------------------------------------------
            //-----------------dislike--------------------
            }else if(event.postback.data.substring(0,3) == '不喜歡'){
                console.log(typeno+'!!!!!!!!!!!!!!!!!!!'+type)
                client.query("select * from userhabits a, type b  where a.typeno = b.typeno AND b.typename = $1 AND a.userid = $2 ",[type,userId] , (err, results) =>{
                    if(err || results.rows.length==0){
                        client.query("insert into userhabits(userid,typeno,count)values($1,$2,99)",[userId,typeno], (err, results) =>{
                            if(err){
                                console.log('不喜歡新增失敗'+userName);
                            }else{
                                console.log('不喜歡更新成功'+userName);
                            }

                            //關閉連線
                            client.end();
    
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "原來你不喜歡阿...我知道了" + "(￣个￣)"
                                }
                            ]);
                        });
                    }else{
                        client.query("update userhabits set count = count - 1 where typeno = $1 AND userid = $2", [typeno,userId], (err, results) => {    
                            console.log(results);
                            
                            //回覆查詢結果
                            if (err){
                                console.log('不喜歡更新失敗'+userName);
                            }else{						
                                console.log('不喜歡更新成功'+userName); 
                            }
    
                            //關閉連線
                            client.end();
    
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "原來你不喜歡阿...我知道了" + "(￣个￣)"
                                }
                            ]);
                        });
                    }
                });        
            }	
            //--------------------------------------------	
    });
});

//--------------------------
// 撈userid--推播功能使用
//--------------------------
//建立資料庫連線           
var client = new Client({
    connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
    ssl: true,
})
client.connect();
//console.log(title+content);
var allKnownUsers=[];
client.query("select userid from users", (err, results) =>{                    
    for(var i = 0;i<results.rows.length;i++){
        allKnownUsers[i]=results.rows[i].userid;                               
    }    
    //關閉連線
    client.end();
});

//--------------------------
// 處理event.message
//--------------------------
bot.on('message',function(event) {           
    if (event.message.type == 'text'){ 
        //-------------主選單-----------------    
        if (event.message.text == 'Takebook會做什麼呢'){
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
                        "label": "我要查詢書本！",
                        "text": "我要查詢書本！"
                        },
                        {
                        "type": "message",
                        "label": "好想找本書看ㄚ～",
                        "text": "好想找本書看ㄚ～"
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
        //--------------------------------------------

        //----------------關鍵字查書-------------------
        }else if (event.message.text == '我要查詢書本！'){
                return event.reply([
                    {
                        type: 'text', 
                        text: '好的！'
                    },
                    {
                        type: 'text', 
                        text: '來~請跟我這樣做'
                    },
                    {
                        type: 'text', 
                        text: '「查 書名」'
                    },
                    {
                        type: 'text', 
                        text: '提醒：「查」後面要記得空一格喔!'
                    }
                ]);
        //--------------------------------------------

        //------關鍵字查書，判斷書本是否存在資料庫-------
        }else if (event.message.text.substring(0,1) == '查'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userName = profile.displayName;
                    var userId = profile.userId;
                    var no = event.message.text.substring(2);		
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    
                    //查詢資料，使用LIKE
                        client.query("select * from book where bookname LIKE $1 ORDER BY random() LIMIT 1",['%'+no+'%'], (err, results) => {    
                            console.log(userName);
                            
                            //回覆查詢結果
                            if (err || results.rows.length==0){
                                event.reply('查不到這本書耶( ´ﾟДﾟ`)'+'\n'+'要不要換個關鍵字或乾脆換本書？');
                            }else{						
                                var bookname=results.rows[0].bookname;
                                var content=results.rows[0].content;
                                var bookno=results.rows[0].bookno;
                                var type=results.rows[0].type;
                                console.log(bookno);

                                event.reply([
                                    {
                                        "type": "image",
                                        //(這裡圖片檔的名稱不能是中文)
                                        "originalContentUrl":"https://linebot-takebook.herokuapp.com/imgs/" + bookno + ".jpg",
                                        "previewImageUrl":"https://linebot-takebook.herokuapp.com/imgs/" + bookno + ".jpg"
                                    },
                                    {
                                        type: 'text', 
                                        text: '類別：' + type
                                    },
                                    {
                                        type: 'text', 
                                        text: '書名：<<' + bookname + '>>' +'\n'+'\n'+ '內容簡介：' +'\n' + content
                                    },
                                    {
                                        type: 'text', 
                                        text: '還可以試試其他找書方式喔(・ω<)，快點開功能選單吧'
                                    }
                                ]);  
                            }
            
                            //關閉連線
                            client.end();
                        });  
                }
            );
        //--------------------------------------------

        //------------------找書選單-------------------
        }else if (event.message.text == '好想找本書看ㄚ～'){    
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
        //--------------------------------------------

        //-------------用類別找書-提示字詞--------------
        }else if (event.message.text == '用類別找書'){
            return event.reply([
                {
                    type: 'text',
                    text: '看好喽，Follow me~'
                },
                {
                    type: 'text',
                    text: '「我想看 類別」 Ex.我想看 文學'
                },
                {
                    type: 'text', 
                    text: '提醒：「我想看」後面要記得空一格！千萬別打錯啦'
                }
            ]);
        //--------------------------------------------

        //----用類別找書-收集使用者userid && 類別喜好----
        }else if (event.message.text.substring(0,3) == '我想看'){
            event.source.profile().then(
                function (profile) {
                    //取得使用者資料及傳回文字
                    var userName = profile.displayName;
                    var userId = profile.userId;
                    //擷取使用者空格後的資料
                    var type = event.message.text.substring(4);
                    var typeno;
                    //將類別文字轉成數值(typeno)
                    switch(type){
                        case '商業理財':
                        case '商業':
                        case '理財':
                            typeno=1;
                            break;
                        case '心理勵志':
                        case '心理':
                        case '勵志':
                            typeno=2;
                            break;
                        case '文學':
                        case '小說':
                        case '文學小說':
                            typeno=3;
                            break;
                        case '旅遊':
                            typeno=4;
                            break; 
                        case '生活': 
                        case '風格': 
                        case '生活風格':
                            typeno=5;
                            break;
                        case '藝術':
                        case '設計':
                        case '藝術設計':
                            typeno=6;
                            break;
                        case '親子教養':
                        case '親子':
                        case '教育':
                            typeno=7;
                            break;
                        case '語言':
                        case '辭典':
                        case '參考書':
                            typeno=8;
                            break;
                        case '醫療保健':
                        case '醫療':
                        case '保健':
                            typeno=9;
                            break
                        case '飲食':
                        case '料理':
                        case '飲食料理':
                            typeno=10;
                            break;
                    }

                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();   
                    
                    //查詢資料
                    console.log(typeno+'!!!!!!!!!!!!!!!!!!');
                    client.query("select * from userhabits a, type b  where a.typeno = b.typeno AND b.typeno = $1 AND a.userid = $2 ",[typeno,userId], (err, results) =>{
                        if(err || results.rows.length==0){
                            client.query("insert into userhabits(userid,typeno,count)values($1,$2,100)", [userId,typeno], (err, results) => {    
                                console.log(userName);
                                
                                //回覆查詢結果
                                if (err){
                                    console.log('新增DB失敗');
                                }else{						
                                    console.log('新增DB成功'); 

                                    //篩選書籍給使用者
                                    client.query("select * from book a,type b where a.typeno=b.typeno AND a.typeno = $1 order by random() LIMIT 3",[typeno], (err, results) =>{            
                                        var bookname=results.rows[0].bookname;
                                        var booktype=results.rows[0].typename; 
                                        var pic=results.rows[0].picture;
                                        var bookno=results.rows[0].bookno;

                                        var bookname2=results.rows[1].bookname;
                                        var booktype2=results.rows[1].typename; 
                                        var pic2=results.rows[1].picture;
                                        var bookno2=results.rows[1].bookno;

                                        var bookname3=results.rows[2].bookname;
                                        var booktype3=results.rows[2].typename; 
                                        var pic3=results.rows[2].picture;
                                        var bookno3=results.rows[2].bookno;


                                        //回覆查詢結果
                                        if (err || results.rows.length==0){
                                            console.log('查詢DB失敗');
                                        }else{			
                                            //return 書本資訊
                                            return event.reply([
                                                {
                                                    "type": "text",
                                                    "text": '收到了~'
                                                },
                                                {
                                                    "type": "template",
                                                        "altText": "推薦給您~",
                                                        "template": {
                                                            "type": "carousel",
                                                            "columns": [
                                                                {
                                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic,
                                                                "imageAspectRatio": "rectangle",
                                                                "imageSize": "cover",
                                                                "imageBackgroundColor": "#FFFFFF",
                                                                "title": "<<" + bookname + ">>",
                                                                "text": "類別：" + booktype,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno
                                                                    }
                                                                ]
                                                                },
                                                                {
                                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic2,
                                                                "imageBackgroundColor": "#000000",
                                                                "title": "<<" + bookname2 + ">>",
                                                                "text": "類別：" + booktype2,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype2
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype2
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno2
                                                                    }
                                                                ]
                                                                },
                                                                {
                                                                "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic3,
                                                                "imageBackgroundColor": "#000000",
                                                                "title": "<<" + bookname3 + ">>",
                                                                "text": "類別：" + booktype3,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype3
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype3
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno3
                                                                    }
                                                                ]
                                                                }
                                                            ],
                                                            "imageAspectRatio": "rectangle",
                                                            "imageSize": "cover"
                                                        }
                                                }
                                            ]);
                                            //--------------------------------
                                        }
        
                                        //關閉連線
                                        client.end();
                                    });
                                }
                            });
                        }else{
                            client.query("update userhabits set count = count + 1 where typeno = $1 AND userid = $2", [typeno,userId], (err, results) => {    
                                console.log(userName);
                                
                                //回覆查詢結果
                                if (err){
                                    console.log('更新DB失敗');
                                }else{						
                                    console.log('更新DB成功'); 

                                    //篩選書籍給使用者
                                    client.query("select * from book a,type b where a.typeno=b.typeno AND a.typeno = $1 order by random() LIMIT 3",[typeno], (err, results) =>{            
                                                                                
                                        var bookname=results.rows[0].bookname;
                                        var booktype=results.rows[0].typename; 
                                        var pic=results.rows[0].picture;
                                        var bookno=results.rows[0].bookno;

                                        var bookname2=results.rows[1].bookname;
                                        var booktype2=results.rows[1].typename; 
                                        var pic2=results.rows[1].picture;
                                        var bookno2=results.rows[1].bookno;

                                        var bookname3=results.rows[2].bookname;
                                        var booktype3=results.rows[2].typename; 
                                        var pic3=results.rows[2].picture;
                                        var bookno3=results.rows[2].bookno;


                                        //回覆查詢結果
                                        if (err || results.rows.length==0){
                                            console.log('查詢DB失敗');
                                        }else{			
                                            //return 書本資訊
                                            return event.reply([
                                                {
                                                    "type": "text",
                                                    "text": '收到了~'
                                                },
                                                {
                                                    "type": "template",
                                                        "altText": "推薦給您~",
                                                        "template": {
                                                            "type": "carousel",
                                                            "columns": [
                                                                {
                                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic,
                                                                "imageAspectRatio": "rectangle",
                                                                "imageSize": "cover",
                                                                "imageBackgroundColor": "#FFFFFF",
                                                                "title": "<<" + bookname + ">>",
                                                                "text": "類別：" + booktype,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno
                                                                    }
                                                                ]
                                                                },
                                                                {
                                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic2,
                                                                "imageBackgroundColor": "#000000",
                                                                "title": "<<" + bookname2 + ">>",
                                                                "text": "類別：" + booktype2,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype2
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype2
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno2
                                                                    }
                                                                ]
                                                                },
                                                                {
                                                                "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic3,
                                                                "imageBackgroundColor": "#000000",
                                                                "title": "<<" + bookname3 + ">>",
                                                                "text": "類別：" + booktype3,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype3
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype3
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno3
                                                                    }
                                                                ]
                                                                }
                                                            ],
                                                            "imageAspectRatio": "rectangle",
                                                            "imageSize": "cover"
                                                        }
                                                }
                                            ]);
                                            //--------------------------------
                                        }
        
                                        //關閉連線
                                        client.end();
                                    });
                                }
                            });
                        }
                    });      
                }

                
            );    
        //--------------------------------------------

        //-------------------新書---------------------
        }else if (event.message.text == '新書'){	        
            //建立資料庫連線           
            var client = new Client({
                connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                ssl: true,
            })
            
            client.connect();

            //查詢資料
            //(資料庫欄位名稱不使用駝峰命名, 否則可能出錯)
                client.query("SELECT bookname, typename, picture, bookno FROM book a, type b where a.typeno = b.typeno order by date DESC LIMIT 3", (err, results) => {    
                    
                    //回覆查詢結果		
                    var bookname=results.rows[0].bookname;
                    var type=results.rows[0].typename; 
                    var pic=results.rows[0].picture;
                    var bookno=results.rows[0].bookno;

                    var bookname2=results.rows[1].bookname;
                    var type2=results.rows[1].typename;
                    var pic2=results.rows[1].picture;
                    var bookno2=results.rows[1].bookno;

                    var bookname3=results.rows[2].bookname;
                    var type3=results.rows[2].typename;   
                    var pic3=results.rows[2].picture;
                    var bookno3=results.rows[2].bookno;                                             
                                                    
                    return event.reply([
                        {
                            type: 'text', 
                            text: '新書快報，緊看ㄛ！'
                        },
                        {
                            "type": "template",
                            "altText": "新書推薦",
                            "template": {
                                "type": "carousel",
                                "columns": [
                                    {
                                    "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic,
                                    "imageAspectRatio": "rectangle",
                                    "imageSize": "cover",
                                    "imageBackgroundColor": "#FFFFFF",
                                    "title": "<<" + bookname + ">>",
                                    "text": "類別：" + type,
                                    "defaultAction": {
                                        "type": "uri",
                                        "label": "View detail",
                                        "uri": "http://140.131.114.176/"
                                    },
                                    "actions": [
                                        {
                                            "type": "postback",
                                            "label": "喜歡",
                                            "data": "我喜歡" + type
                                        },
                                        {
                                            "type": "postback",
                                            "label": "不喜歡",
                                            "data": "不喜歡" + type
                                        },
                                        {
                                            "type": "uri",
                                            "label": "看更多...",
                                            "uri": "https://www.books.com.tw/products/" + bookno
                                        }
                                    ]
                                    },
                                    {
                                    "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic2,
                                    "imageBackgroundColor": "#000000",
                                    "title": "<<" + bookname2 + ">>",
                                    "text": "類別：" + type2,
                                    "defaultAction": {
                                        "type": "uri",
                                        "label": "View detail",
                                        "uri": "http://140.131.114.176/"
                                    },
                                    "actions": [
                                        {
                                            "type": "postback",
                                            "label": "喜歡",
                                            "data": "我喜歡" + type2
                                        },
                                        {
                                            "type": "postback",
                                            "label": "不喜歡",
                                            "data": "不喜歡" + type2
                                        },
                                        {
                                            "type": "uri",
                                            "label": "看更多...",
                                            "uri": "https://www.books.com.tw/products/" + bookno2
                                        }
                                    ]
                                    },
                                    {
                                    "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic3,
                                    "imageBackgroundColor": "#000000",
                                    "title": "<<" + bookname3 + ">>",
                                    "text": "類別：" + type3,
                                    "defaultAction": {
                                        "type": "uri",
                                        "label": "View detail",
                                        "uri": "http://140.131.114.176/"
                                    },
                                    "actions": [
                                        {
                                            "type": "postback",
                                            "label": "喜歡",
                                            "data": "我喜歡" + type3
                                        },
                                        {
                                            "type": "postback",
                                            "label": "不喜歡",
                                            "data": "不喜歡" + type3
                                        },
                                        {
                                            "type": "uri",
                                            "label": "看更多...",
                                            "uri": "https://www.books.com.tw/products/" + bookno3
                                        }
                                    ]
                                    }
                                ],
                                "imageAspectRatio": "rectangle",
                                "imageSize": "cover"
                            }
                        }
                    ]); 
                    
                    //關閉連線
                    client.end();
                });  
        //--------------------------------------------

        //----------------書本排行榜-------------------
        }else if (event.message.text == '書本排行榜'){
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
                        client.query("SELECT bookname, typename, picture, bookno FROM book a, type b where a.typeno = b.typeno ORDER BY rankno ASC LIMIT 10;", (err, results) => {    
                            console.log(results);
                            
                            //回覆查詢結果		
                            var bookname=results.rows[0].bookname;
                            var type=results.rows[0].typename; 
                            var picture=results.rows[0].picture;
                            var bookno=results.rows[0].bookno;
                            
                            var bookname1=results.rows[1].bookname;
                            var type1=results.rows[1].typename;
                            var picture1=results.rows[1].picture;
                            var bookno1=results.rows[1].bookno;

                            var bookname2=results.rows[2].bookname;
                            var type2=results.rows[2].typename;  
                            var picture2=results.rows[2].picture;
                            var bookno2=results.rows[2].bookno;

                            var bookname3=results.rows[3].bookname;
                            var type3=results.rows[3].typename; 
                            var picture3=results.rows[3].picture;
                            var bookno3=results.rows[3].bookno;

                            var bookname4=results.rows[4].bookname;
                            var type4=results.rows[4].typename;
                            var picture4=results.rows[4].picture;
                            var bookno4=results.rows[4].bookno;

                            var bookname5=results.rows[5].bookname;
                            var type5=results.rows[5].typename;
                            var picture5=results.rows[5].picture;
                            var bookno5=results.rows[5].bookno;

                            var bookname6=results.rows[6].bookname;
                            var type6=results.rows[6].typename;
                            var picture6=results.rows[6].picture;
                            var bookno6=results.rows[6].bookno;

                            var bookname7=results.rows[7].bookname;
                            var type7=results.rows[7].typename;
                            var picture7=results.rows[7].picture;
                            var bookno7=results.rows[7].bookno;

                            var bookname8=results.rows[8].bookname;
                            var type8=results.rows[8].typename; 
                            var picture8=results.rows[8].picture;
                            var bookno8=results.rows[8].bookno;

                            var bookname9=results.rows[9].bookname;
                            var type9=results.rows[9].typename; 
                            var picture9=results.rows[9].picture; 
                            var bookno9=results.rows[9].bookno;               
                                                          
                            return event.reply([
                                {
                                    type: 'text', 
                                    text: '熱門排行Top 10'
                                },
                                {
                                "type": "template",
                                "altText": "Top 10",
                                "template": {
                                    "type": "carousel",
                                    "columns": [
                                        {
                                        "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture,
                                        "imageAspectRatio": "rectangle",
                                        "imageSize": "cover",
                                        "imageBackgroundColor": "#FFFFFF",
                                        "title": "<<" + bookname + ">>",
                                        "text": "類別：" + type,
                                        "defaultAction": {
                                            "type": "uri",
                                            "label": "View detail",
                                            "uri": "http://140.131.114.176/"
                                        },
                                        "actions": [
                                            {
                                                "type": "postback",
                                                "label": "喜歡",
                                                "data": "我喜歡" + type
                                            },
                                            {
                                                "type": "postback",
                                                "label": "不喜歡",
                                                "data": "不喜歡" + type
                                            },
                                            {
                                                "type": "uri",
                                                "label": "看更多...",
                                                "uri": "https://www.books.com.tw/products/" + bookno
                                            }
                                        ]
                                        },
                                        {
                                        "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture1,
                                        "imageBackgroundColor": "#000000",
                                        "title": "<<" + bookname1 + ">>",
                                        "text": "類別：" + type1,
                                        "defaultAction": {
                                            "type": "uri",
                                            "label": "View detail",
                                            "uri": "http://140.131.114.176/"
                                        },
                                        "actions": [
                                            {
                                                "type": "postback",
                                                "label": "喜歡",
                                                "data": "我喜歡" + type1
                                            },
                                            {
                                                "type": "postback",
                                                "label": "不喜歡",
                                                "data": "不喜歡" + type1
                                            },
                                            {
                                                "type": "uri",
                                                "label": "看更多...",
                                                "uri": "https://www.books.com.tw/products/" + bookno1
                                            }
                                        ]
                                        },
                                        {
                                        "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture2,
                                        "imageBackgroundColor": "#000000",
                                        "title": "<<" + bookname2 + ">>",
                                        "text": "類別：" + type2,
                                        "defaultAction": {
                                            "type": "uri",
                                            "label": "View detail",
                                            "uri": "http://140.131.114.176/"
                                        },
                                        "actions": [
                                            {
                                                "type": "postback",
                                                "label": "喜歡",
                                                "data": "我喜歡" + type2
                                            },
                                            {
                                                "type": "postback",
                                                "label": "不喜歡",
                                                "data": "不喜歡" + type2
                                            },
                                            {
                                                "type": "uri",
                                                "label": "看更多...",
                                                "uri": "https://www.books.com.tw/products/" + bookno2
                                            }
                                        ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture3,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname3 + ">>",
                                            "text": "類別：" + type3,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type3
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type3
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno3
                                                }
                                            ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture4,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname4 + ">>",
                                            "text": "類別：" + type4,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type4
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type4
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno4
                                                }
                                            ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture5,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname5 + ">>",
                                            "text": "類別：" + type5,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type5
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type5
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno5
                                                }
                                            ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture6,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname6 + ">>",
                                            "text": "類別：" + type6,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type6
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type6
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno6
                                                }
                                            ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture7,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname7 + ">>",
                                            "text": "類別：" + type7,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type7
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type7
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno7
                                                }
                                            ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture8,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname8 + ">>",
                                            "text": "類別：" + type8,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type8
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type8
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno8
                                                }
                                            ]
                                        },
                                        {
                                            "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + picture9,
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover",
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "<<" + bookname9 + ">>",
                                            "text": "類別：" + type9,
                                            "defaultAction": {
                                                "type": "uri",
                                                "label": "View detail",
                                                "uri": "http://140.131.114.176/"
                                            },
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "喜歡",
                                                    "data": "我喜歡" + type9
                                                },
                                                {
                                                    "type": "postback",
                                                    "label": "不喜歡",
                                                    "data": "不喜歡" + type9
                                                },
                                                {
                                                    "type": "uri",
                                                    "label": "看更多...",
                                                    "uri": "https://www.books.com.tw/products/" + bookno9
                                                }
                                            ]
                                        }
                                    ],
                                    "imageAspectRatio": "rectangle",
                                    "imageSize": "cover"
                                }
                            }]); 
                            
                            //關閉連線
                            client.end();
                        });  
                }
            );
        //--------------------------------------------

        //-------機器人依據使用者書本類別取向推薦--------
        }else if (event.message.text == '讓機器人推薦給你吧'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userId = profile.userId;
                    var userName = profile.displayName;		
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    
                    //---先判斷資料庫是否存在此使用者---
                    client.query("select * from userhabits where userid = $1", [userId], (err, results) =>{
                        if(err || results.rows.length==0){
                            //---並亂數傳書本資訊---					
                            client.query("select * from book a,type b where a.typeno=b.typeno order by random() LIMIT 3", (err, results) => {    
                                console.log(userName);
                                
                                var bookname=results.rows[0].bookname;
                                var booktype=results.rows[0].typename; 
                                var pic=results.rows[0].picture;
                                var bookno=results.rows[0].bookno;

                                var bookname2=results.rows[1].bookname;
                                var booktype2=results.rows[1].typename; 
                                var pic2=results.rows[1].picture;
                                var bookno2=results.rows[1].bookno;

                                var bookname3=results.rows[2].bookname;
                                var booktype3=results.rows[2].typename; 
                                var pic3=results.rows[2].picture;
                                var bookno3=results.rows[2].bookno;

                                //回覆查詢結果
                                if (err || results.rows.length==0){
                                    console.log('查詢DB失敗');
                                }else{			
                                    //return 書本資訊
                                    return event.reply([
                                        {
                                            "type": "text",
                                            "text": '收到了~'
                                        },
                                        {
                                            "type": "template",
                                                "altText": "推薦給您~",
                                                "template": {
                                                    "type": "carousel",
                                                    "columns": [
                                                        {
                                                        "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic,
                                                        "imageAspectRatio": "rectangle",
                                                        "imageSize": "cover",
                                                        "imageBackgroundColor": "#FFFFFF",
                                                        "title": "<<" + bookname + ">>",
                                                        "text": "類別：" + booktype,
                                                        "defaultAction": {
                                                            "type": "uri",
                                                            "label": "View detail",
                                                            "uri": "http://140.131.114.176/"
                                                        },
                                                        "actions": [
                                                            {
                                                                "type": "postback",
                                                                "label": "喜歡",
                                                                "data": "我喜歡" + booktype
                                                            },
                                                            {
                                                                "type": "postback",
                                                                "label": "不喜歡",
                                                                "data": "不喜歡" + booktype
                                                            },
                                                            {
                                                                "type": "uri",
                                                                "label": "看更多...",
                                                                "uri": "https://www.books.com.tw/products/" + bookno
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic2,
                                                        "imageBackgroundColor": "#000000",
                                                        "title": "<<" + bookname2 + ">>",
                                                        "text": "類別：" + booktype2,
                                                        "defaultAction": {
                                                            "type": "uri",
                                                            "label": "View detail",
                                                            "uri": "http://140.131.114.176/"
                                                        },
                                                        "actions": [
                                                            {
                                                                "type": "postback",
                                                                "label": "喜歡",
                                                                "data": "我喜歡" + booktype2
                                                            },
                                                            {
                                                                "type": "postback",
                                                                "label": "不喜歡",
                                                                "data": "不喜歡" + booktype2
                                                            },
                                                            {
                                                                "type": "uri",
                                                                "label": "看更多...",
                                                                "uri": "https://www.books.com.tw/products/" + bookno2
                                                            }
                                                        ]
                                                        },
                                                        {
                                                        "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic3,
                                                        "imageBackgroundColor": "#000000",
                                                        "title": "<<" + bookname3 + ">>",
                                                        "text": "類別：" + booktype3,
                                                        "defaultAction": {
                                                            "type": "uri",
                                                            "label": "View detail",
                                                            "uri": "http://140.131.114.176/"
                                                        },
                                                        "actions": [
                                                            {
                                                                "type": "postback",
                                                                "label": "喜歡",
                                                                "data": "我喜歡" + booktype3
                                                            },
                                                            {
                                                                "type": "postback",
                                                                "label": "不喜歡",
                                                                "data": "不喜歡" + booktype3
                                                            },
                                                            {
                                                                "type": "uri",
                                                                "label": "看更多...",
                                                                "uri": "https://www.books.com.tw/products/" + bookno3
                                                            }
                                                        ]
                                                        }
                                                    ],
                                                    "imageAspectRatio": "rectangle",
                                                    "imageSize": "cover"
                                                }
                                        }
                                    ]);
                                }

                                //關閉連線
                                client.end();  
                            });
                            //------------------------------------   
                        }else{
                            //---判斷count是否大於100---
                            client.query("SELECT book.bookno ,book.bookname, book.picture, type.typename FROM book, userhabits,type where book.typeno=type.typeno AND userid= $1 AND count>100 order by count DESC,random()", [userId], (err, results) => {    
                                //如果count沒有>100就隨機傳三本
                                if(err || results.rows.length==0){
                                    client.query("select * from book a,type b where a.typeno=b.typeno order by random() LIMIT 3", (err, results) => {
                                        console.log(results);
                                
                                        var bookname=results.rows[0].bookname;
                                        var booktype=results.rows[0].typename; 
                                        var pic=results.rows[0].picture;
                                        var bookno=results.rows[0].bookno;

                                        var bookname2=results.rows[1].bookname;
                                        var booktype2=results.rows[1].typename; 
                                        var pic2=results.rows[1].picture;
                                        var bookno2=results.rows[1].bookno;

                                        var bookname3=results.rows[2].bookname;
                                        var booktype3=results.rows[2].typename; 
                                        var pic3=results.rows[2].picture;
                                        var bookno3=results.rows[2].bookno;

                                        //回覆查詢結果
                                        if (err || results.rows.length==0){
                                            console.log('查詢DB失敗');
                                        }else{			
                                            //return 書本資訊
                                            return event.reply([
                                                {
                                                    "type": "text",
                                                    "text": '收到了~'
                                                },
                                                {
                                                    "type": "template",
                                                        "altText": "推薦給您~",
                                                        "template": {
                                                            "type": "carousel",
                                                            "columns": [
                                                                {
                                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic,
                                                                "imageAspectRatio": "rectangle",
                                                                "imageSize": "cover",
                                                                "imageBackgroundColor": "#FFFFFF",
                                                                "title": "<<" + bookname + ">>",
                                                                "text": "類別：" + booktype,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno
                                                                    }
                                                                ]
                                                                },
                                                                {
                                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic2,
                                                                "imageBackgroundColor": "#000000",
                                                                "title": "<<" + bookname2 + ">>",
                                                                "text": "類別：" + booktype2,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype2
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype2
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno2
                                                                    }
                                                                ]
                                                                },
                                                                {
                                                                "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic3,
                                                                "imageBackgroundColor": "#000000",
                                                                "title": "<<" + bookname3 + ">>",
                                                                "text": "類別：" + booktype3,
                                                                "defaultAction": {
                                                                    "type": "uri",
                                                                    "label": "View detail",
                                                                    "uri": "http://140.131.114.176/"
                                                                },
                                                                "actions": [
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "喜歡",
                                                                        "data": "我喜歡" + booktype3
                                                                    },
                                                                    {
                                                                        "type": "postback",
                                                                        "label": "不喜歡",
                                                                        "data": "不喜歡" + booktype3
                                                                    },
                                                                    {
                                                                        "type": "uri",
                                                                        "label": "看更多...",
                                                                        "uri": "https://www.books.com.tw/products/" + bookno3
                                                                    }
                                                                ]
                                                                }
                                                            ],
                                                            "imageAspectRatio": "rectangle",
                                                            "imageSize": "cover"
                                                        }
                                                }
                                            ]);
                                        }

                                        //關閉連線
                                        client.end();
                                    });
                                
                                }else{
                                    //---count>100，就只傳喜歡的書---
                                    console.log(results);
                                    //回覆查詢結果	
                                    var bookname=results.rows[0].bookname;
                                    var type=results.rows[0].typename; 
                                    var pic=results.rows[0].picture;
                                    var bookno=results.rows[0].bookno;
                                    
                                    var bookname2=results.rows[5].bookname;
                                    var type2=results.rows[5].typename; 
                                    var pic2=results.rows[5].picture;
                                    var bookno2=results.rows[5].bookno;

                                    var bookname3=results.rows[4].bookname;
                                    var type3=results.rows[4].typename; 
                                    var pic3=results.rows[4].picture;
                                    var bookno3=results.rows[4].bookno;

                                    var bookname4=results.rows[1].bookname;
                                    var type4=results.rows[1].typename; 
                                    var pic4=results.rows[1].picture;
                                    var bookno4=results.rows[1].bookno;

                                    var bookname5=results.rows[10].bookname;
                                    var type5=results.rows[10].typename; 
                                    var pic5=results.rows[10].picture;
                                    var bookno5=results.rows[10].bookno;
                                    
                                    return event.reply({
                                        "type": "template",
                                        "altText": "推薦給您~",
                                        "template": {
                                            "type": "carousel",
                                            "columns": [
                                                {
                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic,
                                                "imageAspectRatio": "rectangle",
                                                "imageSize": "cover",
                                                "imageBackgroundColor": "#FFFFFF",
                                                "title": "<<" + bookname + ">>",
                                                "text": "類別：" + type,
                                                "defaultAction": {
                                                    "type": "uri",
                                                    "label": "View detail",
                                                    "uri": "http://140.131.114.176/"
                                                },
                                                "actions": [
                                                    {
                                                        "type": "postback",
                                                        "label": "喜歡",
                                                        "data": "我喜歡" + type
                                                    },
                                                    {
                                                        "type": "postback",
                                                        "label": "不喜歡",
                                                        "data": "不喜歡" + type
                                                    },
                                                    {
                                                        "type": "uri",
                                                        "label": "看更多...",
                                                        "uri": "https://www.books.com.tw/products/" + bookno
                                                    }
                                                ]
                                                },
                                                {
                                                "thumbnailImageUrl": "https://linebot-takebook.herokuapp.com/imgs/" + pic2,
                                                "imageBackgroundColor": "#000000",
                                                "title": "<<" + bookname2 + ">>",
                                                "text": "類別：" + type2,
                                                "defaultAction": {
                                                    "type": "uri",
                                                    "label": "View detail",
                                                    "uri": "http://140.131.114.176/"
                                                },
                                                "actions": [
                                                    {
                                                        "type": "postback",
                                                        "label": "喜歡",
                                                        "data": "我喜歡" + type2
                                                    },
                                                    {
                                                        "type": "postback",
                                                        "label": "不喜歡",
                                                        "data": "不喜歡" + type2
                                                    },
                                                    {
                                                        "type": "uri",
                                                        "label": "看更多...",
                                                        "uri": "https://www.books.com.tw/products/" + bookno2
                                                    }
                                                ]
                                                },
                                                {
                                                "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic3,
                                                "imageBackgroundColor": "#000000",
                                                "title": "<<" + bookname3 + ">>",
                                                "text": "類別：" + type3,
                                                "defaultAction": {
                                                    "type": "uri",
                                                    "label": "View detail",
                                                    "uri": "http://140.131.114.176/"
                                                },
                                                "actions": [
                                                    {
                                                        "type": "postback",
                                                        "label": "喜歡",
                                                        "data": "我喜歡" + type3
                                                    },
                                                    {
                                                        "type": "postback",
                                                        "label": "不喜歡",
                                                        "data": "不喜歡" + type3
                                                    },
                                                    {
                                                        "type": "uri",
                                                        "label": "看更多...",
                                                        "uri": "https://www.books.com.tw/products/" + bookno3
                                                    }
                                                ]
                                                },
                                                {
                                                "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic4,
                                                "imageBackgroundColor": "#000000",
                                                "title": "<<" + bookname4 + ">>",
                                                "text": "類別：" + type4,
                                                "defaultAction": {
                                                    "type": "uri",
                                                    "label": "View detail",
                                                    "uri": "http://140.131.114.176/"
                                                },
                                                "actions": [
                                                    {
                                                        "type": "postback",
                                                        "label": "喜歡",
                                                        "data": "我喜歡" + type4
                                                    },
                                                    {
                                                        "type": "postback",
                                                        "label": "不喜歡",
                                                        "data": "不喜歡" + type4
                                                    },
                                                    {
                                                        "type": "uri",
                                                        "label": "看更多...",
                                                        "uri": "https://www.books.com.tw/products/" + bookno4
                                                    }
                                                ]
                                                },
                                                {
                                                "thumbnailImageUrl":  "https://linebot-takebook.herokuapp.com/imgs/" + pic5,
                                                "imageBackgroundColor": "#000000",
                                                "title": "<<" + bookname5 + ">>",
                                                "text": "類別：" + type5,
                                                "defaultAction": {
                                                    "type": "uri",
                                                    "label": "View detail",
                                                    "uri": "http://140.131.114.176/"
                                                },
                                                "actions": [
                                                    {
                                                        "type": "postback",
                                                        "label": "喜歡",
                                                        "data": "我喜歡" + type5
                                                    },
                                                    {
                                                        "type": "postback",
                                                        "label": "不喜歡",
                                                        "data": "不喜歡" + type5
                                                    },
                                                    {
                                                        "type": "uri",
                                                        "label": "看更多...",
                                                        "uri": "https://www.books.com.tw/products/" + bookno5
                                                    }
                                                ]
                                                }
                                            ],
                                            "imageAspectRatio": "rectangle",
                                            "imageSize": "cover"
                                        }
                                    });
        
                                    //關閉連線
                                    client.end();
                                }
                                //--------------------------------------------
                            }); 
                            //--------------------------------------------
                        }      
                    });
                    //--------------------------------------------
                }
            );
        //--------------------------------------------

        //-------管理者推播訊息給所有使用者------------
        }else if (event.message.text.substring(0,2) == '推播'){
            var pushMessage = event.message.text.substring(3);
            //將訊息推給所有使用者
            return bot.push(
                allKnownUsers, 
                [
                    {
                        type: 'text', 
                        text: pushMessage
                    },
                    {
                        "type": "sticker",
                        "packageId": "1",
                        "stickerId": "5"
                    }
                ]
            );	
        //--------------------------------------------        
        }else if (event.message.text.substring(0,4) == '書本推播'){
            //建立資料庫連線           
            var client = new Client({
                connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                ssl: true,
            })  
            client.connect();
            client.query("select * from book ORDER BY RANDOM()", (err, results) => {
                //回覆查詢結果
                if (err || results.rows.length==0){
                    econsole.log(results + 'push失敗');
                }else{						
                    var bookname=results.rows[0].bookname;
                    var content=results.rows[0].content;
                    var bookno=results.rows[0].bookno;
                    var type=results.rows[0].type;

                    return bot.push(
                        allKnownUsers,
                        [
                            {
                                type: 'text', 
                                text: '今日推薦給你(✿╹◡╹)'
                            },
                            {
                                "type": "image",
                                //(這裡圖片檔的名稱不能是中文)
                                "originalContentUrl":"https://linebot-takebook.herokuapp.com/imgs/" + bookno + ".jpg",
                                "previewImageUrl":"https://linebot-takebook.herokuapp.com/imgs/" + bookno + ".jpg"
                            },
                            {
                                type: 'text', 
                                text: '類別：' + type
                            },
                            {
                                type: 'text', 
                                text: '書名：<<' + bookname + '>>' +'\n'+'\n'+ '內容簡介：' +'\n' + content
                            }
                        ]
                    );  
                }
                //關閉連線
                client.end();
            });     	
        //--------------------------------------------        
        }else if (event.message.text == '書本清單'){
            return event.reply({
                "type": "template",
                "altText": "書本清單",
                "template": {
                    "type": "buttons",
                    "title": "書本清單",
                    "text": "快來新增自己的書單吧",
                    "actions": [
                        {
                            "type": "message",
                            "label": "新增清單",
                            "text": "新增清單"
                        },
                        {
                            "type": "message",
                            "label": "刪除清單",
                            "text": "刪除清單"
                        },
                        {
                            "type": "message",
                            "label": "檢視清單",
                            "text": "檢視清單"
                        },
                        {
                            "type": "message",
                            "label": "抽籤(抽看看別人的書單吧)",
                            "text": "抽籤"
                        }
                    ]
                }
            });
        }else if (event.message.text == '新增清單'){
            return event.reply([
                {
                    type: 'text', 
                    text: '請先打"加入"，接著輸入書名，再輸入您對於這本書的註解或感想'
                },
                {
                    type: 'text', 
                    text: '「加入 哈利波特 魔法的世界給予我們無限的想像」'
                },
                {
                    type: 'text', 
                    text: '提醒：「加入」及「書名」後面要記得空一格喔!'
                }
            ]);
        }else if (event.message.text == '刪除清單'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userId = profile.userId;
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    client.connect();
                    
                    client.query("select * from booklist where userid = $1",[userId], (err, results) =>{
                        if(err　||　results.rows.length==0){
                            console.log('這人沒有清單可以刪');
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "你還沒有新增過清單喔~" + "(ﾉ∀`*)"
                                }
                            ]);
                        }else{
                            console.log('可以刪!');
                            return event.reply([
                                {
                                    type: 'text', 
                                    text: '請先打"刪除"，接著輸入欲刪除清單的書名'
                                },
                                {
                                    type: 'text', 
                                    text: '「刪除 哈利波特」'
                                },
                                {
                                    type: 'text', 
                                    text: '提醒：「刪除」後面要記得空一格喔!'
                                }
                            ]);
                        }
                        //關閉連線
                        client.end();
                    });
                }
            );
        }else if (event.message.text.substring(0,2) == '加入'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userId = profile.userId;	
                    var splits = event.message.text.split(" ");
                    var title = splits[1];
                    var content = splits[2];
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    //console.log(title+content);
                    client.query("insert into booklist(userid,title,content)values($1,$2,$3)",[userId,title,content], (err, results) =>{
                        if(err){
                            console.log('清單新增失敗'+title);
                        }else{
                            console.log('清單新增成功'+title);
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "加入成功！'快去檢視清單'看看吧~" + "(≧▽≦)"
                                }
                            ]);
                        }
                        //關閉連線
                        client.end();
                    });
                }
            );
        }else if (event.message.text.substring(0,2) == '刪除'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userId = profile.userId;
                    var splits = event.message.text.split(" ");
                    var title = splits[1];
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();                  
                    client.query("select * from booklist where userid = $1",[userId], (err, results) =>{
                        if(err ||　results.rows.length==0){
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "你還沒有新增過清單喔~" + "(ﾉ∀`*)"
                                }
                            ]);
                        }else{
                            client.query("UPDATE booklist SET delete=TRUE WHERE userid=$1 AND title=$2 ;",[userId,title], (err, results) =>{
                                if(err){
                                    return event.reply([
                                        {
                                            "type": "text",
                                            "text": "刪除失敗了~檢查看看有沒有錯字喔！" + "(◞‸◟)"
                                        }
                                    ]);
                                }else{
                                    console.log('清單刪除成功'+title);
                                    return event.reply([
                                        {
                                            "type": "text",
                                            "text": "成功刪掉啦~" + "(≧▽≦)"
                                        }
                                    ]);
                                }                                
                                //關閉連線
                                client.end();
                            });  
                        }                
                    });
                }
            );
        }else if (event.message.text== '檢視清單'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userId = profile.userId;
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    //console.log(title+content);
                    client.query("select * from booklist where userid = $1 order by serno",[userId], (err, results) =>{
                        if(err ||　results.rows.length==0){
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "你還沒有新增過清單喔~" + "(ﾉ∀`*)"
                                }
                            ]);
                        }else{                      
                            var array=[];   
                            
                            for(var i = 0;i<results.rows.length;i++){      
                                var contentnull = results.rows[i].content;                                    
                                var boolean = results.rows[i].delete;
                                if(results.rows[i].delete == true){
                                    console.log("刪過了嗎"+boolean);                                
                                }else if(contentnull != null){
                                    array[i]= "\n●"+ "《" +results.rows[i].title + "》  \n      " + contentnull;
                                }else{
                                    contentnull = '沒有註解喔~~';                                        
                                    array[i]= "\n●"+ "《" +results.rows[i].title + "》  \n      " + contentnull; 
                                }                                
                            }
                            return event.reply([
                                {
                                    "type": "text",
                                    "text": "<我的書本清單>"+array
                                }
                            ]);
                        }
                        //關閉連線
                        client.end();
                    });
                }
            );
        }else if (event.message.text== '抽籤'){
            event.source.profile().then(
                function (profile) {	
                    //取得使用者資料及傳回文字
                    var userId = profile.userId;
        
                    //建立資料庫連線           
                    var client = new Client({
                        connectionString: 'postgres://jwolwdzesbpqji:cd36854742157046461ec01de62e7d851db4cce0e16e6dbaa2a32aea21fa0059@ec2-54-221-210-97.compute-1.amazonaws.com:5432/d36fj3m41rcrr7',
                        ssl: true,
                    })
                    
                    client.connect();
                    //console.log(title+content);
                    client.query("select * from booklist a, users b where a.userid = b.userid AND a.userid != $1 order by random() LIMIT 1",[userId], (err, results) =>{
                        var randomuser = results.rows[0].userid;
                        var username = results.rows[0].username;
                        client.query("select * from booklist where userid= $1 order by serno",[randomuser], (err, results) =>{
                            if(err ||　results.rows.length==0){
                                return event.reply([
                                    {
                                        "type": "text",
                                        "text": "你還沒有新增過清單喔~" + "(ﾉ∀`*)"
                                    }
                                ]);
                            }else{                      
                                var array=[];   
                                
                                for(var i = 0;i<results.rows.length;i++){      
                                    var contentnull = results.rows[i].content;                                    
                                    var boolean = results.rows[i].delete;
                                    if(results.rows[i].delete == true){
                                        console.log("刪過了嗎"+boolean);                                
                                    }else if(contentnull != null){
                                        array[i]= "\n●"+ "《" +results.rows[i].title + "》  \n      " + contentnull;
                                    }else{
                                        contentnull = '沒有註解喔~~';                                        
                                        array[i]= "\n●"+ "《" +results.rows[i].title + "》  \n      " + contentnull; 
                                    }                                
                                }
                                return event.reply([
                                    {
                                        "type": "text",
                                        "text": "恭喜你抽到了!!!٩(ˊᗜˋ*)و\n<"+username+"的書本清單"+">"+array
                                    }
                                ]);
                            }
                            //關閉連線
                            client.end();
                        });
                    });
                }
            );
        }else{
            return event.reply({
                "type": 'template', 
                "altText": "快來問問我！",
                "template": {
                    "type": "buttons",
                    "title": "快來問問我！",
                    "text": "請點選下方按鈕",
                    "actions": [
                        {
                        "type": "message",
                        "label": "Takebook會做什麼呢",
                        "text": "Takebook會做什麼呢"
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
            "altText": "快來問問我！",
            "template": {
                "type": "buttons",
                "title": "快來問問我！",
                "text": "請點選下方按鈕",
                "actions": [
                    {
                    "type": "message",
                    "label": "Takebook會做什麼呢",
                    "text": "Takebook會做什麼呢"
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
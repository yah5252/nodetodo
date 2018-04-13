var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

var serviceAccount = require("./node-todo-385d9-firebase-adminsdk-o90uz-64ee0c10bb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-todo-385d9.firebaseio.com"
});


var firebase = admin.database();

app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))


//路由
app.get('/',function(req,res){
  firebase.ref('todos').once('value',function(snapshot){
    var data = snapshot.val();
    res.render('index',{"todolist":data})
  })
})

//新增邏輯
app.post('/addTodo',function(req,res){
  var content = req.body.content;
  var contentRef = firebase.ref('todos').push();
  contentRef.set({"content":content})
  .then(function(){
    firebase.ref('todos').once('value',function(snapshot){
      res.send(
        {
          "success": true,
          "result": snapshot.val(),
          "message":" 資料讀取成功"
        }
      )
    })
  })
})

//新增刪除
app.post('/removeTodo',function(req,res){
  var _id = req.body.id;
  firebase.ref('todos').child(_id).remove()
  .then(function(){
    firebase.ref('todos').once('value',function(snapshot){
      res.send(
        {
          "success": true,
          "result": snapshot.val(),
          "message":" 資料刪除成功"
        }
      )
    })
  })
})




// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);
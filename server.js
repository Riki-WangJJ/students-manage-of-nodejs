
var express = require("express");
var path = require("path");
var router = require("./modules/router");
var bodyparser = require("body-parser")

// 实例
var app = express();

// 配置模版
app.set("views", path.join(__dirname,"./htmls") );
app.engine("html", require("ejs").renderFile);
app.set("view engine","html");

// 应用bodyparser
app.use(bodyparser.urlencoded({extended:false}));

app.use( router )

app.listen(8080, function () {  
  console.log("8080开启成功");
})
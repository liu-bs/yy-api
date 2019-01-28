/*
*小肥牛扫码点餐项目API子系统
*/



const port = 8091;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoryRouter =require('./routes/admin/category');
const userAdmin = require('./routes/admin/admin')

//创建http应用服务器
var app = express();
app.listen(port, ()=>{ 
  console.log('API服务器启动成功,Server Listening'+port);
  console.log(new Date().toLocaleString());
});

//使用中间件
app.use(cors());
app.use(bodyParser.json());//吧json格式的請求主体数据解析放在req.body属性
//挂载路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',userAdmin);

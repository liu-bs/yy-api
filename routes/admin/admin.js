/*
*管理员相关路由
*/
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports=router;
/*
*API: GET /admin/login/：aname/apwd
*请求数据：{aname:'xxx',apwd:'....'}
*返回数据
{code:200,msg;"login success"}
{code:400,msg;"aname or apwd err"}
*/
router.get('/:aname/:apwd',(req,res)=>{
    var aname = req.params.aname;
    var apwd = req.params.apwd;
    console.log(aname,apwd)
    //需对用户输入的密码执行加密函数
    pool.query('select aid from xfn_admin where aname=? and apwd=password(?)',[aname,apwd],(err,result)=>{
        if(err) throw err;
        console.log(result)
        if(result.length>0){
            //查询到一行数据，登陆成功
            res.send({code:200,msg:'login sucess'})
        }else{
            //没有查询到数据
            res.send({code:400,msg:'name or apwd err'})
        }
        
    })
})



/*
*API: PATCH /admin/login
*请求数据：{aname:'xxx',oldaPwd:'....',newPwd:'....'}
*根据管理员名和密码修改管理员密码
*返回数据
{code:200,msg;"login success"}
{code:400,msg;"aname or apwd err"}
{code:401,msg;"apwd not modified"}
*/
router.patch('/',(req,res)=>{
    var data = req.body;
    pool.query('select aid from xfn_admin where aname=? and apwd=password(?)',[data.aname,data.oldPwd],(err,result)=>{
        if(err)throw err;
        if(result.length==0){
            res.send({code:400,msg:"apwd or aname err"});
            return;
        }
        //如果查询到用户，再修改密码
        pool.query('update xfn_admin set apwd=password(?) where aname=?',[data.newPwd,data.aname],(err,result)=>{
            if(err) throw err;
            if(result.changedRows>0){
                //密码修改完成
                res.send({code:200,msg:"apwd mdified"})
            }else{
                //新旧密码不一样，修改失败
                res.send({code:400,msg:"apwd filed"})
            }
        })
        
    })
    console.log(data)
})
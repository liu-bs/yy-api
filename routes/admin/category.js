/*
*菜品类别相关的路由
*/
const express = require("express");
const pool = require("../../pool");
var router = express.Router();
module.exports=router;
/*
*API：GET /admin/category     restful设计风格
*含义：客户端获取所有菜品类别，按升序排列
*返回值
*[{cid:1,cname:""},{...}]
*/
router.get('/',(req,res)=>{
    var sql = 'select * from xfn_category order by cid';
    pool.query(sql,(err,result)=>{
        if(err)throw err;
        console.log(result)
        res.send(result);
    })
})


/*
*API：DELETE /admin/category/:cid   restful设计风格
*含义：根据理由参数菜品编号，删除该菜品
*返回值
*{code:200,msg:"1 category deleted"}
*{code:400,msg:"0 category deleted"}
*/
router.delete('/:cid',(req,res)=>{
    //注意：删除菜品类别前必须先把属于该类别的菜品的类别编号设置null
    pool.query('update xfn_dish set categoryId=null where categoryId=?',req.params.cid,(err,result)=>{
        if(err) throw err;
        //至此指定类别的菜品已经修改完毕
    });
    pool.query('delete from xfn_category where cid=?',req.params.cid,(err,result)=>{
        if(err)throw err;
        //获取delete语句在数据中的行数
        if(result.affectedRows>0){
            res.send({code:200,msg:"1 category deleted}"})
        }else{
            res.send({code:400,msg:"0 category deleted"})
        }
    })
})

/*API：POST /admin/category   restful设计风格
*请求主体参数：{cname:'...',cid:'...'}
*含义：根据菜品类别编号修改该类别
*返回值
*{code:200,msg:"1 category added",cid:'...'}
*/
router.post('/',(req,res)=>{
    var data = req.body;
    console.log(req.body)
    pool.query('insert into xfn_category set ?',data,(err,result)=>{
        if(err)throw err;
        res.send({code:200,msg:"1 category added"});
      
    })
})


/*API：PUT /admin/category   restful设计风格
*请求主体参数：{cname:'...'}
*含义：添加新的菜品类别
*含义：根据理由参数菜品编号，删除该菜品
*返回值
*{code:200,msg:"1 category modfied"}
*{code:400,msg:"0 category modfied",not exists}
*{code:401,msg:"0 category modfied",no modification}
*/
router.put('/',(req,res)=>{
    var data = req.body;//请求数据{cid:xx,cname:"..."}
    //TODO:此处可对数据进行验证
    pool.query('update xfn_category set ? where cid=?',[data,data.cid],(err,result)=>{
        if(err)throw err;
        if(result.changedRows>0){//实际修改一行
            res.send({code:200,msg:'1 category modified'})
        }else if(result.affectedRows==0){//不存在
            res.send({code:400,msg:'category not exits'})
        }else if(result.affectedRows==1 && result.changedRows==0){//影响了一行  没修改
            res.send({code:401,msg:'no category modified'})
        }
    })
})
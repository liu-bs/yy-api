/**
 * 全局设置路由器
 */
const express = require('express');
const router = express.Router();
const pool = require('../../pool');
module.exports = router;

/*
*GET /admin/settings
*获取所有的桌台信息
*返回数据：
*   [
    {tid:xxx,tname:'xxx',status:xxx}
]
*/
router.get('/',(req,res)=>{
  pool.query('SELECT * FROM xfn_table ORDER BY tid',(err,result)=>{
    if(err) throw err;
    res.send(result);    //查询语句   数组里一条数据
  })
})


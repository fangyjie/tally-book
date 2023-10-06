const express = require('express')
// 导入 jwt
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/config')
// 导入 用户的模型
const UserModel = require('../../models/UserModel')
const md5 = require('md5')

const router = express.Router()

// 登录操作
router.post('/login', (req, res) => {
  // 获取用户名和密码
  let { username, password } = req.body
  // 查询数据库
  UserModel.findOne({ username: username, password: md5(password) })
    .then((data) => {
      // 判断 data
      if (data) {
        // 创建当前用户的 token
        let token = jwt.sign(
          {
            username: data.username,
            _id: data._id
          },
          secret,
          {
            expiresIn: 60 * 60 * 24 * 7 // 单位是秒
          }
        )
        // 响应 token
        res.json({
          code: '0000',
          msg: '登录成功',
          data: token
        })
      } else {
        res.json({
          code: '2002',
          msg: '账号或密码错误~~',
          data: null
        })
      }
    })
    .catch(() => {
      res.json({
        code: '2001',
        msg: '数据库读取失败~~',
        data: null
      })
    })
})

// 退出登录
router.post('/logout', (req, res) => {
  // 销毁 session
  req.session.destroy(() => {
    res.render('success', { msg: '退出成功', url: '/login' })
  })
})

module.exports = router

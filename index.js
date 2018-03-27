var Koa = require('koa')
var body = require('koa-body')
var json = require('koa-json')
var Loki = require('lokijs')

var app = new Koa()
var db = new Loki('db.json')
var logs = db.addCollection('logs')

app.context.db = logs
app.use(body())
app.use(json())

app.use(ctx => {
  if (ctx.request.path === '/favicon.ico') {
    return
  } else if (ctx.request.path === '/inspect') {
    ctx.body = ctx.db.find({})
  } else {
    ctx.body = { reposne: 'ok' }
    ctx.db.insert({
      url: ctx.request.url,
      origin: ctx.request.origin,
      ip: ctx.request.ip,
      method: ctx.request.method,
      headers: ctx.request.headers,
      query: ctx.request.query,    
      body: ctx.request.body,
      date: new Date()
    })
  }
})

app.listen(8000)

console.log('Started on http://localhost:8000')

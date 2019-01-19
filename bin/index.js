const Koa = require('koa');
const router = require('koa-router')();
const globals = require('../global/global');
const session = require('koa-session');
const UserDB = require('../model/user');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.keys = ['com.huawei.consumer.' + Math.random().toString()];
// Use a different key every time the server is setup

const SESSION_CONFIG = {
  key: 'koa:sess',
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false, 
  renew: false,
};

app.use(session(SESSION_CONFIG, app));
app.use(bodyParser())

router.get('/user/*', async (ctx, next) => {
  if (ctx.session.user) {
    await next();
  }
  else {
    ctx.body = {
      status: "Failed",
      message: "You've not signed in yet"
    };
  }
})

router.all('/data/*', async (ctx, next) => {
  if (ctx.session.user) {
    await next();
  }
  else {
    ctx.body = {
      status: "Failed",
      message: "You've not signed in yet"
    };
  }
})

router.post('/user/sign_up', async ctx => {
  if(ctx.request.body.username === undefined || ctx.request.body.password === undefined) {
    ctx.body = {
      status: "Failed",
      message: "Invalid usage"
    }
    return;
  }
  let [err, status] = await UserDB.addUser(ctx.request.body)
  if (err) {
    ctx.throw(500, 'Server error');
  }
  else if (status !== true) {
    ctx.body = {
      status: "Failed",
      message: "This username has been occupied."
    }
  }
  else {
    ctx.body = {
      status: "OK"
    }
  }
})

router.post('/user/login', async ctx => {
  if(ctx.request.body.username === undefined || ctx.request.body.password === undefined) {
    ctx.body = {
      status: "Failed",
      message: "Invalid usage"
    }
    return;
  }
  let [err, status] = await UserDB.checkPass(ctx.request.body)
  if (err) {
    ctx.throw(500, 'Server error');
  }
  else if (status !== true) {
    ctx.body = {
      status: "Failed",
      message: "Username does not exist or invalid password"
    }
  }
  else {
    ctx.session.user = ctx.request.body.username
    ctx.body = {
      status: "OK"
    }
  }
})

router.post('/user/update', async ctx => {
  if(ctx.request.body.username === undefined || 
    ctx.request.body.password === undefined || 
    ctx.request.body.oldPassword === undefined) {
    ctx.body = {
      status: "Failed",
      message: "Invalid usage"
    }
    return;
  }

  let [err, status] = await UserDB.updateUser(ctx.request.body);
  if (err) {
    ctx.throw(500, 'Server error');
  }
  else if (status !== true) {
    ctx.body = {
      status: "Failed",
      message: "Invalid password"
    }
  }
  else {
    ctx.session.user = null;
    ctx.body = {
      status: "OK"
    }
  }
})

router.get('/user/logout', async ctx => {
  ctx.session.user = null;
  ctx.body = {
    status: "OK"
  }
})

router.get('/data/get_time', async ctx => {
  let [err, rows] = await UserDB.getUpdateTime({
    username: ctx.session.user
  })
  if (err) {
    ctx.throw(500, 'Server error');
  }
  else {
    ctx.body = {
      status: 'OK',
      time: rows[0]
    }
  }
})

router.post('/data/put', async ctx => {
  if (ctx.request.body.data === undefined) {
    ctx.body = {
      status: "Failed",
      message: "Invalid usage"
    }
    return;
  }

  let [err, status] = await UserDB.putData(ctx.request.body)
  if (err) {
    ctx.throw(500, 'Server error');
    console.error(err);
  }
  else {
    ctx.body = {
      status: 'OK'
    }
  }
})

router.get('/data/get', async ctx => {
  let [err, rows] = await UserDB.getData({
    username: ctx.session.user
  })
  if (err) {
    ctx.throw(500, 'Server error');
    console.error(err);
  }
  else {
    ctx.body = {
      status: 'OK',
      data: rows[0]
    }
  }
})

// ---Test Module Begin--- //
// You should comment all codes in this module //
// When the server code is formally deployed //

const serve = require('koa2-static-middleware');
router.get('/test/*', serve('./test'));

// ---Test Module End--- //

router.all('*', async ctx => {
  ctx.throw(404, "PAGE_NOT_FOUND");
})

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(async (ctx, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log(`Time: ${ms}ms`);
});

app.use(router.routes());
app.listen(Number(globals.LISTEN_PORT));

console.log('Listening at port', globals.LISTEN_PORT);
require('dotenv').config();
const Koa=require('koa');
const Router=require('koa-router');
const bodyParser=require('koa-bodyparser');
const api=require('./api');
const app=new Koa();
const router=new Router();
const mongoose=require('mongoose');
const session=require('koa-session');
const {
    PORT:port=4000,//값이 존재 하지 않으면 기본적으로 4000값으로 설정
    MONGO_URI:mongoURI,
    COOKIE_SIGN_KEY:signKey
}=process.env;
//mongoose.Promise=global.Promise;//Node의 Promise를 사용하도록 설정 
mongoose.connect(mongoURI,{useNewUrlParser:true}).then(()=>{
    console.log('connected to mongodb');
}).catch((e)=>{
    console.error(e);
})
//라우터 설정 
router.use('/api',api.routes());//api 라우트 적용 
//라우터 적용 전에 bodyParser 적용 
app.use(bodyParser());

//세션/키 적용 
const sessionConfig={
    maxAge:864000000,//하루
    //signed:true(기본으로 설정되어 있습니다.)
};
app.use(session(sessionConfig,app));
app.keys=[signKey];
//app 인스턴스에 라우터 적용 
app.use(router.routes()).use(router.allowedMethods);
app.listen(port,()=>{
    console.log('listening to port',port);
});
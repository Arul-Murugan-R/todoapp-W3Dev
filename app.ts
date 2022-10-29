import express from 'express'
import authRoute from './routes/auth' 
import homeRoute from './routes/home'
import bodyParser from 'body-parser' 
require('dotenv').config()
import path from 'path'
import session from 'express-session'
import mongoose from 'mongoose'
const store = require('connect-mongodb-session')(session)
import Users from './models/users'
declare global {
    namespace Express {
      interface Request {
        user: {
            _id:string,
            name:string,
            email:string,
            password:string,
            product:[{
              title:string,
              _id:undefined,
              status:string,
            }]
        }
      }
    }
  }
declare module "express-session" {
    interface SessionData {
      user: {
        _id:string,
        name:string,
        email:string,
        password:string,
        product:[{
          title:string,
          _id:undefined,
          status:string,
        }]
      },
      isLoggedIn:boolean,
    }
  }
const app = express()
const URI = `mongodb+srv://${process.env.NAME}:${process.env.DPASS}@cluster0.1tdiu.mongodb.net/${process.env.dbname}`
const Store = new store({
    uri:URI,
    collection:'session'
})
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret:'something',
    resave: false,
    saveUninitialized: true,
    store:Store
}))
app.set('view engine','ejs')
app.set('views','views')

app.use(express.static(path.join(__dirname,'public')))

app.use(async (req:express.Request,res,next)=>{
    res.locals.login = req.session.isLoggedIn
    res.locals.message = ''
    if(!req.session.user){
        return next()
    }
    const user = await Users.findById(req.session.user._id)
    if(user){
        req.user=user
        next()
    }
})

app.use(authRoute)
app.use(homeRoute)


mongoose.connect(URI,()=>{
    app.listen(process.env.PORT || 3000)
})
import { Router } from 'express'
import Users from '../models/users'
import bcrypt from 'bcrypt'
import express from 'express'
import auth from '../middleware/auth'
const route = Router()

route.post('/login', async (req:express.Request, res, next) => {
    console.log(req.body);
    const {email,password} = req.body;
    const user = await Users.findOne({email})
    if(!user){
        return res.render('login', {
            title: 'Login Page',
             url: req.originalUrl,
              message: 'User Does not Exists'
            })
    }
    if(user){
        const compare = await bcrypt.compare(password,user.password)
        if(compare){
            req.session.isLoggedIn=true;
            req.session.user=user
            return res.redirect('/')
        }
        else{
            return res.render('login', {
                title: 'Login Page',
                 url: req.originalUrl,
                  message: 'Incorrect Password'
                })
        }
    }

})
route.post('/signup', async (req, res, next) => {
    console.log(req.body);
    const {name,email,password} = req.body;
    const user =  await Users.findOne({email:email})
    if(user){
        return res.render('signup', {
        title: 'SignUp Page',
         url: req.originalUrl,
          message: 'User Already Exist'
        })
    }
    else if(!user){
        const hash = await bcrypt.hash(password,12)
        if(hash){
            console.log(hash);
            const user = new Users(
                {
                    name,
                    email,
                    password:hash,
                }
            )
            const userStatus = await user.save()
            if(userStatus){
                res.render('login', { title: 'Home Page', url: req.originalUrl, message: 'Signed Up Successfully' })
            }
        }
    }

})
route.get('/login', (req, res, next) => {
    res.render('login', { title: 'Home Page', url: req.originalUrl, message: '' })
})
route.get('/signup', (req, res, next) => {
    res.render('signup', { title: 'SignUp Page', url: req.originalUrl, message: null })
})

route.use('/logout',auth,(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})


export default route
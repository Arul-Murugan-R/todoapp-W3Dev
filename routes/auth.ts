import { Router } from 'express'
import Users from '../models/users'
import bcrypt from 'bcrypt'
import express from 'express'
import auth from '../middleware/auth'
import {body,validationResult} from 'express-validator/check'

const route = Router()

route.post('/login',
[
    body('email').not().isEmpty().withMessage('Requires Email').isEmail().withMessage('Invalid Email'),
    body('password').not().isEmpty().withMessage('Requires Password'),
],
async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const errors = validationResult(req)
    // console.log(errors.array())
    if(!errors.isEmpty()){
        let message = {detail:errors.array()[0].msg,type:'Failed'}
        return res.render('login',{
            url:req.originalUrl,
            title:'Login Page',
            message
        })
    }
    // console.log(req.body);
    const {email,password} = req.body;
    const user = await Users.findOne({email})
    if(!user){
        let message = {detail:'User Does not Exists',type:'Failed'}
        return res.render('login', {
            title: 'Login Page',
             url: req.originalUrl,
              message
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
        let message = {detail: 'Incorrect Password',type:'Failed'}
            return res.render('login', {
                title: 'Login Page',
                 url: req.originalUrl,
                  message
                })
        }
    }

})
route.post('/signup',[
    body('name').not().isEmpty().withMessage('Requires Name').isLength({min:4}).withMessage('Check For the size of name'),
    body('email').not().isEmpty().withMessage('Requires Email'),
    body('password').not().isEmpty().withMessage('Requires Password').isLength({min:5}).withMessage('Weak Password Less Size')
], async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const errors = validationResult(req)
    // console.log(errors.array())
    if(!errors.isEmpty()){
        let message = {detail: errors.array()[0].msg,type:'Failed'}
        return res.render('signup',{
            url:req.originalUrl,
            title:'SignUp Page',
            message,
            values:req.body
        })
    }
    // console.log(req.body);
    const {name,email,password} = req.body;
    const user =  await Users.findOne({email:email})
    if(user){
        let message = {detail: 'User Already Exist',type:'Failed'}
        return res.render('signup', {
        title: 'SignUp Page',
         url: req.originalUrl,
        message
        })
    }
    else if(!user){
        const hash = await bcrypt.hash(password,12)
        if(hash){
            // console.log(hash);
            const user = new Users(
                {
                    name,
                    email,
                    password:hash,
                    product:[]
                }
            )
            const userStatus = await user.save()
            if(userStatus){
                let message = {detail: 'Signed Up Successfully',type:'Success'}
                res.render('login', { title: 'Home Page', url: req.originalUrl, message })
            }
        }
    }

})
route.get('/login', (req, res, next) => {
    res.render('login', { title: 'Home Page', url: req.originalUrl})
})
route.get('/signup', (req, res, next) => {
    res.render('signup', { title: 'SignUp Page', url: req.originalUrl })
})

route.use('/logout',auth,(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
})


export default route
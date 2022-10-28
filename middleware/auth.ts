import express from 'express'
export default (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login')
    }
    next()
}

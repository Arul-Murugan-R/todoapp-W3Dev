import { Router } from 'express'
import auth from '../middleware/auth'
import users from '../models/users'
const route = Router()

route.post('/add-todo',auth,async (req,res,next)=>{
    const user = await users.findById(req.user._id)
    if(user){
        user.product.push({
            title: req.body.title,
             status: 'pending',
            _id: undefined
        })
        const added = await user.save()
        if(added){
            console.log('pro added successfully');
            res.redirect('/')
        }
    }
})
route.use('/delete/:id',auth,async (req,res,next)=>{
    const user = await users.findById(req.user._id)
    if(user){
        // let filteredIndex: number = await user.product.findIndex((todo)=>{return todo._id.toString()===req.params.id})
        let filteredItem = await user.product.filter((todo)=>{return todo._id.toString()!==req.params.id})
        console.log(user.product,user);
        await user.$set({product:filteredItem})
        await user.save()
        console.log('Pro deleted successfully');
        res.redirect('/')
    }
})

route.use('/done/:id',auth,async (req,res,next)=>{
    const user = await users.findById(req.user._id)
    if(user){
        const statusIndex = await user.product.findIndex((todo)=>{return todo._id.toString() === req.params.id })
        req.user.product[statusIndex].status = 'done'
        await user.$set({product:req.user.product})
        user.save()
        console.log('Pro Updated Sucessfully');
        res.redirect('/')
    }
})
route.use('/pending/:id',auth,async (req,res,next)=>{
    const user = await users.findById(req.user._id)
    if(user){
        const statusIndex = await user.product.findIndex((todo)=>{return todo._id.toString() === req.params.id })
        // console.log(statusIndex);
        req.user.product[statusIndex].status = 'pending'
        // console.log(req.user.product);
        await user.$set({product:req.user.product})
        await user.save()
        console.log('Pro Updated Sucessfully');
        res.redirect('/')
    }
})
route.post('/search',auth,async (req,res,next)=>{
    const { search } = req.body
    const todoFetched = await req.user.product
    let todoList = []
    for(let todo of todoFetched){
        if(todo.title.toLowerCase().includes(search.toString().toLowerCase())){
            todoList.push(todo)
        }
    }
    let searched = {title:search,count:todoList.length}
    res.render('home',{title:'Home Page',url:req.originalUrl,todos:todoList,searched})
})
route.use('/search',auth,async (req,res,next)=>{
    res.render('home',{title:'Home Page',url:req.originalUrl,todos:req.user.product,searched:null})
})
route.use('/filter/pending',auth,async (req,res,next)=>{
    let todoFiltered = await req.user.product.filter((todo)=>{return todo.status=='pending'})
    res.render('home',{title:'Home Page',url:req.originalUrl,todos:todoFiltered})
})
route.use('/filter/completed',auth,async (req,res,next)=>{
    let todoFiltered = await req.user.product.filter((todo)=>{return todo.status=='done'})
    res.render('home',{title:'Home Page',url:req.originalUrl,todos:todoFiltered})
})
route.use('/filter/all',auth,async (req,res,next)=>{
    res.render('home',{title:'Home Page',url:req.originalUrl,todos:req.user.product})
})

route.use('/',auth,async (req,res,next)=>{
    res.render('home',{title:'Home Page',url:req.originalUrl,todos:req.user.product})
})

export default route
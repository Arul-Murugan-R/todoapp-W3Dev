"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const users_1 = __importDefault(require("../models/users"));
const route = (0, express_1.Router)();
route.post('/add-todo', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findById(req.user._id);
    if (user) {
        user.product.push({
            title: req.body.title,
            status: 'pending',
            _id: undefined
        });
        const added = yield user.save();
        if (added) {
            console.log('pro added successfully');
            res.redirect('/');
        }
    }
}));
route.use('/delete/:id', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findById(req.user._id);
    if (user) {
        // let filteredIndex: number = await user.product.findIndex((todo)=>{return todo._id.toString()===req.params.id})
        let filteredItem = yield user.product.filter((todo) => { return todo._id.toString() !== req.params.id; });
        console.log(user.product, user);
        yield user.$set({ product: filteredItem });
        yield user.save();
        console.log('Pro deleted successfully');
        res.redirect('/');
    }
}));
route.use('/done/:id', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findById(req.user._id);
    if (user) {
        const statusIndex = yield user.product.findIndex((todo) => { return todo._id.toString() === req.params.id; });
        req.user.product[statusIndex].status = 'done';
        yield user.$set({ product: req.user.product });
        user.save();
        console.log('Pro Updated Sucessfully');
        res.redirect('/');
    }
}));
route.use('/pending/:id', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findById(req.user._id);
    if (user) {
        const statusIndex = yield user.product.findIndex((todo) => { return todo._id.toString() === req.params.id; });
        // console.log(statusIndex);
        req.user.product[statusIndex].status = 'pending';
        // console.log(req.user.product);
        yield user.$set({ product: req.user.product });
        yield user.save();
        console.log('Pro Updated Sucessfully');
        res.redirect('/');
    }
}));
route.post('/search', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.body;
    const todoFetched = yield req.user.product;
    let todoList = [];
    for (let todo of todoFetched) {
        if (todo.title.toLowerCase().includes(search.toString().toLowerCase())) {
            todoList.push(todo);
        }
    }
    let searched = { title: search, count: todoList.length };
    res.render('home', { title: 'Home Page', url: req.originalUrl, todos: todoList, searched });
}));
route.use('/search', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('home', { title: 'Home Page', url: req.originalUrl, todos: req.user.product, searched: null });
}));
route.use('/filter/pending', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let todoFiltered = yield req.user.product.filter((todo) => { return todo.status == 'pending'; });
    res.render('home', { title: 'Home Page', url: req.originalUrl, todos: todoFiltered });
}));
route.use('/filter/completed', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let todoFiltered = yield req.user.product.filter((todo) => { return todo.status == 'done'; });
    res.render('home', { title: 'Home Page', url: req.originalUrl, todos: todoFiltered });
}));
route.use('/filter/all', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('home', { title: 'Home Page', url: req.originalUrl, todos: req.user.product });
}));
route.use('/', auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('home', { title: 'Home Page', url: req.originalUrl, todos: req.user.product });
}));
exports.default = route;

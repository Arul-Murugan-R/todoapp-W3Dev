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
const users_1 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = __importDefault(require("../middleware/auth"));
const route = (0, express_1.Router)();
route.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, password } = req.body;
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        return res.render('login', {
            title: 'Login Page',
            url: req.originalUrl,
            message: 'User Does not Exists'
        });
    }
    if (user) {
        const compare = yield bcrypt_1.default.compare(password, user.password);
        if (compare) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return res.redirect('/');
        }
        else {
            return res.render('login', {
                title: 'Login Page',
                url: req.originalUrl,
                message: 'Incorrect Password'
            });
        }
    }
}));
route.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, email, password } = req.body;
    const user = yield users_1.default.findOne({ email: email });
    if (user) {
        return res.render('signup', {
            title: 'SignUp Page',
            url: req.originalUrl,
            message: 'User Already Exist'
        });
    }
    else if (!user) {
        const hash = yield bcrypt_1.default.hash(password, 12);
        if (hash) {
            console.log(hash);
            const user = new users_1.default({
                name,
                email,
                password: hash,
            });
            const userStatus = yield user.save();
            if (userStatus) {
                res.render('login', { title: 'Home Page', url: req.originalUrl, message: 'Signed Up Successfully' });
            }
        }
    }
}));
route.get('/login', (req, res, next) => {
    res.render('login', { title: 'Home Page', url: req.originalUrl, message: '' });
});
route.get('/signup', (req, res, next) => {
    res.render('signup', { title: 'SignUp Page', url: req.originalUrl, message: null });
});
route.use('/logout', auth_1.default, (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});
exports.default = route;

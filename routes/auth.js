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
const check_1 = require("express-validator/check");
const route = (0, express_1.Router)();
route.post('/login', [
    (0, check_1.body)('email').not().isEmpty().withMessage('Requires Email').isEmail().withMessage('Invalid Email'),
    (0, check_1.body)('password').not().isEmpty().withMessage('Requires Password'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    // console.log(errors.array())
    if (!errors.isEmpty()) {
        let message = { detail: errors.array()[0].msg, type: 'Failed' };
        return res.render('login', {
            url: req.originalUrl,
            title: 'Login Page',
            message
        });
    }
    // console.log(req.body);
    const { email, password } = req.body;
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        let message = { detail: 'User Does not Exists', type: 'Failed' };
        return res.render('login', {
            title: 'Login Page',
            url: req.originalUrl,
            message
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
            let message = { detail: 'Incorrect Password', type: 'Failed' };
            return res.render('login', {
                title: 'Login Page',
                url: req.originalUrl,
                message
            });
        }
    }
}));
route.post('/signup', [
    (0, check_1.body)('name').not().isEmpty().withMessage('Requires Name').isLength({ min: 4 }).withMessage('Check For the size of name'),
    (0, check_1.body)('email').not().isEmpty().withMessage('Requires Email'),
    (0, check_1.body)('password').not().isEmpty().withMessage('Requires Password').isLength({ min: 5 }).withMessage('Weak Password Less Size')
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, check_1.validationResult)(req);
    // console.log(errors.array())
    if (!errors.isEmpty()) {
        let message = { detail: errors.array()[0].msg, type: 'Failed' };
        return res.render('signup', {
            url: req.originalUrl,
            title: 'SignUp Page',
            message,
            values: req.body
        });
    }
    // console.log(req.body);
    const { name, email, password } = req.body;
    const user = yield users_1.default.findOne({ email: email });
    if (user) {
        let message = { detail: 'User Already Exist', type: 'Failed' };
        return res.render('signup', {
            title: 'SignUp Page',
            url: req.originalUrl,
            message
        });
    }
    else if (!user) {
        const hash = yield bcrypt_1.default.hash(password, 12);
        if (hash) {
            // console.log(hash);
            const user = new users_1.default({
                name,
                email,
                password: hash,
                product: []
            });
            const userStatus = yield user.save();
            if (userStatus) {
                let message = { detail: 'Signed Up Successfully', type: 'Success' };
                res.render('login', { title: 'Home Page', url: req.originalUrl, message });
            }
        }
    }
}));
route.get('/login', (req, res, next) => {
    res.render('login', { title: 'Home Page', url: req.originalUrl });
});
route.get('/signup', (req, res, next) => {
    res.render('signup', { title: 'SignUp Page', url: req.originalUrl });
});
route.use('/logout', auth_1.default, (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});
exports.default = route;

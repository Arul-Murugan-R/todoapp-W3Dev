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
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const home_1 = __importDefault(require("./routes/home"));
const body_parser_1 = __importDefault(require("body-parser"));
require('dotenv').config();
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const store = require('connect-mongodb-session')(express_session_1.default);
const users_1 = __importDefault(require("./models/users"));
const app = (0, express_1.default)();
const URI = `mongodb+srv://${process.env.NAME}:${process.env.DPASS}@cluster0.1tdiu.mongodb.net/${process.env.dbname}`;
const Store = new store({
    uri: URI,
    collection: 'session'
});
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({ secret: 'something',
    resave: false,
    saveUninitialized: true,
    store: Store
}));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.login = req.session.isLoggedIn;
    res.locals.message = '';
    if (!req.session.user) {
        return next();
    }
    const user = yield users_1.default.findById(req.session.user._id);
    if (user) {
        req.user = user;
        next();
    }
}));
app.use(auth_1.default);
app.use(home_1.default);
mongoose_1.default.connect(URI, () => {
    app.listen(process.env.PORT || 3000);
});

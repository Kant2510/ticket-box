import express from 'express'
import morgan from 'morgan'
import path from 'path'
import compression from 'compression'
import session from "express-session";
import cors from 'cors'
const configViewEngine = (app) => {
    const __dirname = path.resolve()
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'src', 'views'));
    app.use(express.static(path.join(__dirname, 'src', 'public')));
    app.use(cors());


    app.use(compression());
    // HTTP logger
    app.use(morgan('tiny'));
    app.use(express.urlencoded({ extended: true })); // For parsing form data
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: true,
    }));
    app.use(express.json()); // Để xử lý dữ liệu JSON
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

};

export default configViewEngine


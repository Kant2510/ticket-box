import express from 'express';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import session from 'express-session';

const configViewEngine = (app) => {
    const __dirname = path.resolve();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'src', 'views'));
    app.use(express.static(path.join(__dirname, 'src', 'public')));

    app.use(compression());
    app.use(morgan('tiny'));
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Set secure cookies in production
            httpOnly: true, // Mitigate XSS attacks
            maxAge: 3600000, // 1 hour expiration
        }
    }));
    app.use(express.json());
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
};

export default configViewEngine;

// main.js or app.js
import express from 'express';
import configViewEngine from './configs/viewEngine.js';
import indexRoutes from './routes/index.js';
import('./dbs/init.mongodb.js')
import accessController  from './controllers/access.controller.js';


const app = express()

// Connect to MongoDB

// Middlewares

// View engine
configViewEngine(app);
app.use(indexRoutes)
app.get('/logout', (req, res) => {
    accessController.logout(req, res);
});

// Error handling middleware
// app.use((err, req, res, next) => {
//     if (process.env.NODE_ENV === 'production') {
//         return res.render('404');
//     } else {
//         if (err instanceof ErrorResponse) {
//             return res.status(err.statusCode).json({
//                 message: err.message,
//                 stack: err.stack,
//             });
//         } else {
//             return res.status(500).json({
//                 message: 'An unexpected error occurred',
//                 error: err.message,
//                 stack: err.stack,
//             });
//         }
//     }
// });

// Start the server

export default app

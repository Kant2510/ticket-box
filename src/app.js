
// main.js or app.js
import express from 'express';
import configViewEngine from './configs/viewEngine.js';
import indexRoutes from './routes/index.js';
import accessController  from './controllers/access.controller.js';
import'./dbs/init.mongodb.js'
import path from "path";
const __dirname = path.resolve()
const app = express()
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "src", 'public'))); // Thư mục public nằm ở root
app.set('views', path.join(process.cwd(), 'src/views'));

configViewEngine(app);
// Login and Admin routes
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'Ticketbox1234@') {
    return res.redirect('/adminPage-create');
  } else {
    return res.status(400).send('Đăng nhập không thành công!');
  }
});

app.get('/adminPage-create', (req, res) => {
  res.render('adminPage-create');
});

app.use(indexRoutes)
// Login and Admin routes

app.get('/logout', (req, res) => {
  accessController.logout(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'pro') {
    return res.render('404');
  } else {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    } else {
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: err.message,
        stack: err.stack,
      });
    }
  }
});

// Start the server

export default app

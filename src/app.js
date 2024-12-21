import express from 'express';
import configViewEngine from './configs/viewEngine.js';
import indexRoutes from './components/routes/index.js';

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

// Serve static files (JavaScript, CSS, images, etc.)
app.use(express.static('public'));  // Make sure 'formhandles.js' is inside 'public/js'

// Connect to MongoDB
import ('./dbs/init.mongodb.js');

// Route to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@gmail.com') {
    return res.redirect('/adminPage');
  } else {
    return res.status(400).send('Đăng nhập không thành công!');
  }
});

// Route for the admin page
app.get('/adminPage', (req, res) => {
  res.render('adminPage');  // Render admin page view
});

// Middlewares for view engine and routing
configViewEngine(app);
app.use(indexRoutes);

export default app;

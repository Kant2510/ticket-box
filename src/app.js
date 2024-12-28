import express from 'express';
import configViewEngine from './configs/viewEngine.js';
import indexRoutes from './components/routes/index.js';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON format',
      error: err.message
    });
  }

  // Handle 404 errors
  if (err.status === 404) {
    return res.status(404).json({
      message: 'Resource not found',
      error: err.message
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Serve static files
app.use(express.static('public'));

// Connect to MongoDB
import ('./dbs/init.mongodb.js');

// Configure view engine
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

// API and other routes
app.use('/', indexRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;

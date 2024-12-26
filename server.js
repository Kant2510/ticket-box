import dotenv from 'dotenv'
dotenv.config()
import app from './src/app.js'
const PORT =  3005;

// const server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// })
//
// process.on('SIGINT', (err, promise) => {
//     server.close(() => {
//         console.log(`Server stopped`);
//         process.exit(1);
//     })
// })

export default app;
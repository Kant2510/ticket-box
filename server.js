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

<<<<<<< HEAD
process.on('SIGINT', (err, promise) => {
    server.close(() => {
        console.log(`Server stopped`);
        process.exit(1);
    })
})

// export default app;
=======
export default app;
>>>>>>> 1bf3b34a1f5056dbed472829fc8adefee6a3f0df

import dotenv from 'dotenv'
import app from './src/app.js'
dotenv.config()

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log(`Server stopped`)
        process.exit(1)
    })
})

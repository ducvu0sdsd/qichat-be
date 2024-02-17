const app = require('./src/app')
const port = 8080

const server = app.listen(port, () => {
    console.log("Running with port " + port)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'))
})
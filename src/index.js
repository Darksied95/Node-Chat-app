const express = require('express')
const app = require('./app')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/message')
const { generateLocation } = require('./utils/message')


const publicDirectory = path.join(__dirname, '../public')

const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(express.static(publicDirectory))

app.get('/', (_, res) => {
    res.send(publicDirectory)
})

const message = 'Welcome!!!'

io.on('connection', (socket) => {

    socket.emit('message', generateMessage(message))

    socket.broadcast.emit('message', generateMessage('A new user has joined'))

    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profane word(s) found')
        }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('User has logged off'))
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationHandler', generateLocation(`https://google.com/maps/?q=${coords.lat},${coords.long}`))
        callback()
    })
})

server.listen('3000', () => {
    console.log('Connected successfully');
})
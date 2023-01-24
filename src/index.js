const express = require('express')
const app = require('./app')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')


const publicDirectory = path.join(__dirname, '../public')

const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(express.static(publicDirectory))

app.get('/', (req, res) => {
    res.send(publicDirectory)
})

const message = 'Welcome!!!'
io.on('connection', (socket) => {
    socket.emit('message', message)
    socket.broadcast.emit('message', 'A new user has joined')
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
    socket.on('disconnect', () => {
        io.emit('message', 'User has logged off')
    })

    socket.on('sendLocation', (coords) => {
        socket.broadcast.emit('message', coords)
    })
})

server.listen('3000', () => {
    console.log('Connected successfully');
})
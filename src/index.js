const express = require('express')
const app = require('./app')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/message')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

const publicDirectory = path.join(__dirname, '../public')

const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())
app.use(express.static(publicDirectory))

app.get('/', (_, res) => {
    res.send(publicDirectory)
})


io.on('connection', (socket) => {


    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`))
        callback()
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profane word(s) found')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationHandler', generateLocation(user.username, `https://google.com/maps/?q=${coords.lat},${coords.long}`))
        callback()
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left`))

        }
    })

})

server.listen('3000', () => {
    console.log('Connected successfully');
})
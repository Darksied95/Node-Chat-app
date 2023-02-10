const socket = io()
const input = document.getElementById("input")
const form = document.getElementById("form")
const button = document.querySelector("#submit")
const sendLocation = document.getElementById('send-location')
const messages = document.getElementById('messages')
const messageTemplate = document.getElementById("message-template").innerHTML
const locationTemplate = document.getElementById("location-template").innerHTML


let { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (messageObject) => {
    const html = Mustache.render(messageTemplate, {
        message: messageObject.text, createdAt: moment(messageObject.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)


})

socket.on('locationHandler', (locationObject) => {
    const html = Mustache.render(locationTemplate, {
        location: locationObject.url,
        createdAt: moment(locationObject.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})


socket.emit('join', { username, room })
form
    .addEventListener('submit', (e) => {
        e.preventDefault()

        button.setAttribute('disabled', 'disabled')

        if (input.value === "") {
            button.removeAttribute('disabled')
            input.focus()
            return alert('Cannot send empty message')
        }

        socket.emit('sendMessage', input.value, (error) => {

            button.removeAttribute('disabled')

            input.focus()
            if (error) {
                return alert(error)
            }

            console.log('Message Delivered');
            input.value = ""
        })
    })

sendLocation
    .addEventListener('click', () => {
        sendLocation.setAttribute('disabled', 'disabled')
        let locator = navigator.geolocation
        if (!locator) {
            return console.log("Can't find location")
        }

        console.log('workimg');
        navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: long } }) => {
            socket.emit('sendLocation', { lat, long }, () => {
                console.log("Location shared to the console successfully")
            })
        })
        sendLocation.removeAttribute('disabled')
    })




const socket = io()

socket.on('message', (message) => {
    console.log(message);
})


let input = document.getElementById("input")

document
    .getElementById("form")
    .addEventListener('submit', (e) => {
        e.preventDefault()
        if (input.value === "") {
            return alert('Cannot send empty message')
        }
        socket.emit('sendMessage', input.value, (error) => {
            if (error) {
                return alert(error)
            }
            console.log('Message Delivered');
            input.value = ""
        })
    })

document
    .getElementById('send-location')
    .addEventListener('click', () => {
        let locator = navigator.geolocation
        if (!locator) {
            return console.log("Can't find location")
        }

        navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: long } }) => {
            socket.emit('sendLocation', { lat, long }, () => {
                console.log("Location shared to the console successfully")
            })
        })
    })
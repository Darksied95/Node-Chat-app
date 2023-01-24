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
        socket.emit('sendMessage', input.value)
        input.value = ""
    })

document
    .getElementById('send-location')
    .addEventListener('click', () => {
        let locator = navigator.geolocation
        if (!locator) {
            console.log("Can't find location")
            return;
        }

        navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: long } }) => {
            socket.emit('sendLocation', { lat, long })
        })
    })
function generateMessage(message) {
    return {
        text: message,
        createdAt: new Date().getTime()
    }
}


function generateLocation(url) {
    return {
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocation
}
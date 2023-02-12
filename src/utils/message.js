function generateMessage(username, message) {
    return {
        username,
        text: message,
        createdAt: new Date().getTime()
    }
}


function generateLocation(username, url) {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocation
}
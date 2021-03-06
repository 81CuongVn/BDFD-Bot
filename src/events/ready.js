const endpoints = ["handlers", "functions", "utils"]

module.exports = (client) => {
    endpoints.map(end => {
        require(`../${end}/${end.slice(0, end.length - 1)}Manager.js`)(client)
    })
    
    require("../managers/classManager")(client)
    
    try {
        client.handlers.loadCommands()
        
        client.handlers.fetchGiveaways()
        
        console.log(`Ready on client ${client.user.tag} and loaded ${client.commands.size} commands.`)
    } catch(err) {
        console.log(err)
        
        client.handlers.error(err)
    }
}
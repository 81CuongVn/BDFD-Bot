const endpoints = ["handlers", "functions", "utils"]

module.exports = (client) => {
    client.counters.events++
    endpoints.map(end => {
        require(`../${end}/${end.slice(0, end.length - 1)}Manager.js`)(client)
    })
    
    require("../managers/classManager")(client)
    
    try {
        blacklist(client)
        
        client.handlers.loadCommands()
        
        client.handlers.fetchGiveaways()
        
        console.log(`Ready on client ${client.user.tag} and loaded ${client.commands.size} commands.`)
    } catch(err) {
        console.log(err)
        
        client.handlers.error(err)
    }
}

function blacklist(client) {
    client.db.all().filter(a => a.ID.includes("data_")).map(a => {
        if (JSON.parse(a.data).blacklisted) client.blacklist.set(a.ID.split("_")[1], true)
    })
}
module.exports = (client) => {
    for (const folders of client.fs.readdirSync("./src/commands/")) {
        for (const files of client.fs.readdirSync(`./src/commands/${folders}/`)) {
            const path = `../commands/${folders}/${files}`
            
            delete require.cache[require.resolve(path)]
            
            const cmd = require(path)
            
            client.commands.set(cmd.name, cmd)
        }
    }
}
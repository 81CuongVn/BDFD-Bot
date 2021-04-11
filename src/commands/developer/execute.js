const { promisify } =require("util")
const exec = promisify(require("child_process").exec)

module.exports = {
    name: "execute",
    fields: ["code"],
    usages: ["code"],
    examples: ["npm i gay"],
    args: 1,
    aliases: ["exec"],
    description: "executes a command line on the powershell.",
    category: "developer",
    execute: async (client, message, args) => {
        const m = await message.channel.send(`Executing \`${args.join(" ")}\`...`)
        
        try {
            var output = await require("child_process").execSync(args.join(" "))
        } catch (err) {
            output = err.message
        }
        
        message.channel.send(output, {
            code: "js",
            split: true
        })
        .catch(err => {
            message.channel.send(err.message, {
                code: "js"
            })
        })
    }
}
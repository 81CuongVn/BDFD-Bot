module.exports = {
    name: "eval",
    descriotion: "just a eval command",
    category: "developer", 
    fields: ["code"],
    usages: ["<code>"], 
    slash: true, 
    cooldown: 2500,
    args: 1,
    examples: ["function test() { return 1; }"],
    execute: async(client, message, args) => {
        let depth = 0
        
        if (args[args.length - 1].startsWith("--depth")) {
            depth = Number(args.pop().split(":")[1]) || Infinity
        }
        
        try {
            var evaled = await eval(args.join(" "))
        } catch(err) {
            evaled = err.message
        }
        
        if (typeof evaled === "object") evaled = require("util").inspect(evaled, {depth})
        
        const inputs = [
            `**__Input__**:`,
            `\`\`\`js\n${args.join(" ")}\`\`\``,
            `**__Output__**`,
            `\`\`\`js\n${evaled}\`\`\``
        ]
            
        message.channel.send(inputs.join(""), {}).catch(err => {
            message.channel.send(`Output is too big.`)
        })
    }
}
const { promisify } = require("util")
const exec = promisify(require("child_process").exec)

module.exports = {
    name: "commit",
    description: "Im lazy so have to use this to commit",
    args: 1,
    usages: ["<commit>"],
    examples: ["added nothing"],
    fields: ["commit"],
    category: "developer",
    execute: async (client, message, args) => {
        const m = await message.channel.send(`Pushing...`)
       
        await exec("git add .")
        await exec(`git commit -m "${args.join(" ")}"`)
        await exec(`git push -u origin main`)
        
        m.edit(`Successfully commited`)
    }
}
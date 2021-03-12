var lastActivity = null 

module.exports = async (client, oldp, newp) => {
    if (newp.user.id === client.owners[0]) {
        const spot = newp.activities.find(a => a.name === "Spotify")
        if (!spot) {
            client.user.setActivity("Nekos conquer BDFD server", {
                type: "WATCHING"
            })
            lastActivity = null 
        } else {
            if (spot.details !== lastActivity) {
                lastActivity = spot.details 
                client.user.setActivity(`${spot.state} - ${spot.details}`, {
                    type: "LISTENING"
                })
            }
        }
    }
}
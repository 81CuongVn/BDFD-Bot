module.exports = (client) => {
    client.db.all().filter(a => a.ID.startsWith("giveaway_")).map(async d => {
        const data = JSON.parse(d.data)
        
        if (data.removeCache - Date.now() < 1) {
            client.db.delete(d.ID)
        } else {
            try {
                const gw = client.managers.Giveaway(data)
                
                if (!data.ended) gw.update()
                else {
                    gw.fetch()
                }
            } catch (err) {
                console.log(`Failed to fetch ${data.id} in channel ${data.channelID}: ${err.message}`)
            }
        }
    })
}
module.exports = (client, userID) => {
    const d = {
        money: "0",
        bank: "0",
        inventory: {},
        blacklisted: false,
        transferred: false,
        gang: false,
        pending: false,
        blacklisted_at: null,
        blacklist_time: null, 
        gang_id: null,
        pending_id: null,
        cf: null
    }
    
    const data = client.db.get(`data_${userID}`) || {}
    
    return client.deep(d, data)
}
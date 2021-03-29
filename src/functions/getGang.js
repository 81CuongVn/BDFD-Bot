module.exports = (client, userID) => {
    const d = {
        owner_id: null,
        requests: [],
        max_members: 50,
        members: {},
        name: null,
        description: null,
        founded_at: null
    }
    
    const gangs = client.db.get(`gangs`) || []
    
    return client.deep(d, (gangs.find(gang => gang.owner_id === userID || gang.members[userID])) || {})
}
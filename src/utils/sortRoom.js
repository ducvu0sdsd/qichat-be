function sortByLastMessageTimeDescending(roomsByUser) {
    const n = roomsByUser.length;
    for (let i = 0; i < n - 1; i++) {
        let maxIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (roomsByUser[j].lastMessage.time > roomsByUser[maxIndex].lastMessage.time) {
                maxIndex = j;
            }
        }
        if (maxIndex !== i) {
            const temp = roomsByUser[i];
            roomsByUser[i] = roomsByUser[maxIndex];
            roomsByUser[maxIndex] = temp;
        }
    }
    return roomsByUser;
}

module.exports = sortByLastMessageTimeDescending
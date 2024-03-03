

const sortTimeForRooms = (rooms) => {
    rooms.sort((a, b) => b.updatedAt - a.updatedAt);
    console.log(rooms)
}

module.exports = sortTimeForRooms
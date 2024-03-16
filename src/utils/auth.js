const bcrypt = require('bcryptjs');
const saltRounds = 10;

class AuthUtils {

    hashPassword = (password) => new Promise(async (rejects, resolve) => {
        try {
            const saltRounds = 10; // Or whatever number of rounds you want
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            rejects(hashedPassword);
        } catch (error) {
            throw new Error('Error hashing password');
        }
    })
}

module.exports = new AuthUtils()
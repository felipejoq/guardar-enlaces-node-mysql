const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    // const salt = await bcrypt.getSalt(10);
    const hash = await bcrypt.hash(password, 10);

    return hash;
};

helpers.comparePassword = async (password, savedPassword) => {
    
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = helpers;
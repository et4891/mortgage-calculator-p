const { environment } = require('../utils/consts/config');

/*
* show console log if environment is not true
* */
exports.clDebug = (obj, msg = null) => {
    if (!environment) {
        console.log(`-------------${msg}------------BEGIN`);
        console.log(obj, msg);
        console.log(`-------------${msg}------------END`);
        console.log(``);
        console.log(``);
    }
};
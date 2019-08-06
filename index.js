module.exports = type => {
    switch (type) {
        case 'ca':
            return require('./canada/index');
            break;
        default:
            return require('./canada/index');
            break;
    }
};
module.exports = type => {
    switch (type) {
        case 'ca' || 'canada':
            return require('./canada/index');
            break;
        default:
            return require('./common/index');
            break;
    }
};
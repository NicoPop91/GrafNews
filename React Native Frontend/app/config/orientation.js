import { Dimensions } from 'react-native';
var Orientation = require('./Orientation.js')

/**
 *
 * @param {ScaledSize} dim the dimensions object
 * @param {*} limit the limit on the scaled dimension
 */
module.exports.msp = (dim, limit) => {
    return (dim.scale * dim.width) >= limit || (dim.scale * dim.height) >= limit;
};

/**
 * Returns true if the screen is in portrait mode
 */
module.exports.isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

/**
 * Returns true of the screen is in landscape mode
 */
module.exports.isLandscape = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height;
};

/**
 * Returns true if the device is a tablet
 */
module.exports.isTablet = () => {
    const dim = Dimensions.get('screen');
    return ((dim.scale < 2 && msp(dim, 1000)) || (dim.scale >= 2 && Orientation.msp(dim, 1900)));
};

/**
 * Returns true if the device is a phone
 */
module.exports.isPhone = () => { return !Orientation.isTablet(); }

/*export default {
    isPortrait,
    isLandscape,
    isTablet,
    isPhone
};*/

// Move this out and put in ENV vars
exports.HOST = process.env.HOST;
exports.APP_PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
exports.CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.DB_TYPE = process.env.DB_TYPE;
exports.DB_URL = /*'10.16.11.13';*/process.env.DB_URL; //46.32.240.33
exports.DB_ENV = process.env.DB_ENV;
exports.DB_NAME = process.env.DB_NAME;
exports.DB_USER = /*'oneme-5ru-u-121572';*/process.env.DB_USER;
exports.DB_PWD = /*'wTYTMR^E!';*/process.env.DB_PWD;
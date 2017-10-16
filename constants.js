// Move this out and put in ENV vars
exports.HOST = process.env.HOST;
exports.APP_PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
exports.CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.DB_TYPE = process.env.DB_TYPE;
exports.DB_PORT = process.env.DB_PORT;
exports.DB_URL = process.env.DB_URL;
exports.DB_ENV = process.env.DB_ENV;
exports.DB_NAME = process.env.DB_NAME;
exports.DB_USER = process.env.DB_USER;
exports.DB_PWD = process.env.DB_PWD;
exports.DB_SSL_ENABLED = process.env.DB_SSL_ENABLED;
exports.DB_STRING = process.env.DB_STRING;
exports.DATABASE_URL = (process.env.DB_ENV === 'DEV') ? process.env.DATABASE_URL : process.env.HEROKU_POSTGRESQL_MAUVE_URL;
exports.STRAKER_TOKEN_DEV = process.env.STRAKER_TOKEN_DEV;
exports.STRAKER_TOKEN_PROD = process.env.STRAKER_TOKEN_PROD;
exports.STRAKER_TOKEN = (process.env.DB_ENV === 'DEV') ? process.env.STRAKER_TOKEN_DEV : process.env.STRAKER_TOKEN_PROD;
exports.STRAKER_DOMAIN = process.env.STRAKER_DOMAIN;
exports.STRAKER_TRANSLATION_URL = (process.env.DB_ENV === 'DEV') ? 'https://sandbox.' + process.env.STRAKER_DOMAIN : 'https://api.' + STRAKER_DOMAIN;
exports.STRAKER_CALLBACK_URL = (process.env.DB_ENV === 'DEV') ? '' : process.env.STRAKER_CALLBACK_URL;
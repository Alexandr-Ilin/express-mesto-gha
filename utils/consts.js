const OK_STATUS = 200;
const CREATED_STATUS = 201;
const BAD_REQUEST_STATUS = 400;
const NOT_FOUND_STATUS = 404;
const INTERNAL_SERVER_ERROR_STATUS = 500;
const JWT_SECRET = 'some-secret-key';
const regex = /https?:\/\/(www\.)?[\w-]{2,256}\.[a-z]{1,6}\.([-\w._~:/?#[\]@!$&'()*+,;=\S]*)/ig;

module.exports = {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
  JWT_SECRET,
  regex,
};

// eslint-disable-next-line no-useless-escape

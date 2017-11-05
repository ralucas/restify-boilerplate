
module.exports = {
  mongo: require('./mongo.service'),
  pg: require('./sql.service'),
  mysql: require('./sql.service'),
  redis: require('./redis.service')
};

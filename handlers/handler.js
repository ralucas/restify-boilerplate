
module.exports = class Handler {
  constructor(config) {
    this._config = config;
  }

  handleError(res, err) {
    return res.send(500, err);
  }
  
};


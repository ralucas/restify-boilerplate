var convict = require('convict');
var path = require('path');

// Define a schema
var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  server: {
    ip: {
      doc: "The IP address to bind.",
      format: "ipaddress",
      default: "127.0.0.1",
      env: "IP_ADDRESS",
    },
    port: {
      doc: "The port to bind.",
      format: "port",
      default: 8080,
      env: "PORT"
    }
  },
  certs: {
    privateKey: {
      doc: "The private key used for signing tokens",
      format: String,
      default: path.join(__dirname, "./certs/privateKey.key"),
      env: "PRIVATE_KEY"
    }
  },
  database: {
    mongo: {
      host: {
        "doc": "MongoDB host url.",
        "format": String,
        "default": "mongodb://localhost/",
        "env": "MONGO_HOST"
      },
      name: {
        "doc": "MongoDB db name.",
        "format": String, 
        "default": "test",
        "env": "MONGO_DB_NAME"
      }
    },
    sql: {
      client: {
        "doc": "The SQL Client.",
        "format": ["mysql", "pg"],
        "default": "pg",
        "env": "SQL_CLIENT"
      },
      host: {
        "doc": "The SQL DB host address.",
        "format": "ipaddress",
        "default": "127.0.0.1",
        "env": "SQL_DB_HOST"
      },
      user: {
        "doc": "The SQL DB user.",
        "format": String,
        "default": "test",
        "env": "SQL_DB_USER"
      },
      password: {
        "doc": "The SQL DB password.",
        "format": String,
        "default": "test",
        "env": "SQL_DB_PASSWORD"
      },
      name: {
        "doc": "The SQL DB name.",
        "format": String,
        "default": "test",
        "env": "SQL_DB_NAME"
      },
      debug: {
        "doc": "The SQL DB debug status.",
        "format": Boolean, 
        "default": true,
        "env": "SQL_DB_DEBUG"
      }
    }
  }
});

// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/environment/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;

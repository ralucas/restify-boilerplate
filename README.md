Restify Boilerplate
---

[![Build Status](https://secure.travis-ci.org/ralucas/restify-boilerplate.png?branch=master)](http://travis-ci.org/ralucas/restify-boilerplate)

## Introduction
API Boilerplater/Starter in Node.js

## Getting Started
To run the server: `$ npm start`  
It runs an http(s) server on port `8080` and a ws(s) server on `8081`  

## Libraries
- [Node-Restify](http://restify.com) for API Server
- [Websocket](https://github.com/websocket) for websocket server
- [Convict](https://www.npmjs.com/package/convict) for configuration
- [Swagger](http://swagger.io) for API documentation
- [Knex](http://knexjs.org) for SQL connector

## Data Sources
This starter has service connectors for:
- MongoDB
- SQL
- Redis 

**Work in progress**

#### TODO
- Oauth flow/authorization
- Login authentication
- Logging
- API versioning handling
- Session management
- HTTP/2
- Error Handler
- Configuration management
- Build process and integration with CI (Jenkins)
- Move to Yeoman
- Start using [Stampit](https://github.com/stampit-org/stampit) for factory functions


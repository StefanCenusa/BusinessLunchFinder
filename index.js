'use strict';

const debug = require('debug')('app:index');


const finder = require('./src/finder')
    , server = require('./src/server');

async function start() {
    await finder.init();
    await server.start(3000);
}

start().catch(err => {
    debug(err);
});
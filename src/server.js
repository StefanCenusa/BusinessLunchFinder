'use strict';

const debug = require('debug')('app:server')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , express = require('express');


const finder = require('./finder');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + './../public'));

app.get('/businessLunch', async (req, res) => {
    debug('business lunch request');

    const businessMenus = await finder.findBusinessLunch();

    debug(businessMenus);

    res.json(businessMenus);
    // const slackText = businessMenus.reduce((acc, menu) => {
    //     const text = `• *${menu.name}*\n${menu.link}\n${menu.message}\n\n`;
    //
    //     return acc + text;
    // }, '');
});


exports.start = async (port) => {
    app.listen(port, () => {
        debug(`Server listening on port ${port}!`);
        Promise.resolve();
    });
};

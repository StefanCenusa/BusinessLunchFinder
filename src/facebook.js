'use strict';

const debug = require('debug')('app:facebook')
    , {Facebook} = require('fb');


const fb = new Facebook({
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    Promise: Promise,
    version: 'v2.12'
});


exports.init = async () => {
    const fbResponse = await fb.api('oauth/access_token', {
        client_id: fb.options().appId,
        client_secret: fb.options().appSecret,
        grant_type: 'client_credentials'
    });

    debug('Facebook login successful');

    fb.setAccessToken(fbResponse.access_token);
};

exports.getPagePosts = async (pageId) => {
    debug('Get page posts', pageId);
    const response = await fb.api(`${pageId}/posts`, {fields: ['permalink_url', 'message', 'created_time']});

    return response.data;
};

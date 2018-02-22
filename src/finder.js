'use strict';

const debug = require('debug')('app:finder')
    , moment = require('moment');


const facebook = require('./facebook');
const pages = require('./pages');

function mergePageWithPosts(pages, pagesPosts) {
    return pages.map((p, i) => {
        p.posts = pagesPosts[i];
        return p;
    });
}

function todayFilter(post) {
    const postDate = moment(post.created_time);

    const startOfToday = moment().startOf('day');
    const endOfToday = moment().endOf('day');

    return postDate.isAfter(startOfToday) && postDate.isBefore(endOfToday);
}

function findBusinessLunchForPage(page) {
    const {name, posts, keywords} = page;

    const todayPosts = posts.filter(todayFilter);

    const businessLunchPosts = todayPosts.find(post => keywords.find(k => post.message.includes(k)));

    if (businessLunchPosts) {
        debug('Found business lunch menu', name);
        return {
            name,
            message: businessLunchPosts.message,
            link: businessLunchPosts.permalink_url
        };
    } else {
        debug('Could not find business lunch menu', name);
        return {
            name,
            message: 'No business lunch found today :('
        };
    }
}

exports.findBusinessLunch = async () => {
    debug('Start finding business lunches');

    const pagesPosts = await Promise.all(pages.map(async page => await facebook.getPagePosts(page.id)));

    const augmentedPages = mergePageWithPosts(pages, pagesPosts);

    return augmentedPages.map(findBusinessLunchForPage);
};

exports.init = async () => {
    await facebook.init();
};
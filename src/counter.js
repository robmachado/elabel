//'use strict';

const nanotimer = require('nanotimer');

let timer;

function init(countDown) {
    timer = new nanotimer();
    timer.setInterval(countDown, '', '2s');
    //return timer;
}

function stop() {
    timer.clearInterval();
}

module.exports.init = init;
module.exports.stop = stop;
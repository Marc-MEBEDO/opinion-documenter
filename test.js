const gutachten = require('./index.js');

const opinion = require('./data/opinions');

const opinionDetails = require('./data/opinionDetails');

gutachten.pdfCreate( opinion, opinionDetails );
const gutachten = require('./index.js');

const opinion = require('./data/opinions');

const opinionDetails = require('./data/opinionDetails');

async function main() {
    await gutachten.pdfCreate( opinion , opinionDetails );
    console.log( 'done' );
}
main();
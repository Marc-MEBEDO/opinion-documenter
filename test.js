const gutachten = require('./index.js');

const opinion = require('./data/opinions');

const opinionDetails = require('./data/opinionDetails');

async function main() {
    let path = require( 'path' );
    await gutachten.pdfCreate( opinion , opinionDetails , path.join( __dirname , 'result' , 'html5-to-pdf.pdf' ) );
    console.log( 'done' );
}
main();
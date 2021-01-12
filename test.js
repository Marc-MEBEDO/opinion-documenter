const gutachten = require( './index.js' );

const opinion = require( './data/opinions' );

const opinionDetails = require( './data/opinionDetails' );

async function main() {
    opinionDetails.forEach( currentDetailValue => {
        if ( currentDetailValue.type == 'HEADING' )
          /*|| currentDetailValue.type == 'QUESTION'
          || currentDetailValue.type == 'ANSWER' )*/
            currentDetailValue.showInToC = true;
    });
    //console.log( opinionDetails );
    //console.log( JSON.stringify( opinionDetails ) );
    
    let path = require( 'path' );
    try {
        await gutachten.pdfCreate( opinion , opinionDetails , path.join( __dirname , 'result' , 'html5-to-pdf.pdf' ) );///**/ , 1 , 1 , 0 , 0 );///**/= nur für Tests
        console.log( 'done' );
    }    
    catch( err ) {
        console.log( err );
    }
}
main();
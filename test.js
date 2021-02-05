const gutachten = require( './index.js' );

const opinion = require( './data/opinions' );

const opinionDetails = require( './data/opinionDetails' );

async function main() {
    let detailsTodoList = [];
    opinionDetails.forEach( currentDetailValue => {
        if ( currentDetailValue.type == 'HEADING' )
            currentDetailValue.showInToC = true;
        else if ( currentDetailValue.type == 'QUESTION' )
            detailsTodoList.push( currentDetailValue );
    });
    //console.log( opinionDetails );
    //console.log( JSON.stringify( opinionDetails ) );
    
    let path = require( 'path' );
    try {
        await gutachten.pdfCreate( opinion , opinionDetails , detailsTodoList , path.join( __dirname , 'result' ) );///**/ , 1 , 1 , 0 , 0 );///**/= nur für Tests
        console.log( 'done' );
    }    
    catch( err ) {
        console.log( err );
    }
}
main();
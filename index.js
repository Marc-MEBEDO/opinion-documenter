let lastPageNo = '';
const helper = require( './helper' );
const fs = require( 'fs' );

/*const createHTMLFile = ( iHTMLText ) => {
    // HTML Datei schreiben.
    fs.writeFile( './result/html5-to-pdf.html' , iHTMLText , err => {
        if ( err )
            return console.log( err );
    });
}*/

const getHeader = async ( iFullTemplatePath ) => {
    const path = require( 'path' );
    let pathFile = path.join( iFullTemplatePath , 'header_image.html' );
    let header_image = fs.readFileSync( pathFile , 'utf-8' ); 
    pathFile = path.join( iFullTemplatePath , 'pageHeader.txt' );
    let headerText = fs.readFileSync( pathFile , 'utf-8' );
    headerText = headerText.replace( /\$\{header_image\}/g , header_image );
    return headerText;
}

const getFooter = async ( iFullTemplatePath ) => {
    const path = require( 'path' );
    const dateStr = helper.GetTodayDateString();
    let pathFile = path.join( iFullTemplatePath , 'pageFooter.txt' );
    let footerText = fs.readFileSync( pathFile , 'utf-8' );
    footerText = footerText.replace( /\$\{dateStr\}/g , dateStr );
    return footerText;
}

const pathExists = async ( iPath ) => {
    return new Promise( async ( resolve , reject ) => {
        try {
            fs.access( iPath , fs.constants.F_OK, (err) => {
                if ( err )
                    resolve( false );
                else
                    resolve( true );
            });    
            
        }
        catch( err ) {
            reject( err );
        }
    });
}

const createPDFFile_html5_to_pdf = async ( iOpinion , iPathFile , iHTMLText ) => {
    // Benötigte Dateien lesen.
    const path = require( 'path' );    
    // PDF Datei schreiben mit 'html5-to-pdf'.
    const _HTML5ToPDF = require( 'html5-to-pdf_mt' ); 

    // Um welches Ausgabeformat handelt es sich.
    const _defaultTemplatePathPart = 'mebedo-gutachten';
    let pathPart = _defaultTemplatePathPart;
    if ( !helper.EmptyString( iOpinion.outputTemplate ) )
        pathPart = iOpinion.outputTemplate;
    let fullTemplatePath = path.join( __dirname , 'Files' , pathPart );

    return new Promise( async ( resolve , reject ) => {
        if ( !await pathExists( fullTemplatePath ) )
            fullTemplatePath = path.join( __dirname , 'Files' , _defaultTemplatePathPart );
        const header = await getHeader( fullTemplatePath );
        const footer = await getFooter( fullTemplatePath );

        const html5ToPDF = new _HTML5ToPDF({
            inputBody: iHTMLText,
            //outputPath: iPathFile,
            templatePath: fullTemplatePath,//path.join( __dirname , 'Files' ),
            include: [
                //path.join( __dirname , 'Files' , 'ENSMANN' , 'basic.css' ),
                path.join( fullTemplatePath , 'basic.css' ),
                path.join( fullTemplatePath , 'custom-margin.css' ),
            ],
            pdf: {
                displayHeaderFooter: true,
                format: 'A4',
                printBackground: true,
                headerTemplate:
                    header,
                footerTemplate:
                    footer,
                margin: {
                    top: '35mm',
                    bottom: '23mm',
                    right: '0mm',
                    left: '0mm',
                },
            },
            // Versuch die Qualität zu beeinflussen - ohne Funktion?!.
            /*launchOptions: {
                defaultViewport: {
                    width: 800,
                    height: 600,
                    deviceScaleFactor: 1,
                }
            },*/
        })
    
        try {
            await html5ToPDF.start();
            const buf = await html5ToPDF.build();
            await html5ToPDF.close();
            if ( buf )
                fs.writeFileSync( iPathFile , buf );
            resolve();
        }
        catch( err ) {
            reject( err );
        }
    })
}

const readPDF_parse = async ( iTmpPathFile ) => {
    return new Promise( ( then_ , catch_ ) => {
        const pdfreader = require( 'pdf-parse' );
        const dataBuffer = fs.readFileSync( iTmpPathFile );// !!! Hier kein: , 'utf-8' !!!
 
        pdfreader( dataBuffer ).then( function( data ) {
            // number of pages
            lastPageNo = data.numpages;
            // PDF text
            then_( data.text );
        })
        .catch( err => {
            catch_( err );
        })
    })
}

const SetPages = ( arrHead , text ) => {
    if ( !arrHead
      || arrHead.length == 0 )
        return;
    // Zunächst alle Zeilenumbrüche löschen.
    text = text.replace( /\n/g , '' );
    // Dann den Text so kürzen, dass erst der Text nach dem Inhaltsverzeichnis enthalten ist. Ansonsten würden im match die Einträge im Inhaltsverzeichnis gefunden.
    let exp = new RegExp( helper.escapeRegExp( arrHead[ arrHead.length - 1 ].name ) + '.*?Seite .*? von' );//, 'g' );
    const index = text.search( exp );
    if ( index == -1 )
        return;
    if ( text.length <= ( index + arrHead[ arrHead.length - 1 ].name.length ) )
        return;
    
    text = text.slice( index + arrHead[ arrHead.length - 1 ].name.length );
    arrHead.forEach( ( element ) => {
        exp = new RegExp( helper.escapeRegExp( element.name ) + '.*?Seite (.*?) von' );//, 'g' );
        const match = text.match( exp );
        if ( match
          && match.length > 1 ) {
            const pageNo = match[ 1 ];
            if ( pageNo > 3 ) {
                element.page = pageNo - 1;
                /*// Text vor der Fundstelle rauslöschen.
                // Das ist nicht notwendig, da nach den IDs gesucht wird und damit Mehrfachfunde ausgeschlossen sein sollten.
                index = text.search( exp );
                if ( index > -1 )
                    text = text.slice( index + element.name.length );*/
            }
        }
    });
}

const ModifyArray = ( headArray ) => {
    if ( headArray.length > 0 ) {
        let pre = '';
        // Schleife, um headArray vom Ende nach vorne durchzugehen und Seitennummer zu setzen, falls noch nicht vorhanden.
        for( let i = headArray.length - 1 ;  i >= 0 ; i-- ) {
            if ( helper.EmptyString( headArray[ i ].page ) ) {
                if ( helper.EmptyString( pre ) )
                    headArray[ i ].page = lastPageNo;
                else
                    headArray[ i ].page = pre;
            }
            else
                pre = headArray[ i ].page; 
        }
    }
}

/* Parameter:
    opinion:        Das Gutachten "Objekt".
    opinionDetails: Das Array der zum Gutachten gehörenden Gutachten-Details.
    detailsTodoList: Das Array der Gutachten-Details, das alle im Gutachten enthaltenen (aktiven) Fragen mit Handlungsbedarf enthält.
    images:         Das Array der Bilder, die im Gutachten enthalten sind.
    path:           Pfad, in den das zu erstellendes PDF Dokument geschrieben werden soll.
                    Als Dateiname wird automatisch "{opinion._id}.pdf" gesetzt.
    hasAbbreviationsPage: default: true - Bool, der angibt, ob im Dokument das fest hinterlegte Abkürzungsvereichnis enthalten sein soll.
    hasToC:         default: true - Bool, der angibt, ob Inhaltsverzeichnis generiert werden soll.
    print:          default: false - Bool, der angibt, ob PDF für Ausdruck (=true) gedacht ist oder nicht (=false).
                    Wenn print == false (also rein für digitale Betrachtung), dann werden im Inhaltsverzeichnis Links eingefügt.
                    Bei print == true keine Links.
                    Nur relevant, wenn hasToC == true.
    ToCPageNos:     Bool, der angibt, ob im Inhaltsverzeichnis Seitenzahlen angegeben werden sollen.
                    Nur relevant, wenn hasToC == true.
*/
const pdfCreate = async ( opinion , opinionDetails , detailsTodoList , images , path , hasAbbreviationsPage = true , hasToC = true , print = false , ToCPageNos = true ) => {
    if ( helper.EmptyString( path ) ) {
        // PDF Pfad muss angegeben sein.
        console.log( 'ERROR: Kein Dateipfad des PDF Dokuments übergeben!\nEs erfolgt KEINE Ausgabe.' );
    }
    else if ( !opinion ) {
        // opinion darf nicht null sein. opinionDetails darf null sein, dann sind eben keine Gutachten-Details in der Ausgabe enthalten.
        console.log( 'ERROR: Keine opinion (Gutachten) übergeben!\nEs erfolgt KEINE Ausgabe.' );
    }
    else if ( helper.EmptyString( opinion._id ) ) {
        // opinionId darf nicht null oder leer sein.
        console.log( 'ERROR: Es ist keine gültige Gutachten ID im übergebenen Gutachten vorhanden!\nEs erfolgt KEINE Ausgabe.' );
    }
    else {
        let htmlText = '';
        const genHTMLText = require( './GenHTMLText' );
        // Zunächst den HTML Text generieren.
        let headingsArray = [];
        const pathFile = helper.GetPDFPathFile( path , opinion._id );
        if ( hasToC && ToCPageNos ) {
            // Mit Inhaltverzeichnis und Seitenzahlen.
            try {
                //console.log( '1' );
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , true );

                // HTML Datei schreiben für 'html5-to-pdf'.
                //createHTMLFile( htmlText );
                // Dafür muss PDF temporär geschrieben, eingelesen und dann final mit den zuvor ermittelten Seitenzahlen neu geschrieben werden.
                const tmpPathFile = helper.GetPDFPathFile( path , opinion._id , true );
                // PDF temporär schreiben.
                await createPDFFile_html5_to_pdf( opinion , tmpPathFile , htmlText );
                // PDF lesen und Seitenzahlen ermitteln.
                let result = await readPDF_parse( tmpPathFile );
                // Temporäre Datei löschen, wenn diese existiert.
                if ( fs.existsSync( tmpPathFile ) ) {
                    fs.unlink( tmpPathFile , ( err ) => {
                        if ( err )
                            throw err;
                    });
                }
                SetPages( headingsArray , result );
                ModifyArray( headingsArray );
                // HTML Text neu generieren mit Seitenzahlen.
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray );
                // HTML Datei final schreiben für 'html5-to-pdf'.
                //createHTMLFile( htmlText );
                // PDF Datei final schreiben mit 'html5-to-pdf'.
                await createPDFFile_html5_to_pdf( opinion , pathFile , htmlText );
                return pathFile;
            }
            catch( err ) {
                console.log( err );
            }
        }
        else {
            try {
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray );
                // HTML Datei schreiben für 'html5-to-pdf'.
                //createHTMLFile( htmlText );
                // PDF Datei schreiben mit 'html5-to-pdf'.
                await createPDFFile_html5_to_pdf( opinion , pathFile , htmlText );
                return pathFile;
            }
            catch( err ) {
                console.log( err );
            }
        }        
    }
    return '';
 }

 //module.exports = pdfCreate;
 module.exports = { pdfCreate };
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

const createPDFFile_html5_to_pdf = async ( iPathFile , iHTMLText ) => {
    // Benötigte Dateien lesen.
    const path = require( 'path' );
    const pathFile = path.join( __dirname , 'Files' , 'header_image.html' );
    const header_image = fs.readFileSync( pathFile , 'utf-8' );    
    // Aktuelles Datum für Footer.
    const dateStr = helper.GetTodayDateString();

    // PDF Datei schreiben mit 'html5-to-pdf'.
    const _HTML5ToPDF = require( 'html5-to-pdf' ); 

    return new Promise( async ( resolve , reject ) => {
        const html5ToPDF = new _HTML5ToPDF({
            inputBody: iHTMLText,
            //outputPath: iPathFile,
            templatePath: path.join( __dirname , 'Files' ),
            include: [
                path.join( __dirname , 'Files' , 'basic.css' ),
                path.join( __dirname , 'Files' , 'custom-margin.css' ),
            ],
            pdf: {
                displayHeaderFooter: true,
                format: 'A4',
                printBackground: true,
                headerTemplate:
                    //`<div id="header-template">
                    //`<div id="header-template" style="position:absolute; top:6mm;">
                        //<table style="width = 550mm">
                    `<div id="header-template" style="position:absolute; top:7mm;">
                        <table width = 550mm>
                            <tr>
                                <td style="width: 80%;"></td>
                                <td style="width: 20%;">${header_image}</td>
                            </tr>
                        </table>
                    </div>`,
                    //<td style="width: 20%;"><img style="width: 180px;" src="file:/C:/Users/marc.tomaschoff/meteor/html-create/Files/MEBEDO_LOGO_PRINT_CMYK.jpg" alt="Page Header"></td>
                footerTemplate:
                    `<div id="footer-template" style="position:absolute; height:16mm; top:215mm; left:0mm; right:0mm; font-family:Arial; font-size:10px; padding-left:1px; background-color:rgb(245,155,19); -webkit-print-color-adjust: exact">
                        <table style="position:absolute; width:65%; height:7mm; left:9mm;">
                            <tr>
                                <td style="text-align: left;width: 33%;"><b>© MEBEDO Consulting GmbH</b></td>
                                <td style="text-align: center;width: 33%;">Seite <span class="pageNumber"></span> von <span class="totalPages"></span></td>
                                <td style="text-align: right;width: 33%;">${dateStr}</td>
                            </tr>
                        </table>
                    </div>`,
                margin: {
                    top: '30mm',
                    bottom: '16mm',
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
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , detailsTodoList , images , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray , true );
                // HTML Datei schreiben für 'html5-to-pdf'.
                //createHTMLFile( htmlText );

                // Dafür muss PDF temporär geschrieben, eingelesen und dann final mit den zuvor ermittelten Seitenzahlen neu geschrieben werden.
                const tmpPathFile = helper.GetPDFPathFile( path , opinion._id , true );
                // PDF temporär schreiben.
                await createPDFFile_html5_to_pdf( tmpPathFile , htmlText );
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
                await createPDFFile_html5_to_pdf( pathFile , htmlText );
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
                await createPDFFile_html5_to_pdf( pathFile , htmlText );
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
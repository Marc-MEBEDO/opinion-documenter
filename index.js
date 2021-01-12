
/*const createHTMLFile = ( iHTMLText ) => {
    // HTML Datei schreiben.
    let fs = require( 'fs' );
    fs.writeFile( './result/html5-to-pdf.html' , iHTMLText , err => {
        if ( err )
            return console.log( err );
    });
}*/

let lastPageNo = '';
const tmpPDFFileName = '_tmp.pdf';
const helper = require('./helper');

const createPDFFile_html5_to_pdf = async ( iPathFile , iHTMLText , tmp = false ) => {
    // Benötigte Dateien lesen.
    let fs = require( 'fs' );
    let path = require( 'path' );
    let pathFile = path.join( __dirname , 'Files' , 'header_image.html' );
    let header_image = fs.readFileSync( pathFile , 'utf-8' );    
    // Aktuelles Datum für Footer selbst "holen".
    /*let dateStr = '';
    let moment = require( 'moment' );
    let useMomentFormat = true;
    if ( useMomentFormat )
        dateStr = moment().format( 'DD.MM.YYYY' );
    else
        dateStr = new Date().toLocaleDateString('de-DE');*/
    let dateStr = helper.GetTodayDateString();

    // PDF Datei schreiben mit 'html5-to-pdf'.
    let _HTML5ToPDF = require( 'html5-to-pdf' );
    let outputFilePath = '';
    if ( tmp )
        outputFilePath = path.join( __dirname , 'tmp' , tmpPDFFileName );
    else
        outputFilePath = iPathFile;        

    return new Promise( async ( resolve , reject ) => {
        let html5ToPDF = new _HTML5ToPDF({
            inputBody: iHTMLText,
            //inputPath: path.join(__dirname , 'tmp' , 'test.html' ),
            outputPath: outputFilePath,
            templatePath: path.join( __dirname , '' , 'Files' ),
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
                    //`<div id="footer-template" style="font-family:Arial; font-size:10px; padding-left:1px; background-color:rgb(245,155,19); -webkit-print-color-adjust: exact">
                    //`<div id="footer-template" style="height:75px;position: absolute;top:auto;left:0px;right:0px;left:0px;background-color:red;">
                    //<table width = '590mm'>
                    //`<div id="footer-template" style="position: absolute;top:auto;left:0px;right:0px;background-color:red;font-family:Arial; font-size:10px;-webkit-print-color-adjust: exact">
                    
                    //top:...
                    //`<div id="footer-template" style="position:absolute; height:8mm; top:auto; left:0mm; right:0mm; font-family:Arial; font-size:10px; padding-left:1px; background-color:rgb(245,155,19); -webkit-print-color-adjust: exact">
                    `<div id="footer-template" style="position:absolute; height:16mm; top:215mm; left:0mm; right:0mm; font-family:Arial; font-size:10px; padding-left:1px; background-color:rgb(245,155,19); -webkit-print-color-adjust: exact">
                        <table style="position:absolute; width:65%; height:7mm; left:9mm;">
                            <tr>
                                <td style="text-align: left;width: 33%;"><b>© MEBEDO Consulting GmbH</b></td>
                                <td style="text-align: center;width: 33%;">Seite <span class="pageNumber"></span> von <span class="totalPages"></span></td>
                                <td style="text-align: right;width: 33%;">${dateStr}</td>
                            </tr>
                        </table>
                    </div>`,
                /*margin: {
                    top: '25mm',
                    //top: '100px',
                    bottom: '16mm',
                    //bottom: '200px',
                    //right: '1.27cm',
                    right: '12.7mm',
                    left: '0px',
                    //left: '1.27cm',
                    //left: '30px',
                },*/
                margin: {
                    top: '25mm',
                    bottom: '16mm',
                    right: '0mm',
                    left: '0mm',
                },
            },
            // Versuch die Qualität zu beeinflussen.
            /*launchOptions: {
                defaultViewport: {
                    width: 800,
                    height: 600,
                    deviceScaleFactor: 1,
                }
            },*/
        })
    
        try {
            await html5ToPDF.start()
            await html5ToPDF.build()
            await html5ToPDF.close()
            resolve();
        }
        catch( err ) {
            reject( err );
        }
    })
}

function escapeRegExp( rexp ) {
    return rexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const readPDF_parse = async ( arrHead ) => {
    return new Promise( ( then_ , catch_ ) => {
        let fs = require( 'fs' );
        let pdfreader = require( 'pdf-parse' );
        let path = require( 'path' );
        let pathFile = path.join( __dirname , 'tmp' , tmpPDFFileName );
        let dataBuffer = fs.readFileSync( pathFile );// !!! Hier kein: , 'utf-8' !!!
        //let dataBuffer = fs.readFileSync( './tmp/html5-to-pdf.pdf' );
 
        //pdfreader( dataBuffer , ( data ) => {
        pdfreader( dataBuffer ).then( function( data ) {
            // number of pages
            lastPageNo = data.numpages;
            // number of rendered pages
            //console.log(data.numrender);
            // PDF info
            //console.log(data.info);
            // PDF metadata
            //console.log(data.metadata); 
            // PDF.js version
            // check https://mozilla.github.io/pdf.js/getting_started/
            //console.log(data.version);
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
    let exp = new RegExp( escapeRegExp( arrHead[ arrHead.length - 1 ].name ) + '.*?Seite .*? von' );//, 'g' );
    let index = text.search( exp );
    if ( index == -1 )
        return;
    if ( text.length <= ( index + arrHead[ arrHead.length - 1 ].name.length ) )
        return;
    
    text = text.slice( index + arrHead[ arrHead.length - 1 ].name.length );
    let match = '';
    arrHead.forEach( ( element ) => {
        exp = new RegExp( escapeRegExp( element.name ) + '.*?Seite (.*?) von' );//, 'g' );
        match = text.match( exp );
        if ( match
          && match.length > 1 ) {
            let pageNo = match[ 1 ];
            if ( pageNo > 3 )
                element.page = pageNo - 1;
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
    pathFile:       Pfad und Dateiname des zu erstellenden PDF Dokuments.
    hasAbbreviationsPage...
    hasToC:         Bool, der angibt, ob Inhaltsverzeichnis generiert werden soll.
    print:          Bool, der angibt, ob PDF für Ausdruck (=true) gedacht ist oder nicht (=false).
                    Wenn print == false (also rein für digitale Betrachtung), dann werden im Inhaltsverzeichnis Links eingefügt.
                    Bei print == true keine Links.
                    Nur relevant, wenn hasToC == true.
    ToCPageNos:     Bool, der angibt, ob im Inhaltsverzeichnis Seitenzahlen angegeben werden sollen.
                    Nur relevant, wenn hasToC == true.
*/
const pdfCreate = async ( opinion , opinionDetails , pathFile , hasAbbreviationsPage = true , hasToC = true , print = false , ToCPageNos = true ) => {
    let htmlText = '';
    if ( helper.EmptyString( pathFile ) ) {
        // PDF Dateiname inkl. Pfad muss angegeben sein.
        console.log( 'error: Kein Dateipfad und Dateiname des PDF Dokuments übergeben!\nEs erfolgt KEINE Ausgabe.' );
    }
    else if ( !opinion ) {
        // opinion darf nicht null sein. opinionDetails darf null sein, dann sind eben keine Gutachten-Details in der Ausgabe enthalten.
        console.log( 'error: Keine opinion (Gutachten) übergeben!\nEs erfolgt KEINE Ausgabe.' );
    }
    else {
        let genHTMLText = require( './GenHTMLText' );
        // Zunächst den HTML Text generieren.
        let headingsArray = [];
        htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray );
        // HTML Datei schreiben für 'html5-to-pdf'.
        //createHTMLFile( htmlText );
        if ( hasToC && ToCPageNos ) {
            // Mit Inhaltverzeichnis und Seitenzahlen.
            // Dafür muss PDF temporär geschrieben, eingelesen und dann final mit den zuvor ermittelten Seitenzahlen neu geschrieben werden.
            // PDF temporär schreiben.
            await createPDFFile_html5_to_pdf( pathFile , htmlText , true );
            try {
                // PDF lesen und Seitenzahlen ermitteln.
                let result = await readPDF_parse( headingsArray );
                SetPages( headingsArray , result );
                ModifyArray( headingsArray );
                // HTML Text neu generieren mit Seitenzahlen.
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray );
                // HTML Datei final schreiben für 'html5-to-pdf'.
                //createHTMLFile( htmlText );
                // PDF Datei final schreiben mit 'html5-to-pdf'.
                await createPDFFile_html5_to_pdf( pathFile , htmlText );
            }
            catch( err ) {
                console.log( err );
            }
        }
        else {
            try {
                // PDF Datei schreiben mit 'html5-to-pdf'.
                await createPDFFile_html5_to_pdf( pathFile , htmlText );
            }
            catch( err ) {
                console.log( err );
            }
        }
    }
    return htmlText;
 }

 //npm install pdf-parse

 //module.exports = pdfCreate;
 module.exports = { pdfCreate };
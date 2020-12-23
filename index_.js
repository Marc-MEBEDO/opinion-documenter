
/*const createHTMLFile = ( iHTMLText ) => {
    // HTML Datei schreiben.
    let fs = require( 'fs' );
    fs.writeFile( './result/html5-to-pdf.html' , iHTMLText , err => {
        if ( err )
            return console.log( err );
    });
}*/

//const { ok } = require('assert');

let lastPageNo = '';

const createPDFFile_html5_to_pdf = async ( iHTMLText , tmp = false ) => {
    // Benötigte Dateien lesen.
    let fs = require( 'fs' );
    
    //
    //iHTMLText = fs.readFileSync( './result/html5-to-pdf.html' , 'utf-8' );
    //

    let header_image = fs.readFileSync( './Files/header_image.html' , 'utf-8' );
    
    // Aktuelles Datum für Footer selbst "holen".
    let dateStr = '';
    let moment = require( 'moment' );
    let useMomentFormat = true;
    if ( useMomentFormat )
        dateStr = moment().format( 'DD.MM.YYYY' );
    else
        dateStr = new Date().toLocaleDateString('de-DE');

    // PDF Datei schreiben mit 'html5-to-pdf'.
    let _HTML5ToPDF = require( 'html5-to-pdf' );
    let path = require( 'path' );
    let outputFilePath = '';
    if ( tmp )
        outputFilePath = path.join( __dirname , 'tmp' , 'html5-to-pdf.pdf' );
    else
        outputFilePath = path.join( __dirname , 'result' , 'html5-to-pdf.pdf' );
        

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
                //printBackground: true,
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

const GetRegExp = ( rexp => {
    return rexp.replace( ' ' , '( *)' );
})

function escapeRegExp( string ) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const readPDF = async ( arrHead ) => {
    lastPageNo = '';
    return new Promise((then_, catch_) => {
        var pdfreader = require( 'pdfreader' );
        let testRules = [];
        //var expr = /,Seite ,(\d*|\d*,\d*|\d*,\d*,\d*), von ,/;
        var expr = /,Seite ,(\d*|\d*,\d*|\d*,\d*,\d*), von ,(\d*|\d*,\d*|\d*,\d*,\d*)/;
        arrHead.forEach( ( element ) => {
            //testRules.push( pdfreader.Rule.on( new RegExp( GetRegExp( element.name ) ) )
            
            testRules.push( 
                pdfreader.Rule.on( new RegExp( '^' + GetRegExp( escapeRegExp( element.name ) ) ) )
            
                //pdfreader.Rule.on( new RegExp( '^' + escapeRegExp( GetRegExp( element.name ) ) ) )
                //pdfreader.Rule.on( new RegExp( '^' + escapeRegExp( element.name ) + '([\s\w\W]*)(Seite )([0-9]+)( von )([0-9]+)' ) )
            //(6\. Auswertung)([\s\w\W]*)(Seite )([0-9]+)( von )([0-9]+)
            //console.log( element.name );
            //testRules.push( pdfreader.Rule.on( new RegExp( element.name ) )
            //testRules.push( pdfreader.Rule.on( new RegExp( '6.Auswertung' ) )
            //testRules.push( pdfreader.Rule.on( new RegExp( GetRegExp( element.name ) ) )
            //testRules.push( pdfreader.Rule.on( new RegExp( `^${element.name}` ) )
                .accumulateAfterHeading()
                //.extractRegexpValues()
                .then( ( value ) => {
                    //console.log( `extracted value (${element.name}):` , value );
                    let match = String( value ).match( expr );
                    if ( match
                      && match.length > 1 ) {
                        let pageNo = match[ 1 ].replace(/,/g , '' );
                        if ( pageNo > 3 )
                            element.page = pageNo - 1;
                        
                        if ( lastPageNo == ''
                          && match.length > 2 )
                            lastPageNo = match[ 2 ].replace(/,/g , '' );// Letzte Seite einmalig setzen.
                    }
                })
            )
        });
        //testRules.push( pdfreader.Rule.on( /^1. Auftrag/ )
        /*testRules.push( pdfreader.Rule.on( /6\.1/g )
        .accumulateAfterHeading()
        .then( async ( value ) => {
            console.log( `extracted value (^1. Auftrag):` , value );
        }))*/
    
        let processItem = pdfreader.Rule.makeItemProcessor( testRules );
        let arrxy = [];
        new pdfreader.PdfReader().parseFileItems( './tmp/html5-to-pdf.pdf' , ( err , item ) => {
            if ( err ) {
                console.log( err );
                catch_( err );
            }
               
            /*if ( !item )// Erst jetzt ist Parsing abgeschlossen.
                then_( true );*/
            if (err)
                catch_(err);
            else if (!item)
                then_( arrxy );
            else if (item.text) {
                //console.log(item.text);
                arrxy.push(item.text);
            }
            // Läuft für jedes zu parsende item.
            processItem( item );    
        });
    });
}

const ModifyArray = ( headArray ) => {
    if ( headArray.length > 0 ) {
        let helper = require('./helper');
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
    hasToC:         Bool, der angibt, ob Inhaltsverzeichnis generiert werden soll.
    print:          Bool, der angibt, ob PDF für Ausdruck (=true) gedacht ist oder nicht (=false).
                    Wenn print == false (also rein für digitale Betrachtung), dann werden im Inhaltsverzeichnis Links eingefügt.
                    Bei print == true keine Links.
                    Nur relevant, wenn hasToC == true.
    ToCPageNos:     Bool, der angibt, ob im Inhaltsverzeichnis Seitenzahlen angegeben werden sollen.
                    Nur relevant, wenn hasToC == true.
*/
const pdfCreate = async ( opinion , opinionDetails , hasToC = true , print = false , ToCPageNos = true ) => {
    let ok = true;
    if ( !opinion ) {
        // opinion darf nicht null sein. opinionDetails darf null sein, dann sind eben keine Gutachten-Details in der Ausgabe enthalten.
        console.log( 'error: Keine opinion (Gutachten) übergeben!\nEs erfolgt KEINE Ausgabe.' );
        ok = false;
    }
    else {
        let genHTMLText = require( './GenHTMLText' );
        // html5-to-pdf.
        // Zunächst den HTML Text generieren.
        let headingsArray = [];
        let htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , hasToC , print , ToCPageNos , headingsArray );
        //console.log( headingsArray );
        // HTML Datei schreiben für 'html5-to-pdf'.
        //createHTMLFile( htmlText );
        // PDF Datei schreiben mit 'html5-to-pdf'.
        if ( hasToC && ToCPageNos ) {
            // Mit Inhaltverzeichnis und Seitenzahlen.
            // Dafür muss PDF temporär geschrieben, eingelesen und dann final mit den zuvor ermittelten Seitenzahlen neu geschrieben werden.
            // PDF temporär schreiben.
            await createPDFFile_html5_to_pdf( htmlText , true );
            
////
            /*headingsArray = [
                { name: '^1. Auftrag', page: '' },
                { name: '^2. Methode', page: '' },
                { name: '^3. Sachstand/ Probleme', page: '' },
                { name: '^4. Befragung', page: '' },
                { name: '^5. Fazit', page: '' },
                { name: '^6. Auswertung', page: '' },
                { name: '^6.1 Organisation', page: '' },
                { name: '^6.1.1 Strukturempfehlung', page: '' },
                { name: '^6.2 Schnittstellendefinition', page: '' },
                { name: '^6.2.1 Schnittstelle Beschaffung', page: '' },
                { name: '^6.2.2 Schnittstelle IT/EDV - Bereich', page: '' },
                { name: '^6.2.3 Schnittstelle Mieter – Vermieter', page: '' },
                { name: '^6.3 Prüfungen', page: '' },
                { name: '^6.4 Gefährdungsbeurteilungen', page: '' },
                { name: '^6.5 Zutrittsregelung', page: '' },
                { name: '^6.6 Fremdfirmeneinsatz', page: '' },
                { name: '^6.7 Arbeitsanweisungen und Betriebsanweisungen', page: '' },
                { name: '^6.8 Arbeiten unter Spannung', page: '' },
                { name: '^6.9 Konformität und Abnahme', page: '' },
                { name: '^7. Ergebnisse der Begehung', page: '' },
                { name: '^8. Abschlussbetrachtung', page: '' },
                { name: '^8.1 Headrow', page: '' },
                { name: '^8.2 Ad-Hoc Maßnahme', page: '' },
                { name: '^8.3 kurzfristige Maßnahme', page: '' },
                { name: '^8.4 mittelfristige Maßnahme', page: '' },
                { name: '^8.5 langfristige Maßnahme', page: '' },
                { name: '^9. Verzeichnis der gesichteten Unterlagen', page: '' },
                { name: '^9.1 Headrow', page: '' }
              ]*/
////

            // PDF lesen und Seitenzahlen ermitteln.
            /*await readPDF( headingsArray )
            .then(async () => {
            //.then(async ( arrxy ) => {
                console.log( '4' );
                //console.log( arrxy.join( '' ) );
                console.log( headingsArray );
                // HTML Text neu generieren mit Seitenzahlen.
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , hasToC , print , ToCPageNos , headingsArray );
                // HTML Datei final schreiben für 'html5-to-pdf'.
                createHTMLFile( htmlText );
                console.log( '5' );
                createPDFFile_html5_to_pdf( htmlText );
                console.log( '6' );
            });*/
            try {
                let result = await readPDF( headingsArray );
                //console.log( headingsArray );
                ModifyArray( headingsArray );
                console.log( result.join( '' ) );
                //console.log( headingsArray );
                // HTML Text neu generieren mit Seitenzahlen.
                htmlText = genHTMLText.generateHTMLText( opinion , opinionDetails , hasToC , print , ToCPageNos , headingsArray );
                // HTML Datei final schreiben für 'html5-to-pdf'.
                //createHTMLFile( htmlText );
                await createPDFFile_html5_to_pdf( htmlText );
            }
            catch( err ) {
                console.log( err );
                ok = false;
            }
        }
        else {
            try {
                await createPDFFile_html5_to_pdf( htmlText );
            }
            catch( err ) {
                console.log( err );
                ok = false;
            }
        }
    }
    return ok;
 }

 //module.exports = pdfCreate;
 module.exports = { pdfCreate };
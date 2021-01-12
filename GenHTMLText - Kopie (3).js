const fs = require('fs');
const helper = require('./helper');

const GetFirstPage = ( opinion ) => {
    let path = require( 'path' );
    let pathFile = path.join( __dirname , 'Files' , 'page1.html' );
    let pagedata = fs.readFileSync( pathFile , 'utf-8' );
    //let pagedata = fs.readFileSync( './Files/page1.html' , 'utf-8' );
    //pagedata = pagedata.replace( /\{\{opinionNo\}\}/g , opinion.opinionNo );

    return pagedata;
}

const GetParticipant = ( element ) => {
    if ( !element )
        return '';
    let participant = '';
    if ( !helper.EmptyString( element.gender ) )
        participant += element.gender;
    if ( !helper.EmptyString( element.academicTitle ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' ';
        participant += element.academicTitle;
    }
    if ( !helper.EmptyString( element.firstName ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' ';
        participant += element.firstName;
    }
    if ( !helper.EmptyString( element.lastName ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' ';
        participant += element.lastName;
    }
    if ( !helper.EmptyString( element.position ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' / ';
        participant += element.position;
    }
    if ( !helper.EmptyString( element.comment ) ) {
        if ( !helper.EmptyString( participant ) )
            participant += ' / ';
        participant += element.comment;
    }
    
    if ( !helper.EmptyString( participant ) )
        participant = `<li>${participant}</li>`;
    return participant;
}

const GetExpert = ( expert , long = true ) => {
    // long = Erweiterte "Version" mit advancedQualification (nur) für Seite 2.
    if ( !expert )
        return '';
    let exp = '';
    if ( !helper.EmptyString( expert.title ) )
        exp += expert.title;
    if ( !helper.EmptyString( expert.firstName ) ) {
        if ( !helper.EmptyString( exp ) )
            exp += ' ';
        exp += expert.firstName;
    }
    if ( !helper.EmptyString( expert.lastName ) ) {
        if ( !helper.EmptyString( exp ) )
            exp += ' ';
        exp += expert.lastName;
    }
    if ( long ) {
        if ( !helper.EmptyString( exp )
          && !helper.EmptyString( expert.advancedQualification ) )
            exp += '<br>';
        if ( !helper.EmptyString( expert.advancedQualification ) )
            exp += `(${expert.advancedQualification})`;
    }       
    return exp;
}

const GetSecondPage = ( opinion ) => {
    let path = require( 'path' );
    let pathFile = path.join( __dirname , 'Files' , 'page2.html' );
    let pagedata = fs.readFileSync( pathFile , 'utf-8' );
    //let pagedata = fs.readFileSync( './Files/page2.html' , 'utf-8' );
    pagedata = pagedata.replace( /\{\{company_name\}\}/ , opinion.customer.name );
    //pagedata = pagedata.replace( '{{contact_person}}' , opinion.customer.name );
    pagedata = pagedata.replace( /\{\{street\}\}/ , opinion.customer.street );
    pagedata = pagedata.replace( /\{\{postal_city\}\}/ , (opinion.customer.postalCode + ' ' + opinion.customer.city) );

    // Datumsangaben.
    let moment = require( 'moment' );
    let useMomentFormat = true;
    if ( useMomentFormat ) {
        pagedata = pagedata.replace( /\{\{PRJ_Datum_Start\}\}/ , moment( opinion.dateFrom ).format( 'DD.MM.YYYY' ) );
        pagedata = pagedata.replace( /\{\{PRJ_DATUM_PLAN\}\}/  , moment( opinion.dateTill ).format( 'DD.MM.YYYY' ) );
    }
    else {
        pagedata = pagedata.replace( /\{\{PRJ_Datum_Start\}\}/ , opinion.dateFrom.toLocaleDateString('de-DE') );
        pagedata = pagedata.replace( /\{\{PRJ_DATUM_PLAN\}\}/  , opinion.dateTill.toLocaleDateString('de-DE') );
    }
    
    // Teilnehmer.
    let help = '';
    if ( opinion.participants
      && opinion.participants.length > 0 ) {
        opinion.participants.forEach( element => {
            help += GetParticipant( element ); 
        });
        if ( !helper.EmptyString( help ) )
            help = `<ul class="part">${help}</ul>`; 
    }
    pagedata = pagedata.replace( '{{participants}}' , help );

    // Sachverständige.
    pagedata = pagedata.replace( /\{\{expertno1\}\}/ , GetExpert( opinion.expert1 ) );
    pagedata = pagedata.replace( /\{\{expertno2\}\}/ , GetExpert( opinion.expert2 ) );
    
    /*if ( !helper.EmptyString( help ) )
        help = `<ul class="part">${help}</ul>`;*/
    /*if ( opinion.expert1 != null )
        pagedata = pagedata.replace( '{{expertno1}}' , opinion.expert1.firstName + ' ' + opinion.expert1.lastName );
    if ( opinion.expert2 != null )
        pagedata = pagedata.replace( '{{expertno2}}' , opinion.expert2.firstName + ' ' + opinion.expert2.lastName );*/

    return pagedata;
}

const FilterOpDetailsLayerA = ( opDetail ) => {
    return ( opDetail
      && !opDetail.deleted
      && helper.EmptyString( opDetail.refParentDetail ) );
      //&& opDetail.type == 'HEADING' );// Wird hier nicht geprüft, ansonsten würden LayerA Details von jedem anderen type nie angezeigt!
}

const GetHeadingRegExp = ( ToCPoint ) => {
    return {
        //name: `^${ToCPoint}`,
        name: `${ToCPoint}`,
        page: ''
    };
}

const GetToCItemDepth = ( chapter ) => {
    //console.log( chapter );
    chapter = String( chapter );
    let countedPoints = 0;
    let index = chapter.indexOf( '.' , 0 )
    while ( index >= 0 ) {
        countedPoints++;
        index = chapter.indexOf( '.' , index + 1 )
    }
    //console.log( countedPoints );
    return `item depth-${countedPoints}`;
}

const GetChildrenToc = ( opDetails , parentID , chapter , print , ToCPageNos , writePageNoToArray , headingsArray ) => {
    // Für das Inhaltsverzeichnis, ToC = table of content.
    let text = '';
    //let title = '';
    // "Holt" alle Children zum übergebenen Gutachten-Detail (=parentID).
    let subChapterNo = 1;
    let detailArray = opDetails.filter( opDetail => {
        return ( opDetail
                && !opDetail.deleted
                && opDetail.refParentDetail == parentID
                //&& opDetail.type == 'HEADING' );
                && opDetail.showInToC
                && !helper.EmptyString( opDetail.printTitle ) );
    });
    if ( detailArray.length == 0 )
        return '';        

    detailArray.forEach( currentDetailValue => {
        text += `<div class="toc_Point">`;

        /*if ( !helper.EmptyString( currentDetailValue.printTitle ) )
            title = currentDetailValue.printTitle;
        else
            title = currentDetailValue.title;*/
        let pageNo = '';
        if ( ToCPageNos
          && !writePageNoToArray ) {
            // Seitennummern ins Inhaltsverzeichnis schreiben.
            let pageNoElement = headingsArray.find( (element) => {
                return ( element.name == `${chapter}.${subChapterNo} ${currentDetailValue.printTitle}` );
            });
            if ( pageNoElement )
                pageNo = pageNoElement.page;
            if ( print )
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} ${currentDetailValue.printTitle}</b></span>`;
            else
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${helper.GetID( chapter + '.' + subChapterNo )}">${currentDetailValue.printTitle}</a></b></span>`;
            text += `<span class="dots"></span>
                     <span class="pageNo">${pageNo}</span>`;
        }
        else {
            if ( print )
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} ${currentDetailValue.printTitle}</b></span>`;
            else
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${helper.GetID( chapter + '.' + subChapterNo )}">${currentDetailValue.printTitle}</a></b></span>`;
        }
        if ( writePageNoToArray )
            headingsArray.push( GetHeadingRegExp( `${chapter}.${subChapterNo} ${currentDetailValue.printTitle}` ) );

        text += `</div>`;
        text += GetChildrenToc( opDetails , currentDetailValue._id , `${chapter}.${subChapterNo}` , print , ToCPageNos , writePageNoToArray , headingsArray );
        subChapterNo += 1;
    });
    //text += `</td></tr></table>`;
    return text;
}

const GetChildren = ( opDetails , parentID , chapter , print ) => {
    // "Holt" alle Children zum übergebenen Gutachten-Detail (=parentID).
    let text = '';
    let subChapterNo = 1;
    let detailArray = opDetails.filter( opDetail => {
        return ( opDetail
              && !opDetail.deleted
              && opDetail.refParentDetail == parentID );
    });
    detailArray.forEach( currentDetailValue => {
        text += helper.GetFormatText( currentDetailValue , `${chapter}.${subChapterNo}` , 'B' , print );      
        text += GetChildren( opDetails , currentDetailValue._id , `${chapter}.${subChapterNo}` , print );
        //if ( currentDetailValue.type == 'HEADING' )
        if ( currentDetailValue.showInToC
          && !helper.EmptyString( currentDetailValue.printTitle ) )
            subChapterNo += 1;
    });
    return text;
}

const GetDynContent = ( opinionDetails , hasToC , print , ToCPageNos , headingsArray ) => {
    // Inhalt ab Seite 3.
    if ( !opinionDetails )
        return '';
    //let title = '';
    let text = ''; 
    let chapterNo = 1;

    opinionDetails.sort( helper.opinionDetailsSortASC );   
    const opDetailLayerA = opinionDetails.filter( FilterOpDetailsLayerA );
    if ( hasToC ) {
        text += `<div class="toc">
                    <p><b>Inhaltsverzeichnis</b></p>`;
        //////////////
        // Test zum Einfügen eines Bildes.
        //text += `<img style="width: 300px;" src="file:/C:/Users/marc.tomaschoff/meteor/html-create/Files/MEBEDO_LOGO_PRINT_CMYK.jpg" alt="TEST">`;
        //text += `<img style="width: 50mm;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1024px-Google_2015_logo.svg.png" alt="TEST">`;

        // Funktioniert NICHT in HTML5-to-pdf!
        //text += `<img style="width: 50mm;" src="https://mebedo-ac.de/wp-content/uploads/2020/10/MEBEDO_LOGO_PRINT_RGB-300x88.jpg" alt="TEST">`;

        /*let fs = require( 'fs' );

        //let bitmap = fs.readFileSync( 'C:/Users/marc.tomaschoff/meteor/html-create/Files/MEBEDO_LOGO_PRINT_CMYK.jpg');
        let bitmap = fs.readFileSync( 'C:/Users/marc.tomaschoff/meteor/html-create/Files/orange_FooterBlock.png');
            
        text += `<img src="data:image/png;base64,${new Buffer(bitmap).toString('base64')}">`;
        console.log(`<img src="data:image/png;base64,${new Buffer(bitmap).toString('base64')}">`);*/
        
        // Funktioniert in HTML5-to-pdf!
        /*let fs = require( 'fs' );
        let header_image = fs.readFileSync( './Files/header_image.html' , 'utf-8' );
        text += header_image;*/
        //////////////
        let writePageNoToArray = false;//Variable, ob Seitennummern in Array geschrieben werden sollen = nur für 1. temporären Durchgang.
        if ( ToCPageNos
          && ( !headingsArray
            || headingsArray.length == 0 ) )
            writePageNoToArray = true;

        // 1. Durchgang für Inhaltsverzeichnis.
        opDetailLayerA.forEach( currentDetail => {
            //if ( currentDetail.type == 'HEADING' ) {
            // Prüfung nach Kriterien showInToC = true und printTitle nicht leer.
            if ( currentDetail.showInToC
              && !helper.EmptyString( currentDetail.printTitle ) ) {
                text += `<div class="toc_Point">`;
                
                /*if ( !helper.EmptyString( currentDetail.printTitle ) )
                    title = currentDetail.printTitle;
                else
                    title = currentDetail.title;*/
                let pageNo = '';
                if ( ToCPageNos
                  && !writePageNoToArray ) {
                    // Seitennummern ins Inhaltsverzeichnis schreiben.
                    let pageNoElement = headingsArray.find( (element) => {
                        return ( element.name == `${chapterNo}. ${currentDetail.printTitle}` );
                    });
                    if ( pageNoElement )
                        pageNo = pageNoElement.page;
                    if ( print )
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. ${currentDetail.printTitle}</b></span>`;
                    else
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${chapterNo}">${currentDetail.printTitle}</a></b></span>`;
                    text += `<span class="dots"></span>
                             <span class="pageNo">${pageNo}</span>`;
                }
                else {
                    if ( print )
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. ${currentDetail.printTitle}</b></span>`;
                    else
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${chapterNo}">${currentDetail.printTitle}</a></b></span>`;
                }
                if ( writePageNoToArray )
                    headingsArray.push( GetHeadingRegExp( `${chapterNo}. ${currentDetail.printTitle}` ) );

                text += `</div>`;
                // Weitere OpinionDetails zu diesem OpinionDetail.
                text += GetChildrenToc( opinionDetails , currentDetail._id , chapterNo , print , ToCPageNos , writePageNoToArray , headingsArray );
                chapterNo += 1;
            }
        });
        text += `</div>`;
    }

    // 2. Durchgang für Inhalt: Einzelne Kapitel.
    chapterNo = 1;
    opDetailLayerA.forEach( currentDetail => {
        text += `<div class="page">`;
        text += helper.GetFormatText( currentDetail , chapterNo , 'A' , print );        
        // Weitere OpinionDetails zu diesem OpinionDetail.
        // Auskommentiert nur für Tests:
        //text += GetChildren( opinionDetails , currentDetail._id , chapterNo , print );
        text += `</div>`;
        chapterNo += 1;
    });
    return text;
}

const GetBody = ( opinion, opinionDetails , hasToC , print , ToCPageNos , headingsArray ) => {
    return '<body>'
         + GetFirstPage( opinion )
         + GetSecondPage( opinion )
         + GetDynContent( opinionDetails , hasToC , print , ToCPageNos , headingsArray )
         //+ GetFinalPage( opinion )
         + '</body>';
}

const ReplaceOpinionVariables = ( htmlText , opinion ) => {
    //...
    return htmlText;
}

const ReplaceInternalVariables = ( htmlText , opinion ) => {
    // Ersetzen der "internen" Variablen.
    // ${Firma}
    htmlText = htmlText.replace( /\$\{Firma\}/g , opinion.customer.name );
    // ${Gutachtennummer}
    htmlText = htmlText.replace( /\$\{Gutachtennummer\}/g , opinion.opinionNo );
    // ${Druckdatum}
    let dateStr = helper.GetTodayDateString();
    htmlText = htmlText.replace( /\$\{Druckdatum\}/g , dateStr );
    // ${GutachterName1}
    htmlText = htmlText.replace( /\$\{GutachterName1\}/g , GetExpert( opinion.expert1 , false ) );
    // ${GutachterName2}
    htmlText = htmlText.replace( /\$\{GutachterName2\}/g , GetExpert( opinion.expert2 , false ) );

    return htmlText;
}

const ReplaceVariables = ( htmlText , opinion ) => {
    // Replace der im Gutachten verwendeten Variablen.
    htmlText = ReplaceOpinionVariables( htmlText , opinion );
    htmlText = ReplaceInternalVariables( htmlText , opinion );
    return htmlText;
}

const generateHTMLText = ( opinion , opinionDetails , hasToC , print , ToCPageNos , headingsArray ) => {
    return ReplaceVariables( GetBody( opinion , opinionDetails , hasToC , print , ToCPageNos , headingsArray ) , opinion );
}

module.exports = { generateHTMLText };
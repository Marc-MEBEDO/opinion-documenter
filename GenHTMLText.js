const fs = require('fs');
const path = require( 'path' );
const helper = require('./helper');

const ToC_constString = 'Inhaltsverzeichnis';
const AbbreviationsPage_constString = 'Abkürzungsverzeichnis';

const GetFirstPage = () => {
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
    let pathFile = path.join( __dirname , 'Files' , 'page2.html' );
    let pagedata = fs.readFileSync( pathFile , 'utf-8' );
    //let pagedata = fs.readFileSync( './Files/page2.html' , 'utf-8' );
    //pagedata = pagedata.replace( /\{\{company_name\}\}/ , opinion.customer.name );
    pagedata = pagedata.replace( /\{\{Name_Auftraggeber\}\}/ , 'opinion.customer.contact_person' );
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

    return pagedata;
}

const GetAbbreviationsPage = () => {
    let pathFile = path.join( __dirname , 'Files' , 'page_abbreviations.html' );
    let pagedata = fs.readFileSync( pathFile , 'utf-8' );

    return pagedata;
}

const FilterOpDetailsLayerA = ( opDetail ) => {
    return ( opDetail
      && !opDetail.deleted
      && !opDetail.finallyRemoved
      && helper.EmptyString( opDetail.refParentDetail ) );
      //&& opDetail.type == 'HEADING' );// Wird hier nicht geprüft, ansonsten würden LayerA Details von jedem anderen type nie angezeigt!
}

const GetPageClass = ( opDetail ) => {
    //`<div class="page...">`;
    let pageClass = '';
    if ( opDetail.pagebreakBefore ) {
        if ( opDetail.pagebreakAfter )
            pageClass = 'page-Breaks';
        else
            pageClass = 'page-breakBefore';
    }
    else if ( opDetail.pagebreakAfter )
        pageClass = 'page-breakAfter';
    else
        pageClass = 'page-noBreak';    

    return pageClass;
}

const GetHeadingRegExp = ( ToCPoint ) => {
    return {
        name: ToCPoint,
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
    if ( countedPoints > 7 )
        countedPoints = 7;// In CSS (basic.css) maximal eingestellte Einrückung.
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
                && !opDetail.finallyRemoved
                && opDetail.refParentDetail == parentID
                //&& opDetail.type == 'HEADING' );
                && opDetail.showInToC
                && !helper.EmptyString( opDetail.printTitle ) );
    });
    if ( detailArray.length == 0 )
        return '';        

    detailArray.forEach( currentDetailValue => {
        text += '<div class="toc_Point">';

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
                //text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${helper.GetID( chapter + '.' + subChapterNo )}">${currentDetailValue.printTitle}</a></b></span>`;
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${currentDetailValue._id}">${currentDetailValue.printTitle}</a></b></span>`;
            text += '<span class="dots"></span>';
            text += `<span class="pageNo">${pageNo}</span>`;
        }
        else {
            if ( print )
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} ${currentDetailValue.printTitle}</b></span>`;
            else
                //text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${helper.GetID( chapter + '.' + subChapterNo )}">${currentDetailValue.printTitle}</a></b></span>`;
                text += `<span class="${GetToCItemDepth( chapter + '.' + subChapterNo )}"><b>${chapter}.${subChapterNo} <a href="#${currentDetailValue._id}">${currentDetailValue.printTitle}</a></b></span>`;
        }
        if ( writePageNoToArray )
            headingsArray.push( GetHeadingRegExp( `${chapter}.${subChapterNo} ${currentDetailValue.printTitle}` ) );

        text += '</div>';
        text += GetChildrenToc( opDetails , currentDetailValue._id , `${chapter}.${subChapterNo}` , print , ToCPageNos , writePageNoToArray , headingsArray );
        subChapterNo += 1;
    });
    return text;
}

const GetChildren = ( opDetails , parentID , chapter ) => {
    // "Holt" alle Children zum übergebenen Gutachten-Detail (=parentID).
    let text = '';
    let subChapterNo = 1;
    let detailArray = opDetails.filter( opDetail => {
        return ( opDetail
              && !opDetail.deleted
              && !opDetail.finallyRemoved
              && opDetail.refParentDetail == parentID );
    });
    if ( detailArray.length == 0 )
        return ''; 

    detailArray.forEach( currentDetailValue => {
        text += `<div class="${GetPageClass( currentDetailValue )}">`;
        if ( !helper.EmptyString( currentDetailValue.htmlContent ) )
            text += currentDetailValue.htmlContent.replace( /\{\{Xposition\}\}/ , `${chapter}.${subChapterNo}` );
        else
            //text += helper.GetFormatText( currentDetailValue , `${chapter}.${subChapterNo}` , 'B' );
            text += helper.GetFormatText2( currentDetailValue , 'B' )
            .replace( /\{\{Xposition\}\}/ , `${chapter}.${subChapterNo}` )
            .replace( /\{\{XparentPosition\}\}/ , '' );
        text += '</div>';
        text += GetChildren( opDetails , currentDetailValue._id , `${chapter}.${subChapterNo}` );
        //if ( currentDetailValue.type == 'HEADING' )
        if ( currentDetailValue.showInToC
          && !helper.EmptyString( currentDetailValue.printTitle ) )
            subChapterNo += 1;
    });
    return text;
}

const GetDynContent = ( opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray ) => {
    // Inhalt ab Seite 3.
    if ( !opinionDetails )
        return '';
    //let title = '';
    let text = ''; 
    let chapterNo = 1;

    opinionDetails.sort( helper.opinionDetailsSortASC );   
    const opDetailLayerA = opinionDetails.filter( FilterOpDetailsLayerA );
    if ( hasToC ) {
        text += '<div class="page-Breaks">';
        text += `<h2 class="ueb2">${ToC_constString}</h2>`;
                    //<p><b>Inhaltsverzeichnis</b></p>`;
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
            || headingsArray.length == 0 ) ) {
            if ( hasAbbreviationsPage )
                headingsArray.push( GetHeadingRegExp( AbbreviationsPage_constString ) );
            writePageNoToArray = true;
        }
        if ( hasAbbreviationsPage ) {
            // Abkürzungsverzeichnis im Inhaltsverzeichnis.
            text += '<div class="toc_Point">';
            let pageNo = '';
            if ( ToCPageNos
              && !writePageNoToArray ) {
                // Seitennummern ins Inhaltsverzeichnis schreiben.
                let pageNoElement = headingsArray.find( (element) => {
                    return ( element.name == AbbreviationsPage_constString );
                });
                if ( pageNoElement )
                    pageNo = pageNoElement.page;
                if ( print )
                    text += `<span class="item"><b>${AbbreviationsPage_constString}</b></span>`;
                else
                    text += `<span class="item"><b><a href="#0">${AbbreviationsPage_constString}</a></b></span>`;
                text += '<span class="dots"></span>';
                text += `<span class="pageNo">${pageNo}</span>`;
            }
            else {
                if ( print )
                    text += `<span class="item"><b>${AbbreviationsPage_constString}</b></span>`;
                else
                    text += `<span class="item"><b><a href="#0">${AbbreviationsPage_constString}</a></b></span>`;
            }
            text += '</div>';
        }

        // 1. Durchgang für Inhaltsverzeichnis.
        opDetailLayerA.forEach( currentDetail => {
            //if ( currentDetail.type == 'HEADING' ) {
            // Prüfung nach Kriterien showInToC = true und printTitle nicht leer.
            if ( currentDetail.showInToC
              && !helper.EmptyString( currentDetail.printTitle ) ) {
                text += '<div class="toc_Point">';
                
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
                        //text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${chapterNo}">${currentDetail.printTitle}</a></b></span>`;
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${currentDetail._id}">${currentDetail.printTitle}</a></b></span>`;
                    text += '<span class="dots"></span>';
                    text += `<span class="pageNo">${pageNo}</span>`;
                }
                else {
                    if ( print )
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. ${currentDetail.printTitle}</b></span>`;
                    else
                        //text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${chapterNo}">${currentDetail.printTitle}</a></b></span>`;
                        text += `<span class="${GetToCItemDepth( chapterNo )}"><b>${chapterNo}. <a href="#${currentDetail._id}">${currentDetail.printTitle}</a></b></span>`;
                }
                if ( writePageNoToArray )
                    headingsArray.push( GetHeadingRegExp( `${chapterNo}. ${currentDetail.printTitle}` ) );

                text += '</div>';
                // Weitere OpinionDetails zu diesem OpinionDetail.
                text += GetChildrenToc( opinionDetails , currentDetail._id , chapterNo , print , ToCPageNos , writePageNoToArray , headingsArray );
                chapterNo += 1;
            }
        });
        text += '</div>';
    }

    // Abkürzungsverzeichnis.
    if ( hasAbbreviationsPage ) {
        text += GetAbbreviationsPage();
    }

    // 2. Durchgang für Inhalt: Einzelne Kapitel.
    chapterNo = 1;
    opDetailLayerA.forEach( currentDetail => {
        text += `<div class="${GetPageClass( currentDetail )}">`;
        if ( !helper.EmptyString( currentDetail.htmlContent ) )
            text += currentDetail.htmlContent.replace( /\{\{Xposition\}\}/ , chapterNo );
        else
            //text += helper.GetFormatText( currentDetail , chapterNo , 'A' );
            text += helper.GetFormatText2( currentDetail , 'A' )
            .replace( /\{\{Xposition\}\}/ , chapterNo )
            .replace( /\{\{XparentPosition\}\}/ , '' );
        text += '</div>';
        // Weitere OpinionDetails zu diesem OpinionDetail.
        text += GetChildren( opinionDetails , currentDetail._id , chapterNo );
        
        chapterNo += 1;
    });
    return text;
}

const GetBody = ( opinion, opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray ) => {
    return '<body>'
         + GetFirstPage()
         + GetSecondPage( opinion )
         + GetDynContent( opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray )
         + '</body>';
}

/*const escapeRegExp = ( rexp ) => {
    return rexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}*/

const ReplaceOpinionVariables = ( htmlText , opinion ) => {
    if ( opinion.userVariables
      && opinion.userVariables.length > 0 ) {
        opinion.userVariables.forEach( element => {
            htmlText = htmlText.replace( new RegExp( '\{\{' + helper.escapeRegExp( element.name ) + '\}\}' , 'g' ) , element.value );
        });
    }
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

const generateHTMLText = ( opinion , opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray ) => {
    return ReplaceVariables( GetBody( opinion , opinionDetails , hasAbbreviationsPage , hasToC , print , ToCPageNos , headingsArray ) , opinion );
}

module.exports = { generateHTMLText };
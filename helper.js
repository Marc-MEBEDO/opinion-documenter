const layoutTypes = require('./constData/layouttypes');

const EmptyString = ( stringToCheck ) => {
    if ( !stringToCheck
      || stringToCheck == '' )
        return true;
    else
        return false;
}

const GetTodayDateString = () => {
  // Aktuelles Datum zurückgeben.
  let dateStr = '';
  let moment = require( 'moment' );
  let useMomentFormat = true;
  if ( useMomentFormat )
      dateStr = moment().format( 'DD.MM.YYYY' );
  else
      dateStr = new Date().toLocaleDateString('de-DE');
  return dateStr;
}

const opinionDetailsSortASC = ( opinionDetailA , opinionDetailB ) => {
  // Mit "parentPosition" und "position":
  // Funktion zur Sortierung der Gutachten-Details.
  let pValue1 = opinionDetailA.parentPosition;
  let pValue2 = opinionDetailB.parentPosition;

  if ( !EmptyString( pValue1 )
    && !EmptyString( pValue2 ) ) {
    if ( pValue2 > pValue1 )
      return 1;
  }

  return opinionDetailA.position - opinionDetailB.position;
}

/*const opinionDetailsSortASC = ( opinionDetailA , opinionDetailB ) => {
  // Mit "OrderString":
  // Funktion zur Sortierung der Gutachten-Details.
  let value1 = opinionDetailA.orderString.trim();
  let value1b = '';
  let value2 = opinionDetailB.orderString.trim();
  let value2b = '';
  let tmp = '';
  let pos = 0;

  // Buchstabe 'a', 'b' oder 'c' enthalten?
  if ( ( pos = value1.toLowerCase().indexOf( 'a' ) ) > -1 )
    value1 = value1.substring( 0 , pos );
  if ( ( pos = value1.toLowerCase().indexOf( 'b' ) ) > -1 )
    value1 = value1.substring( 0 , pos );
  if ( ( pos = value1.toLowerCase().indexOf( 'c' ) ) > -1 )
    value1 = value1.substring( 0 , pos );

  if ( ( pos = value2.toLowerCase().indexOf( 'a' ) ) > -1 )
    value2 = value2.substring( 0 , pos );
  if ( ( pos = value2.toLowerCase().indexOf( 'b' ) ) > -1 )
    value2 = value2.substring( 0 , pos );
  if ( ( pos = value2.toLowerCase().indexOf( 'c' ) ) > -1 )
    value2 = value2.substring( 0 , pos );

  // 1. Zeichen ist '0'?
  while ( value1.charAt( 0 ) == '0' && value1.length > 1 ) {
      value1 = value1.slice( -(value1.length - 1) );// 1. Zeichen entfernen.
  }
  while ( value2.charAt( 0 ) == '0' && value2.length > 1 ) {
    value2 = value2.slice( -(value2.length - 1) );// 1. Zeichen entfernen.
  }

  // Unterscheidung zwischen orderString mit und ohne '-'.
  if ( ( pos = value1.indexOf( '-' ) ) > -1 ) {
      // Zeichen '-' ist enthalten.
      tmp = value1.substring( 0 , pos );
      if ( value1.length > (pos+1) )
        value1b = value1.substring( pos + 1 );
      value1 = tmp;
  }
  if ( ( pos = value2.indexOf( '-' ) ) > -1 ) {
      // Zeichen '-' ist enthalten.
      tmp = value2.substring( 0 , pos );
      if ( value2.length > (pos+1) )
        value2b = value2.substring( pos + 1 );
      value2 = tmp;
  }
  if ( value1 == value2 )
    return value1b - value2b;
  else
    return value1 - value2;
}*/

/*const GetID = ( chapter ) => {
  return String( chapter ).replace( /\./g , '-' );
}*/

const GetFormatText2 = ( opDetail , layer ) => {
  let depth = 0;
  if ( layer != 'A' )
    depth = 1;
  return layoutTypes.renderTemplate( opDetail , depth );
}

const GetFormatText = ( opDetail , chapterNo , layer ) => {
  let text = '';
  
  let formatText = opDetail.text;
  // Kapitel in Inhaltsverzeichnis?
  // Wenn showInToC = true und PrintTitle nicht leer.
  if ( opDetail.showInToC 
    && !EmptyString( opDetail.printTitle ) ) {
    if ( layer == 'A' )
      // Auf 1. Ebene (=Layer A) immer h2.
      //text += `<h2 class="ueb2" id="${GetID( chapterNo )}">${chapterNo}. ${opDetail.printTitle}</h2>`;
      text += `<h2 class="ueb2" id="${opDetail._id}">${chapterNo}. ${opDetail.printTitle}</h2>`;
    else if ( opDetail.type == 'QUESTION'
            || opDetail.type == 'ANSWER'
            || opDetail.type == 'RECOMMENDATION' ) {}// wird unten gesetzt.
    else
      //text += `<h2 class="ueb3" id="${GetID( chapterNo )}">${chapterNo} ${opDetail.printTitle}</h2>`;
      text += `<h2 class="ueb3" id="${opDetail._id}">${chapterNo} ${opDetail.printTitle}</h2>`;
  }
  else if ( !EmptyString( opDetail.printTitle ) ) {
    if ( opDetail.type == 'QUESTION'
      || opDetail.type == 'ANSWER'
      || opDetail.type == 'RECOMMENDATION' ) {}// wird unten gesetzt.
    else
      text += `<p><b>${opDetail.printTitle}</b></p>`
  }

  // Formatierung abhängig vom type.
  if ( opDetail.type == 'INFO' ) {
    // formatText...
  }
  else if ( opDetail.type == 'HEADING' ) {
    // formatText...
  }
  else if ( opDetail.type == 'TEXT' ) {
    // formatText...
  }
  else if ( opDetail.type == 'QUESTION' ) {
    text += '<div class="question">';
    if ( opDetail.showInToC
      && !EmptyString( opDetail.printTitle ) ) {
      text += `<p id="${GetID( chapterNo )}"><b>${chapterNo}. ${opDetail.printTitle}</b></p>`;
    }
    else if ( !EmptyString( opDetail.printTitle ) ) {
      text += `<p><b>${chapterNo}. ${opDetail.printTitle}</b></p>`;
    }
    if ( !EmptyString( formatText ) )
      text += `<p>${formatText}</p>`;
    text += '</div>';
    formatText = '';
  }
  else if ( opDetail.type == 'ANSWER' ) {
    text += '<div class="answer">';
    if ( opDetail.showInToC
      && !EmptyString( opDetail.printTitle ) ) {
      //text += `<p id="${GetID( chapterNo )}"><b>${chapterNo}. ${opDetail.printTitle}</b></p>`;
      text += `<p id="${opDetail._id}"><b>${chapterNo}. ${opDetail.printTitle}</b></p>`;
    }
    else if ( !EmptyString( opDetail.printTitle ) ) {
      text += `<p><b>${opDetail.printTitle}</b></p>`;
    }
    if ( !EmptyString( formatText ) ) {
      text += '<p><u>Antwort/Ist-Zustand</u></p>';
      text += `<p>${formatText}</p>`;
    }
    text += '</div>';
    formatText = '';
  }
  else if ( opDetail.type == 'DEFINITION' ) {
    // formatText...
  }
  else if ( opDetail.type == 'RECOMMENDATION' ) {
    text += '<div class="recommendation">';
    if ( opDetail.showInToC
      && !EmptyString( opDetail.printTitle ) ) {
      //text += `<p id="${GetID( chapterNo )}"><b>${chapterNo}. ${opDetail.printTitle}</b></p>`;
      text += `<p id="${opDetail._id}"><b>${chapterNo}. ${opDetail.printTitle}</b></p>`;
    }
    else if ( !EmptyString( opDetail.printTitle ) ) {
      text += `<p><b>${opDetail.printTitle}</b></p>`;
    }
    if ( !EmptyString( formatText ) ) {
      text += '<p><u>Handlungsempfehlung</u></p>';
      text += `<p>${formatText}</p>`;
    }
    text += '</div>';
    formatText = '';
  }
  else if ( opDetail.type == 'IMPORTANT' ) {
    // formatText...
  }
  else if ( opDetail.type == 'NOTE' ) {
    // formatText...
  }
  else if ( opDetail.type == 'ATTENTION' ) {
    // formatText...
  }
  else if ( opDetail.type == 'BESTIMMUNGEN' ) {
    // formatText...
  }
  else if ( opDetail.type == 'TODOLIST' ) {
    // formatText...
  }
  if ( !EmptyString( formatText ) )
    text += formatText; 
  
  return text;
};

const escapeRegExp = ( rexp ) => {
  return rexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = { EmptyString , GetTodayDateString , opinionDetailsSortASC , GetFormatText , GetFormatText2 , escapeRegExp };
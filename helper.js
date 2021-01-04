
const EmptyString = ( stringToCheck ) => {
    if ( !stringToCheck
      || stringToCheck == '' )
        return true;
    else
        return false;
}

const opinionDetailsSortASC = ( opinionDetailA , opinionDetailB ) => {
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
}

const GetID = ( chapter ) => {
  return String( chapter ).replace( /\./g , '-' );
}

const GetFormatText = ( opDetail , chapterNo , layer , print ) => {
  let title = '';
  let text = '';
  if ( !EmptyString( opDetail.printTitle ) )
    title = opDetail.printTitle;
  else
    title = opDetail.title;
  
  let formatText = opDetail.text;
  // Formatierung abhängig vom type.
  if ( opDetail.type == 'INFO' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'HEADING' ) {
    if ( print ) {
      if ( layer == 'A' )
        text += `<h2>${chapterNo}. ${title}</h2>`;
      else
        text += `<h2>${chapterNo} ${title}</h2>`
    }
    else {
      if ( layer == 'A' )
        //text += `<h2 id="${GetID( chapterNo )}">${chapterNo}. ${title}</h2>`;
        text += `<h2 class="ueb2" id="${GetID( chapterNo )}">${chapterNo}. ${title}</h2>`;
      else
        text += `<h2 class="ueb3" id="${GetID( chapterNo )}">${chapterNo} ${title}</h2>`
    }
    // formatText...
  }
  else if ( opDetail.type == 'TEXT' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'QUESTION' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'ANSWER' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'DEFINITION' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'RECOMMENDATION' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'IMPORTANT' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'NOTE' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'ATTENTION' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'BESTIMMUNGEN' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  else if ( opDetail.type == 'TODOLIST' ) {
    text += `<p><b>${title}</b></p>`;
    // formatText...
  }
  if ( !EmptyString( formatText ) )
    text += formatText; 
  
  return text;
};

module.exports = { EmptyString , opinionDetailsSortASC , GetFormatText , GetID };
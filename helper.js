//const layoutTypes = require( './constData/layouttypes' );

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
  const useMomentFormat = true;// Wird hier fest gesetzt.
  if ( useMomentFormat ) {
    const moment = require( 'moment' );
    dateStr = moment().format( 'DD.MM.YYYY' );
  }
  else
    dateStr = new Date().toLocaleDateString( 'de-DE' );
  return dateStr;
}

const GetPDFPathFile = ( iPath , iFileName , tmp = false ) => {
  const path = require( 'path' );
  let pathFile = path.join( iPath , iFileName );
  if ( tmp )
    pathFile += '.tmp';
  pathFile += '.pdf';
  return pathFile;
}

const opinionDetailsSortASC = ( opinionDetailA , opinionDetailB ) => {
  // Mit "parentPosition" und "position":
  // Funktion zur Sortierung der Gutachten-Details.
  const pValueA = opinionDetailA.parentPosition;
  const pValueB = opinionDetailB.parentPosition;

  if ( !EmptyString( pValueA ) ) {
    if ( !EmptyString( pValueB ) ) {
      if ( pValueA < pValueB )
        return -1;
      else if ( pValueA > pValueB )
        return 1;
    }
    else
      return 1;
  }
  else if ( !EmptyString( pValueB ) )
    return -1;

  return opinionDetailA.position - opinionDetailB.position;
}

const escapeRegExp = ( rexp ) => {
  return rexp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = { EmptyString , GetTodayDateString , opinionDetailsSortASC , escapeRegExp , GetPDFPathFile };
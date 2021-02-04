# opinion-documenter

Modul für die Generierung eines PDF Dokuments eines Gutachtens.
Das Gutachten mit den entsprechenden Inhalten wird als Parameter an die Funktion "pdfCreate" übergeben.

## Used Packages
* [html5-to-pdf](https://www.npmjs.com/package/html5-to-pdf)
* [pdf-parse](https://www.npmjs.com/package/pdf-parse)
* [moment](https://www.npmjs.com/package/moment)

## Getting started

`npm install opinion-documenter --save`

## Example usage

```javascript
const opinionDocumenter = require( 'opinion-documenter' );
let opinion = {};
let details = [];
let detailsTodolist = [];
let pdfPath = '';
const filename = await opinionDocumenter.pdfCreate( opinion , details , detailsTodolist , pdfPath );
```

---

## Good to know

### Rückgabewert

String "Pfad + Dateiname" des generierten PDF-Dokuments, wenn Erstellung erfolgreich durchgeführt wurde.
Ansonsten ''.

### Parameter der Funktion pdfCreate

Die ersten 4 Parameter der Funktion pdfCreate sind verpflichtend und beinhalten:
1. opinion: Das Gutachten "Objekt".
2. details: Das Array der zum Gutachten gehörenden Gutachten-Details.
3. detailsTodolist: Das Array der Gutachten-Details, das alle im Gutachten enthaltenen (aktiven) Fragen mit Handlungsbedarf enthält.
4. pdfPath: Pfad, in den das zu erstellende PDF Dokument geschrieben werden soll. Als Dateiname wird automatisch "{opinion._id}.pdf" gesetzt.

Paramteter 5-8 sind optional und beinhalten.
5. hasAbbreviationsPage: default: true - Bool, der angibt, ob im Dokument das fest hinterlegte Abkürzungsvereichnis enthalten sein soll. 
6. hasToC: default: true - Bool, der angibt, ob Inhaltsverzeichnis generiert werden soll.
7. print: default: false - Bool, der angibt, ob PDF für Ausdruck (=true) gedacht ist oder nicht (=false).
Wenn print == false (also rein für digitale Betrachtung), dann werden im Inhaltsverzeichnis Links eingefügt.
Bei print == true keine Links.
Nur relevant, wenn hasToC == true.
8. ToCPageNos: default: true - Bool, der angibt, ob im Inhaltsverzeichnis Seitenzahlen angegeben werden sollen.
Nur relevant, wenn hasToC == true.

### Variablen

#### Interne Variablen

Folgende internen Variablen werden verwendet bzw. können im Dokument verwendet werden:
* ${Firma} - aus opinion
* ${Druckdatum} - Datum zum Zeitpunkt des Funktionsaufrufs
* ${Gutachtennummer} - aus opinion
* ${GutachterName1} - aus opinion
* ${GutachterName2} - aus opinion

#### Zusätzliche Variablen
Folgende Variablen können vom Anwender genutzt werden zum Überschreiben der default-Werte:

##### Für das "Deckblatt" (1. Seite) des Dokuments:
* {{Dokument_Titel}} - default: 'Gutachtliche Stellungnahme'
* {{Dokument_Untertitel}} - default: 'Sicherheit in der Elektrotechnik'
* {{Dokument_ZusatztextZeile1}} - default: 'Schwerpunkt ist der Aufbau einer rechtssicheren'
* {{Dokument_ZusatztextZeile2}} - default: 'Organisationsstruktur im Bereich der Elektrotechnik'
* {{Dokument_StandortLangtext}} - default: ''. Empfehlung, falls benötigt: 'am Standort xyz'

##### Für die 2. Seite des Dokuments für den Namen des Ansprechpartners des Auftraggebers:
* {{AuftraggeberName}} - default: ''
const fs = require('fs');

const GetHead = () => {
    return fs.readFileSync( 'Files/head.html' , 'utf-8' );

    /*return `<head>`
        + `<meta charset="utf8">`
        + `<title>GutachtenPlus</title>`
        + `<style>`
        + `p {color: black; font-family:Arial;}`
        + `p.normal {mso-style-priority:1;margin:0cm;line-height:115%;font-size:10.0pt;font-family:"Arial";}`
        + `div {color: black; font-family:Arial;}`
        + `table {width:100%;}`
        + `td {color: black; font-family:Arial; }`
        + `.page { page-break-after: always; }`
        + `</style></head>`;*/
    //th {color: black; font-family:Arial;}
}

const GetHeader = () => {
    //return `<div style="text-align: center;">Author: Marc Bachmann</div>`;
    
    //return `<div id="pageHeader"><img style='width: 720px;' src='file:/Files/fdfdsafs.jpg;' alt='Page Header'></div>`;
    
    //return `<div id="pageHeader"><img style='width: 720px;' src='https://mebedo-ac.de/wp-content/uploads/2020/10/MEBEDO_LOGO_PRINT_RGB-300x88.jpg' alt='Page Header'></div>`;
    
    return `<div id="pageHeader"><img style='width: 720px;' src='file:/C:/Users/marc.tomaschoff/meteor/html-create/Files/Image_header.png' alt='Page Header'></div>`;

    //return `<div id="pageHeader"><img style='width: 720px;' src='data:image/png;base64,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'></div>`;
    
    //return `<div id="pageHeader">Default header</div>`;
/*+ `<div id="pageHeader-first">Header on first page</div>`
+ `<div id="pageHeader-2">Header on second page</div>`
+ `<div id="pageHeader-3">Header on third page</div>`
+ `<div id="pageHeader-last">Header on last page</div>`;*/
}

const GetFooter = () => {
    /*return `<div id="pageFooter">Default footer</div>`
    + `<div id="pageFooter-first">Footer on first page</div>`
    + `<div id="pageFooter-2">Footer on second page</div>`
    + `<div id="pageFooter-last">Footer on last page</div>`;*/

    let date = new Date().toLocaleDateString('de-DE');
    return `<div id="pageFooter"><table><tr>`//`<div id="pageFooter" style="background-color: rgb(245,155,19);"><table><tr>`
                + `<td style="text-align: left;width: 33%;">© MEBEDO Consulting GmbH</td>`
                + `<td style="text-align: center;width: 33%;">Seite {{page}} von {{pages}}</td>`
                + `<td style="text-align: right;width: 33%;">${date}</td>`
                + `</tr></table></div>`;
}

const GetFirstPage = () => {
    var pagedata = fs.readFileSync( 'Files/page1.html' , 'utf-8' );
    var opinion_no = '[57464]';
    pagedata = pagedata.replace( '{{opinionNo}}' , opinion_no );

    return pagedata;

    /*return `<div class="page">`
        +   `<p>&nbsp;</p>`
        +   `<p>&nbsp;</p>`
        +   `<p>&nbsp;</p>`
        +   `<p>&nbsp;</p>`
        +   `<p align=center style="text-align: center"><span style="font-size: 28.0pt;line-height: 115%">Gutachtliche Stellungnahme</span></p>`
        +   `<p>&nbsp;</p>`
        +   `<p align=center style="text-align: center">Nr. [57464]</p>`
        +   `<p>&nbsp;</p>`
        +   `<p>&nbsp;</p>`
        +   `<p align=center style="text-align: center"><span style="font-size: 16.0pt;line-height: 115%">[zum Thema innere Sicherheit in der Elektrotechnik]</span></p>`
        +   `<p>&nbsp;</p>`
        +   `<p align=center style="text-align: center"><span style="font-size: 16.0pt;line-height: 115%">[Schwerpunkt ist der Aufbau einer rechtssicheren Organisationsstruktur im Bereich der Elektrotechnik]</span></p>`
        + `</div>`;*/
}

const GetSecondPage = () => {
    var pagedata = fs.readFileSync( 'Files/page2.html' , 'utf-8' );
    var customerData = { firmenname: 'Musterfa.' };
    pagedata = pagedata.replace( '{{firmenname}}' , customerData.firmenname );

    return pagedata;
    
    
    
    /*return `<div class="page">`
         + `<p class=normal>&nbsp;</p>`
         + `<table border=1 cellspacing=0 cellpadding=0 style="border-collapse:collapse;">`
         +  `<tr style="height:100.4pt;">`
         +      `<td width=168 valign=top style="width: 125.9pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 100.4pt">`
         +      `<p class=normal>Auftraggeber/ Ort:</p>`
         +      `</td>`
         +      `<td width=504 valign=top style="width: 377.95pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 100.4pt">`
         +      `<p class=normal>[Musterfirma AG]</p>`
         +      `<p class=normal>[Herr Hans Mustermann]</p>`
         +      `<p class=normal>[Musterstr. 1]</p>`
         +      `<p class=normal>[10000 Musterort]</p>`
         +      `</td>`
         +  `</tr>`
         +  `<tr style="height: 35.15pt">`
         +      `<td width=168 valign=top style="width: 125.9pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 35.15pt">`
         +      `<p class=normal>Datum:</p>`
         +      `</td>`
         +      `<td width=504 valign=top style="width: 377.95pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 35.15pt">`
         +      `<p class=normal>[PRJ_Datum_Start] - [PRJ_DATUM_PLAN]</p>`
         +      `</td>`
         +  `</tr>`
         +  `<tr style="height: 34.95pt">`
         +      `<td width=168 valign=top style="width: 125.9pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 34.95pt">`
         +      `<p class=normal>Uhrzeit:</p>`
         +      `</td>`
         +      `<td width=504 valign=top style="width: 377.95pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 34.95pt">`
         +      `<p class=normal>[PRJ_Uhrzeit_Von] - [PRJ_Uhrzeit_bis] Uhr</p>`
         +      `</td>`
         +  `</tr>`
         +  `<tr style="height: 105.6pt">`
         +      `<td width=168 valign=top style="width: 125.9pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 105.6pt">`
         +      `<p class=normal>Teilnehmer:</p>`
         +      `</td>`
         +      `<td width=504 valign=top style="width: 377.95pt;padding: 0cm 5.4pt 0cm 5.4pt;height: 105.6pt">`
         +      `<p class=normal>[Teilnehmer]</p>`
         +      `<p class=normal>Michael Kern</p>`
         +      `<p class=normal>Markus Reppke</p>`
         +      `<p class=normal>Hildegard Renschler (teilweise)</p>`
         +      `<p class=normal>Andreas Kern</p>`
         +      `<p class=normal>Hans-Jürgen Jurth (ext. Hausverwaltung)</p>`
         +      `<p class=normal>Frank Hafner (Fa. Elektro Ehret GmbH)</p>`
         +      `</td>`
         +  `</tr>`
         +  `<tr>`
         +      `<td width=168 valign=top style="width: 125.9pt;padding: 0cm 5.4pt 0cm 5.4pt">`
         +      `<p class=normal>Sachverständige:</p>`
         +      `</td>`
         +      `<td width=504 valign=top style="width: 377.95pt;padding: 0cm 5.4pt 0cm 5.4pt">`
         +      `<p class=normal>[PRJ_ProjektleiterAnrede] [PRJ_ProjektleiterName]</p>`
         +      `<p class=normal>[PRJ_ProjektleiterTitelZusatz]</p>`
         +      `<p class=normal></p>`
         +      `<p class=normal>[PRJ_MAVertriebAnrede] [PRJ_MAVertriebName]</p>`
         +      `<p class=normal>[PRJ_MAVertriebTitelZusatz] Bund der Sachverständigen des Handwerks e. V. geprüfter Sachverständiger für Elektrotechnik, MEBEDO Consulting GmbH</p>`
         +      `<p class=normal></p>`
         +      `</td>`
         +   `</tr>`
         + `</table></div>`;*/
}

const GetDynContent = () => {
    // Inhalt ab Seite 3.
    return `<h1>Dynamic content...</h1>`;
}

const GetBody = () => {
    let text = `<body>`
            + GetFirstPage()
            + GetSecondPage()
            + GetDynContent()
            + `</body>`;      
    
    
    /*+ `<p><u><span style='font-family: &quot;Arial&quot;;'>GutachtenPlus</span></u></p>`
    + `<p><b><span style='font-family: &quot;Arial&quot;;'>fsasf</span></b></p>`
    + `<p><b><span style='font-family: &quot;Arial&quot;;'><font color='#FF0000'>WICHTIG</font><br></span></b></p>`
    + `<ul><li><span style='font-family: &quot;Arial&quot;;'>324124</span></li><li><font color='#397B21'><span style='font-family: &quot;Arial&quot;;'>521</span></font></li><li><span style='font-family: &quot;Arial&quot;;'>325635</span></li><li><span style='font-family: &quot;Arial&quot;;'>rrrr</span></li></ul>`
    + `<span style='font-family: &quot;Arial&quot;;'><br></span><br></p></body>`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`
    + `<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20`;*/

    return text;
}

const GetText = () => {
    let text = GetHead()
    + GetHeader()
    + GetFooter()
    + GetBody();
    
    return text;
};

//var htmlText = `<p><b>HALLO</b></p>`;
let htmlText = GetText();

// Create PDF document
let pdf = require('html-pdf');
//var date = new Date().toLocaleDateString('de-DE');
let options = {
    /*title: "12345", 
    author: "0815MR",*/
    format: "Letter",
    border: {
         'top': "0 cm",            // default is 0, units: mm, cm, in, px
         'right': "1.27 cm",
         'bottom': "0 cm",
         'left': "1.27 cm"
    },
    //zoomFactor: "5",
    //type: "png",
    //quality: "75",
    paginationOffset: 1,       // Override the initial pagination number
    header: {
        'height': "35 mm",
        /*"contents": {
            default: GetHeader(),
        }*/
        //'<div style="text-align: center;">Author: Marc Bachmann</div>'
    },
    footer: {
        'height': "14mm",
        /*//'color': "DeepSkyBlue",//"rgba(255, 255, 255, 0)",
        'contents': {
        //default: `<div style="text-align: left;">© MEBEDO Consulting GmbH</div><div style="text-align: center;"><span>Seite {{page}}</span> von <span>{{pages}}</span></div><div style="text-align: right;">{{Date}}</div>`,
            //default: `<table><tr><th style="text-align: left;">© MEBEDO Consulting GmbH</th><th style="text-align: center;"><span>Seite {{page}}</span> von <span>{{pages}}</span></th><th style="text-align: right;">{{Date}}</th></tr></table>`,
            //default: `<div style="text-align: center;">© MEBEDO Consulting GmbH - <span>Seite {{page}}</span> von <span>{{pages}} - </span> ${date}</div>`,
            default: `<table><tr>`//`<table style="background-color: DeepSkyBlue;"><tr>`
                + `<td style="text-align: left;width: 33%;">© MEBEDO Consulting GmbH</td>`
                + `<td style="text-align: center;width: 33%;">Seite {{page}} von {{pages}}</td>`
                + `<td style="text-align: right;width: 33%;">${date}</td>`
                + `</tr></table>`,
        }*/
    },
 };

 const pdfCreate = ( opinion, opinionDetails ) => {
    pdf.create( htmlText , options ).toFile('test.pdf', function( err , res ) {
        if (err)
            return console.log( err );
    });
 }
 //pdf.create( htmlText , options ).toStream( function( err , res ) {
 /*pdf.create( htmlText , options ).toFile('test.pdf', function( err , res ) {
     if (err)
         return console.log( err );
     //console.log( res ); // { filename: 'C:\Users\marc.tomaschoff\meteor\edelrahmmandel\.meteor\local\build\programs\server\test.pdf' }
 });*/

 //module.exports = pdfCreate;
 module.exports = { pdfCreate };
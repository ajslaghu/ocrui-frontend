var testName = "OC-70: Tekstiä editoitaessa muutetut sanat renderöidään omalla tyylillään"

var settings = require('./settings');
var mytests = require('./mytests');
var utils = require('utils');
var casper = require('casper').create(mytests.debugOptions);
var url = settings.url+'#'+settings.testItem+'/11';

casper.start(url,mytests.initCasper(testName));

casper.waitForText( "Pienet" ); // ensure editor is there

casper.then(function() {
    var data = mytests.getEditorData(casper);

    var cursor = data.cursor;
    var content = data.content;
    var slice = content.substring(0,8);

    casper.test.assert(
        (cursor.ch == 0) && (cursor.line == 0),
        "Cursor is at the beginning"
    );

    casper.test.assertEqual(slice,"Sisällys");
    casper.sendKeys(".CodeMirror","koe");

    casper.log(slice);
});

casper.waitForText( "koeSisällys" ); // wait for text to be rendered

casper.then(function() {
    var info = casper.getElementInfo('.cm-changed');
    var text = info.text.replace(/[\s]/,'');
    casper.test.assertEqual(text,"koeSisällys");
});

casper.run(function() {
    casper.test.done();
    casper.exit();
});



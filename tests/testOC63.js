var testName = "OC-63: HTML-sivun komonentit ovat paikallaan"

var settings = require('./settings');
var mytests = require('./mytests');
var casper = require('casper').create();

var url = settings.url+'#'+settings.testItem+'/11';
casper.start(url,mytests.initCasper(testName));

casper.then(function() {

    var title = this.getElementInfo('title').text;

    this.test.assertEqual(title,'OCR editor',"Correct page title");

    this.test.assertExists('#toolbar');
    this.test.assertExists('#dialog');
    this.test.assertExists('#facsimile-container');
    this.test.assertExists('#facsimile-canvas');
    this.test.assertExists('#boxes')
    this.test.assertExists('#bottom-geometry')
    this.test.assertExists('#vkeyboard')
    this.test.assertExists('#spinner')
    this.test.assertExists('#greyout')
});

casper.run(function() {
    this.test.done();
    this.exit();
});


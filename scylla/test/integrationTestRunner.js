var Mocha = require('mocha');
var path = require('path');
var fs = require('fs');
var glob = require("glob");

var mocha = new Mocha({
    reporter: 'spec',
    ui: 'bdd',
    timeout: 500
});

var testDir = './test/api/**/*Test.js';
glob(testDir, function (err, files) {
    if (err) {
        console.log(err);
        return;
    }
    files.forEach(function (file) {
        console.log('adding test file: %s', file);
        mocha.addFile(file);
    });

    var runner = mocha.run(function () {
        console.log('finished');
        process.exit();
    });

});
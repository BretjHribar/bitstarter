#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = fs.writeFile("tempURLfile.html",rest.get("http://aqueous-escarpment-3217.herokuapp.com/"));
var testURLfile = fs.writeFile("tempURLfile.html",rest.get("http://aqueous-escarpment-3217.herokuapp.com/"));

//var printToConsoleTest = function(console.log(testURLfile);

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(inURL,checksfile) {
    console.log("begin assertURL fn on " + inURL);
    rest.get(inURL).on('complete', function(result) {
        if (result instanceof Error) {
            console.log("Error retrieving URL");
            console.log(Error);
            process.exit(1);
        } else {
/*            $ = cheerio.load(result);
            var checks = loadChecks(checksfile).sort();
            var out = {};
            for (var ii in checks) {
                var presents = $(checks[ii]).length > 0;
                out[checks[ii]] = present;
            }
            var outJson = JSON.stringify(out,null,4);
            console.log(outJson);
            console.log("did we fetch a URL?"); */
	    var r=new Buffer( result);
//console.log(result);
fs.writeFile('urltext.html',r.toString('utf-8'));
	    var checkJson = checkHtmlFile(r.toString('utf-8'),CHECKSFILE_DEFAULT);
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);
        }
      });
    console.log("exiting assertURL fn");
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url_file>', 'URL address to html file', clone(assertURLExists), URL_DEFAULT)
        .parse(process.argv);
    if (program.url) {
	console.log('in url');
	//assertURLExists(myArgs[3],program.checks);
//var checkJson = checkFile(program.file, program.checks);

    }
    else {
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}


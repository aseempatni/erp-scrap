
var https = require("https");
var request = require("request");
var cheerio = require("cheerio");
var parseString = require('xml2js').parseString;

// Config
var no = 01;
var max = 45;
var maxc=max-no;
var count=0;

var students = [];
var timer = setInterval(function() {
  var roll = '12CS300'+zeroFill(no,2);
  var url = 'https://erp.iitkgp.ernet.in/StudentPerformance/view_performance.jsp?rollno='+roll;
  dothis(roll, url);
  no= no+1;;
  if (no==max) { //
    clearInterval(timer);
  }
}, 200);

function dothis(roll, url){
  request(url, function(error, response, body) {
    var stud = {};=
    var fs = require('fs');
    fs.writeFile('./cs/'+roll,body, function(err) {
      if(err) {
        console.log(err);
      } else {
//        console.log("The file was saved!");
      }
    }); 
    var $ = cheerio.load(body);
    stud.cg = $("table").slice(3,4).first().find("td").slice(11,12).html();
    $("fieldset td").slice(4,5).each(function() {
      var elem = $(this);
      var text = elem.text();
      stud.name = text;
    });
    $("fieldset td").slice(2,3).each(function() {
      var elem = $(this);
      var text = elem.text();
      stud.roll = text;
    });
    console.log(stud.roll + "\t" + stud.name + "\t" +stud.cg);
    students.push(stud);
    count++;
    if(count==maxc) {
      setTimeout (function() {
        students.sort(compare);
        print();
      }, 2000);
    }
  });  
}

function compare (a,b) {
  if (a.cg < b.cg)
   return 1;
 if (a.cg > b.cg)
  return -1;
return 0;
}

function print () {
  for (studs in students) {
    stud = students[studs];
    var val = parseInt(studs) + 1;
    console.log(val + "\t" + stud.roll + "\t" + stud.cg + "\t" + stud.name);
  }
}

function zeroFill( number, width ) {
  width -= number.toString().length;
  if ( width > 0 ) {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}
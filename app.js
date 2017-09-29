var fs 		 = require('fs');
var _ 		 = require('lodash');
var pdfUtil  = require('pdf-to-text');
var pdf_path = "./Reports/PDF/2012/Crime Report 1-2-12 through 1-8-12.pdf";

// option to extract text from page 0 to 1
var option = { from: 0, to: 10 };

var pdfData = {
	pdfDate: "",
	arrests: [],
};

var arrest = {
	name: "",
	charges: [],
	date: "",
	location: "",
};

var arrestFields = [
	"Name:",
	"Charge:",
	"Date:",
	"Location:",
];

pdfUtil.pdfToText(pdf_path, option, function(err, data) {
	if (err) throw(err);
	// console.log(data); // print text
	fs.writeFile("test.txt", data, function(err) {
		if (err) throw err;
		console.log('saved!');
	})
});

fs.readFile("test.txt", function(err, data) {
	if (err) throw err;
	var currIndex;
	data = data.toString().split(" ").filter(string => string != '');
	pdfData.pdfDate = data[4] + " " + data[5] + " - " + data[7] + " " + data[8] + " ";
	var currentFolderDate = "2012";
	if (_.includes(data[9], currentFolderDate)) {
		pdfData.pdfDate += data[9].replace(/\n/g, " ").split(" ")[0];
	}
	console.log("pdfDate : ", pdfData.pdfDate);
	for (var i = data.length - 1; i >= 0; i--) {
		if (_.includes(data[i], "\n")) {
			// console.log(data[i]);
			data[i] = data[i].replace(/\n/g, " ").trim();
		}
		// if (data[i].endsWith(":")) {
		// 	console.log("found: ", data[i]);
		// 	if (currIndex === "") {
		// 		console.log("currIndex is empty")
		// 		currIndex = data.indexOf(data[i]);
		// 	}
		// }
		if (_.includes(data[i], "Name:")) {
			var name = data[i+1] + data[i+2];
			console.log("name : ", name)
			var newName;
			if (name.indexOf(",") > -1) {
				if (!(name.endsWith(","))) {
					newName = name.replace(",", ", ").replace("Charge:", "");
				} else {
					newName = name;
				}
			}
			var middle = data[i+3].split(" ");
			console.log("middle : ", middle)
			var middleInitial = middle.filter(string => _.includes(string, "."))[0];
			console.log("middleInitial : ", middleInitial)
			if (middleInitial && middleInitial !== "") {

				newName += (" " + middleInitial);
			}
			pdfData.arrests.push({
				name: newName,
			});
		}
		// if (!(data[i].endsWith(":"))) {
		// 	pdfData.arrests.push(data[i]);
		// }
		// while (currIndex !== "") {
		// 	pdfData.arrests.push(data[i]);
		// }
	}
	console.log("arrests: ", pdfData.arrests)
	// console.log("data : ", data);
});

// pdfUtil.info(pdf_path, function(err, info) {
//     if (err) throw(err);
//     console.log(info);
// });
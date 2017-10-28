var fs 		 = require('fs'),
	_ 		 = require('lodash'),
	pdfUtil  = require('pdf-to-text'),
	pdf_path = "./Reports/PDF/2012/Crime Report 1-2-12 through 1-8-12.pdf";

// option to extract text from page 0 to 1
var option = { from: 0, to: 10 };

var pdfData = {
	pdfDate: "",
	arrests: [],
};

var baseArrest = {
	firstName: "",
	middleName: "",
	lastName: "",
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

// Strings to check for
var filteredStrings = ['DUI'].concat(arrestFields);

pdfUtil.pdfToText(pdf_path, option, function(err, data) {
	if (err) throw(err);
	// console.log(data); // print text
	fs.writeFile("test.txt", data, function(err) {
		if (err) throw err;
		console.log('saved!');
	})
});

function fixData(string) {
	if (_.includes(string, ",")) {
		return string.replace(",", "");
	} else {
		return _.difference(string.split(" "), filteredStrings)[0];
	}
}

fs.readFile("test.txt", function(err, data) {
	if (err) throw err;

	// Janitor Data
	data = data.toString().split(" ")
			.filter(string => string != "")
			.map(string =>
				_.includes(string, "\n")
					? string.replace(/\n/g, " ").trim()
					: string
			);

	// for (var i = 0; i < 20; i++) {
	// 	console.log(`data[${i}] : `, data[i]);
	// }

	// Set PDF Date
	var month    = data[4],
		startDay = data[5],
		endDay   = data[8],
		year     = data[9].replace(/\n/g, " ").split(" ")[0]

	pdfData.pdfDate = `${month} ${startDay} - ${month} ${endDay} ${year}`;

	// console.log("pdfDate : ", pdfData.pdfDate);
	var personFound   = false;
	var chargeFound   = false;
	var dateFound     = false;
	var locationfound = false;
	var arrested 	  = false;
	for (var i = 0; i < data.length; i++) {
		var arrest = _.cloneDeep(baseArrest);

		// Find name
		if (_.includes(data[i], "Name:")) {
			arrest.firstName  = fixData(data[i+2]) || '',
			arrest.middleName = fixData(data[i+3]) || '',
			arrest.lastName   = fixData(data[i+1]) || '';

			console.log("-----------");
			console.log("First Name : ", arrest.firstName);
			console.log("Middle Name : ", arrest.middleName);
			console.log("Last Name : ", arrest.lastName);

			for (var j = 0; j < data.length; j++) {

				// Find charge
				if (_.includes(data[j], "Charge:")) {
					var charge = "";
					var x = j+1;

					while (!_.includes(data[x], "Charge")) {
						charge += `${data[x]} `;
						x++;
					}

					arrest.charges.push(charge.trim());

					for (var k = 0; k < data.length; k++) {

						// Find date
						if (_.includes(data[k], "Date:")) {
							arrest.date = fixData(data[k+1]) || '';

							for (var n = 0; n < data.length; n++) {

								// Find location
								if (_.includes(data[n], "Location:")) {
									var location = "";
									var m = n+1;

									while (!_.includes(data[m], "Location:")) {
										location += `${data[m]} `;
										m++;
									}

									arrest.location = location.trim() || '';
								}
							}
						}
					}
				}
			}
		}
		if (!_.isEqual(arrest, baseArrest) && !_.some(pdfData.arrests, arrest)) {
			pdfData.arrests = [...pdfData.arrests, arrest];
			console.log("arrests : ", pdfData.arrests);
		}
	}

	// for (var i = data.length - 1; i >= 0; i--) {
		// if (data[i].endsWith(":")) {
		// 	console.log("found: ", data[i]);
		// 	if (currIndex === "") {
		// 		console.log("currIndex is empty")
		// 		currIndex = data.indexOf(data[i]);
		// 	}
		// }
		// console.log("data : ", data[i]);
		// if (_.includes(data[i], "Name:")) {
		// 	console.log("name found!");
		// 	console.log(data[i]);
		// 	console.log(data[i+1]);
		// 	console.log(data[i+2]);
		// 	console.log("-----------");
		// }
		// if (_.includes(data[i], "Name:")) {
		// 	var name = data[i+1] + data[i+2];
		// 	// console.log("name : ", name);
		// 	var newName;
		// 	if (name.indexOf(",") > -1) {
		// 		// console.log("name : ", name);
		// 		if (!(name.endsWith(","))) {
		// 			newName = name.replace(",", ", ").replace("Charge:", "");
		// 		} else {
		// 			newName = name;
		// 		}
		// 	}
		// 	var middle = data[i+3].split(" ");
		// 	// console.log("middle : ", middle);
		//
		// 	// var middleInitial = middle.filter(string => _.includes(string, "."))[0];
		// 	var middleInitial = _.difference(middle, filteredStrings)[0];
		// 	// console.log("middleInitial : ", middleInitial)
		// 	if (middleInitial && middleInitial !== "") {
		// 		newName += (" " + middleInitial);
		// 	}
		// 	// console.log("newName : ", newName);
		// 	var splitName = newName.split(" ");
		// 	// console.log("splitName : ", splitName);
		// 	arrest.firstName = splitName[1];
		// 	arrest.middleName = splitName[2] || '';
		// 	arrest.lastName = splitName[0].replace(",", "");
		// }
		// if (_.includes(data[i], "Charge:")) {
		// 	var charge;
		// 	var x;
			// console.log("found : ", data[i]);
			// console.log("next 1 : ", data[i+1]);
			// console.log("next 2 : ", data[i+2]);
			// console.log("next 3 : ", data[i+3]);
			// console.log("next 4 : ", data[i+4]);
			// console.log("next 5 : ", data[i+5]);

			// charge = data[i];
			// var found = false;
			// var x = i + 1;
			// console.log("x : ", x);
			// var y = x;
			// console.log("y : ", y);
			// do {
			// 	charge += ` ${data[x]}`;
			// 	x++;
			// } while (!_.includes(data[x], "Charge"));

			// while (!_.includes(data[y], "Charge")) {
			// 	charge += ` ${data[y]}`;
			// 	console.log("charge : ", charge);
			// 	y++;
			// 	console.log("inc y : ", y);
			// }

			// while (!found) {
			// 	x += 1;
			// 	if (!_.includes(data[x], "Charge")) {
			// 		charge += ` ${data[x]}`;
			// 	} else {
			// 		console.log("found", data[x]);
			// 		found = true;
			// 	}
			// }
		// }
		// if (_.includes(data[i], "Date:")) {
		// 	var date = _.difference(data[i+1].split(" "), filteredStrings)[0];
		// 	arrest.date = date;
		// }
		// if (!_.includes(data[i], ":")) {
		// 	charge += ` ${data[i]}`;
		// }
		// console.log("charge : ", charge);
		// if (!(data[i].endsWith(":"))) {
		// 	pdfData.arrests.push(data[i]);
		// }
		// while (currIndex !== "") {
		// 	pdfData.arrests.push(data[i]);
		// }
		// if (!_.some(pdfData.arrests, arrest)) {
		// 	console.log("arrest : ", arrest);
		// 	pdfData.arrests.push(arrest);
		// }
	// }
	// console.log("arrests: ", pdfData.arrests)
	// console.log("data : ", data);
});

// pdfUtil.info(pdf_path, function(err, info) {
//     if (err) throw(err);
//     console.log(info);
// });

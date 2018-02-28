var canonnEd3d_gr = {

	//Define Categories
	systemsData: {
		"categories": {
			"Points of Interest - POI": {
				"100": {
					"name": "System",
					"color": "F7F7F7"
				},
				"101": {
					"name": "MegaShips",
					"color": "f4f142"
				}
			},
			"Guardian Ruins - (GR)": {
				"400": {
					"name": "Alpha",
					"color": "f44141"
				},
				"401": {
					"name": "Beta",
					"color": "f4b241"
				},
				"402": {
					"name": "Gamma",
					"color": "f441d0"
				},
				"403": {
					"name": "Structure",
					"color": "3380ff"
				}
			},
			"Error Sites": {
				"600": {
					"name": "Invalid Data Information",
					"color": "150187"
				}
			}
		},
		"systems": [{
				"name": "Sol",
				"coords": {
					"x": "0",
					"y": "0",
					"z": "0"
				},
				"cat": [
					"100"
				]
			}, {
				"name": "Merope",
				"coords": {
					"x": "-78.59375",
					"y": "-149.625",
					"z": "-340.53125"
				},
				"cat": [
					"100"
				]
			}, {
				"name": "HIP 22460",
				"coords": {
					"x": "-41.3125",
					"y": "-58.96875",
					"z": "-354.78125"
				},
				"cat": [
					"100"
				]
			}, {
				"name": "Col 173 Sector LJ-F C12-0 (The Cete)",
				"coords": {
					"x": "1202.125",
					"y": "-213.40625",
					"z": "-165.5625"
				},
				"cat": [
					"101"
				]
			},
		]
	},

	// Lets get data from CSV Files

	formatGR: function (data) {
		//Here you format GR JSON to ED3D acceptable object

		// this is assuming data is an array []
		for (var i = 0; i < data.length; i++) {
			if (data[i].system && data[i].system.replace(" ", "").length > 1) {
				var grSite = {};
				grSite["name"] = data[i].system;

				//Check Site Type and match categories
				if (data[i].type.toString() == "Alpha") {
					grSite["cat"] = [400];
				} else if (data[i].type.toString() == "Beta") {
					grSite["cat"] = [401];
				} else if (data[i].type.toString() == "Gamma") {
					grSite["cat"] = [402];
				} else if (data[i].type.toString() == "Structure") {
					grSite["cat"] = [403];
				} else {
					grSite["cat"] = [600];
				}
				grSite["coords"] = {
					"x": parseFloat(data[i].galacticX),
					"y": parseFloat(data[i].galacticY),
					"z": parseFloat(data[i].galacticZ)
				};

				// We can then push the site to the object that stores all systems
				canonnEd3d_gr.systemsData.systems.push(grSite);
			}

		}

	},

	parseData: function (url, callBack, resolvePromise) {
		Papa.parse(url, {
			download: true,
			header: true,
			complete: function (results) {

				callBack(results.data);

				// after we called the callback
				// (which is synchronous, so we know it's safe here)
				// we can resolve the promise

				resolvePromise();
			}
		});
	},

	init: function () {

		var p1 = new Promise(function (resolve, reject) {
				canonnEd3d_gr.parseData("https://docs.google.com/spreadsheets/d/e/2PACX-1vTSvkdtHr0SbM4dYOCsDalp1hRilWt2I5Hz1l2OIgbfR8Hs-lOCat_ZUyhyBnuv9R9rXz9vnhaYif2-/pub?gid=0&single=true&output=csv", canonnEd3d_gr.formatGR, resolve);
			});

		Promise.all([p1]).then(function () {
			Ed3d.init({
				container: 'edmap',
				json: canonnEd3d_gr.systemsData,
				withHudPanel: true,
				hudMultipleSelect: true,
				effectScaleSystem: [50, 10000],
				startAnim: false,
				showGalaxyInfos: true,
				cameraPos: [25, 14100, -12900],
				systemColor: '#FF9D00'
			});
		});
	}
};

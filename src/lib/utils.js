import xml2js from 'xml2js';

export const getData = (url) => {
	console.log(url);

	fetch(url).then(response => {
		response.text().then(xmlText => {
			// console.log(xmlText);
			return xmlToJson(xmlText);
		});
	})

}

export const xmlToJson = (xmlString) => {
	// console.log(xmlString);
	xml2js.parseString(xmlString, function (err, result) {
		console.log(result.site.$.name);
		return result.site;
	});
}

// expects this -> "2019-01-11T21:45:00-00:00"
export const formatDate = (rawDate) => {
  var dateTime = rawDate.split('T');
  var date = dateTime[0].split('-');
  var time = dateTime[1].split(':');
  return time[0] + ':' + time[1] + ' - ' + date[1] + '/' + date[2] + '/' + date[0];
}
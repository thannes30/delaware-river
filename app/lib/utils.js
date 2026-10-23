import xml2js from 'xml2js';

export const xmlToJson = (xmlString) => {
  let parsed;
  xml2js.parseString(xmlString, (err, result) => {
    if (err) throw err;
    parsed = result;
  });
  return parsed;
};

// expects this -> "2019-01-11T21:45:00-00:00"
export const formatDate = (rawDate) => {
  var dateTime = rawDate.split('T');
  var date = dateTime[0].split('-');
  var time = dateTime[1].split(':');
  var formattedTime = time[0] + ':' + time[1] + ' - ' + date[1] + '/' + date[2] + '/' + date[0]
  return formattedTime;
}

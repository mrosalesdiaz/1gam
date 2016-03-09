define(
    ["dojo/text!web-data.json","dojo/json"],
  function(webData,json) {
    webData=json.parse(webData);
    console.log("init")
    console.log()
  } );
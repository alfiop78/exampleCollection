(() => {
  var app = {
  	btnAddField : document.getElementById('btn-add-field'),
  	btnCreateJson : document.getElementById('btn-create-json')

  };

  app.btnCreateJson.onclick = async (e) => {
  	console.log('creazione file json : ');
  	const file = document.getElementById('input-filename').value;
	// TODO: recupero tutte le input da inserire nel file
	let filterName = document.querySelector('input[data-filter-name]').value;
	let filterId = document.querySelector('input[data-filter-id]').value;
	let filterType = document.querySelector('input[data-filter-type]').value;
	
	const params = "filename="+file+"&filterName="+filterName+"&filterId="+filterId+"&filterType="+filterType;
	const url = "test.php";
    // console.log(params);
    const init = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}, method: 'POST', body: params};
    const req = new Request(url, init);
    // console.log('load data for template');
    await fetch(req)
    	.then( (response) => {
	        if (!response.ok) {throw Error(response.statusText);}
	        return response;
	    })
    	.then( (response) => response.json())
		.then( (data) => {
			// console.log(data);
			if (data) {
				console.log(data);
			} else {
				// TODO: no data per questa metrica
			}
		})
		.catch( (err) => console.error(err));
  };

})();

/*esempio filtri utilizzati su menu pricing
json : [
                {
                    "filters" : {
                        "year" : {"id" : "year", "type" : "select"},
                        "month" : {"id" : "month", "type" : "select"},
                        "date" : {"id" : "date", "type" : "date"},
                        "site" : {"id" : "site", "type" : "select"},
                        "brand" : {"id" : "brand", "type" : "select"},
                        "vehicle-brand" : {"id" : "vehicle_brand", "type" : "select"},
                        "accettatore" : {"id" : "accettatore", "type" : "select"}
                    }
                }
            ]*/
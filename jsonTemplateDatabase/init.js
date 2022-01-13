(() => {
	var app = {
		// templates
		templateFilters : document.getElementById('filter-template-inputs'),
		// buttons
		btnAddField : document.getElementById('btn-add-field'),
		btnCreateJson : document.getElementById('btn-create-json')

	};

	app.btnAddField.onclick = (e) => {
		console.log('aggiungi filtro');
		const parent = document.getElementById('input-filters');
		const tmpl = app.templateFilters.content.cloneNode(true);
		// parent.childElementCount conta quanti elmeenti sono stati aggiunti ed assegna un numero all'attr data-id
		tmpl.querySelector('div').setAttribute('data-id', parent.childElementCount);
		parent.appendChild(tmpl);
	};

	app.btnCreateJson.onclick = async (e) => {
		console.log('Salvataggio json nel DB');
		const name = document.getElementById('input-filename').value;
		// TODO: recupero tutte le input da inserire nel file
		// quanti filtri ci sono ?
		let paramsObj = {};
		document.querySelectorAll('#input-filters > div[data-id]').forEach( (filter) => {
			console.log(filter); // div[data-id]
			// all'interno di filter ho le input da cui recuperare i dati
			const name = filter.querySelector('input[data-filter-name]').value;
			const id = filter.querySelector('input[data-filter-id]').value;
			const optionSelected = filter.querySelector('select[data-filter-type]').options;
            // console.log(optionSelected[optionSelected.selectedIndex].getAttribute('id'));
            const type = optionSelected[optionSelected.selectedIndex].getAttribute('id');
            // console.log(optionSelected.options[optionSelected.selectedIndex].getAttribute('id')); altro modo per recuperare l'id dell'elemento selezionato
            paramsObj[name] = {id, type};

			const index = +filter.getAttribute('data-id');
		});

		console.log('paramsObj : ', JSON.stringify(paramsObj));
		// return;
		// let filterName = document.querySelector('input[data-filter-name]').value;
		// let filterId = document.querySelector('input[data-filter-id]').value;
		// let filterType = document.querySelector('input[data-filter-type]').value;

		// const params = "filename="+file+"&filterName="+filterName+"&filterId="+filterId+"&filterType="+filterType;
        console.log(paramsObj);
        console.log(JSON.stringify(paramsObj));
		const params = "params="+JSON.stringify(paramsObj)+"&name="+name;
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
			console.log(data);
			if (data) {
				// console.log(data);
			} else {
				// TODO: 
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

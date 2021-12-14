(() => {
	var app = {

	};

})();

$(function() {
	var $table = $('#table');
	console.log('$table : ', $table);
	// debugger;
	var randomId = 100 + ~~(Math.random() * 100);
	$table.bootstrapTable('insertRow', {
		index: 0,
			row: {
				id: randomId,
				item: 'Item ' + randomId,
				price: '$' + randomId
			}
	});
});
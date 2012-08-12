var makeTableSortable = function(){
	setColumnIndex(this);
	$(this).on('click', 'th', sortTable);
};

var setColumnIndex = function(table){
	$(table).find('th').attr('column', function(i){return i});
};

var sortTable = function(event){
	var th = $(event.target)
	var table = th.parents('table');
	var columnIndex = parseInt(th.attr('column'));
	toggleSortAscendOrDescend(th);
	removeOtherHeadsAscendAndDescendIcon(th);
	sortTableByColumn(table, columnIndex, !th.hasClass('descend'));
};

var toggleSortAscendOrDescend = function(th){
	if(th.hasClass('ascend')){
		th.removeClass('ascend').addClass('descend');
	}else{
		th.removeClass('descend').addClass('ascend');
	}
};

var removeOtherHeadsAscendAndDescendIcon = function(th){
	th.prevAll().removeClass('ascend').removeClass('descend');
	th.nextAll().removeClass('ascend').removeClass('descend');
}

var sortTableByColumn = function(table, columnIndex, isAscend){
	var rows = table.find('tbody tr').detach();
	sortRows(rows, columnIndex, isAscend);
	rows.each(setAlternateClass);
	rows.appendTo(table);
};

var sortRows = function(rows, columnIndex, isAscend){
	rows.sort(function(rowA, rowB){
		var a = $($(rowA).find('td')[columnIndex]).text();
		var b = $($(rowB).find('td')[columnIndex]).text();
		if (a == b) 
			return 0;
		if (isAscend && a > b) 
			return 1;
		if (isAscend && a < b) 
			return -1;
		if (!isAscend && a > b) 
			return -1;
		if (!isAscend && a < b) 
			return 1;
	});
	return rows;
};

var setAlternateClass = function(index, row){
	index % 2 == 0 ? $(row).removeClass('alternate') : $(row).addClass('alternate');
};

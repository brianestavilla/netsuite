function populateLineItem(type, form){
	user = nlapiGetUser();
	principal = nlapiLookupField('employee', user, 'class');
	location = nlapiLookupField('employee', user, 'location');
	
	//Item ICO
	var filter = new Array(
				new nlobjSearchFilter('custrecord387', 'CUSTRECORD386', 'is', location, null),
				new nlobjSearchFilter('class', null, 'is', principal, null)
				);
	var columns = new Array(
				new nlobjSearchColumn('custrecord388', 'CUSTRECORD386'),
				new nlobjSearchColumn('internalid')
				);
	intransit = nlapiSearchRecord('item', 'customsearch185', filter, columns);
	
	//IN TRANSIT
	filter = new Array(
				new nlobjSearchFilter('class', null, 'anyof', principal, null),
				new nlobjSearchFilter('location', null, 'anyof', location, null)
				);
	columns = new Array(
				new nlobjSearchColumn('item', null, 'group'),
				new nlobjSearchColumn('custitem3', 'item', 'sum'),
				new nlobjSearchColumn('quantity', null, 'sum'),
				new nlobjSearchColumn('quantityonhand', 'item', 'sum'),
				new nlobjSearchColumn('quantityshiprecv', null, 'sum')
				);
	
	var sublist = form.getSubList('recmachcustrecord86');
	
	var supplier = nlapiSearchRecord('vendor', null, new nlobjSearchFilter('custentity23', null, 'anyof', principal), new nlobjSearchColumn('internalid'));
	
	if(supplier != null)form.getField('custrecord92').setDefaultValue(supplier[0].getValue('internalid'));
	form.getField('custrecord88').setDefaultValue(principal);
	form.getField('custrecord87').setDefaultValue(location);
	
	if(intransit != null)
	for(var i = 0; i < intransit.length; i++){	
		
		var item = (intransit[i].getValue('internalid') == null) ? '' : intransit[i].getValue('internalid');
		filter[2] = new nlobjSearchFilter('item', null, 'is', item, 'group');
		
		suggested = nlapiSearchRecord('transaction', 'customsearch75', filter, columns);
		
		if(suggested != null){
			var onhand = (suggested[0].getValue('quantityonhand', 'item', 'sum') == null) ? 0 : suggested[0].getValue('quantityonhand', 'item', 'sum');
			var quantity = (suggested[0].getValue('quantity', null, 'sum') == null) ? 0 : parseFloat(suggested[0].getValue('quantity', null, 'sum'));
			var quantityshiprecv = (suggested[0].getValue('quantityshiprecv', null, 'sum') == null) ? 0: parseFloat(suggested[0].getValue('quantityshiprecv', null, 'sum'));
		}else{
			var onhand = 0;
			var quantity = 0;
			var quantityshiprecv = 0;
		}
		if(intransit != null)
			ico = (intransit[i].getValue('custrecord388', 'CUSTRECORD386') == null) ? 0 : intransit[i].getValue('custrecord388', 'CUSTRECORD386');
		else ico = 0;
		
		var sugg = ((ico - onhand - (quantity - quantityshiprecv)).toFixed(0) > 0) ? ico - onhand - (quantity - quantityshiprecv) : 0;
		//if(ico > 0){
			sublist.setLineItemValue('custrecord79', i + 1, item);
			sublist.setLineItemValue('custrecord80', i + 1, ico);
			sublist.setLineItemValue('custrecord81', i + 1, parseFloat(onhand).toFixed(0));
			sublist.setLineItemValue('custrecord83', i + 1, (quantity - quantityshiprecv).toFixed(0));
			sublist.setLineItemValue('custrecord82', i + 1, sugg.toFixed(0));
			sublist.setLineItemValue('custrecord84', i + 1, sugg.toFixed(0));
			sublist.setLineItemValue('custrecord85', i + 1, (0).toFixed(0));
		
	}
}

function getParam(name) {
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var tmpURL = window.location.href;
  var results = regex.exec( tmpURL );
  if( results == null )
    return "";
  else
    return results[1];
}
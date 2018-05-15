function formTest(request, response){
	if(request.getMethod() == 'GET')
	{
	var form = nlapiCreateForm('Redem Form');
	var field = form.addField('mytextfield','textarea', 'My Text Area');
	field.setLayoutType('normal','startcol');
	form.addField('mydatefield','date', 'Date');
	
	var select = form.addField('selectfield','select', 'Select');
	select.addSelectOption('','');
	select.addSelectOption('r','Redem');
	select.addSelectOption('i','Ian');
	select.addSelectOption('n','Noeh');
	select.addSelectOption('a','Albert');
		
	var sublist = form.addSubList('mysublist','inlineeditor','Redem Editor Sublist');
	sublist.addField('sub1','date', 'Date');
	sublist.addField('sub2','text', 'Sample Text');
	sublist.addField('sub3','currency', 'Currency');
	
	form.addSubmitButton('Submit');
	response.writePage(form);
	}else{
	
	var textval = request.getParameter('mytextfield'),
	date = request.getParameter('mydatefield'),
	select = request.getParameter('selectfield');
	
	form = nlapiCreateForm('Redem Posted Form');
	var textfield = form.addField('mytextfield','text', 'My Text').setLabel(textval);
	textfield.setDisplayType('inline');
	datefield = form.addField('datefield','date', 'Date').setLabel(date);
	datefield.setDisplayType('inline');
	selected = form.addField('selected','select', 'Selected').setLabel(select);
	selected.setDisplayType('inline');
	
	response.writePage(form);
	}
	
}
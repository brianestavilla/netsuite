function getDoc(request, response)
{
    if(request.getMethod() == 'GET')
	{
	var form = nlapiCreateForm('Inventory Count Cut-Off Documents');
	
	//Fields
	var group = form.addFieldGroup( 'myfieldgroup', 'Information');
	var selectprincipal = form.addField('custpage_selectprincipal','select', 'Principal', 'classification','myfieldgroup');	
	var selectlocation = form.addField('custpage_selectlocation','select', 'Location','location','myfieldgroup');
	var dateofCount = form.addField('custpage_dateofcount','date', 'Date of Count','myfieldgroup');
	var monthEndCutOff = form.addField('custpage_monthendcutoff','date', 'Month end cut-off','myfieldgroup');
	group.setShowBorder(true);
	
	//Inventory Count Cut-off Doc List
	form.addField("enterempslink", "url", "").setDisplayType( "inline" ).setLinkText( "Inventory Count Cut-off Doc List").setDefaultValue('/app/common/custom/custrecordentrylist.nl?rectype=379&searchtype=Custom&searchid=825&refresh=&whence=');
	
	form.addSubmitButton('Submit');
	response.writePage(form);
	}else{
		var principal = request.getParameter('custpage_selectprincipal');
		var location = request.getParameter('custpage_selectlocation');
		var dateofcount = request.getParameter('custpage_dateofcount');
		var monthendcutoff = request.getParameter('custpage_monthendcutoff');
			
		var cont = nlapiGetContext(); // intialize context
		cont.setSessionObject('principal',principal); // create session object to getval
		cont.setSessionObject('location',location);
		cont.setSessionObject('dateofcount',dateofcount);
		cont.setSessionObject('monthendcutoff',monthendcutoff);
		
		response.sendRedirect('RECORD','customrecord379',null,true,{principal:principal,location:location,dateofcount:dateofcount,monthendcutoff:monthendcutoff});
		
	}
}
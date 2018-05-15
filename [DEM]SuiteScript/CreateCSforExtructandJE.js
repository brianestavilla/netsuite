/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 March 2014    Redemptor	To Create a Sales Invoice transaction.
 *											Revised the structure of code.
 *@Van Balancing
 */

function CreateCSforExtructandJE(){
		var getrecord = nlapiGetNewRecord();
		var internalid1 = getrecord.getId();
		var recordtype = getrecord.getRecordType();

		//values for cash slip
		var customer = getrecord.getFieldValue('custrecord235');
		var date = getrecord.getFieldValue('custrecord236');
		var salesman = getrecord.getFieldValue('custrecord242');
		var department = getrecord.getFieldValue('custrecord265');
		var principal = getrecord.getFieldValue('custrecord268');
		var location = getrecord.getFieldValue('custrecord269');
		var operation = getrecord.getFieldValue('custrecord804');
		var external_invoice = getrecord.getFieldValue('custrecord237');

		var linecount = getrecord.getLineItemCount('recmachcustrecord275');

		var createInvoiceRecord = nlapiCreateRecord('invoice', {recordmode: 'dynamic', entity:customer }); //create record for invoice

		createInvoiceRecord.setFieldValue('customform','129');// custom form
		createInvoiceRecord.setFieldValue('trandate',date);// set date to invoice
		createInvoiceRecord.setFieldValue('salesrep',salesman);// set salesman to invoice
		createInvoiceRecord.setFieldValue('department',department);// set department to invoice
		createInvoiceRecord.setFieldValue('class',principal);// set principal to invoice
		createInvoiceRecord.setFieldValue('location',location);// set location to invoice
		createInvoiceRecord.setFieldValue('custbody125',internalid1);// create from vb #
		createInvoiceRecord.setFieldValue('name','Van Balancing');// create from vb #
		createInvoiceRecord.setFieldValue('custbody69',operation);// operation
		createInvoiceRecord.setFieldValue('custbody178',external_invoice);// external invoice

		var salesrep_terms = getCustomerCreditInfo(principal, customer);
		createInvoiceRecord.setFieldValue('terms',salesrep_terms.terms);

  		for(var i = 1; i <= linecount; i++){

			//get items value
			var getItemcode = getrecord.getLineItemValue('recmachcustrecord275','custrecord276',i);
			var getDescription = getrecord.getLineItemValue('recmachcustrecord275','custrecord308',i);
			var getQuantity = getrecord.getLineItemValue('recmachcustrecord275','custrecord279',i);
			var unitprice = getrecord.getLineItemValue('recmachcustrecord275','custrecord280',i);
			var getAmount = getrecord.getLineItemValue('recmachcustrecord275','custrecord281',i);
			var getUnits = getrecord.getLineItemText('recmachcustrecord275','custrecord504',i);
			var taxcode = getrecord.getLineItemValue('recmachcustrecord275','custrecord603',i);
			var taxrate = getrecord.getLineItemValue('recmachcustrecord275','custrecord600',i);
			var taxamt = getrecord.getLineItemValue('recmachcustrecord275','custrecord601',i);
			var grossamt = getrecord.getLineItemValue('recmachcustrecord275','custrecord602',i);
			
			//SET item to invoice
			if(parseFloat(getQuantity) != 0.0 || parseFloat(getQuantity) != 0.00){
				createInvoiceRecord.selectNewLineItem('item');
				createInvoiceRecord.setCurrentLineItemValue('item', 'item', getItemcode);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'description',getDescription);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'quantity',getQuantity);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'rate',unitprice);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'amount',getAmount);//
				createInvoiceRecord.setCurrentLineItemText('item', 'units',getUnits);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'taxcode',taxcode);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'taxrate1',taxrate);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'tax1amt',taxamt);//
				createInvoiceRecord.setCurrentLineItemValue('item', 'grossamt',grossamt);//
				createInvoiceRecord.commitLineItem('item');
			}
		}
			var invoicepid = nlapiSubmitRecord(createInvoiceRecord,null,true);
			//nlapiSubmitField(recordtype, internalid1,'custrecord306',invoicepid);
			getrecord.setFieldValue('custrecord306', invoicepid);
}

function getCustomerCreditInfo(principal, customer) {
  if(principal != '' && customer != '') {
    	filter = new Array(
          new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
          new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
        );
      columns = new Array(
        new nlobjSearchColumn('custrecord156'),	//Terms Column
        new nlobjSearchColumn('custrecord340')	//Sales Rep Column
      );

      var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);

      if(creditLimit != null) {
        return {
          "terms" : (creditLimit!=null) ? creditLimit[0].getValue('custrecord156') : '',
          "salesrep" : creditLimit[0].getValue('custrecord340') || ''
        };
      } else { return { 'terms':'', 'salesrep':'' }; }

  } else { return { 'terms':'', 'salesrep':'' }; }

}

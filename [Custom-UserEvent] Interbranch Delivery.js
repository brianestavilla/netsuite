function beforeLoad(type, form){
	if(type == 'create'){
		// recType = nlapiGetRecordType();
		
		// newSeries = numberSeries('get', recType);
		
		// nlapiSetFieldValue('name', newSeries);
		// nlapiSetFieldValue('custrecord604', newSeries);
		
		ITOSubID = 'recmachcustrecord232';
		IDRSubID = 'recmachcustrecord463';
		
		ITOID = nlapiGetContext().getSessionObject('ITOID');
		
		ITO = nlapiLoadRecord('customrecord160', ITOID);
		
		createdFrom = ITO.getId();
		branch = ITO.getFieldValue('custrecord228');
		memo = ITO.getFieldValue('custrecord227');
		DRType = ITO.getFieldValue('custrecord350');
		iCount = ITO.getLineItemCount(ITOSubID);
		
		nlapiSetFieldValue('custrecord459', branch);
		nlapiSetFieldValue('custrecord462', memo);
		nlapiSetFieldValue('custrecord460', createdFrom);
		nlapiSetFieldValue('custrecord605', DRType);
		
		for(i = 1; i <= iCount; i++){
			TOItem = ITO.getLineItemValue(ITOSubID, 'custrecord238', i);
			
			TOQuantity = parseInt(ITO.getLineItemValue(ITOSubID, 'custrecord427', i));
			TOUnit = parseInt(ITO.getLineItemValue(ITOSubID, 'custrecord428', i));
			TOCost = parseInt(ITO.getLineItemValue(ITOSubID, 'custrecord429', i));
			
			DRQuantity = parseInt(ITO.getLineItemValue(ITOSubID, 'custrecord436', i));
			
			nlapiSelectNewLineItem(IDRSubID); // create new line item
			
			nlapiSetCurrentLineItemValue(IDRSubID, 'custrecord444', TOItem); // T.O. Item
			nlapiSetCurrentLineItemValue(IDRSubID, 'custrecord445', TOQuantity); // T.O. Quantity
			nlapiSetCurrentLineItemValue(IDRSubID, 'custrecord501', TOQuantity); // T.O. Remaining Quantity
			nlapiSetCurrentLineItemValue(IDRSubID, 'custrecord446', TOUnit); // T.O. Unit
			nlapiSetCurrentLineItemValue(IDRSubID, 'custrecord452', TOQuantity); // D.R. Quantity
			nlapiSetCurrentLineItemValue(IDRSubID, 'custrecord453', TOUnit); // D.R. Unit
			
			nlapiCommitLineItem(IDRSubID); // commit new line item
		}
	}
	
	if(type == 'view'){
		/** Receive Button - Start **/
		ctx = nlapiGetContext();
		ctx.setSessionObject('IDRID', nlapiGetRecordId());
		
		event = "window.location='" + nlapiResolveURL('record', 'customrecord216', null) + "';";
		
		form.addButton('custpageGetLines', 'Receive', event);
		/** Receive Button - End **/
	}
}

function beforeSubmit(type, form){
	if(type == 'create'){
		/** Generate Number Series - START **/
		recType = nlapiGetRecordType();
		
		newSeries = numberSeries('get', recType);
		
		nlapiSetFieldValue('name', newSeries);
		nlapiSetFieldValue('custrecord604', newSeries);
		/** Generate Number Series - END **/
	}
	
	if(type == 'create' || type == 'edit'){
		IDRSubID = 'recmachcustrecord463';
		
		iCount = nlapiGetLineItemCount(IDRSubID);
		
		for(i = 1; i <= iCount; i++){
			TORemQuantity = parseInt(nlapiGetLineItemValue(IDRSubID, 'custrecord501', i));
			
			DRQuantity = parseInt(nlapiGetLineItemValue(IDRSubID, 'custrecord452', i));
			
			TORemQuantity = TORemQuantity - DRQuantity;
			
			nlapiSetLineItemValue(IDRSubID, 'custrecord501', i, TORemQuantity); // T.O. Remaining Quantity
			
			nlapiSetLineItemValue(IDRSubID, 'custrecord452', i, TORemQuantity); // D.R. Quantity
		}
	}
}

function afterSubmit(type, form){
	if(type == 'create'){
		recType = nlapiGetRecordType();
		
		numberSeries('fix', recType);
	}
	
	if(type == 'create' || type == 'edit'){
		ITOSubID = 'recmachcustrecord232';
		IDRSubID = 'recmachcustrecord463';
		JESubID = 'line';
		
		IDR = nlapiGetNewRecord();
		IDRID = IDR.getId();
		IDRTOID = IDR.getFieldValue('custrecord460');
		
		ITO = nlapiLoadRecord('customrecord160', IDRTOID);
		
		iCount = ITO.getLineItemCount(ITOSubID);
		
		for(i = 1; i <= iCount; i++){
			TOQuantity = parseInt(IDR.getLineItemValue(IDRSubID, 'custrecord445', i));
			TORemQuantity = parseInt(IDR.getLineItemValue(IDRSubID, 'custrecord501', i));
			
			DRQuantity = TOQuantity - TORemQuantity;
			
			ITO.setLineItemValue(ITOSubID, 'custrecord436', i, DRQuantity);
		}
		
		nlapiSubmitRecord(ITO);
		
		IDRLandedCost = parseFloat(IDR.getFieldValue('custrecord529'));
		
		ITODepartment = ITO.getFieldValue('custrecord230');
		ITOPrincipal = ITO.getFieldValue('custrecord231');
		ITOLocation = ITO.getFieldValue('custrecord228');
		
		/** Journal Entry - Start **/
		if(IDRLandedCost > 0){
			JE = nlapiCreateRecord('journalentry');
			
			JE.setLineItemValue(JESubID, 'account', 1, '1165'); // Advances to Branches
			JE.setLineItemValue(JESubID, 'debit', 1, IDRLandedCost);
			JE.setLineItemValue(JESubID, 'department', 1, ITODepartment);
			JE.setLineItemValue(JESubID, 'class', 1, ITOPrincipal);
			JE.setLineItemValue(JESubID, 'location', 1, ITOLocation);
			
			JE.setLineItemValue(JESubID, 'account', 2, '884'); // Logistics Costs : Freight, Trucking & Handling
			JE.setLineItemValue(JESubID, 'credit', 2, IDRLandedCost);
			JE.setLineItemValue(JESubID, 'department', 2, ITODepartment);
			JE.setLineItemValue(JESubID, 'class', 2, ITOPrincipal);
			JE.setLineItemValue(JESubID, 'location', 2, ITOLocation);
			
			JEID = nlapiSubmitRecord(JE, false, true);
			
			nlapiSubmitField('customrecord214', IDRID, 'custrecord597', JEID);
		}
		/** Journal Entry - End **/
	}
}
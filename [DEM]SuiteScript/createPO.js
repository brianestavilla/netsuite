/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Feb 2014     Redemptor		To Create a Purchase Order transaction.
 *											Revised the structure of code.
 */

//Main Line Fields
var mainLine_fieldDepartment = 'custrecord38';
var mainLine_fieldLocation = 'custrecord76';
var mainLine_fieldDate = 'custrecord40';
var mainLine_fieldType = 'custrecord41';
var mainLine_fieldRemarks = 'custrecord42';
var mainLine_fieldTotalAmount = 'custrecord348';
var mainLine_fieldPrincipal = 'custrecord130';
var mainLine_fieldPoNumbers = 'custrecord391';
var mainLine_fieldNameOfRequester = 'custrecord773';
var mainLine_fieldCanvassedBy = 'custrecord62';
var mainLine_fieldUpdatedBy = 'custrecord190';
var mainLine_fieldJobNo = 'custrecord673';
var mainLine_fieldAssetName = 'custrecord681';
var mainLine_fieldDeliveredto = 'custrecord_deliveredto';

//Sublist Item Fields
var itemSublist = 'recmachcustrecord33';
var itemSublist_fieldItem = 'custrecord34';
var itemSublist_fieldDescription = 'custrecord46';
var itemSublist_fieldQtyOrder = 'custrecord48';
var itemSublist_fieldUnitCost = 'custrecord58';
var itemSublist_fieldAmount = 'custrecord59';
var itemSublist_fieldFinalVendor = 'custrecord380';
var itemSublist_fieldFinalTerms = 'custrecord381';
var itemSublist_fieldTaxCode = 'custrecord607';
var itemSublist_fieldPaymentType = 'custrecord_list_paymenttype';

/**
 * @returns {Void} Any or no return value
 */
function AutoCreatePO() {
	var poNumbers = [];
	var record = nlapiGetNewRecord(); //get current record
	var mainLine = getMainLine(record,'noninventoryitem');
	var mainLineService = getMainLine(record,'serviceitem');
	var lineItem = getLineItem(mainLine,'noninventoryitem');
	var lineItemServices = getLineItem(mainLine,'serviceitem');
	if(lineItemServices != ''){
		poNumbers.push(saveRecord(mainLineService,lineItemServices)); // save service
	}
	
	if(lineItem != ''){
		poNumbers.push(saveRecord(mainLine,lineItem)); // save noninventory
	}
	
	record.setFieldValue('custrecord391', poNumbers);
	
	nlapiLogExecution('ERROR',JSON.stringify(poNumbers));

}

function getMainLine(record,itemType){
	var MainLineObject = new Object();
		MainLineObject.Internalid = record.getId();
		MainLineObject.RecordType = record.getRecordType();
		MainLineObject.Department = record.getFieldValue(mainLine_fieldDepartment);
		MainLineObject.Location = record.getFieldValue(mainLine_fieldLocation);
		MainLineObject.Date = record.getFieldValue(mainLine_fieldDate);
		MainLineObject.Type = record.getFieldValue(mainLine_fieldType);
		MainLineObject.Remarks = record.getFieldValue(mainLine_fieldRemarks);
		MainLineObject.TotalAmount = record.getFieldValue(mainLine_fieldTotalAmount);
		MainLineObject.Principal = record.getFieldValue(mainLine_fieldPrincipal);
		MainLineObject.NameOfRequester = record.getFieldValue(mainLine_fieldNameOfRequester);
		MainLineObject.CanvassedBy = record.getFieldValue(mainLine_fieldCanvassedBy);
		MainLineObject.UpdatedBy = record.getFieldValue(mainLine_fieldUpdatedBy);
		MainLineObject.JobNo = record.getFieldValue(mainLine_fieldJobNo);
		MainLineObject.AssetName = record.getFieldValue(mainLine_fieldAssetName);
		MainLineObject.CustomForm = '121';
		MainLineObject.Deliveredto = record.getFieldValue(mainLine_fieldDeliveredto);
                MainLineObject.PreparedBy = record.getFieldValue('custrecord60'); //added by brian 8/20/2015
				
	
	if(itemType == 'serviceitem'){
		MainLineObject.IsService = 'T';
	}else if(itemType == 'noninventoryitem'){
		MainLineObject.IsService = 'F';
	}
	
	return MainLineObject;
}

function getLineItem(record,itemType){
	var lineItem = new Array();
	
	var filter = [new nlobjSearchFilter('internalid',null,'is',record.Internalid)];
	if(itemType == 'serviceitem'){
		filter.push(new nlobjSearchFilter('formulatext',null,'contains','NTRM'));
		filter[1].setFormula('{custrecord33.custrecord34}');
	}else if(itemType == 'noninventoryitem'){
		filter.push(new nlobjSearchFilter('formulatext',null,'doesnotcontain','NTRM'));
		filter[1].setFormula('{custrecord33.custrecord34}');
	}
	
	var columns = new Array(new nlobjSearchColumn(itemSublist_fieldItem,'custrecord33'), //item code
		new nlobjSearchColumn(itemSublist_fieldDescription,'custrecord33'), //description
		new nlobjSearchColumn(itemSublist_fieldQtyOrder,'custrecord33'), // quantity order
		new nlobjSearchColumn(itemSublist_fieldUnitCost,'custrecord33'), // unit cost
		new nlobjSearchColumn(itemSublist_fieldAmount,'custrecord33'), // amount
		new nlobjSearchColumn(itemSublist_fieldFinalVendor,'custrecord33'), //vendor
		new nlobjSearchColumn(itemSublist_fieldFinalTerms,'custrecord33'),// terms
		new nlobjSearchColumn(itemSublist_fieldTaxCode,'custrecord33'), // tax code
		new nlobjSearchColumn(mainLine_fieldAssetName), // asset samp
		new nlobjSearchColumn(itemSublist_fieldPaymentType, 'custrecord33')
		);
		columns[5].setSort();
		
		var result = nlapiSearchRecord('customrecord111','customsearch130',filter,columns);
		
		for(var i = 0; result != null && i < result.length; i++){
			var LineItemObject = new Object();
			searchresult = result[i];
			if(searchresult.getValue(itemSublist_fieldFinalVendor,'custrecord33') != ''){
				LineItemObject.Item = searchresult.getValue(itemSublist_fieldItem,'custrecord33');
				LineItemObject.Description = searchresult.getValue(itemSublist_fieldDescription,'custrecord33');
				LineItemObject.QtyOrder = searchresult.getValue(itemSublist_fieldQtyOrder,'custrecord33');
				LineItemObject.UnitCost = searchresult.getValue(itemSublist_fieldUnitCost,'custrecord33');
				LineItemObject.Amount = searchresult.getValue(itemSublist_fieldAmount,'custrecord33');
				LineItemObject.FinalVendor = searchresult.getValue(itemSublist_fieldFinalVendor,'custrecord33');
				LineItemObject.FinalTerms = searchresult.getValue(itemSublist_fieldFinalTerms,'custrecord33');
				LineItemObject.TaxCode = searchresult.getValue(itemSublist_fieldTaxCode,'custrecord33');
				LineItemObject.RelatedAsset = searchresult.getValue(mainLine_fieldAssetName);
				var payType = searchresult.getValue(itemSublist_fieldPaymentType,'custrecord33');
				LineItemObject.PaymentType = payType === '' ? getPaymentType(LineItemObject.FinalTerms,payType) : payType;
				lineItem.push(LineItemObject);
			}
		}
		
		return lineItem;
}

function setMainField(purchaseOrderRecord,mainLine){
	purchaseOrderRecord.setFieldValue('department',mainLine.Department);
	purchaseOrderRecord.setFieldValue('location',mainLine.Location);
	//purchaseOrderRecord.setFieldValue('trandate',mainLine.Date);
	purchaseOrderRecord.setFieldValue('custbody4',mainLine.Type);
	purchaseOrderRecord.setFieldValue('memo',mainLine.Remarks);
	purchaseOrderRecord.setFieldValue('class',mainLine.Principal);
	purchaseOrderRecord.setFieldValue('custbody157',mainLine.NameOfRequester);
	purchaseOrderRecord.setFieldValue('customform',mainLine.CustomForm);
	//purchaseOrderRecord.setFieldValue('custbody38',mainLine.PaymentType);
	purchaseOrderRecord.setFieldValue('custbody162',mainLine.JobNo);
	purchaseOrderRecord.setFieldValue('custbody163',mainLine.AssetName);
	purchaseOrderRecord.setFieldValue('custbody55',mainLine.Internalid);
	purchaseOrderRecord.setFieldValue('custbody196',mainLine.IsService); //custbody192 = Sandbox , custbody196 = Live
	purchaseOrderRecord.setFieldValue('custbody_deliveredto',mainLine.Deliveredto);
    purchaseOrderRecord.setFieldValue('custbody8',mainLine.PreparedBy); //added by brian 8/20/2015
	purchaseOrderRecord.setFieldValue('approvalstatus',2); //added by noeh 8/28/2015 auto approve
	
	if(mainLine.CanvassedBy != null || mainLine.CanvassedBy != ''){
		purchaseOrderRecord.setFieldValue('custbody8',mainLine.CanvassedBy);
	}else{
		purchaseOrderRecord.setFieldValue('custbody8',mainLine.UpdatedBy);
	}
}

function setLineField(purchaseOrderRecord,lineItem,counter){
	purchaseOrderRecord.setLineItemValue('item','item',counter,lineItem.Item);
	purchaseOrderRecord.setLineItemValue('item','description',counter,lineItem.Description);
	purchaseOrderRecord.setLineItemValue('item','quantity',counter,lineItem.QtyOrder);
	purchaseOrderRecord.setLineItemValue('item','rate',counter,lineItem.UnitCost);
	purchaseOrderRecord.setLineItemValue('item','amount',counter,lineItem.Amount);
	purchaseOrderRecord.setFieldValue('entity',lineItem.FinalVendor);
	purchaseOrderRecord.setFieldValue('custbody120',lineItem.FinalTerms);
	purchaseOrderRecord.setFieldValue('custbody38',lineItem.PaymentType);
	purchaseOrderRecord.setLineItemValue('item','custcol_far_trn_relatedasset',counter,lineItem.RelatedAsset);
	purchaseOrderRecord.setLineItemValue('item','taxcode',counter,lineItem.TaxCode);
}


function saveRecord(mainLine,lineItem){
	var tempVendor = '';
	var counter = 1;
	var poNumbers = new Array();
	
	var createRecord = nlapiCreateRecord('purchaseorder');

	setMainField(createRecord,mainLine);
	
	for(var j = 0; lineItem != '' && j < lineItem.length; j++){
		var lineItemResult = lineItem[j];
	
		if(tempVendor == '' || lineItemResult.FinalVendor == tempVendor){
			setLineField(createRecord,lineItemResult,counter);
			tempVendor = lineItemResult.FinalVendor;
			counter++;
		}else{
			var poid = nlapiSubmitRecord(createRecord, null, true);
			poNumbers.push(poid);
			
			createRecord = null;
			createRecord = nlapiCreateRecord('purchaseorder');
			counter = 1;
			setMainField(createRecord,mainLine);
			setLineField(createRecord,lineItemResult,counter);
			counter++;
			tempVendor = lineItemResult.FinalVendor;
		}
	}
	if(lineItem != ''){
		var poid = nlapiSubmitRecord(createRecord, null, true);
		poNumbers.push(poid);
	}
	
	return poNumbers;
}

function getPaymentType(terms,paytype){
	var paymentType = null;

	if(terms == '5' || terms == '6'){ // 5 = COD, 6 = CWO
		paymentType = '1'; // 1 = Advance Payment
	}else{
		if(paytype === ''){
			paymentType = '2'; // 2 = Later Payment
		}
	}
	
	return paymentType;
}
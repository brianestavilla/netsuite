/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Nov 2016     Brian			   Class for Export PG Transaction to be Uploaded in PG Netsuite
 *
 */

var pgClassTemplate = function () {
	this._EXPORT_DATA = function(request, recordtype, principal, location) {
		if(recordtype == 'invoice') {
			return this._EXPORT_INVOICE(request, principal);
		}
	};
	
	this._EXPORT_INVOICE = function (request, principal) {
		var url;
		var data ='"externalid","transactiondate","customerid","item","discount","qty_cas","qty_sw","qty_pcs"\n';
		for(var i=1,counter = request.getLineItemCount('invoices'); i<=counter; i++) {
			if(request.getLineItemValue('invoices','ifpick', i)=='T') {
				
				//SANDBOX REQUEST
//				url = 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=629&deploy=1';
				//PRODUCTION REQUEST
				url = 'https://rest.na2.netsuite.com/app/site/hosting/restlet.nl?script=629&deploy=1';
				
				var record = nlapiRequestURL(url+'&invoice_internalid='+request.getLineItemValue('invoices','internalid',i)+'&type=invoice', null, this._SET_HEADERS(),null,null);					
				record = JSON.parse(record.getBody());
				var customermappingcode = this._GET_CUSTOMER_MAPPING(record.entityid, principal);
				for(var j=0; j<record.lineitems.length; j++) {
					if(customermappingcode!=null) {
						data += record.externalinvoice;
						data += ',';
						data += record.transdate;
						data += ',';
						data += customermappingcode;
						data += ',';
						data += record.lineitems[j].itemid;
						data += ',';
						data += record.lineitems[j].discount1;
						data += ',';
						if(record.lineitems[j].unit=='CS' ||
						   record.lineitems[j].unit=='cs' ||
						   record.lineitems[j].unit=='cS' ||
						   record.lineitems[j].unit=='Cs') {
							
							data += record.lineitems[j].quantity;
							data += ',';
							data += 0;
							data += ',';
							data += 0;
						
						} else if(record.lineitems[j].unit=='SW' ||
								  record.lineitems[j].unit=='sw' ||
								  record.lineitems[j].unit=='sW' ||
								  record.lineitems[j].unit=='Sw') {
							
							data += 0;
							data += ',';
							data += record.lineitems[j].quantity;							
							data += ',';
							data += 0;
						
						} else {
						
							data += 0;
							data += ',';
							data += 0;						
							data += ',';
							data += record.lineitems[j].quantity;	
						
						}
						
						data += ',';
						data +='\n';
					} else {
						data += record.externalinvoice;
						data += ',';
						data += record.transdate;
						data += ',';
						data += 'NO CUSTOMER CODE SETUP FOR '+record.entityname;
						data += ',';
						data += record.lineitems[j].itemid;
						data += ',';
						data += record.lineitems[j].discount1;
						data += ',';
						if(record.lineitems[j].unit=='CS' || record.lineitems[j].unit=='cs' || record.lineitems[j].unit=='cS' || record.lineitems[j].unit=='Cs') {
							data += record.lineitems[j].quantity;
							data += ',';
							data += 0;
						} else {
							data += 0;
							data += ',';
							data += record.lineitems[j].quantity;
						}
						data += ',';
						data +='\n';
					}
				}
			}
			
		}// end for loop
		return data;
	};
	
	//INTERNAL FUNCTION
	this._GET_CUSTOMER_MAPPING = function (customer, principal) {
		var column = new nlobjSearchColumn('custrecord883');
		var filter = [new nlobjSearchFilter('custrecord882', null, 'anyof', customer),
		              new nlobjSearchFilter('custrecord884', null, 'anyof', principal)
					 ];
		var result = nlapiSearchRecord('customrecord400', null, filter, column); //Performs query
		return (result==null) ? null : result[0].getValue('custrecord883');
	};
	
	this._SET_HEADERS = function (){
		return {
			"User-Agent-x": "SuiteScript-Call",
	        "Authorization": "NLAuth nlauth_account=3625074, nlauth_email=brianestavilla@gmail.com, nlauth_signature=March21993, nlauth_role=3",
	        "Content-Type": "application/json"};
	};
};
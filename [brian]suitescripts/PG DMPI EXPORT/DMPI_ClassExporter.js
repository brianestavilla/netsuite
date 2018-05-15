/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Nov 2016     Brian			   Class for Export DMPI Transaction to be Uploaded in Odoo
 *
 */

var dmpiClassTemplate = function () {
	
	this._EXPORT_DATA = function(request, recordtype, principal, location) {
		if(recordtype == 'invoice') {
			return this._EXPORT_INVOICE(request, principal);
		} else {
			return this._EXPORT_IRA(request, principal, location);
		}
	};
	
	this._EXPORT_INVOICE = function (request, principal) {
		var url;
		var data ='"docref","date","customer","warehouse","product","qty_cas","qty_pcs","price","discount","claimable","amount","free"\n';
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
						data += 'WH';
						data += ',';
						data += record.lineitems[j].itemcode;
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
						data += '';
						data += ',';
						data += record.lineitems[j].discount1;
						data += ',';
						data += '';
						data += ',';
						data += '';
						data += ',';
						data += '';
						data += ',';
						data +='\n';
					} else {
						data += record.externalinvoice;
						data += ',';
						data += record.transdate;
						data += ',';
						data += 'NO CUSTOMER CODE SETUP FOR '+record.entityname;
						data += ',';
						data += 'WH';
						data += ',';
						data += record.lineitems[j].itemcode;
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
						data += '';
						data += ',';
						data += record.lineitems[j].discount1;
						data += ',';
						data += '';
						data += ',';
						data += '';
						data += ',';
						data += '';
						data += ',';
						data +='\n';
					}
				}
			}
			
		}// end for loop
		return data;
	};
	
	this._EXPORT_IRA = function (request, principal, location) {
		if(location == 49 || //CEBU : PAKNAAN : DMPI : GT : GOOD (PAK_DMPI)
		   location == 53 || //CEBU : PAKNAAN : DMPI : FS : GOOD (PAK_DMPI)
		   location == 1039 || //EAST : BAL : TACLOBAN : DMPI : GT : GT GOOD (TAC_DMPI)
		   location == 2049 || //EAST : TACLOBAN : DMPI : GT : GOOD (TAC_DMPIGT)
		   location == 1987 || //CENTRAL : CEBU : PAKNAAN : DMPI : DMPI GT : GOOD (PAK_DMPIGT)
		   location == 2001 || //CENTRAL : CEBU : PAKNAAN : DMPI : DMPI FS : GOOD (PAK_DMPIFS)
		   location == 2398) { //CENTRAL : CEBU : PAKNAAN : DMPI : DMPI GT : BTDT (PAK_DMPIGT)
			var url;
			var data ='"docref","date","partner","return_type","reason","loc_barcode","product","qty_cas","qty_pcs"\n';
			for(var i=1,counter = request.getLineItemCount('returns'); i<=counter; i++) {
				if(request.getLineItemValue('returns','ifpick', i)=='T') {
					
					//SANDBOX REQUEST
//							url = 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=636&deploy=1';
					//PRODUCTION REQUEST
					url = 'https://rest.na2.netsuite.com/app/site/hosting/restlet.nl?script=629&deploy=1';
					
					var record = nlapiRequestURL(url+'&ira_internalid='+request.getLineItemValue('returns','internalid',i)+'&type=returnauthorization', null, this._SET_HEADERS(),null,null);					
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
							data += 'GS';
							data += ',';
							data += 'NOBC';
							data += ',';
							data += 'MAIN';
							data += ',';
							data += record.lineitems[j].itemcode;
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
							data +='\n';
						} else {
							data += record.externalinvoice;
							data += ',';
							data += record.transdate;
							data += ',';
							data += 'NO CUSTOMER CODE SETUP FOR '+record.entityname;
							data += ',';
							data += 'GS';
							data += ',';
							data += 'NOBC';
							data += ',';
							data += 'MAIN';
							data += ',';
							data += record.lineitems[j].itemcode;
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
							data +='\n';
						}
					}
				}
				
			}// end for loop
			return data;
		} else if(location == '649' || // EAST : BAL : TACLOBAN : DMPI : BO (TAC_DMPI)
				  location == '583' || // CEBU : PAKNAAN : DMPI : BO (PAK_DMPI)
				  location == '1985' || //CENTRAL : CEBU : PAKNAAN : DMPI : DMPI GT : BO (PAK_DMPIGT)
				  location == '2348' || //CENTRAL : CEBU : PAKNAAN : DMPI : DMPI FS : BO (PAK_DMPIFS)
				  location == '2050') { //EAST : TACLOBAN : DMPI : GT : BO (TAC_DMPIGT)
			var url;
			var data ='"docref","date","partner","return_type","reason","loc_barcode","product","qty_cas","qty_pcs"\n';
			for(var i=1,counter = request.getLineItemCount('returns'); i<=counter; i++) {
				if(request.getLineItemValue('returns','ifpick', i)=='T') {
					
					//PRODUCTION REQUEST
					url = 'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=629&deploy=1';
					
					var record = nlapiRequestURL(url+'&ira_internalid='+request.getLineItemValue('returns','internalid',i)+'&type=returnauthorization', null, this._SET_HEADERS(),null,null);					
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
							data += 'BO';
							data += ',';
							data += record.lineitems[j].reason;
							data += ',';
							data += 'BO';
							data += ',';
							data += record.lineitems[j].itemcode;
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
							data +='\n';
						} else {
							data += record.externalinvoice;
							data += ',';
							data += record.transdate;
							data += ',';
							data += 'NO CUSTOMER CODE SETUP FOR '+record.entityname;
							data += ',';               
							data += 'BO';
							data += ',';
							data += record.lineitems[j].reason;
							data += ',';
							data += 'BO';
							data += ',';
							data += record.lineitems[j].itemcode;
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
							data +='\n';
						}
					}
				}
				
			}// end for loop
			return data;
		}
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
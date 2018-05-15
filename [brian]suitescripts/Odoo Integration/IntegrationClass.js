/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Jan 2018     brian
 *
 */

var INTEGRATION_API = function () {
	var filter, column, message = "remarks, internalid, tranid, customer, trandate, location, principal, externalinvoice, item, itemcode, qty, uom\n",
	error_objects = [];

	this.GET_INVOICE_DATA = function() {
		var lastid = 0;
		var data_storage = [];
		var count = 0;
		
		/**
		** Search Records Returns a maximum of 1000 rows,
		** This Script enables us to query more than 1000 rows.
		** returns internalid of invoices.
		**/
		
		do {
			var columns = [
               new nlobjSearchColumn('internalid').setSort(),
		       new nlobjSearchColumn('tranid'),
		       new nlobjSearchColumn('entity'),
		       new nlobjSearchColumn('custentity13','customer'),
		       new nlobjSearchColumn('trandate'),
		       new nlobjSearchColumn('location'),
		       new nlobjSearchColumn('class'),
		       new nlobjSearchColumn('custbody69'),  //operation
		       new nlobjSearchColumn('custbody178'), //externalinvoice#
		       new nlobjSearchColumn('type', 'systemnotes'), //system notes type
		       new nlobjSearchColumn('amount'),
		       new nlobjSearchColumn('account'),
		       new nlobjSearchColumn('item'),
		       new nlobjSearchColumn('unit'),
		       new nlobjSearchColumn('custitem10','item'),
		       new nlobjSearchColumn('quantityuom')
            ];
			
			var filters = [
			    //new nlobjSearchFilter('status', null, 'anyof', 'CustInvc:A'), // open invoices
			    //new nlobjSearchFilter('date', 'systemnotes', 'within', '5/1/2018','5/7/2018'),
			    new nlobjSearchFilter('date', 'systemnotes', 'within', 'today'),
			    new nlobjSearchFilter('type', 'systemnotes', 'is','Create'),
				new nlobjSearchFilter('mainline', null, 'is', 'F'),
				new nlobjSearchFilter('class', null, 'anyof', ['10','11']),
				new nlobjSearchFilter('internalidnumber', null, 'greaterthan', lastid),
	            new nlobjSearchFilter('item', null, 'noneof', ['@NONE@', '6','30362','']),
	            new nlobjSearchFilter('account', null, 'is', '2221') // 401010300 REVENUE : Sales : Sales - Food : Del Monte
			];
			
			var result = nlapiSearchRecord('invoice',null, filters, columns);
			
			if(result != null){
				for(var i in result) {
					if(/Create/i.test(result[i].getValue('type', 'systemnotes'))){
						data_storage.push({
							'internalid': result[i].getValue('internalid'),
							'tranid': result[i].getValue('tranid'),
							'customer': result[i].getText('entity'),
							'customerid': result[i].getValue('entity'),
							'customer_code': result[i].getText('entity'),
							'trandate': result[i].getValue('trandate'),
							'location': result[i].getText('location'),
							'principal': result[i].getText('class'),
							'operation': result[i].getText('custbody69'),
							'customer_operation': result[i].getText('custentity13','customer'),
							'external_invoice': result[i].getValue('custbody178'),
							'item': result[i].getText('item'),
							'itemcode': result[i].getValue('custitem10','item'),
							'quantity': result[i].getValue('quantityuom'),
							'unit': result[i].getValue('unit')
						});
					}
				}
				
				count = result.length;
				lastid = result[result.length-1].getValue('internalid');
			}
			
		} while(count == 1000);

		return data_storage;
		
	};
	
	this.GET_INVOICES = function () {
		try {
			var rawdata = this.GET_INVOICE_DATA();
			var data = [], validated_data = {};

			if(rawdata.length != 0) {
				validated_data = this.VALIDATE_INVOICE_DATA(rawdata);

				if(validated_data.error_data.length != 0) {
					//this.BACKUP_ERROR_DATA_INVOICE(validated_data.error_data,validated_data.csvdata_error);
					this.SET_MESSAGE(validated_data.csvdata_error);
				}
				
				if(validated_data.data_to_be_send.length != 0) {
					this.BACKUP_SENT_DATA_INVOICE(validated_data.csvdata_backup); 

					/** RESTRUCTURE DATA OBJECT **/		
					data = this.RESTRUCTURE_INVOICE_DATA(validated_data.data_to_be_send);
					
					this.TEST_SEND_DATA(data);

			        /** PAKNAAN FS **/
					if(data.PAK_DATA_FS.transactions.length != 0) { this.SEND_DATA('paknaan_fs', data.PAK_DATA_FS); }
	
					/** PAKNAAN GT **/
					if(data.PAK_DATA_GT.transactions.length != 0) { this.SEND_DATA('paknaan_gt', data.PAK_DATA_GT); }
	
					/** TACLOBAN GT **/
					if(data.TAC_DATA_GT.transactions.length != 0) {	this.SEND_DATA('tacloban_gt', data.TAC_DATA_GT); }
	
					/** CALBAYOG GT **/
					if(data.CAL_DATA_GT.transactions.length != 0) { this.SEND_DATA('calbayog_gt', data.CAL_DATA_GT); }	
					
				}
				
				if(this.GET_ERROR_OBJECTS().length != 0) {
					var date = new Date();
					date.setHours(date.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
					date.setMinutes(date.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
					var filename = (date.getMonth()+1)+''+date.getDate()+''+date.getFullYear();
					var num_exist_filename = 0;
					var regexx = "";
					regexx = new RegExp(filename, "i");
					
					/** get filenames in the AFTER SEND ERROR FOLDER **/
					
					var filter = new nlobjSearchFilter('internalid', null, 'is', 1330);
					var columns = [ new nlobjSearchColumn('name', 'file'), new nlobjSearchColumn('internalid', 'file') ];
					
					var searchResult = nlapiSearchRecord('folder', null , filter, columns);
					if(searchResult != null) {
						for (var i in searchResult) {
							if(regexx.test(searchResult[i].getValue('name','file'))) num_exist_filename += 1;
						};
					}
					
					filename += '_'+num_exist_filename;
					
					this.TEST_SEND_DATA(this.GET_MESSAGE());
					this.SEND_EMAIL_TO_ADMINISTRATOR(this.GET_MESSAGE());
					this.BACKUP_ERROR_DATA_INVOICE(filename);
				}
			}
			
		} catch(err) { nlapiLogExecution('ERROR','ERROR MESSAGE',err.message); };
	};

	this.SEND_DATA = function(branch, data) {
		try {
			var url_link = this.URL_LINKS_INVOICE(branch);
			var response = nlapiRequestURL(url_link, JSON.stringify(data), this.HTTP_HEADERS(), null,null);	
			var error_response = JSON.parse(response.getBody()).result.fail;
			//var csvdata_error = "remarks, internalid, customer name, customer code, trandate, externalinvoice\n";
			var csvdata_error = '';
			var error_object = [];
			
			/** HANDLE RETURNED ERROR DATA **/
			if(error_response.length != 0) {
				/** BUILD CSV ERROR DATA **/
				for(var i in error_response) {
					for(var j in  data.transactions) {
						if(error_response[i].remote_id == data.transactions[j].remote_id) {
							var duplicate_flag = 0;
							var error_message = '';
							
							for(var err in error_response[i].errors) {
								if(/Duplicate/i.test(error_response[i].errors[err])) {
									duplicate_flag = 1; 
									break;
								} else { error_message += error_response[i].errors[err]; }
							}
							
							if(duplicate_flag == 0) {
								/** ERROR OBJECT **/								
								this.SET_ERROR_OBJECTS({
									'transaction':'sale',
									'remote_id': data.transactions[j].remote_id,
									'customername': data.transactions[j].customername,
									'customer': data.transactions[j].customername,
									'customer_code': data.transactions[j].customer_code,
									'customerid': data.transactions[j].customerid,
									'date': data.transactions[j].date,
									'location': data.transactions[j].location,
									'principal': data.transactions[j].principal,
									'warehouse':'WH',
									'docref': data.transactions[j].docref,
									'order_lines': data.transactions[j].order_lines
								});
								
								/** CSV FORMAT **/
								csvdata_error += error_message+',';
								csvdata_error += data.transactions[j].remote_id+',';
								csvdata_error += data.transactions[j].customername+',';
								csvdata_error += data.transactions[j].customer+',';
								csvdata_error += data.transactions[j].date+',';
								csvdata_error += data.transactions[j].docref+'\n';
							}
							
							break;
							
						}
					}
				}
					this.SET_MESSAGE(csvdata_error);
			}
			
		} catch(err) { nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message); };
	};

	this.VALIDATE_INVOICE_DATA = function(data) {
		var data_to_be_send = [], error_data = [], customer_codes = [];
		var csvdata_backup = "internalid, tranid, customer, customercode, trandate, location, principal, externalinvoice, item, itemcode, qty, uom\n";
		//var csvdata_error = "remarks, internalid, tranid, customer, trandate, location, principal, externalinvoice, item, itemcode, qty, uom\n";
		var csvdata_error = "";
		
		try {
			/** UPDATE DATA TO ITS CORRESPONDING CUSTOMER CODES **/
			customer_codes = this.GET_CUSTOMER_MAPPING(data);
			
			for(var k in data) {
				if(typeof(customer_codes[data[k].customerid+'_'+data[k].principal]) != 'undefined') {
					data[k]['customer_code'] = customer_codes[data[k].customerid+'_'+data[k].principal];
					data_to_be_send.push(data[k]);
					
					/** Structure csv data backup **/
					
					csvdata_backup += data[k].internalid+',' || data[k].remote_id+',';
					csvdata_backup += data[k].tranid+',' || data[k].docref+',';
					csvdata_backup += data[k].customer.replace(/,/g,'')+',';
					csvdata_backup += customer_codes[data[k].customer+'_'+data[k].principal]+',';
					csvdata_backup += data[k].trandate+',' || data[k].date+',';
					csvdata_backup += data[k].location+',';
					csvdata_backup += data[k].principal+',';
					csvdata_backup += data[k].external_invoice+',' || data[k].docref+',';
					csvdata_backup += data[k].item+',' || data[k].product+',';
					csvdata_backup += data[k].itemcode+',';
					csvdata_backup += data[k].quantity+',';
					csvdata_backup += data[k].unit+'\n';
						
					/***************************************************/
				} else {
					
					/** Push data in the error object **/
					
					//error_data.push(data[k]);
					this.SET_ERROR_OBJECTS(data[k]);
					
					/** Structure csv data error **/
					
					csvdata_error += 'No Customer Code Setup for this customer.'+',';
					csvdata_error += data[k].internalid+',' || data[k].remote_id+',';
					csvdata_error += data[k].tranid+',' || data[k].docref+',';
					csvdata_error += data[k].customer.replace(/,/g,'')+',';
					csvdata_error += data[k].trandate+',' || data[k].date+',';
					csvdata_error += data[k].location+',';
					csvdata_error += data[k].principal+',';
					csvdata_error += data[k].external_invoice+',' || data[k].docref+',';
					csvdata_error += data[k].item+',' || data[k].product+',';
					csvdata_error += data[k].itemcode+',';
					csvdata_error += data[k].quantity+',';
					csvdata_error += data[k].unit+'\n';
					
					/***************************************************/
				}
			}
			
			/************************************************/
			
			return {
				'data_to_be_send':data_to_be_send, 'csvdata_backup':csvdata_backup,
				'error_data':error_data, 'csvdata_error':csvdata_error
			};
		} catch(err) { nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message); };
	};
	
	this.BACKUP_ERROR_DATA_INVOICE = function(filename){
		try {	
//			var date = new Date();
//			date.setHours(date.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
//			date.setMinutes(date.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
	
	//        var file_for_email = nlapiCreateFile('error_data.csv', 'CSV', data_csv);
	//        file_for_email.setFolder(1229);
	//        var emailedid = nlapiSubmitFile(file_for_email);
	//        nlapiSendEmail(30855, ['bestavilla.pgkhc@gmail.com','rgtabasa.pgkhc@gmail.com'], 'Invoice Errors Returned After Sending', 'Please see the attached file.', null, null, null, file_for_email);
	//		nlapiDeleteFile(emailedid);
			
//			this.SET_MESSAGE(data_csv);
			
			/** Create a csv file for the current invoices and add it in the netsuite cabinet **/
			
			//var file = nlapiCreateFile((date.getMonth()+1)+''+date.getDate()+''+date.getFullYear(), 'PLAINTEXT', JSON.stringify(data_obj));
			//file.setFolder(1330); //ERROR STORAGE FOLDER
			//nlapiSubmitFile(file);
			
			/*******************************************************************/
		
			/** SAVE ERROR DATA IN THE STORAGE **/
			if(this.GET_ERROR_OBJECTS().length != 0) {			
				var save_file = nlapiCreateFile(filename, 'PLAINTEXT', JSON.stringify(this.GET_ERROR_OBJECTS()));
				save_file.setFolder(1330);
				nlapiSubmitFile(save_file);
				error_objects = [];
			}
			
		} catch(err){ nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message); };
	};
	
	this.BACKUP_SENT_DATA_INVOICE = function(data) {
		try {
			var date = new Date();
			date.setHours(date.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
			date.setMinutes(date.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
			var filename = (date.getMonth()+1)+''+date.getDate()+''+date.getFullYear();
			var num_exist_filename = 0;
			var regexx = "";
			regexx = new RegExp(filename, "i");
			
			/**
			**	GET FILE NAMES IN THE BACKUP FOR DATA SEND FOLDER 
			**/
			
			var filter = new nlobjSearchFilter('internalid', null, 'is', 1329);
			var columns = [
			    new nlobjSearchColumn('name', 'file'),
			    new nlobjSearchColumn('internalid', 'file')
			];
			
			var searchResult = nlapiSearchRecord('folder', null , filter, columns);
			if(searchResult != null) {
				for (var i in searchResult) {
					if(regexx.test(searchResult[i].getValue('name','file'))) num_exist_filename += 1;
				}
			}
			
			filename += '_'+num_exist_filename;
			
			/**
			** Create a csv file for the current invoices and add it in the netsuite cabinet
			**/
			
	        var file = nlapiCreateFile(filename, 'CSV', data);
			file.setFolder(1329); //BACKUP FOR SENT DATA FOLDER
			nlapiSubmitFile(file);
			
			if(searchResult != null && searchResult.length >= 15) {
				nlapiDeleteFile(searchResult[0].getValue('internalid','file'));
			}
			/*******************************************************************/
		} catch(err){ nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message); };
	};
	
	this.RESTRUCTURE_INVOICE_DATA = function(data) {
		var structured_data = [];
		var PAK_DATA_FS = [], TAC_DATA_GT = [], CAL_DATA_GT = []; PAK_DATA_GT = [];
		
		for(var i in data) {
			var found = structured_data.some(function(val){ return val.remote_id === data[i].internalid; });
			
			if(found){
				var qty_pcs = 0, qty_cs = 0;
				
				if(data[i].unit=='CS' || data[i].unit=='cS' || data[i].unit=='cs' ||
				   data[i].unit=='Cs' || data[i].unit=='CASE' ||
				   data[i].unit=='Case' || data[i].unit=='case' ||
				   data[i].unit=='CASES' || data[i].unit=='Cases'  || data[i].unit=='cases') {
					
					qty_cs = parseInt(data[i].quantity);

				} else { qty_pcs = parseInt(data[i].quantity); }
				
				for(var j in structured_data) {
					if(structured_data[j].remote_id == data[i].internalid) {
						structured_data[j].order_lines.push({
							'product': data[i].itemcode,
							'qty_cas': parseInt(qty_cs),
							'qty_pcs': parseInt(qty_pcs),
							'free': false
						});
						break;
					}
				}
			} else {
				var dateformat = new Date(data[i].trandate);
				var qty_pcs = 0, qty_cs = 0;
				
				if(data[i].unit=='CS' || data[i].unit=='cS' || data[i].unit=='cs' ||
				   data[i].unit=='Cs' || data[i].unit=='CASE' ||
				   data[i].unit=='Case' || data[i].unit=='case' ||
				   data[i].unit=='CASES' || data[i].unit=='Cases'  || data[i].unit=='cases') {
					
					qty_cs = parseInt(data[i].quantity);

				} else { qty_pcs = parseInt(data[i].quantity); }
				
				structured_data.push({
					'transaction':'sale',
					'remote_id': data[i].internalid,
					'customername': data[i].customer,
					'customer': data[i].customer_code,
					'customerid': data[i].customerid,
					'date': dateformat.getFullYear()+'-'+(dateformat.getMonth()+1)+'-'+dateformat.getDate(),
					'location': data[i].location,
					'principal': data[i].principal,
					'warehouse':'WH',
					'docref': data[i].external_invoice,
					'order_lines': [{
						'product': data[i].itemcode,
						'qty_cas':parseInt(qty_cs),
						'qty_pcs':parseInt(qty_pcs),
						'free':false
					}]
				});
			}
		}
		
		for(var i in structured_data) {
			if(/FS/i.test(structured_data[i].principal)) {
				
				/** DMPI FS **/
				if(/PAK/i.test(structured_data[i].location)) { PAK_DATA_FS.push(structured_data[i]); }
				
			} else {
				
				/** DMPI GT **/
				if(/PAK/i.test(structured_data[i].location)) {
					PAK_DATA_GT.push(structured_data[i]);	
				} else if (/TAC/i.test(structured_data[i].location)) {
					TAC_DATA_GT.push(structured_data[i]);
				} else {
					CAL_DATA_GT.push(structured_data[i]);
				}
				
			}
		}
		
		return {
			'PAK_DATA_FS' : {'transactions': PAK_DATA_FS},
			'PAK_DATA_GT' : {'transactions': PAK_DATA_GT},
			'TAC_DATA_GT' : {'transactions': TAC_DATA_GT},
			'CAL_DATA_GT' : {'transactions': CAL_DATA_GT}
		};
	};
		
	this.GET_CUSTOMER_MAPPING = function(data) {
		var customers =  [], temp = [];
		try {
			for(var i in data) {
				
				/** 
				** GET UNIQUE CUSTOMER ID AND PUSH IT IN CUSTOMERS ARRAY
				** THIS ARRAY IS USED TO GET CUSTOMER CODE
				**/
				
				var customercheck = temp.some(function (d) { return d.customerid == data[i].customerid; });
				
				if(!customercheck) {
					temp.push({'customerid':data[i].customerid});
					customers.push(data[i].customerid);
				}
			}
			
			filter = [
	          new nlobjSearchFilter('isinactive', null, 'is', 'F'),
	          new nlobjSearchFilter('custrecord882', null, 'anyof', customers),
	          new nlobjSearchFilter('custrecord884', null, 'anyof', ['10','11']) // 10 = DMPI GT; 11 = DMPI FS;
			];
			
			column = [
			   new nlobjSearchColumn('custrecord882'), // customer name
		       new nlobjSearchColumn('custrecord883'), // customer mapping code
		       new nlobjSearchColumn('custrecord884') // principal
			];
			
			var result = nlapiSearchRecord('customrecord400', null, filter, column);
			customers = [];
					
			if(result != null) {
				for(var i in result) {
					customers[result[i].getValue('custrecord882')+'_'+result[i].getText('custrecord884')] = result[i].getValue('custrecord883');
				}
			}
			return customers;
		} catch(err) {
			nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message);
		};
		
	};
	
	this.REUPLOAD_BEFORE_SEND_ERRORS_INVOICES = function() {
		var filter = new nlobjSearchFilter('internalid', null, 'is', 1330);
		var column = new nlobjSearchColumn('internalid','file');
		var error_files = nlapiSearchRecord('folder', null , filter , column);
		
		if(error_files[0].getValue('internalid','file')!='') {
			for(var i in error_files) {
				var load_error_file = nlapiLoadFile(error_files[i].getValue('internalid','file'));
				var filename = load_error_file.getName();
				invoices = JSON.parse(load_error_file.getValue());
				
				if(invoices.length != 0) {
					validated_data = this.VALIDATE_INVOICE_DATA(invoices);
					
					if(validated_data.data_to_be_send.length != 0) { this.BACKUP_SENT_DATA_INVOICE(validated_data.csvdata_backup); }
					
					if(validated_data.error_data.length != 0) {
										
						/** SEND EMAIL TO THE ADMINISTRATORS **/
							//this.SEND_EMAIL_TO_ADMINISTRATOR(validated_data.csvdata_error);
							this.SET_MESSAGE(validated_data.csvdata_error);
						/** END **/
						
//						var file = nlapiCreateFile(filename, 'PLAINTEXT', JSON.stringify(validated_data.error_data));
//						file.setFolder(1330); //ERROR STORAGE FOLDER
//						nlapiSubmitFile(file);
					} else { nlapiDeleteFile(error_files[i].getValue('internalid','file')); }
					
				data = this.RESTRUCTURE_INVOICE_DATA(validated_data.data_to_be_send);
					
				/** PAKNAAN FS **/
				if(data.PAK_DATA_FS.transactions.length != 0) { this.SEND_DATA('paknaan_fs', data.PAK_DATA_FS); }
				
				/** PAKNAAN GT **/
				if(data.PAK_DATA_GT.transactions.length != 0) { this.SEND_DATA('paknaan_gt', data.PAK_DATA_GT); }
				
				/** TACLOBAN GT **/
				if(data.TAC_DATA_GT.transactions.length != 0) { this.SEND_DATA('tacloban_gt', data.TAC_DATA_GT); }
				
				/** CALBAYOG GT **/
				if(data.CAL_DATA_GT.transactions.length != 0) { this.SEND_DATA('calbayog_gt', data.CAL_DATA_GT); }
				
				this.BACKUP_ERROR_DATA_INVOICE(filename);
				
				} else { nlapiDeleteFile(error_files[i].getValue('internalid','file')); }
			}
				this.SEND_EMAIL_TO_ADMINISTRATOR(this.GET_MESSAGE());
		}
	
	};
	
	this.SEND_EMAIL_TO_ADMINISTRATOR = function(csvdata_error) {
		/** SEND EMAIL TO THE ADMINISTRATORS **/
		var file_for_email = nlapiCreateFile('returned_error_data.csv', 'CSV', csvdata_error);
        file_for_email.setFolder(1229);
        var emailedid = nlapiSubmitFile(file_for_email);
        nlapiSendEmail(30855, ['bestavilla.pgkhc@gmail.com','rgtabasa.pgkhc@gmail.com'], 'Errors Returned After Sending', 'Please see the attached file.', null, null, null, file_for_email);
		nlapiDeleteFile(emailedid);
		/** END **/
	};

	this.URL_LINKS_INVOICE = function (branch) {
		
		/** LINKS FOR THE TEST SERVER **/
//		var branchlinks = {
//			    'paknaan_fs':'http://52.220.97.8:18069/dmpi/rest/drx_ceb_fs_live/sales',
//			    'paknaan_gt':'http://52.220.97.8:18069/dmpi/rest/drx_ceb_gr_live/sales',
//			    'tacloban_fs':'http://52.220.97.8:18069/dmpi/rest/drx_ceb_gr_live/sales',
//			    'tacloban_gt':'http://52.220.97.8:18069/dmpi/rest/drx_ceb_gr_live/sales',
//			    'calbayog_fs':'http://52.220.97.8:18069/dmpi/rest/drx_ceb_gr_live/sales',
//			    'calbayog_gt':'http://52.220.97.8:18069/dmpi/rest/drx_ceb_gr_live/sales'
//		};
		
		/** LINKS FOR THE PRODUCTION **/
		var branchlinks = {
		    'paknaan_fs':'https://syncserver.delmontecsg.com:38071/dmpi/rest/drx_ceb_fs_live_sync/sales',
		    'paknaan_gt':'https://syncserver.delmontecsg.com:38071/dmpi/rest/drx_ceb_gr_live_sync/sales',
		    'tacloban_gt':'https://syncserver.delmontecsg.com:38071/dmpi/rest/dnx_tac_gr_live_sync/sales',
		    'calbayog_gt':'https://syncserver.delmontecsg.com:38071/dmpi/rest/dnx_cal_gr_live_sync/sales'
		    //'paknaan_fs':'http://52.220.97.8:28071/dmpi/rest/drx_ceb_fs_live_sync/sales',
		    //'paknaan_gt':'http://52.220.97.8:28071/dmpi/rest/drx_ceb_gr_live_sync/sales',
		};
		return branchlinks[branch];
	};
	
  	this.HTTP_HEADERS = function() {
		return { 'Content-Type':'application/json', 'Authorization':'Basic '+nlapiEncrypt('drxsync:drxsync', 'base64') };
	};

	this.SET_MESSAGE = function(mess) { message = message+"\n"+mess; };

	this.GET_MESSAGE = function() { return message; };
	
	this.SET_ERROR_OBJECTS = function(err_obj){ error_objects.push(err_obj); };
	
	this.GET_ERROR_OBJECTS = function() { return error_objects; };
	/********************** ISSUE RETURN AUTHORIZATION (IRA) **********************/
	
	this.GET_IRAS = function () {
		try {
			var rawdata = this.GET_IRA_DATA();
			var data = [], validated_data = {};

			if(rawdata.length != 0) {
				validated_data = this.VALIDATE_IRA_DATA(rawdata);
				
				/** BACKUP ERROR  **/
				if(validated_data.error_data.length != 0) {
					//this.BACKUP_ERROR_DATA_IRA(validated_data.error_data,validated_data.csvdata_error);
					this.SET_MESSAGE(validated_data.csvdata_error);
				}
				/*******************/
				
				if(validated_data.data_to_be_send.length != 0) {
					this.BACKUP_SENT_DATA_IRA(validated_data.csvdata_backup);
			        
			        /** RESTRUCTURE DATA OBJECT **/		
					data = this.RESTRUCTURE_IRA_DATA(validated_data.data_to_be_send);
					
//					this.TEST_SEND_DATA(data);
					
			        /** PAKNAAN FS **/
					if(data.PAK_DATA_FS.transactions.length != 0) { this.SEND_DATA_IRA('paknaan_fs', data.PAK_DATA_FS); }
					
					/** PAKNAAN GT **/
					if(data.PAK_DATA_GT.transactions.length != 0) { this.SEND_DATA_IRA('paknaan_gt', data.PAK_DATA_GT); }
					
					/** TACLOBAN GT **/
					if(data.TAC_DATA_GT.transactions.length != 0) { this.SEND_DATA_IRA('tacloban_gt', data.TAC_DATA_GT); }
					
					/** CALBAYOG GT **/
					if(data.CAL_DATA_GT.transactions.length != 0) { this.SEND_DATA_IRA('calbayog_gt', data.CAL_DATA_GT); }
				}
				
				if(this.GET_ERROR_OBJECTS().length != 0) {
					var date = new Date();
					date.setHours(date.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
					date.setMinutes(date.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
					var filename = (date.getMonth()+1)+''+date.getDate()+''+date.getFullYear();
					var num_exist_filename = 0;
					var regexx = "";
					regexx = new RegExp(filename, "i");
					
					/** get filenames in the AFTER SEND ERROR FOLDER **/
					
					var filter = new nlobjSearchFilter('internalid', null, 'is', 1333);
					var columns = [ new nlobjSearchColumn('name', 'file'), new nlobjSearchColumn('internalid', 'file') ];
					
					var searchResult = nlapiSearchRecord('folder', null , filter, columns);
					if(searchResult != null) {
						for (var i in searchResult) {
							if(regexx.test(searchResult[i].getValue('name','file'))) num_exist_filename += 1;
						};
					}
					
					filename += '_'+num_exist_filename;

					this.SEND_EMAIL_TO_ADMINISTRATOR(this.GET_MESSAGE());
					this.BACKUP_ERROR_DATA_IRA(filename);
				}
			}
		} catch(err) { nlapiLogExecution('ERROR', 'ERROR EXCEPTION', err.message); };
	};
	
	this.GET_IRA_DATA = function(){
		var lastid = 0;
		var data_storage = [];
		var count = 0;
		
		/**
		** Search Records Returns a maximum of 1000 rows,
		** This Script enables us to query more than 1000 rows.
		** returns internalid of invoices.
		**/
		
		do {
			var columns = [
               new nlobjSearchColumn('internalid').setSort(),
		       new nlobjSearchColumn('tranid'),
		       new nlobjSearchColumn('entity'),
		       new nlobjSearchColumn('trandate'),
		       new nlobjSearchColumn('location'),
		       new nlobjSearchColumn('class'),
		       new nlobjSearchColumn('custbody178'),
		       new nlobjSearchColumn('amount'),
		       new nlobjSearchColumn('account'),
		       new nlobjSearchColumn('item'),
		       new nlobjSearchColumn('unit'),
		       new nlobjSearchColumn('custitem10','item'),
		       new nlobjSearchColumn('quantityuom'),
		       new nlobjSearchColumn('custcol35')
			];
			
			var filters = [
			    new nlobjSearchFilter('date', 'systemnotes', 'within', 'today'),
			    //new nlobjSearchFilter('date', 'systemnotes', 'within', '5/1/2018','5/7/2018'),
				new nlobjSearchFilter('status', null, 'anyof', 'RtnAuth:G'), // refunded IRA
				new nlobjSearchFilter('mainline', null, 'is', 'F'),
				new nlobjSearchFilter('class', null, 'anyof', ['10','11']),
				new nlobjSearchFilter('internalidnumber', null, 'greaterthan', lastid),
				new nlobjSearchFilter('item', null, 'noneof', ['@NONE@', '6','30362','']),
		        new nlobjSearchFilter('account', null, 'is', '2221') // 401010300 REVENUE : Sales : Sales - Food : Del Monte
			];
			
			var result = nlapiSearchRecord('returnauthorization',null, filters, columns);
			if(result != null) {
				for(var i in result) {
						if(!(/QRTN/i.test(result[i].getText('location')))) {
							data_storage.push({
								'internalid': result[i].getValue('internalid'),
								'tranid': result[i].getValue('tranid'),
								'customer': result[i].getText('entity'),
								'customerid': result[i].getValue('entity'),
								'customer_code': result[i].getText('entity'),
								'trandate': result[i].getValue('trandate'),
								'location': result[i].getText('location'),
								'principal': result[i].getText('class'),
								'external_invoice': result[i].getValue('custbody178'),
								'item': result[i].getText('item'),
								'itemcode': result[i].getValue('custitem10','item'),
								'quantity': Math.abs(result[i].getValue('quantityuom')),
								'unit': result[i].getValue('unit'),
								'reason': result[i].getText('custcol35').split('_')[2] || result[i].getText('custcol35'),
							});
						}
					}
				count = result.length;
				lastid = result[result.length-1].getValue('internalid');
			}
		} while(count == 1000);
		
		/************************************************************/
		
		return data_storage;
	};
	
	this.VALIDATE_IRA_DATA = function(data) {
		var data_to_be_send = [], error_data = [], customer_codes = [];
		var csvdata_backup = "internalid, tranid, customer, customercode, trandate, location, principal, externalinvoice, item, itemcode, qty, uom\n";
		var csvdata_error = '';
		//var csvdata_error = "remarks, internalid, tranid, customer, trandate, location, principal, externalinvoice, item, itemcode, qty, uom\n";

		/** UPDATE DATA TO ITS CORRESPONDING CUSTOMER CODES **/
		customer_codes = this.GET_CUSTOMER_MAPPING(data);
		
		for(var k in data) {
			if(typeof(customer_codes[data[k].customerid+'_'+data[k].principal]) != 'undefined') {
				data[k]['customer_code'] = customer_codes[data[k].customerid+'_'+data[k].principal];
				data_to_be_send.push(data[k]);
				/** Structure csv data backup **/
				
					csvdata_backup += data[k].internalid+',' || data[k].remote_id+',';
					csvdata_backup += data[k].tranid+',' || data[k].docref+',';
					csvdata_backup += data[k].customer.replace(/,/g,'')+',';
					csvdata_backup += customer_codes[data[k].customer+'_'+data[k].principal]+',';
					csvdata_backup += data[k].trandate+',' || data[k].date+',';
					csvdata_backup += data[k].location+',';
					csvdata_backup += data[k].principal+',';
					csvdata_backup += data[k].external_invoice+',' || data[k].docref+',';
					csvdata_backup += data[k].item+',' || data[k].product+',';
					csvdata_backup += data[k].itemcode+',';
					csvdata_backup += data[k].quantity+',';
					csvdata_backup += data[k].unit+',';
					csvdata_backup += data[k].reason+'\n';
					
				/***************************************************/
			} else {
				
				/** Push data in the error object **/
				
				//error_data.push(data[k]);
				this.SET_ERROR_OBJECTS(data[k]);
				
				/** Structure csv data error **/
				
					csvdata_error += 'No Customer Code Setup for this customer.,';
					csvdata_error += data[k].internalid+',' || data[k].remote_id+',';
					csvdata_error += data[k].tranid+',' || data[k].docref+',';
					csvdata_error += data[k].customer.replace(/,/g,'')+',';
					csvdata_error += data[k].trandate+',' || data[k].date+',';
					csvdata_error += data[k].location+',';
					csvdata_error += data[k].principal+',';
					csvdata_error += data[k].external_invoice+',' || data[k].docref+',';
					csvdata_error += data[k].item+',' || data[k].product+',';
					csvdata_error += data[k].itemcode+',';
					csvdata_error += data[k].quantity+',';
					csvdata_error += data[k].unit+',';
					csvdata_error += data[k].reason+'\n';
			
				/***************************************************/
			}
		}
		
		/************************************************/
		
		return {
			'data_to_be_send':data_to_be_send,
			'csvdata_backup':csvdata_backup,
			'error_data':error_data,
			'csvdata_error':csvdata_error
			};
	};
	
	this.BACKUP_ERROR_DATA_IRA = function(filename){
		try {
			if(this.GET_ERROR_OBJECTS().length != 0) {
				var save_file = nlapiCreateFile(filename, 'PLAINTEXT', JSON.stringify(this.GET_ERROR_OBJECTS()));
				save_file.setFolder(1333);
				nlapiSubmitFile(save_file);
				error_objects = [];
			}
		} catch(err){ nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message); };
	};
	
	this.BACKUP_SENT_DATA_IRA = function(data){
		
		var date = new Date();
		date.setHours(date.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
		date.setMinutes(date.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
		var filename = (date.getMonth()+1)+''+date.getDate()+''+date.getFullYear();
		var num_exist_filename = 0;
		var regexx = "";
		regexx = new RegExp(filename, "i");
		
		/** GET FILE NAMES IN THE BACKUP FOR DATA SEND FOLDER **/
		var filter = new nlobjSearchFilter('internalid', null, 'is', 1329);
		var columns = [ new nlobjSearchColumn('name', 'file'), new nlobjSearchColumn('internalid', 'file') ];
		var searchResult = nlapiSearchRecord('folder', null , filter, columns);
		
		if(searchResult != null) {
			for (var i in searchResult) {
				if(regexx.test(searchResult[i].getValue('name','file'))) num_exist_filename += 1;
			};
		}
		
		filename += '_'+num_exist_filename;
		
		/** Create a csv file for the current invoices and add it in the netsuite cabinet **/
		
        var file = nlapiCreateFile(filename, 'CSV', data);
		file.setFolder(1332); //BACKUP FOR SENT DATA FOLDER
		nlapiSubmitFile(file);
		
		if(searchResult != null && searchResult.length >= 15) {
			nlapiDeleteFile(searchResult[0].getValue('internalid','file'));
		}
		
		/*******************************************************************/
	};
	
	this.RESTRUCTURE_IRA_DATA = function(data) {
		var structured_data = [];
		var PAK_DATA_FS = [], TAC_DATA_GT = [],CAL_DATA_GT = [],
			PAK_DATA_GT = [], return_type='';
		
		for(var i in data) {
			var found = structured_data.some(function(val){ return val.remote_id === data[i].internalid; });
			if(/GOOD/i.test(data[i].location)) { return_type = 'GS'; } else { return_type = 'BO'; }
			
			if(found) {
				var qty_pcs = 0, qty_cs = 0;
				
				if(data[i].unit=='PC' || data[i].unit=='pC' || data[i].unit=='pc' || data[i].unit=='Pc' ||
				data[i].unit=='PIECE' || data[i].unit=='Piece' || data[i].unit=='PIECES' || data[i].unit=='Pieces' ||
				data[i].unit=='pieces' || data[i].unit=='PCS' || data[i].unit=='Pcs'|| data[i].unit=='pcs') {
						 qty_pcs = parseInt(data[i].quantity);
				} else { qty_cs = parseInt(data[i].quantity); }
				
				for(var j in structured_data) {
					if(structured_data[j].remote_id == data[i].internalid) {
						structured_data[j].order_lines.push({
							'product': data[i].itemcode,
							'qty_cas': parseInt(qty_cs),
							'qty_pcs': parseInt(qty_pcs),
							'free':false,
							'reason': data[i].reason
						});
						break;
					}
				}
			} else {
				var dateformat = new Date(data[i].trandate);
				var qty_pcs = 0, qty_cs = 0;
				
				if(data[i].unit=='PC' || data[i].unit=='pC' || data[i].unit=='pc' || data[i].unit=='Pc' ||
				   data[i].unit=='PIECE' || data[i].unit=='Piece' || data[i].unit=='PIECES' || data[i].unit=='Pieces'  ||
				   data[i].unit=='pieces' || data[i].unit=='PCS' || data[i].unit=='Pcs'|| data[i].unit=='pcs') {
					
					qty_pcs = parseInt(data[i].quantity);
				
				} else { qty_cs = parseInt(data[i].quantity); }
				
				structured_data.push({
					'transaction':'return',
					'remote_id': data[i].internalid,
					'customername': data[i].customer,
					'customer': data[i].customer_code,
					'customerid': data[i].customerid,
					'date': dateformat.getFullYear()+'-'+(dateformat.getMonth()+1)+'-'+dateformat.getDate(),
					'location': data[i].location,
					'principal': data[i].principal,
					'warehouse':'WH',
					'return_type':return_type,
					'docref': data[i].tranid || data[i].docref,
					'order_lines': [{
						'product': data[i].itemcode || data[i].product,
						'qty_cas': parseInt(qty_cs),
						'qty_pcs': parseInt(qty_pcs),
						'free':false,
						'reason': data[i].reason
					}]
				});
			}
		}
		
		
		for(var i in structured_data) {
			if(/FS/i.test(structured_data[i].principal)) {				
				/** DMPI FS **/
				if(/PAK/i.test(structured_data[i].location)) { PAK_DATA_FS.push(structured_data[i]); }
			} else {
				/** DMPI GT **/
				if(/PAK/i.test(structured_data[i].location)) {
					PAK_DATA_GT.push(structured_data[i]);	
				} else if (/TAC/i.test(structured_data[i].location)) {
					TAC_DATA_GT.push(structured_data[i]);
				} else {
					CAL_DATA_GT.push(structured_data[i]);
				}
			}
		}
		
		return {
			'PAK_DATA_FS' : {'transactions': PAK_DATA_FS}, 'PAK_DATA_GT' : {'transactions': PAK_DATA_GT},
			'TAC_DATA_GT' : {'transactions': TAC_DATA_GT}, 'CAL_DATA_GT' : {'transactions': CAL_DATA_GT}
		};
	};

	this.REUPLOAD_BEFORE_SEND_ERRORS_IRAS = function() {
		var filter = new nlobjSearchFilter('internalid', null, 'is', 1333);
		var column = new nlobjSearchColumn('internalid','file');
		var error_files = nlapiSearchRecord('folder', null , filter , column);
		
		if(error_files[0].getValue('internalid','file')!='') {
			for(var i in error_files) {
				var load_error_file = nlapiLoadFile(error_files[i].getValue('internalid','file'));
				var filename = load_error_file.getName();
				invoices = JSON.parse(load_error_file.getValue());
				
				if(invoices.length != 0) {
					validated_data = this.VALIDATE_IRA_DATA(invoices);
					
					if(validated_data.error_data.length != 0) {
										
						/** SEND EMAIL TO THE ADMINISTRATORS **/
//							this.SEND_EMAIL_TO_ADMINISTRATOR(validated_data.csvdata_error);
							this.SET_MESSAGE(validated_data.csvdata_error);
						/** END **/
						
//						var file = nlapiCreateFile(filename, 'PLAINTEXT', JSON.stringify(validated_data.error_data));
//						file.setFolder(1333); //ERROR STORAGE FOLDER
//						nlapiSubmitFile(file);
					} else { nlapiDeleteFile(error_files[i].getValue('internalid','file')); }
				
					if(validated_data.data_to_be_send.length != 0) {
						
						this.BACKUP_SENT_DATA_IRA(validated_data.csvdata_backup);
						
						data = this.RESTRUCTURE_IRA_DATA(validated_data.data_to_be_send);
						
				        /** PAKNAAN FS **/
						if(data.PAK_DATA_FS.transactions.length != 0) { this.SEND_DATA_IRA('paknaan_fs', data.PAK_DATA_FS); }
						
						/** PAKNAAN GT **/
						if(data.PAK_DATA_GT.transactions.length != 0) { this.SEND_DATA_IRA('paknaan_gt', data.PAK_DATA_GT); }
						
						/** TACLOBAN GT **/
						if(data.TAC_DATA_GT.transactions.length != 0) { this.SEND_DATA_IRA('tacloban_gt', data.TAC_DATA_GT); }
						
						/** CALBAYOG GT **/
						if(data.CAL_DATA_GT.transactions.length != 0) { this.SEND_DATA_IRA('calbayog_gt', data.CAL_DATA_GT); }
					
						this.BACKUP_ERROR_DATA_INVOICE(filename);
					}
				} else { nlapiDeleteFile(error_files[i].getValue('internalid','file')); }
			}
			this.SEND_EMAIL_TO_ADMINISTRATOR(this.GET_MESSAGE());
		}
	
	};
	
	this.SEND_DATA_IRA = function(branch, data) {
		try {
			var url_link = this.URL_LINKS_IRA(branch);
			var response = nlapiRequestURL(url_link, JSON.stringify(data), this.HTTP_HEADERS(), null,null);
			var error_response = JSON.parse(response.getBody()).result.fail;
			//var csvdata_error = "remarks, internalid, customer name, customer code, trandate, externalinvoice\n";
			var csvdata_error = "";
			var error_object = [];
			
	        /** HANDLE RETURNED ERROR DATA **/
			if(error_response.length != 0) {
				/** BUILD CSV ERROR DATA **/
				for(var i in error_response) {
					for(var j in  data.transactions) {
						if(error_response[i].remote_id == data.transactions[j].remote_id) {
							var duplicate_flag = 0;
							var error_message = '';
							
							for(var err in error_response[i].errors) {
								if(/Duplicate/i.test(error_response[i].errors[err])) {
									duplicate_flag = 1; 
									break;
								} else { error_message += error_response[i].errors[err]; }
							}
							
							if(duplicate_flag == 0) {
								/** ERROR OBJECT **/
								//error_object.push(data.transactions[j]);
								
								this.SET_ERROR_OBJECTS({
									'transaction':'return',
									'remote_id': data.transactions[j].remote_id,
									'customername': data.transactions[j].customername,
									'customer': data.transactions[j].customername,
									'customer_code': data.transactions[j].customer_code,
									'customerid': data.transactions[j].customerid,
									'date': data.transactions[j].date,
									'location': data.transactions[j].location,
									'principal': data.transactions[j].principal,
									'docref': data.transactions[j].docref,
									'order_lines': data.transactions[j].order_lines
								});
																
								/** CSV FORMAT **/
								csvdata_error += error_message+',';
								csvdata_error += data.transactions[j].remote_id+',';
								csvdata_error += data.transactions[j].customername+',';
								csvdata_error += data.transactions[j].customer+',';
								csvdata_error += data.transactions[j].date+',';
								csvdata_error += data.transactions[j].docref+'\n';
							}
							break;
						}
					}
				}
			}
//			if(error_object.length != 0) {	
				/** SEND EMAIL TO THE ADMINISTRATORS **/
					//this.SEND_EMAIL_TO_ADMINISTRATOR(csvdata_error);
					this.SET_MESSAGE(csvdata_error);
				/** END **/
//			}
		} catch(err) { nlapiLogExecution('ERROR', 'EXCEPTIONS', err.message); };
	};
	
	this.URL_LINKS_IRA = function (branch) {		
		/** LINKS FOR THE PRODUCTION **/
		var branchlinks = {
		    'paknaan_fs':'https://syncserver.delmontecsg.com:38071/dmpi/rest/drx_ceb_fs_live_sync/returns',
		    'paknaan_gt':'https://syncserver.delmontecsg.com:38071/dmpi/rest/drx_ceb_gr_live_sync/returns',
		    'tacloban_gt':'https://syncserver.delmontecsg.com:38071/dmpi/rest/dnx_tac_gr_live_sync/returns',
		    'calbayog_gt':'https://syncserver.delmontecsg.com:38071/dmpi/rest/dnx_cal_gr_live_sync/returns'
		};
		return branchlinks[branch];
	};

	this.TEST_SEND_DATA = function(data) {
		var date = new Date();
		date.setHours(date.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
		date.setMinutes(date.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
		var filename = (date.getMonth()+1)+''+date.getDate()+''+date.getFullYear();
		var num_exist_filename = 0;
		var regexx = "";
		regexx = new RegExp(filename, "i");
		
		/** get filenames in the AFTER SEND ERROR FOLDER **/
		
		var filter = new nlobjSearchFilter('internalid', null, 'is', 1335);
		var columns = [ new nlobjSearchColumn('name', 'file'), new nlobjSearchColumn('internalid', 'file') ];
		
		var searchResult = nlapiSearchRecord('folder', null , filter, columns);
		if(searchResult != null) {
			for (var i in searchResult) {
				if(regexx.test(searchResult[i].getValue('name','file'))) num_exist_filename += 1;
			};
		}
		
		filename += '_'+num_exist_filename;
		
		var save_file = nlapiCreateFile(filename, 'PLAINTEXT', JSON.stringify(data));
		save_file.setFolder(1335);
		nlapiSubmitFile(save_file);
	};
};

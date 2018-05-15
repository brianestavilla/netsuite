function printCheck(request, response){
	var voucherId = request.getParameter("internalId");
	var layout = request.getParameter("layout");
	var formtype = request.getParameter("formtype");
	var bankname = request.getParameter("bank");
	nlapiSubmitField('vendorpayment', voucherId, 'custbody190', 'T');
	//edited by dem:
	//wrong cvno pulled. cvno = voucherId;
	cvno = nlapiLookupField('vendorpayment',voucherId,'tranid');;

	if(bankname == '4') {
		var html = nlapiGetContext().getSetting('SCRIPT', 'custscript7');
	} else {
		var html = nlapiGetContext().getSetting('SCRIPT', 'custscript11');
	}
	
	var printRecord = (formtype == 'vendorpayment') ? nlapiLoadRecord('vendorpayment', voucherId) :  nlapiLoadRecord('check', voucherId);
	var amount = (printRecord.getFieldValue('usertotal') == null) ? printRecord.getFieldValue('total') : printRecord.getFieldValue('usertotal');
	
	
	//edited by dem. 03/21/14
	var verifyvend = printRecord.getFieldValue('entity');
	var asddi = printRecord.getFieldValue('custbody203');
	if(verifyvend != '723'){
		if(asddi == 'T'){ 
			var vendor = nlapiLoadRecord('vendor', '25209');
		}else{
			var vendor = nlapiLoadRecord('vendor', verifyvend);
		}
	}else{
		var vendor = nlapiLoadRecord('vendor', '25209');
	}
	//var vendor = nlapiLoadRecord('vendor', printRecord.getFieldValue('entity'));
	
	var vendorType = vendor.getFieldValue('isperson');
	var companyName = '';
	
	companyName = vendor.getFieldValue('legalname'); // added by brian 9/16/2016

	//commented by brian 9/16/2016
	// if(vendorType != 'T'){ // if not a person or is a company
		// companyName = vendor.getFieldValue('companyname');
	// }else{ // if person or not a company
		// companyName = vendor.getFieldValue('entityid');
	// }
	
	words = toWords(amount);
	html = html.replace('{checkNo}', (printRecord.getFieldValue('custscript7') == null)? '' : printRecord.getFieldValue('custscript7'));
	html = html.replace("{amountInWords}", words);
	html = html.replace("{cdate}",(printRecord.getFieldValue('custbody61') == null) ? '' : nlapiStringToDate(printRecord.getFieldValue('custbody61')).toLocaleDateString());
	html = html.replace("{companyName}", companyName);
	html = html.replace("{amountinPHP}", addCommas(amount));
	//html = html.replace('{cvno}', cvno);
	html = replaceall(html, '&', '&amp;');
	//response.write(html);
	
	/*if(words.length > 50) {
		html = html.replace('font-size: 12px;', 'font-size: 9px;');
	}*/
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', printRecord + '.pdf', 'inline');
	response.write(file.getValue());
 }

 function replaceall(str, replace, with_this) {
    var str_hasil = "";
    var temp;
    for(var i = 0; i < str.length; i++) {
        if (str[i] == replace) {
            temp = with_this;
        }
        else {
			temp = str[i];
        }
        str_hasil += temp;
    }
    return str_hasil;
}
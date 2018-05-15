/*
	Modified :
		Date : Oct. 22, 2013.
			* Pag bato ug date sa standard.
*/
function afterSubmit() {
	if (type == 'create') {
		var newRecord = nlapiGetNewRecord(),
			internalID = newRecord.getId();
		
		dept = newRecord.getFieldValue('custrecord651');
		principal = newRecord.getFieldValue('custrecord652');
		loc = newRecord.getFieldValue('custrecord653');
		orNo = newRecord.getFieldValue('custrecord822');
		cashamount = parseFloat(newRecord.getFieldValue('custrecord761')); //cash tab
		//bankcategory = newRecord.getFieldValue('custrecord800');
		memo = newRecord.getFieldValue('custrecord650'); // get memo
		date = newRecord.getFieldValue('custrecord648'); // get date
		
		subID = 'recmachcustrecord667'; //apply tab
		subIDcheck = 'recmachcustrecord765'; // check tab
		subApply = 'apply';
		linecount = newRecord.getLineItemCount(subID); // line item count in apply tab
		linecountcheck = newRecord.getLineItemCount(subIDcheck); // line item count in check tab
		
		ctr = 1;
		ctrCheck = 1;
		ctrCheckArray = 0;
		checkamount = [];
		checknum = [];
		bankact = [];
		bankbranch = [];
		duedate = [];
		bankcat = [];
		
		for (i = 1; i <= linecountcheck; i++) {
			checkamount[ctrCheckArray] = parseFloat(newRecord.getLineItemValue(subIDcheck, 'custrecord764', i));
			bankcat[ctrCheckArray] = newRecord.getLineItemValue(subIDcheck, 'custrecord821', i);
			checknum[ctrCheckArray] = newRecord.getLineItemValue(subIDcheck, 'custrecord762', i);
			bankact[ctrCheckArray] = newRecord.getLineItemValue(subIDcheck, 'custrecord763', i);
			bankbranch[ctrCheckArray] = newRecord.getLineItemValue(subIDcheck, 'custrecord799', i);
			duedate[ctrCheckArray] = newRecord.getLineItemValue(subIDcheck, 'custrecord798', i);
			ctrCheckArray++;
		}
		
		while (ctr <= linecount) {
			apply = newRecord.getLineItemValue(subID, 'custrecord655', ctr); // get checkbox that has been checked in apply tab
			if (apply == 'T') { // if apply is checked.
				payment = parseFloat(newRecord.getLineItemValue(subID, 'custrecord760', ctr)); // get Payment Per Line Item
				
				outerLoop:
				while (true) {
					if (payment != 0) { // if payment is not equal to zero per line item
						ref = newRecord.getLineItemValue(subID, 'custrecord659', ctr); // ref. of invoice transaction
						salesRep = newRecord.getLineItemValue(subID, 'custrecord850', ctr); // sales rep
						
						if (cashamount != 0) {
							cashTransform = nlapiTransformRecord('invoice', ref, 'customerpayment');
							cashTransform.setFieldValue('customform', '123');
							cashTransform.setFieldValue('department', dept);
							cashTransform.setFieldValue('class', principal);
							cashTransform.setFieldValue('location', loc);
							cashTransform.setFieldValue('undepfunds', 'T');
							cashTransform.setFieldValue('paymentmethod', 1);
							cashTransform.setFieldValue('custbody150', orNo);
							cashTransform.setFieldValue('memo', memo);
							cashTransform.setFieldValue('trandate', date);
							cashTransform.setFieldValue('custbody186', salesRep);
							
							cashTransform.selectNewLineItem(subApply);
							if (cashamount >= payment) {
								cashTransform.setCurrentLineItemValue(subApply, 'amount', payment);
								cashamount = cashamount - payment;
								//cashTransform.setFieldValue('memo', cashamount);
								cashTransform.commitLineItem(subApply);
								
								cashTransform.setFieldValue('custbody136', internalID);
								
								idCashPay = nlapiSubmitRecord(cashTransform, null, true);
								payment = 0;
								break outerLoop;
							} else {
								cashTransform.setCurrentLineItemValue(subApply, 'amount', cashamount);
								cashTransform.commitLineItem(subApply);
								
								payment = payment - cashamount;
								
								//cashTransform.setFieldValue('memo', payment);
								
								cashTransform.setFieldValue('custbody136', internalID);
								
								idCashPay = nlapiSubmitRecord(cashTransform, null, true);
								cashamount = 0;
							}
							
						} else {
							if (ctrCheck <= linecountcheck) {
								while (ctrCheck <= linecountcheck) {
									
									innerLoop:
									while (true) {
										if (payment != 0 || payment != 0.00) {
											if (parseFloat(checkamount[ctrCheck - 1]) != 0) {
												checkTransform = nlapiTransformRecord('invoice', ref, 'customerpayment');
												checkTransform.setFieldValue('customform', '123');
												checkTransform.setFieldValue('department', dept);
												checkTransform.setFieldValue('class', principal);
												checkTransform.setFieldValue('location', loc);
												checkTransform.setFieldValue('undepfunds', 'T');
												checkTransform.setFieldValue('paymentmethod', 2);
												checkTransform.setFieldValue('custbody150', orNo);
												checkTransform.setFieldValue('memo', memo);
												checkTransform.setFieldValue('trandate', date);
												checkTransform.setFieldValue('custbody186', salesRep);
												
												checkTransform.selectNewLineItem(subApply);
												if (parseFloat(checkamount[ctrCheck - 1]) >= payment) {
													
													checkTransform.setFieldValue('custbody1', bankact[ctrCheck - 1]);
													checkTransform.setFieldValue('custbody141', checknum[ctrCheck - 1]);
													checkTransform.setFieldValue('custbody174', bankcat[ctrCheck - 1]); // bank category
													
													checkTransform.setCurrentLineItemValue(subApply, 'amount', payment);
													
													checkamount[ctrCheck - 1] = parseFloat(checkamount[ctrCheck - 1]) - payment;
													//checkTransform.setFieldValue('memo', checkamount[ctrCheck - 1]);
													checkTransform.commitLineItem(subApply);
													
													checkTransform.setFieldValue('custbody136', internalID);
													
                                                    checkTransform.setFieldValue('custbody173', bankbranch[ctrCheck - 1]);
													checkTransform.setFieldValue('custbody185', duedate[ctrCheck - 1]);
													
													
													idCashPay = nlapiSubmitRecord(checkTransform,null, true);
													payment = 0;
													
													if (checkamount[ctrCheck - 1] == 0 && payment == 0) {
														ctrCheck++;
														break outerLoop;
													}
													
													break outerLoop;
												} else {
													checkTransform.setFieldValue('custbody1', bankact[ctrCheck - 1]);
													checkTransform.setFieldValue('custbody141', checknum[ctrCheck - 1]);
													checkTransform.setFieldValue('custbody174', bankcat[ctrCheck - 1]); // bank category
													
													checkTransform.setCurrentLineItemValue(subApply, 'amount', checkamount[ctrCheck - 1]);
													checkTransform.commitLineItem(subApply);
													
													payment = payment - checkamount[ctrCheck - 1];
													
													//checkTransform.setFieldValue('memo', payment);
													checkTransform.setFieldValue('custbody136', internalID);
													
                                                    checkTransform.setFieldValue('custbody173', bankbranch[ctrCheck - 1]);
													checkTransform.setFieldValue('custbody185', duedate[ctrCheck - 1]);
													
													idCashPay = nlapiSubmitRecord(checkTransform,null, true);
													checkamount[ctrCheck - 1] = 0;
													
													if (checkamount[ctrCheck - 1] == 0 && payment == 0) {
														ctrCheck++;
														break outerLoop;
													}
													
													if (payment != 0) {
														ctrCheck++;
													}
												}
											} else {
												ctrCheck++;
												break innerLoop;
											}
											
										} else {
											break outerLoop;
										}
									}
									ctrCheck++;
								}
							}
						}
					}
				}
			}
			ctr++;
		}
	}
}
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Jan 2018     DRANIX_JOHN
 *
 */

/**
 * @returns {Void} Any or no return value
 */
function TransDate() {
	var record = nlapiGetNewRecord();
  	var vendbillID = record.getId();
  	var nxtAprvr = record.getFieldValue('custbody17');
    var docdate = record.getFieldValue('trandate');
  	var todaysdate = new Date();
  	todaysdate.setHours(todaysdate.getHours() + 16);
  	todaysdate.setMinutes(todaysdate.getMinutes()+ 2);
      var transdate = new Date(docdate);
  	var tdate = (todaysdate.getMonth() + 1) + ' ' + todaysdate.getFullYear();
    var formttransdate =  (transdate.getMonth() + 1) + ' ' + transdate.getFullYear();

    if(nxtAprvr=='1031') { // 1031 = BFM role;
        if(transdate.getMonth()+1 < todaysdate.getMonth()+1 && transdate.getFullYear() <= todaysdate.getFullYear() && todaysdate.getDate() > 6) {
            var date = new Date(todaysdate.setDate(todaysdate.getDate()));
            record.setFieldValue('trandate', date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear());
        } else { record.setFieldValue('trandate', transdate.getMonth()+1+'/'+transdate.getDate()+'/'+transdate.getFullYear()); }
    }
}

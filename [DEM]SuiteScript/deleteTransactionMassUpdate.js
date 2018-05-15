/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 May 2014     Redemptor
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {
	nlapiDeleteRecord(recType, recId);
}

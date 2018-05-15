/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Mar 2018     brian
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduledReupload(type) {
	var integration = new INTEGRATION_API();
	integration.REUPLOAD_BEFORE_SEND_ERRORS_INVOICES();
	integration.REUPLOAD_BEFORE_SEND_ERRORS_IRAS();
}

function scheduledReuploadInvoice(type) {
	var integration = new INTEGRATION_API();
	integration.REUPLOAD_BEFORE_SEND_ERRORS_INVOICES();
}

function scheduledReuploadIRA(type) {
	var integration = new INTEGRATION_API();
	integration.REUPLOAD_BEFORE_SEND_ERRORS_IRAS();
}
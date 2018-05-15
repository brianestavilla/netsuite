/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Jan 2018     brian
 *
 */

function scheduledIntegration(type) {
	var integration = new INTEGRATION_API();
	integration.GET_INVOICES();
	integration.GET_IRAS();
}

function scheduledIntegrationInvoice(type) {
  var integration = new INTEGRATION_API();
  integration.GET_INVOICES();
}

function scheduledIntegrationIRA(type) {
  var integration = new INTEGRATION_API();
  integration.GET_IRAS();
}
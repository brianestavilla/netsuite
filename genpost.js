	function suitelet(request, response){
			if ( request.getMethod() == 'GET' ){
				var form = nlapiCreateForm('Generate Post Dated Checks for Advance Deposit');
				form.addSubmitButton('Preview');
				var htm = 'ENTER TRANSACTION DATE'
			
				var H1 = form.setTitle(htm);
				var fromdate = form.addField('custpagefrom','date', 'AS OF : ');
				//var todate =  form.addField('custpageto','date', 'To : ');
				
			
				nlapiGetContext().setSessionObject('status', 'get');
				response.writePage(form);
			}else
			{
				var context = nlapiGetContext(),
				form = nlapiCreateForm('Post Dated Checks for Advance Deposit Preview');
				if(context.getSessionObject('status') == 'get'){
					fromview = request.getParameter('custpagefrom');
					//toview = request.getParameter('custpageto');
				
					
																					
					var sublist_results = form.addSubList('custpage_results','list','Results');
					sublist_results.addRefreshButton();
					sublist_results.addField('custpagea','text','Record Value',null);
					sublist_results.addField('custpageb','text','Subscriber Name',null);
					sublist_results.addField('custpagec','text','Subscriber Number',null);
					sublist_results.addField('custpaged','text','Reference Number',null);
					sublist_results.addField('custpagee','text','Check Amount',null);
					sublist_results.addField('custpagef','date','Check Date',null);
					sublist_results.addField('custpageg','date','Check Posting Date',null);
					sublist_results.addField('custpageh','text','Check Number',null);
					sublist_results.addField('custpagei','text','Drawee Bank',null);
					sublist_results.addField('custpagej','text','BRSTN',null);
					sublist_results.addField('custpagek','text','Field 1',null);
					sublist_results.addField('custpagel','text','Field 2',null);
					sublist_results.addField('custpagem','text','Field 3',null);
					sublist_results.addField('custpagen','text','Field 4',null);
					sublist_results.addField('custpageo','text','Field 5',null);
					sublist_results.addField('custpagep','text','Field 6',null);
					sublist_results.addField('custpageq','text','Field 7',null);
					sublist_results.addField('custpager','text','Field 8',null);
					sublist_results.addField('custpages','text','Field 9',null);
					sublist_results.addField('custpaget','text','Field 10',null);
					sublist_results.addField('custpageu','text','Filler',null);
					sublist_results.addField('custpagev','text','FileControlNumber',null);		
					
				
							
				filteractual = [
							//new nlobjSearchFilter('custbody185', null, 'within', fromview,toview)
							new nlobjSearchFilter('trandate', null,'on',fromview),
							new nlobjSearchFilter('custbody61', null, 'notonorbefore',fromview)
							//new nlobjSearchFilter('trandate', null, 'notafter',toview),
							//new nlobjSearchFilter('custbody61',null,'notonorbefore',toview)
						],	
						
				//var resultsq = nlapiSearchRecord('transaction','customsearch1151',filteractual,null); deposit 
				//resultsq = nlapiSearchRecord('transaction','customsearch1162',filteractual,null); //cust depo
				resultsq = nlapiSearchRecord('transaction','customsearch1338',filteractual,null); //depo only cust
				
				if(resultsq != null){
						form.addSubmitButton('Export');
						var tsk = 1;
					    var totcheck = 0.00;
						var ref = '';
						for(var ups = 0; ups < resultsq.length; ups++){
							
							sublist_results.setLineItemValue('custpagea',ups+tsk,'H');
							
							var subsname = resultsq[ups].getText('name','appliedtotransaction','GROUP');
							sublist_results.setLineItemValue('custpageb',ups+tsk,subsname);
							
							
							sublist_results.setLineItemValue('custpagec',ups+tsk,'');
							
							var subsno = resultsq[ups].getValue('custbody150','appliedtotransaction','GROUP');
							sublist_results.setLineItemValue('custpaged',ups+tsk,subsno);
							
							var amnt = resultsq[ups].getValue('amount','appliedtotransaction','SUM');
							sublist_results.setLineItemValue('custpagee',ups+tsk,amnt);
							
							var duedate = resultsq[ups].getValue('custbody61','appliedtotransaction','GROUP');
							sublist_results.setLineItemValue('custpagef',ups+tsk,duedate);
							sublist_results.setLineItemValue('custpageg',ups+tsk,duedate);
							
							
							var cheque = resultsq[ups].getValue('custbody141','appliedtotransaction','GROUP');
							sublist_results.setLineItemValue('custpageh',ups+tsk,cheque);
							
							var bbranch = resultsq[ups].getText('custbody173','appliedtotransaction','GROUP');
							sublist_results.setLineItemValue('custpagei',ups+tsk,bbranch);
							
							//ref = resultsq[ups].getValue('formulatext',null,'GROUP');
							sublist_results.setLineItemValue('custpagev',ups+tsk,'PDC'+fromview.replace(/\//gi,''));
							totcheck += parseFloat(amnt);
						}
						var totline = sublist_results.getLineItemCount() + tsk;
						sublist_results.setLineItemValue('custpagea',totline,'S');
						sublist_results.setLineItemValue('custpageb',totline,'PDC'+fromview.replace(/\//gi,''));
						sublist_results.setLineItemValue('custpagec',totline,sublist_results.getLineItemCount()-1);
						sublist_results.setLineItemValue('custpaged',totline,parseFloat(totcheck).toFixed(2));
						sublist_results.setLineItemValue('custpagee',totline,'PDC'+fromview.replace(/\//gi,''));						
				}
		
				
				nlapiGetContext().setSessionObject('status', 'post');
				response.writePage(form);
				}else{		
					var linesublist = request.getLineItemCount('custpage_results');	
					var refd = request.getLineItemValue('custpage_results', 'custpagev', 1)||'';					
					var data = '';
					for(var iv = 1; iv <= linesublist; iv++) {
						var a = request.getLineItemValue('custpage_results', 'custpagea', iv)||'',
						b = request.getLineItemValue('custpage_results', 'custpageb', iv)||'',
						c = request.getLineItemValue('custpage_results', 'custpagec', iv)||'',
						d = request.getLineItemValue('custpage_results', 'custpaged', iv)||'',
						e = request.getLineItemValue('custpage_results', 'custpagee', iv)||'',
						f = request.getLineItemValue('custpage_results', 'custpagef', iv)||'',
						g = request.getLineItemValue('custpage_results', 'custpageg', iv)||'',
						h = request.getLineItemValue('custpage_results', 'custpageh', iv)||'',
						i = request.getLineItemValue('custpage_results', 'custpagei', iv)||'',
						j = request.getLineItemValue('custpage_results', 'custpagej', iv)||'',
						k = request.getLineItemValue('custpage_results', 'custpagek', iv)||'',
						l = request.getLineItemValue('custpage_results', 'custpagel', iv)||'',
						m = request.getLineItemValue('custpage_results', 'custpagem', iv)||'',
						n = request.getLineItemValue('custpage_results', 'custpagen', iv)||'',
						o = request.getLineItemValue('custpage_results', 'custpageo', iv)||'',
						p = request.getLineItemValue('custpage_results', 'custpagep', iv)||'',
						q = request.getLineItemValue('custpage_results', 'custpageq', iv)||'',
						r = request.getLineItemValue('custpage_results', 'custpager', iv)||'',
						s = request.getLineItemValue('custpage_results', 'custpages', iv)||'',
						t = request.getLineItemValue('custpage_results', 'custpaget', iv)||'',
						u = request.getLineItemValue('custpage_results', 'custpageu', iv)||'';
						v = request.getLineItemValue('custpage_results', 'custpagev', iv)||'';
						
						
						
						
						data += [a,b.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''),
								 c,d,e,f,g,h,i.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,''),
								 j,k,l,m,n,o,p,q,r,s,t,u,v+'\r\n'];
					}		
					var refrep = refd.replace(/\//gi,'');
					var objFile = nlapiCreateFile((refrep+".csv"), 'CSV', data);
					objFile.setFolder(132);
					var id = nlapiSubmitFile(objFile);
					var file = nlapiLoadFile(id);
					var url = file.getURL();
	
					//var username = 'pcFtp';
					//var userpass = 'pc1@1@Ftp';
					//var file = encodeURIComponent("https://system.na1.netsuite.com/c.TSTDRV1215639/suitebundle39858/test.csv");
				
					//var file = encodeURI("D:/sample1.txt");
					var inlineText = '<iframe src="'+ url + '" width="0" height="0"> </iframe>';		
					//nlapiRequestURL('http://asset.goldenkaizen.com/uploadftp/'+file);
					wew = '<html><h1>' + inlineText + '</h1><a href= '+ nlapiResolveURL('SUITELET','customscript563','customdeploy1',false) +'>BACK <br/></a> <body>SUCCESSFULLY EXPORTED!</body></html>';
					nlapiLogExecution("DEBUG", "SSS", file);
					
					response.write(wew);
				}
		}
	}
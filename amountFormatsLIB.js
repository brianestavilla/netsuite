function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
var th = ['','Thousand','Million', 'Billion','Trillion'];
var dg = ['Zero','One','Two','Three','Four', 'Five','Six','Seven','Eight','Nine']; var tn = ['Ten','Eleven','Twelve','Thirteen', 'Fourteen','Fifteen','Sixteen', 'Seventeen','Eighteen','Nineteen']; var tw = ['Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
function toWords(s){
	s = s.toString(); 
	s = s.replace(/[\, ]/g,''); 
	if (s != parseFloat(s)) return 'not a number'; 
	var x = s.indexOf('.'); 
	if (x == -1) x = s.length; 
	if (x > 15) return 'too big';
	var n = s.split(''); 
	var str = ''; 
	var sk = 0; 
	for (var i=0; i < x; i++) {
		if ((x-i)%3==2) {
			if (n[i] == '1') {
				str += tn[Number(n[i+1])] + ' '; i++; sk=1;
			} else if (n[i]!=0) {
				str += tw[n[i]-2] + ' ';sk=1;
			}
		} else if (n[i]!=0) {
			str += dg[n[i]] +' '; 
			if ((x-i)%3==0) str += 'hundred ';sk=1;
		} 
		if ((x-i)%3==1) {
			if (sk) str += th[(x-i-1)/3] + ' ';sk=0;
		}
	}
  	str+="pesos ";
	if (x != s.length) {
		var y = s.length;
		o = s.substring(x+1);
		u = parseInt(o);
		if(o > 0){
			str += 'and ';
			str += o + "/100";
		}
		
	} 
        str+=" only";
	return str.toUpperCase().replace(/\s+/g,' ');
}
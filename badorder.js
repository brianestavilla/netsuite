function boInteface(request, response)
{
	var html='<html>';
	html+='<body>';
	html+='<h1>Bad Order Receiving</h1>';
	html+='<div>'
	html+='<table width="900px" border ="1">';
	html+='<tr>'; //row1	
	html+='<th>Barcode</th>';//Barcode
	html+='<th>Units</th>';//Units
	html+='<th>Quantity</th>';//Quantity
	html+='</tr>';

	html+='<tr  contenteditable="true">';//row2
	html+='<td>123456</td>';
	html+='<td>CASE</td>';
	html+='<td>9</td>';
	html+='</tr>';

	html+='<tr  contenteditable="true">';//row3
	html+='<td>23423423</td>';
	html+='<td>PCS</td>';
	html+='<td>3</td>';
	html+='</tr>';

	html+='</table>';

	html+='</div>';
	html+='</body>';
	html+='</html>';
	response.write(html);
	response.setHeader('Custom-Header-Demo','Demo');

}
function addCommas(str){
   var arr,int,dec;
   str += '';

   arr = str.split('.');
   int = arr[0] + '';
   dec = arr.length>1?'.'+arr[1]:'';

   return int.replace(/(\d)(?=(\d{3})+$)/g,"$1,") + dec;
}
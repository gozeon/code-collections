var arr1 = [];
var arr2 = [1,3,4,5,6,7,8,10,11];
var arr3 = [];

for(var i=0; i<arr2.length;i++)
{
	if(arr2[i+1]-arr2[i] ==1)
	{
		arr1.push(arr2[i]);
		arr1.push(arr2[i+1]);
	}
}
for(var i=0; i<arr1.length;i++)
{
	if(arr1[i]==arr1[i+1])
	{
		arr1.splice(i+1,1);
	}
}
for(var i=0; i<arr1.length;i++)
{
	if(arr2[i+1]-arr1[i] !=1)
	{
		arr1.push(arr1[i]);
		arr1.push(arr1[i+1]);
	}
}
console.log(arr1);

var arr1 = [1,3,4,5,6,7,8,10,11];
var arr2 = [];
var arr3 = [];
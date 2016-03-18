
function contacts(request, response){
try {

	var result;
	
	result = ds.PNJ.all();

	return JSON.stringify(result);	
} catch(err) { console.log('test --> ' + err.message); }
}




function test(request, response){
try {

	var result;
	
	return JSON.stringify(result);	
} catch(err) { console.log('test --> ' + err.message); }
}


//dialogs = ds.Event.find('ID==2').dialogs;
//dialogsArray = dialogs.toArray();

//expandedDialogs = [];
//for (var i=0 ; i<dialogs.length ; i++) {
//	expandedDialogs[i] = dialogsArray[i]

//	if(dialogs[i].questions){
//		var questions = dialogs[i].questions;
//		expandedDialogs[i].questions =  questions.toArray();
// 
//		var answers = questions.answers;
//		expandedDialogs[i].answers =  answers.toArray();

//	}
//	

//};

//expandedDialogs[1]


a = ds.PNJ.all()

a.forEach(function (pnj){
	

pnj.title= "President and CEO"
pnj.cellPhone= "617-000-0001"
pnj.email= "jking@fakemail.com"
pnj.city= "Boston, MA"

	pnj.save();
});	
	
ds.Scene.remove();
ds.Character.remove();
ds.InOut.remove();
ds.Scenario.remove();


var scenarioFile = ds.getModelFolder().path + 'scenario.csv';

var mystream = new TextStream(scenarioFile,"Read",-2);
var row = "";

var scenario = new ds.Scenario();
scenario.title ="Serlock Holmes";
scenario.level = 1;
scenario.save();

do { 
    row = mystream.read(''); 
    cells = row.split(";")
    
    var scene = new ds.Scene(); 
    scene.ID		= cells[0];
    scene.scriptID	= cells[0];
    scene.scenario = scenario;

    scene.script	= cells[1];
        
    if (cells[23] != '') scene.clues		= { 'id' : cells[23].replace(/^\s+|\s+$/g, '') };
    if (cells[24] != '') scene.deduction	= { 'id' : cells[24].replace(/^\s+|\s+$/g, '') };
    if (cells[25] != '') scene.decision		= { 'id' : cells[25].replace(/^\s+|\s+$/g, '') };
    if (cells[26] != '') scene.question		= { 'id' : cells[26].replace(/^\s+|\s+$/g, '') };
    if (cells[27] != '') {
    
    	if (parseInt(cells[27])>0) {
    		scene.goto = cells[27].replace(/^\s+|\s+$/g, '');
    	} else {
    		scene.gotoInterrogatory	= true;
    	}
    } 
    
    if (cells[28]) scene.dies		= {
    					'aptitude'	: cells[28],
    					'range1'	:	{
    									'min' 	: (cells[29]) ? cells[29].split(' ')[1] : "",
    									'max' 	: (cells[29]) ? cells[29].split(' ')[3] : "",
    									'goto'	: cells[30]
    									},
    					'range2'	:	{
    									'min' 	: (cells[31]) ? cells[31].split(' ')[1] : "",
    									'max' 	: (cells[31]) ? cells[31].split(' ')[3] : "",
    									'goto'	: cells[32]
    									}
    				 };
    
    var choices = []; var empty = true;
    j=1;
    for (i=33 ; i < 52 ; i=i+2) {
		if (cells[i] != '') {
			choices.push({
	    				'proposal'	: cells[i],
	    				'id'		: j++,
	    				'goto'		: cells[i+1].replace(/^\s+|\s+$/g, '')
	    			});
			empty = false;
		}
	    			  
	}
	
	if (!empty) scene.choices = { 'choices' : choices };
	
	scene.save();	
	
    for (i=2 ; i < 22 ; i++) {
    
    	if (cells[i] != "") {	
	    	var character = new ds.Character();
	    	character.scene		= scene;
	    	character.PNJ_ID	= i-1;
	    	
	    	character.save();
	    	
	    	var inout = new ds.InOut();
	    	inout.character	= character;
	    	inout.inTime	= 0;
	    	
	    	inout.save();
	    }	
    }		  
 					  
a=1    				  
    				  
    
} while(mystream.end()==false)

mystream.close();
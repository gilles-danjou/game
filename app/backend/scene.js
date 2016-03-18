
function scene(request, response){
try {

	var nextScene;
	var payload = JSON.parse(request.body);
	//console.log(payload);

	if (payload.sceneID == -1) {
		nextScene = ds.Scene(payload.goto);
	} else {
		
		var currentScene = ds.Scene(payload.sceneID);
		//console.log(scene.actionType)
		switch(currentScene.actionType) {
			
			case 'goto':
				nextScene = ds.Scene(currentScene.goto);
			break;
			
			case 'chance':
				
				dies = Math.floor((Math.random() * 11) + 2);
				if (currentScene.dies.range1.min <= dies && dies <= currentScene.dies.range1.max) {
					nextScene = ds.Scene(currentScene.dies.range1.goto);
				} else if (currentScene.dies.range2.min <= dies && dies <= currentScene.dies.range2.max) {
					nextScene = ds.Scene(currentScene.dies.range2.goto);
				}
			
			break;
			
			case 'choices':
				console.log(currentScene.ID)
				var i=0; var find = false;
				 do {
					if (currentScene.choices.choices[i].id == payload.choice) {
						nextScene = ds.Scene(currentScene.choices.choices[i].goto);
						find = true;
					}
					i++;
				} while (!find)
				
			break;
			
			
		}
		
	}

	return JSON.stringify(nextScene);	
} catch(err) { console.log('scene --> ' + err.message); }

}
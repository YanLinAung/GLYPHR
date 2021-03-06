
//-------------------
// Actions Panel
//-------------------
	function makePanel_Actions(){
		//stack(arguments);

		var content = "<h1>actions</h1><table class='actionsgrid'><tr>";
				
		var s = ss("Update Actions");		
		
		var allactions = "<td><h3>universal</h3>";
			allactions += "<input  class='"+(_UI.charundoq.length>0? "button": "buttondis")+"' type='button' value='Undo" + ((_UI.charundoq.length > 0) ? (" " + _UI.charundoq.length) : "") + "' onclick='pullundoq()'><br>";
			allactions += "<input class='button' type='button' value='add new shape' onclick='addShape();putundoq(\"Add Shape\");redraw(\"updateactions\");'><br>";
			allactions += "<input class='button' type='button' value='add linked shape' onclick='insertLinkedShapeDialog();'><br>";
			allactions += "<input class='"+(_UI.clipboardshape? "button": "buttondis")+"' type='button' value='Paste' onclick='pasteShape();putundoq(\"Paste Shape\");redraw(\"updateactions\");'><br>";
			
			allactions += "</td>";
			
		var shapeactions = "<td><h3>shape</h3>";
			shapeactions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Copy' onclick='copyShape()'><br>";
			shapeactions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Flip Horizontal' onclick='ss().path.flipEW();putundoq(\"Flip Shape Horizontal\");redraw(\"updateactions\");'><br>";
			shapeactions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Flip Vertical' onclick='ss().path.flipNS();putundoq(\"Flip Shape Vertical\");redraw(\"updateactions\");'><br>";
			shapeactions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Delete' onclick='deleteShape();putundoq(\"Delete Shape\");redraw(\"updateactions\");'><br>";

			shapeactions += "</td>";
			
		var layeractions = "<td><h3>layer</h3>";
			layeractions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Move Up' onclick='moveupShape();putundoq(\"Move Shape Layer Up\");'><br>";
			layeractions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Move Down' onclick='movedownShape();putundoq(\"Move Shape Layer Down\");'><br>";
			layeractions += "</td>";
			
		var canvasactions = "<td><h3>editor view</h3>";
			canvasactions += "<input class='button' type='button' value='Toggle Grid' onclick='_UI.showgrid? _UI.showgrid=false : _UI.showgrid=true; redraw(\"updateactions\");'><br>"; 
			canvasactions += "<input class='button' type='button' value='Toggle Guides' onclick='_UI.showguides? _UI.showguides=false : _UI.showguides=true; redraw(\"updateactions\");'><br>"; 
			canvasactions += "</td>";
			
		var pointactions = "<td><h3>path point</h3>";
			pointactions += "<input class='button' type='button' value='Insert' onclick='ss().path.insertPathPoint(); putundoq(\"Insert Path Point\"); redraw(\"updateactions\");'><br>";
			pointactions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Delete' onclick='ss().path.deletePathPoint(); putundoq(\"Delete Path Point\"); redraw(\"updateactions\");'><br>";
			pointactions += "<input class='button' type='button' value='Reset Handles' onclick='ss().path.sp().resetHandles(); putundoq(\"Reset Path Point\"); redraw(\"updateactions\");'><br>";	
			pointactions += "</td>";
		
		// Put it all together

		content += allactions;
		
		if(_UI.shapelayers.length > 0){ content += shapeactions; }
		else { content += "<td> &nbsp; </td>";}
		
		var ispointsel = false;
		if(s && !s.link) ispointsel = s.path.sp(false);
		if(_UI.selectedtool != "pathedit") ispointsel = false;
		
		//debug("UPDATEACTIONS - trying to get selected point, ispointsel = " + ispointsel);
		if(ispointsel){ content += pointactions; }
		else { content += "<td> &nbsp; </td>";}
		
		content += "</tr><tr>";
		
		content += canvasactions;
		
		if(_UI.shapelayers.length > 1){ content += layeractions; }
		
		content += "</td></tr></table><br><br>";
		
		return content;
	}

	function updateLayerActions(){
		//stack(arguments);

		var content = "<h1>actions</h1><table class='actionsgrid'><tr>";
				
		var s = ss("Update Actions");
		var allactions = "<td><h3>shape</h3>";
			allactions += "<input class='button' type='button' value='add new shape' onclick='addShape();putundoq(\"Add Shape\");redraw(\"updateLayerActions\");'><br>";
			allactions += "<input class='button' type='button' value='add linked shape' onclick='insertLinkedShapeDialog();'><br>";
			
		var shapeactions = "<input class='"+(s? "button": "buttondis")+"' type='button' value='Delete' onclick='deleteShape();putundoq(\"Delete Shape\");redraw(\"updateLayerActions\");'><br>";
			
		var layeractions = "<td><h3>layer</h3>";
			layeractions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Move Up' onclick='moveupShape();putundoq(\"Move Shape Layer Up\");'><br>";
			layeractions += "<input class='"+(s? "button": "buttondis")+"' type='button' value='Move Down' onclick='movedownShape();putundoq(\"Move Shape Layer Down\");'><br>";
			layeractions += "</td>";
			
		content += allactions;
		
		if(_UI.shapelayers.length > 0){ content += shapeactions; }
		content += "</td>";
			
		if(_UI.shapelayers.length > 1){ content += layeractions; }
		
		content += "<td> &nbsp; </td></tr></table>";
		
		return content;
	}

//-------------------
// Copy Paste
//-------------------
	function copyShape(){
		//stack(arguments);

		if(_UI.navhere == "linked shapes"){
			_UI.clipboardshape = {
				"s":_GP.linkedshapes[_UI.shownlinkedshape].shape,
				"c":_UI.shownlinkedshape
			};
		} else if (_UI.navhere == "character edit"){
			var s = ss("copy shape");
			if(s.link) s = _GP.linkedshapes[s.link].shape;
			if(s){
				_UI.clipboardshape = {
					"s":s,
					"c":_UI.selectedchar
				};
				//debug("COPYShape() - new clipboard shape: " + _UI.clipboardshape.s.name); 
			}
			redraw("copyShape");
		}
	}
	
	function pasteShape(){
		//stack(arguments);

		if(_UI.clipboardshape){
			var newshape = clone(_UI.clipboardshape.s);
			if(_UI.clipboardshape.c != _UI.selectedchar) newshape.path.updatePathPosition(20,20,true);
			
			var newname = newshape.name;
			var newsuffix = " (copy)";
			var n = newshape.name.lastIndexOf("(copy");
						
			if(n > 0){
				var suffix = newname.substring(n+5);
				newname = newname.substring(0,n);
				if(suffix == ")"){
					newsuffix = "(copy 2)";
				} else {
					//debug("PASTESHAPE - suffix " + suffix);
					suffix = suffix.substring(1);
					//debug("PASTESHAPE - suffix " + suffix);
					suffix = suffix.substring(0, suffix.length-1);
					//debug("PASTESHAPE - suffix " + suffix);
					newsuffix = "(copy " + (parseInt(suffix)+1) + ")";
					//debug("PASTESHAPE - newsuffix " + newsuffix);
				}			
			}
			newshape.name = newname + newsuffix;
			
			if(newshape.link){
				addToUsedIn(newshape.link, _UI.selectedchar);
				//debug("PASTESHAPE - pasted a linkedshape, added " + _UI.selectedchar + " to usedin array.");
			}

			addShape(newshape);
		}
	}


//-------------------
// Move up / down
//-------------------
	function moveupShape(){
		//stack(arguments);

		var s = ss("Move Up Shape");
		
		if(s && (_UI.selectedshape < (_UI.shapelayers.length-1))){
			var tempshape = _UI.shapelayers[_UI.selectedshape+1];
			_UI.shapelayers[_UI.selectedshape+1] = _UI.shapelayers[_UI.selectedshape];
			_UI.shapelayers[_UI.selectedshape] = tempshape;
			_UI.selectedshape++;
			redraw("moveupShape");
		}
	}
	
	function movedownShape(){
		//stack(arguments);

		var s = ss("Move Down Shape");
		
		if(s && (_UI.selectedshape > 0)){
			var tempshape = _UI.shapelayers[_UI.selectedshape-1];
			_UI.shapelayers[_UI.selectedshape-1] = _UI.shapelayers[_UI.selectedshape];
			_UI.shapelayers[_UI.selectedshape] = tempshape;
			_UI.selectedshape--;
			redraw("movedownShape");
		}
	}
	
	
//-------------------
// Generic Spinner Control
//-------------------
	function spinner(){
		//stack(arguments);

		var content ="";
		content += "<input type='button' value='&#9652;' class='button spinnerbutton' onclick='inc(this);'>";  //&and;
		content += "<input type='button' value='&#9662;' class='button spinnerbutton' onclick='dec(this);'>";  //&or;
		return content;
	}
	
	function inc(obj){
		//stack(arguments);

		if(obj.parentNode.childNodes[0]){
			if(isNaN(obj.parentNode.childNodes[0].value)) obj.parentNode.childNodes[0].value = 0;
			obj.parentNode.childNodes[0].value = ((obj.parentNode.childNodes[0].value*1) + _GP.projectsettings.spinnervaluechange);
			obj.parentNode.childNodes[0].onchange();
			//putundoq("Up Spinner");
		}
	}
	
	function dec(obj){
		//stack(arguments);

		if(obj.parentNode.childNodes[0]){
			if(isNaN(obj.parentNode.childNodes[0].value)) obj.parentNode.childNodes[0].value = 0;
			obj.parentNode.childNodes[0].value = ((obj.parentNode.childNodes[0].value*1) - _GP.projectsettings.spinnervaluechange);
			obj.parentNode.childNodes[0].onchange();
			//putundoq("Down Spinner");
		}
	}

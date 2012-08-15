/**
 * Bolstering CSS with dynamic effects, in the most literal sense possible.
 */
!function(mT){
	// Prerequisites.
	if(mT===undefined||mT.version.toFloat()<1.4){
		console.log('Bolster requires at least MooTools 1.4.5');
		return;
	}
	if(mT.More===undefined||mT.More.version.toFloat()<1.2){
		console.log('Bolster requires at least MooTools More 1.2.5');
		return;
	}
	// Initialize plugin.
	window.Bolster={
		version:'', // Version.
		extend:function(property_name,func){ // Add custom properties.
			bolsterfx[property_name]=func;
		}
	};
	// Initialize CSS input object.
	input={
		count:$(document.head).getChildren('link[type="text/css"]').length, // The number of files
		loaded:0, // The counter of loaded files.
		text:''
	};	
	// Get inline CSS.
	$$('style[type="text/css"]').each(function(style){
		input.text+=style.get('html');
	});
	// Get the CSS files.
	$(document.head).getChildren('link[type="text/css"]').each(function(link){
		new Request({
			url:link.get('href'),
			onSuccess:function(response){
				input.text+=response;
				input.loaded++;
				if(input.loaded===input.count){
					parse(input.text);
				}
			}
		}).send();
	});
	// Parse for Bolster keywords.
	function parse(css){
		// Parse for CSS declarations.
		css=css.split(/[{}]/g);
		css.pop(); // Remove last item; will be the 'empty' text after the last '}'.
		rules=[];
		for(i=0;i<css.length/2;i++){
			rules.push({
				selector:css[2*i].trim().replace(/[\t\n]/g,''),
				'css':css[2*i+1],
				declarations:[]
			});
		}
		// Parse CSS into rules.
		rules.each(function(rule){
			declarations=rule.css.split(/;/g);
			declarations.pop(); // Same as above.
			declarations.each(function(declaration){
				declaration=declaration.split(/:/g);
				rule.declarations.push({
					property:declaration[0].trim().replace(/[\t\n]/g,''),
					value:declaration[1].trim().replace(/[\t\n]/g,'')
				});
			});
		});
		// Parse rules for Bolster properties.
		rules.each(function(rule){
			rule.declarations.each(function(declaration){
				get_effects().each(function(bolster_property){
					if(declaration.property==='-bolster-'+bolster_property){
						// Format whitespace.
						value=declaration.value.replace(/ +(?= )/g,''); // Remove multiple spaces.
						value=declaration.value.replace(/, /g,','); // Remove space after comma.
						// Tokenize.
						args=[];
						last=0;
						quoted=false;
						//escape=false;
						temp=[];
						for(i=0,len=value.length;i<len;i++){
							switch(value[i]){
								case "'":
								case '"':
									if(quoted===false){
										quoted=value[i];
										last++; // So it won't match the leading quotation mark.
									}else if(quoted===value[i]){
										temp.push(value.substring(last,i));
										last=i+1;
										quoted=false;
									}
									break;
								case ' ':
									if(quoted===false){
										temp.push(value.substring(last,i));
										last=i+1;
									}
									break;
								case ',':
									if(quoted===false){
										temp.push(value.substring(last,i));
										last=i+1;
										args.push(temp);
										temp=[];
									}
									break;
							}
						}
						// The last token won't have a trailing comma or space.
						temp.push(value.substring(last));
						args.push(temp);
						// Clean arguments.
						cleaned=[];
						args.each(function(tokens){
							// Remove invalid tokens.
							tokens=tokens.clean();
							// Remove empty tokens.
							temp=[]
							tokens.each(function(token){
								if(token!==''){
									temp.push(token);
								}
							});
							// If only one token, push that instead of the array.
							if(temp.length<=1){
								cleaned.push(temp[0]);
							}
							else{
								cleaned.push(temp);
							}
						});
						if(cleaned.length<=1){
							cleaned=cleaned[0];
						}
						set_effect(rule.selector,bolster_property,cleaned);
					}					
				});
			});
		});
	}
	// Get effect names.
	function get_effects(){
		return Object.keys(bolsterfx);
	}
	// Effect setter.
	function set_effect(selector,property,args){
		bolsterfx[property](selector,args);
	}
	// Effect configuration.
	bolsterfx={
		'test-property':function(selector,args){
			console.log('Selector: '+selector+';');// Declaration:"test-property:'+args+';"');
			console.log(args);
		},
		// Vertically centre dynamic content
		'vert-mount':function(selector,args){
			$$(selector).each(function(element){
				if(value===''){
					;
				}
			});
		},
		// Natural height given in absolute pixels
		'abs-height':function(selector,arg){
			if(arg=='auto'){
				add_new_continuous(function(){
					$$('selector').each(function(element){
						element.setStyle('height',element.getSize().y);
					})
				});
			}
			else{ // If they're an idiot and decide to use this for a regular height declaration.
				sheets_height:
				for(i=0,lenA=document.styleSheets.length;i<len;i++){ // Traditional for loops must be used to use labels.
					sheet=document.styleSheets.length[i];
					for(j=0,lenB=sheet.cssRules.length;j<lenB;j++){
						rule=document.styleSheets[i].cssRules[j];
						if(rule.selectorText==selector){
							rule.style.setProperty('height',arg);
							break sheets_height;
						}
					}
				}
			}
		},
		// Natural width given in absolute pixels
		'abs-width':function(selector,args){
			if(arg=='auto'){
				add_new_continuous(function(){
					$$('selector').each(function(element){
						element.setStyle('width',element.getSize().x);
					})
				});
			}
			else{
				sheets_width:
				for(i=0,lenA=document.styleSheets.length;i<len;i++){
					sheet=document.styleSheets.length[i];
					for(j=0,lenB=sheet.cssRules.length;j<lenB;j++){
						rule=document.styleSheets[i].cssRules[j];
						if(rule.selectorText==selector){
							rule.style.setProperty('width',arg);
							break sheets_width;
						}
					}
				}
			}
		},
	};
	// Continuous functions.
	continuous_check_functions=[];
	function add_new_continuous(func){
		continuous_check_functions.push(func);
	}
	(function(){
		continuous_check_functions.each(function(func){
			func();
		});
	}).periodical(1/32);
}(window.MooTools);
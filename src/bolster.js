/*jshint mootools:true,bitwise:true,curly:true,eqeqeq:true,noarg:true,undef:true,unused:true,strict:true,trailing:true */

/**
 * Bolstering CSS with dynamic effects, in the most literal sense possible.
 */
(function(mT){
	"use strict";
	
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
		version:'0.1.0', // Version.
		extend:function(property_name,func){ // Add custom properties.
			bolsterfx[property_name]=func;
		},
		rescan:function(){
			load();
		}
	};

	var load=function(){
		// Initialize CSS input object.
		var input={
			count:$(document.head).getChildren('link[type="text/css"]').length, // The number of files
			loaded:0, // The counter of loaded files.
			text:''
		};
		
		// Get inline CSS.
		$$('style').each(function(style){
			input.text+=style.get('html');
		});
		// Get external CSS files.
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
	};
	
	// Wait until all CSS loads.
	window.addEvent('domready',load);
	
	// Parse for Bolster keywords.
	var parse=function(css){
		// Parse for CSS declarations.
		css=css.split(/[{}]/g);
		css.pop(); // Remove last item; will be the 'empty' text after the last '}'.
		var rules=[];
		for(var i=0;i<css.length/2;i++){
			rules.push({
				selector:css[2*i].trim().replace(/[\t\n]/g,''),
				'css':css[2*i+1],
				declarations:[]
			});
		}
		// Parse CSS into rules.
		rules.each(function(rule){
			var declarations=rule.css.split(/;/g);
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
						var value=declaration.value.replace(/ +(?= )/g,''); // Remove multiple spaces.
						value=value.replace(/, /g,','); // Remove space after comma.
						// Tokenize.
						var args=[],last=0,quoted=false,bucket=[];
						for(var i=0,len=value.length;i<len;i++){
							switch(value[i]){
								case "'":
								case '"':
									if(quoted===false){
										quoted=value[i];
										last++; // So it won't match the leading quotation mark.
									}else if(quoted===value[i]){
										bucket.push(value.substring(last,i));
										last=i+1;
										quoted=false;
									}
									break;
								case ' ':
									if(quoted===false){
										bucket.push(value.substring(last,i));
										last=i+1;
									}
									break;
								case ',':
									if(quoted===false){
										bucket.push(value.substring(last,i));
										last=i+1;
										args.push(bucket);
										bucket=[];
									}
									break;
							}
						}
						// The last token won't have a trailing comma or space.
						bucket.push(value.substring(last));
						args.push(bucket);
						// Clean arguments.
						var cleaned=[];
						args.each(function(tokens){
							// Remove invalid tokens.
							tokens=tokens.clean();
							// Remove empty tokens.
							var nonempty=[];
							tokens.each(function(token){
								if(token!==''){
									nonempty.push(token);
								}
							});
							cleaned.push(nonempty);
						});
						set_effect(rule.selector,bolster_property,cleaned);
					}
				});
			});
		});
	};
	
	// Get effect names.
	var get_effects=function(){
		return Object.keys(bolsterfx);
	};
	// Effect setter.
	var set_effect=function(selector,property,args){
		bolsterfx[property](selector,args);
	};
	// Effect configuration.
	var bolsterfx={
		// An example test property.
		'test-property':function(selector,args){
			console.log('Selector: '+selector+';');
			console.log(args);
		},
		// Vertically centre dynamic content
		'vert-mount':function(selector,args){
			function set_mount(obj){
				$$(obj.s).each(function(element){
					obj.current=element.getStyle('margin-top');
					if(isNaN(obj.current)){
						obj.current=0;
					}
					element.setStyles({
						position:'absolute',
						top:'50%'
					});
					if(obj.a[0].indexOf('middle')!==-1){
						element.setStyle('margin-top',obj.current-element.getSize().y/2);
					}
					if(obj.a[0].indexOf('bottom')!==-1){
						element.setStyle('margin-top',obj.current-element.getSize().y);
					}
				});
			}
			set_mount({
				s:selector,
				a:args
			});
			if(args.indexOf('continuous')!==-1){
				add_continuous(set_mount,{
					s:selector,
					a:args
				});
			}
		},
		// Natural height given in absolute pixels
		'abs-height':function(selector,args){
			if(args[0].indexOf('auto')!==-1){
				$$(selector).each(function(element){
					element.setStyle('height','auto');
					element.setStyle('height',element.getSize().y);
				});
				if(args[0].indexOf('continuous')!==-1){
					add_continuous(function(s){
						$$(s).each(function(element){
							element.setStyle('height','auto');
							element.setStyle('height',element.getSize().y);
						});
					},selector);
				}
			}
			else{ // If they're an idiot and decide to use this for a regular height declaration.
				sheets_width:
				for(var i=0,lenA=document.styleSheets.length;i<lenA;i++){ // Traditional for loops must be used to use labels.
					var sheet=document.styleSheets.length[i];
					for(var j=0,lenB=sheet.cssRules.length;j<lenB;j++){
						var rule=document.styleSheets[i].cssRules[j];
						if(rule.selectorText===selector){
							rule.style.setProperty('width',args[0][0]);
							break sheets_width;
						}
					}
				}
			}
		},
		// Natural width given in absolute pixels
		'abs-width':function(selector,args){
			if(args[0].indexOf('auto')!==-1){
				$$(selector).each(function(element){
					element.setStyle('width','auto');
					element.setStyle('width',element.getSize().x);
				});
				if(args[0].indexOf('continuous')!==-1){
					add_continuous(function(s){
						$$(s).each(function(element){
							element.setStyle('width','auto');
							element.setStyle('width',element.getSize().x);
						});
					},selector);
				}
			}
			else{
				sheets_width:
				for(var i=0,lenA=document.styleSheets.length;i<lenA;i++){
					var sheet=document.styleSheets.length[i];
					for(var j=0,lenB=sheet.cssRules.length;j<lenB;j++){
						var rule=document.styleSheets[i].cssRules[j];
						if(rule.selectorText===selector){
							rule.style.setProperty('width',args[0][0]);
							break sheets_width;
						}
					}
				}
			}
		}
		// Sets transition type.
		/*'transition':function(selector,arg){
			;
		}*/
	};
	
	// Continuous functions.
	var continuous=[];
	var add_continuous=function(func,param){
		continuous.push({
			'function':func,
			parameter:param
		});
	};
	(function(){
		continuous.each(function(item){
			item['function'](item.parameter);
		});
	}).periodical(1/32);
	
	// Rescan for new elements.
	// Dammit, DOMSubtreeModified is deprecated?
})(window.MooTools);
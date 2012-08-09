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
	}
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
				if(input.loaded==input.count){
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
		rules.each(function(rule){
			declarations=rule.css.split(/;/g);
			declarations.pop(); // Same as above.
			declarations.each(function(declaration){
				declaration=declaration.split(/:/g);
				rule['declarations'].push({
					property:declaration[0].trim().replace(/[\t\n]/g,''),
					value:declaration[1].trim().replace(/[\t\n]/g,'')
				});
			});
		});
		// Parse for Bolster properties.
		rules.each(function(rule){
			rule.declarations.each(function(declaration){
				get_effects().each(function(bolster_property){
					if(declaration.property=='-bolster-'+bolster_property){
						set_effect(rule.selector,declaration);
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
	function set_effect(selector,declaration){
		declaration.property=declaration.property.substring(9); // Remove the '-bolster-' prefix.
		bolsterfx[declaration.property](selector,declaration.value);
	}
	// Effect configuration.
	bolsterfx={
		'example-property':function(selector,value){
			console.log('Selector: '+selector+'; Declaration:"test-property:'+value+';"');
		},
		// Vertically centre dynamic content
		'div-align':function(selector,value){
			$$(selector);
		},
		// Natural height given in absolute pixels
		'abs-height':function(selector,value){
			$$(selector);
		},
		// Natural width given in absolute pixels
		'abs-width':function(selector,value){
			$$(selector);
		},
	};
}(window.MooTools);

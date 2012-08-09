/**
 * Bolstering CSS with dynamic effects, in the most literal sense possible.
 */
!function(mT){
	// Prerequisites.
	if(mT===undefined){
		alert('Bolster relies upon MooTools.');
		return;
	}
	if(mT.More===undefined){
		alert('Bolster requires MooTools More.');
		return;
	}
	if(mT.version.toFloat()<1.4){
		alert('Bolster requires at least MooTools 1.4.5.')
		return;
	}
	// Initialize plugin.
	window.Bolster={
		version:''
	}
	// Get the CSS files.
	input={
		count:$(document.head).getChildren('link[type="text/css"]').length, // The number of files
		loaded:0, // The counter of loaded files.
		text:'' // CSS file contents.
	};
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
	};
}(window.MooTools);
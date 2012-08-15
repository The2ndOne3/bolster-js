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
			this.bolsterfx[property_name]=func;
		}
	};
	// Initialize temporary object.
	this.temp={};
	
	// Initialize CSS input object.
	this.input={
		count:$(document.head).getChildren('link[type="text/css"]').length, // The number of files
		loaded:0, // The counter of loaded files.
		text:''
	};
	// Get inline CSS.
	$$('style[type="text/css"]').each(function(style){
		this.temp.input.text+=style.get('html');
	});
	// Get the CSS files.
	$(document.head).getChildren('link[type="text/css"]').each(function(link){
		new Request({
			url:link.get('href'),
			onSuccess:(function(response){
				this.input.text+=response;
				this.input.loaded++;
				if(this.input.loaded===this.input.count){
					this.parse(this.input.text);
				}
			}).bind(this)
		}).send();
	},this);
	
	// Parse for Bolster keywords.
	this.parse=(function(css){
		// Parse for CSS declarations.
		css=css.split(/[{}]/g);
		css.pop(); // Remove last item; will be the 'empty' text after the last '}'.
		this.rules=[];
		for(this.temp.i=0;this.temp.i<css.length/2;this.temp.i++){
			this.rules.push({
				selector:css[2*this.temp.i].trim().replace(/[\t\n]/g,''),
				'css':css[2*this.temp.i+1],
				declarations:[]
			});
		}
		// Parse CSS into rules.
		this.rules.each((function(rule){
			this.temp.declarations=rule.css.split(/;/g);
			this.temp.declarations.pop(); // Same as above.
			this.temp.declarations.each(function(declaration){
				declaration=declaration.split(/:/g);
				rule.declarations.push({
					property:declaration[0].trim().replace(/[\t\n]/g,''),
					value:declaration[1].trim().replace(/[\t\n]/g,'')
				});
			});
		}).bind(this));
		// Parse rules for Bolster properties.
		this.rules.each((function(rule){
			rule.declarations.each((function(declaration){
				this.get_effects().each((function(bolster_property){
					if(declaration.property==='-bolster-'+bolster_property){
						// Format whitespace.
						this.temp.value=declaration.value.replace(/ +(?= )/g,''); // Remove multiple spaces.
						this.temp.value=declaration.value.replace(/, /g,','); // Remove space after comma.
						// Tokenize.
						this.temp.args=[];
						this.temp.last=0;
						this.temp.quoted=false;
						//escape=false;
						this.temp.bucket=[];
						for(this.temp.i=0,this.temp.len=this.temp.value.length;this.temp.i<this.temp.len;this.temp.i++){
							switch(this.temp.value[this.temp.i]){
								case "'":
								case '"':
									if(this.temp.quoted===false){
										this.temp.quoted=this.temp.value[this.temp.i];
										this.temp.last++; // So it won't match the leading quotation mark.
									}else if(this.temp.quoted===this.temp.value[this.temp.i]){
										this.temp.bucket.push(this.temp.value.substring(this.temp.last,this.temp.i));
										this.temp.last=this.temp.i+1;
										this.temp.quoted=false;
									}
									break;
								case ' ':
									if(this.temp.quoted===false){
										this.temp.bucket.push(this.temp.value.substring(this.temp.last,this.temp.i));
										this.temp.last=this.temp.i+1;
									}
									break;
								case ',':
									if(this.temp.quoted===false){
										this.temp.bucket.push(this.temp.value.substring(this.temp.last,this.temp.i));
										this.temp.last=this.temp.i+1;
										this.temp.args.push(this.temp.bucket);
										this.temp.bucket=[];
									}
									break;
							}
						}
						// The last token won't have a trailing comma or space.
						this.temp.bucket.push(this.temp.value.substring(this.temp.last));
						this.temp.args.push(this.temp.bucket);
						// Clean arguments.
						this.temp.cleaned=[];
						this.temp.args.each((function(tokens){
							// Remove invalid tokens.
							tokens=tokens.clean();
							// Remove empty tokens.
							this.temp.nonempty=[];
							tokens.each((function(token){
								if(token!==''){
									this.temp.nonempty.push(token);
								}
							}).bind(this));
							// If only one token, push that instead of the array.
							if(this.temp.nonempty.length<=1){
								this.temp.cleaned.push(this.temp.nonempty[0]);
							}
							else{
								this.temp.cleaned.push(this.temp.nonempty);
							}
						}).bind(this));
						if(this.temp.cleaned.length<=1){
							this.temp.cleaned=this.temp.cleaned[0];
						}
						this.set_effect(rule.selector,bolster_property,this.temp.cleaned);
					}
				}).bind(this));
			}).bind(this));
		}).bind(this));
	}).bind(this);
	
	// Get effect names.
	this.get_effects=function(){
		return Object.keys(this.bolsterfx);
	};
	// Effect setter.
	this.set_effect=function(selector,property,args){
		this.bolsterfx[property](selector,args);
	};
	// Effect configuration.
	this.bolsterfx={
		'test-property':function(selector,args){
			console.log('Selector: '+selector+';');// Declaration:"test-property:'+args+';"');
			console.log(args);
		},
		// Vertically centre dynamic content
		/*'vert-mount':function(selector,args){
			;
		},*/
		// Natural height given in absolute pixels
		'abs-height':function(selector,arg){
			if(arg==='auto'){
				this.add_new_continuous(function(){
					$$('selector').each(function(element){
						element.setStyle('width',element.getSize().x);
					});
				});
			}
			else{ // If they're an idiot and decide to use this for a regular height declaration.
				sheets_width:
				for(this.temp.i=0,this.temp.lenA=document.styleSheets.length;this.temp.i<this.temp.lenA;this.temp.i++){ // Traditional for loops must be used to use labels.
					this.temp.sheet=document.styleSheets.length[this.temp.i];
					for(this.temp.j=0,this.temp.lenB=this.temp.sheet.cssRules.length;this.temp.j<this.temp.lenB;this.temp.j++){
						this.temp.rule=document.styleSheets[this.temp.i].cssRules[this.temp.j];
						if(this.temp.rule.selectorText===selector){
							this.temp.rule.style.setProperty('width',arg);
							break sheets_width;
						}
					}
				}
			}
		},
		// Natural width given in absolute pixels
		'abs-width':function(selector,arg){
			if(arg==='auto'){
				this.add_new_continuous(function(){
					$$('selector').each(function(element){
						element.setStyle('width',element.getSize().x);
					});
				});
			}
			else{
				sheets_width:
				for(this.temp.i=0,this.temp.lenA=document.styleSheets.length;this.temp.i<this.temp.lenA;this.temp.i++){
					this.temp.sheet=document.styleSheets.length[this.temp.i];
					for(this.temp.j=0,this.temp.lenB=this.temp.sheet.cssRules.length;this.temp.j<this.temp.lenB;this.temp.j++){
						this.temp.rule=document.styleSheets[this.temp.i].cssRules[this.temp.j];
						if(this.temp.rule.selectorText===selector){
							this.temp.rule.style.setProperty('width',arg);
							break sheets_width;
						}
					}
				}
			}
		}
	};
	// Continuous functions.
	this.continuous_check_functions=[];
	this.add_new_continuous=function(func){
		this.continuous_check_functions.push(func);
	}
	(function(){
		this.continuous_check_functions.each(function(func){
			(func)();
		});
	}).bind(this).periodical(1/32);
}).bind({})(window.MooTools);
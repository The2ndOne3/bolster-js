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
	// Debug pointers.
	debug={
		requests:[]
	}
	// Get the CSS files.
	files={
		count:$(document.head).getChildren('link[type="text/css"]').length, // The number of files
		loaded:0, // The counter of loaded files.
		text:[] // An array of file contents.
	};
	$(document.head).getChildren('link[type="text/css"]').each(function(link){
		debug.requests.push(new Request({
			url:link.get('href'),
			onSuccess:function(text,xml){
				files['text'].push(text);
				files['loaded']++;
				console.log(files);
				if(files['loaded']==files['count']){
					parse(files);
				}
			}
		}).send());
	});
	// Parse for Bolster keywords.
	function parse(input){
		console.log(input);
	}
}(window.MooTools);
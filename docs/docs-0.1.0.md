Documentation
=============
**Version 0.1.0**

Getting Started
===============
Bolster depends upon MooTools Core 1.4.5 and MooTools More 1.2.5. These libraries need to be linked before Bolster is loaded, or Bolster will fail and log to console.

Usage
=====
Bolster allows you to declare dynamic styles in CSS, and then sets those styles at run-time. This is necessary in certain situations, especially if dynamic content is involved. For example, vertically centering a div with dynamic content requires run-time computation.

Bolster will automatically scan inline style tags and externally linked CSS files for properties, so you don't need to manually configure any JavaScript to use it.

Bolster Properties
==================
Bolster comes with a number of default dynamic styles, all of which have the '-bolster-' prefix.

* **-bolster-abs-height** -- behaves like `height`, but will set a width in absolute pixels when set to `auto`. If set to `auto-continuous`, it will continuously rescan the element in case the content changes. Note that `auto-continuous` may clash with tweening functions. Useful for dynamic content.
* **-bolster-abs-width** -- same as `-bolster-abs-height`, but for width. 

Custom Properties
=================
Bolster comes with an extend function that allows you to define your own custom dynamic styles.

To extend Bolster with a custom function, you can call `window.Bolster.extend(property_name, function)` and pass it a function of signature `function(selector, arguments)`. The `selector` argument is the CSS selector, and the `arguments` argument is the value of the CSS declaration, passed as follows:
* If there is one value, it is passed.
* If there are multiple comma-delimited values, an array is passed.
* If there are multiple whitespace-delimited values, an array is passed.
* If there are both commas and whitespace delimiters, an array is passed such that:
	* Each array element is comma delimited.
	* Within each element is an array of whitespace delimited values.
* Quoted strings are treated as a single value.

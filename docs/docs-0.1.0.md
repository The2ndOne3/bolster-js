Documentation
=============
Bolster.js 0.1.0

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

* **-bolster-abs-height** -- behaviors like height, but will set a width in absolute pixels when set to 'auto'. Useful for dynamic content.
* **-bolster-abs-width** -- behaviors like width, but will set a width in absolute pixels when set to 'auto'. Useful for dynamic content.

Custom Properties
=================
Bolster comes with an extend function that allows you to define your own custom dynamic styles.
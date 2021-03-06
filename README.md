jQuery Styled Select Box Widget Replacement Plugin
==================================================

Regular `<select>` widgets are not able to be styled to full satisfaction, so this
makes it possible for a user to fully integrate this commonly used widget into
whatever style they demand. Allows for simply replacing the `<select>` element,
or the `<select>` element and all of its `<optgroup>` and `<option>` elements.

Currently only works with single-select `<select>` elements.

Version 2.0

Cross-platform Compatibility
----------------------------

* Firefox 3+
* Webkit (Google Chrome, Apple's Safari)
* Internet Explorer 7+
* Opera

Requirements
------------

* jQuery 1.7.0+

Feature Overview
----------------

* Auto-sizes to your select box (unless overridden through CSS)
* Exposes methods for ease of use after initialization
* Easy to configure

Essentially it creates a new `<div>` element with the class 'styled\_select'. This contains
a `<span>` element with the class 'styled\_select\_option\_display' which displays
the text value of the currently selected `<option>` of the `<select>` element, plus
a `<span>` element with the class 'styled\_select\_arrow' which displays the icon indicating
that the element can drop down options. The original `<select>` widget then becomes completely
transparent but still exists overtop the new 'styled\_select' `<div>`, registering all key and
mouse events, while appearing as other styled widgets on your page would.

If you specify full replacement through an option or data attribute, the original
`<select>` widget becomes hidden and replacement `<div>` elements are created for each
`<optgroup>` and `<option>` element and nested the same as the original set. This way,
the user can fully style the options as he/she sees fit. Mouse and key events simulate
the behavior of the regular `<select>` element.

Usage
=====

Create a regular `<select>` widget in HTML. Override any CSS styles needed for
your theme. On page DOM load, simply call the styledSelectBox() function with
or without any special options.
####Required options:
* image\_base				location of directory where images are located

If you need to resize the widget (say after updating the list of options in the
original select box) or explicitly update the selected text, instead of passing
an object with options, you can pass a method name.
####Exposed methods:
* resize
* update

@changelog	2.0 -	refactored. removed 'styled\_select\_id' option. added full replacement and multi-line option options, and 'data-styled-select-...' attribute recognition<br />
@changelog	1.1.6 - bug fix: certain browsers were not properly setting width of the selected\_option\_div element<br />
@changelog	1.1.5 - added fix for navigating via key press events. added README<br />
@changelog	1.1.4 -	added 'method' parameter to enable the user to call a function<br />
@changelog	1.1.3 -	bug fix: added 'z\_index' option for using this with elements with high zIndex values, this can override.

Example
-------
	The first box gets specialized styles.<br />
	<select name="select_box_1" class="some_random_class" tabindex="1" id="select_box_1">
		<option value=""></option>
		<option value="3">An Option</option>
		<option value="4">Another Option</option>
		<optgroup label="-- Option Group --">
			<option value="5">A Grouped Option</option>
			<option value="6">Another Grouped Option</option>
			<option value="7">An extremely long option that was put into the 'Option Group' set of Grouped Options</option>
		</optgroup>
		<option value="2">Last Option</option>
	</select><br /><br />
	
	The second box gets fully replaced and allows multi-line options.<br />
	<select name="select_box_2" tabindex="2" id="select_box_2" data-styled-select-type="full" data-styled-select-multiline="true">
		<option value=""></option>
		<option value="3">An Option</option>
		<option value="4">Another Option</option>
		<optgroup label="&mdash; Option Group &mdash;">
			<option value="5">A Grouped Option</option>
			<option value="6">Another Grouped Option</option>
			<option value="7">An extremely long option that was put into the 'Option Group' set of Grouped Options</option>
		</optgroup>
		<option value="2">Last Option</option>
	</select>
	<br /><br />
	
	The third box is just a regular select box, for reference.<br />
	<select name="select_box_3" tabindex="3" id="select_box_3">
		<option value=""></option>
		<option value="3">An Option</option>
		<option value="4">Another Option</option>
		<optgroup label="&mdash; Option Group &mdash;">
			<option value="5">A Grouped Option</option>
			<option value="6">Another Grouped Option</option>
			<option value="7">An extremely long option that was put into the 'Option Group' set of Grouped Options</option>
		</optgroup>
		<option value="2">Last Option</option>
	</select>
	<br /><br />
	
	The fourth box gets fully replaced but does not allow multi-line options.<br />
	<select name="select_box_3" tabindex="4" id="select_box_4" data-styled-select-type="full">
		<option value=""></option>
		<option value="3">An Option</option>
		<option value="4">Another Option</option>
		<optgroup label="&mdash; Option Group &mdash;">
			<option value="5">A Grouped Option</option>
			<option value="6">Another Grouped Option</option>
			<option value="7">An extremely long option that was put into the 'Option Group' set of Grouped Options</option>
		</optgroup>
		<option value="2">Last Option</option>
	</select>
	
	<script type='text/javascript'>
		$(document).ready(function() {
			$('select').not('#select_box_3')
				.styledSelectBox({image_base:'images',
								  widget_height: 30,
								  classes:['any_extra_classes', 'that_you_want']})
				.styledSelectBox('resize')
				.styledSelectBox('update');
		});
	</script>
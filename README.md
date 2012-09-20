jQuery Styled Select Box Widget Replacement Plugin
==================================================

Regular `<select>` widgets are not able to be styled to full satisfaction, so this
makes it possible for a user to fully integrate this commonly used widget into
whatever style they demand.

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

Essentially it creates a new `<div>` element with the class 'styled\_select'. This contains
a `<span>` element with the class 'styled\_select\_option\_display' which displays
the text value of the currently selected `<option>` of the `<select>` element, plus
a `<span>` element with the class 'styled\_select\_arrow' which displays the icon indicating
that the element can drop down options. The original `<select>` widget then becomes completely
transparent but still exists overtop the new 'styled\_select' `<div>`, registering all key and
mouse events, while appearing as other styled widgets on your page would.

Usage
=====

Create a regular `<select>` widget in HTML. Override any CSS styles needed for
your theme. On page DOM load, simply call the styledSelectBox() function with
or without any special options.
####Required options:
* styled\_select\_id		the ID of the new element that will be created
* image\_base				location of directory where images are located

If you need to resize the widget (say after updating the list of options in the
original select box) or explicitly update the selected text, instead of passing
an object with options, you can pass a method name.
####Exposed methods:
* resize
* update

@changelog	1.1.5 - added fix for navigating via key press events. added README
@changelog	1.1.4 -	added 'method' parameter to enable the user to call a function 
@changelog	1.1.3 -	bug fix: added 'z\_index' option for using this with elements with high zIndex values, this can override.

Example
-------
	<select name="select_box_1" class="some_random_class" tabindex="1" id="select_box_1">
		<option value=""></option>
		<option value="3">An Option</option>
		<option value="4">Another Option</option>
		<optgroup label="420_time">
			<option value="5">A Grouped Option</option>
			<option value="6">Another Grouped Option</option>
		</optgroup>
		<option value="2">Last Option</option>
	</select>
	<script type='text/javascript'>
		$(document).ready(function() {
			$('select').each(function(index, select_box) {
				var si_id = $(select_box).prop('id');
				$(select_box).styledSelectBox({styled_select_id : si_id+"StyledSelect",
											   image_base:'images',
											   widget_height: 30,
											   classes:['any_extra_classes', 'that_you_want']});
				// now resize and update it
				$(select_box).styledSelectBox('resize');
				$(select_box).styledSelectBox('update');
			});
		});
	</script>
/**
 * jQuery Styled Select Box Widget Replacement Plugin
 * ==================================================
 * 
 * Regular `<select>` widgets are not able to be styled to full satisfaction, so this
 * makes it possible for a user to fully integrate this commonly used widget into
 * whatever style they demand.
 * 
 * Cross-platform Compatibility
 * ----------------------------
 * 
 * * Firefox 3+
 * * Webkit (Google Chrome, Apple's Safari)
 * * Internet Explorer 7+
 * * Opera
 * 
 * Requirements
 * ------------
 * 
 * * jQuery 1.7.0+
 * 
 * Feature Overview
 * ----------------
 * 
 * * Auto-sizes to your select box (unless overridden through CSS)
 * * Exposes methods for ease of use after initialization
 * 
 * Essentially it creates a new `<div>` element with the class 'styled\_select'. This contains
 * a `<span>` element with the class 'styled\_select\_option\_display' which displays
 * the text value of the currently selected `<option>` of the `<select>` element, plus
 * a `<span>` element with the class 'styled\_select\_arrow' which displays the icon indicating
 * that the element can drop down options. The original `<select>` widget then becomes completely
 * transparent but still exists overtop the new 'styled\_select' `<div>`, registering all key and
 * mouse events, while appearing as other styled widgets on your page would.
 * 
 * Usage
 * =====
 * 
 * Create a regular `<select>` widget in HTML. Override any CSS styles needed for
 * your theme. On page DOM load, simply call the styledSelectBox() function with
 * or without any special options.
 * ####Required options:
 * * styled\_select\_id		the ID of the new element that will be created
 * * image\_base				location of directory where images are located
 * 
 * If you need to resize the widget (say after updating the list of options in the
 * original select box) or explicitly update the selected text, instead of passing
 * an object with options, you can pass a method name.
 * ####Exposed methods:
 * * resize
 * * update
 * 
 * @changelog	1.1.6 - bug fix: certain browsers were not properly setting width of the selected\_option\_div element<br />
 * @changelog	1.1.5 - added fix for navigating via key press events. added README<br />
 * @changelog	1.1.4 -	added 'method' parameter to enable the user to call a function<br />
 * @changelog	1.1.3 -	bug fix: added 'z\_index' option for using this with elements with high zIndex values, this can override.
 * 
 * @example		See example.html
 * @class		StyledSelectBox
 * @name		StyledSelectBox
 * @version		1.1.6
 * @author		Derek Rosenzweig <derek.rosenzweig@gmail.com, drosenzweig@riccagroup.com>
 */
(function($) {
	
	/**
     * Constructor. Creates the new 'styled_select' <div> and its children, sets the indicator
     * arrow image based on the 'image_base' option, and determines the height of the new widget
     * based on the height of the original <select> widget. Creates all necessary event handlers for
     * changing options.
     *
     * @access		public
     * @memberOf	StyledSelectBox
     * @since		1.0
     * @updated		1.1.6
     *
     * @param		options_or_method	mixed				An object containing various options, or a string containing a method name.
     * 															Valid method names: 'resize', 'update'
     *
     * @returns		this				jQuery				The jQuery element being extended gets returned for chaining purposes
     */
	$.fn.styledSelectBox = function(options_or_method) {
		//--------------------------------------------------------------------------
		//
		//  Variables and get/set functions
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Default options for the widget. Overwrite by including individual
		 * options in the 'options' map object when extending the styledSelect widget.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @updated		1.1.3
		 */
		var default_options = {
			styled_select_id : null,				// ID of the new element that'll be created. Default null. Required.
			image_base : null,						// Location of directory where images are located. Default null. Required.
			classes : [],							// A set of additional class names that will get applied to the replacement 'styled_select' <div>. Default []. Optional.
			widget_height : null,					// The height of the widget in pixels. Default null. Optional.
			include_separator_border : true,		// Flag indicating whether to include a border separator between the dropdown arrow and the text content. Optional. Default true.
			z_index : null							// Indicates a zIndex value for the new 'styled_select' <div>. Useful for when the default class-based zIndex is insufficient. Default null. Optional.
		};
		
		/**
		 * The actual final set of extended options that will be used in creating
		 * the replacement styledSelect widget.
		 *
		 * This will be stored on the replacement styledSelect widget as 'styled_select_options'
		 * data for easy retrieval and use when the 'options_or_method' var is a string
		 * indicating a function to be run.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	StyledSelectBox
		 * @since		1.1.4
		 */
		var options = {};
		
		/**
		 * The <select> element which will be overlaid by the new widget.
		 *
		 * @access		public
		 * @type		HTMLElement <select>
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @default		this
		 */
		var linked_select_box = this;
		
		/**
		 * The replacement 'styled_select' <div> element that will visually replace
		 * the linked_select_box <select> element.
		 *
		 * @access		public
		 * @type		HTMLElement <div>
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @default		null
		 */
		var replacement_container_div = null;
		
		/**
		 * The 'styled_select_option_display' <div> element that contains the text
		 * of the currently selected <select> widget <option> value.
		 *
		 * @access		public
		 * @type		HTMLElement <div>
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @default		null
		 */
		var selected_option_div = null;
		
		/**
		 * The 'styled_select_arrow' <span> element that contains the indicator
		 * dropdown arrow.
		 *
		 * @access		public
		 * @type		HTMLElement <span>
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @default		null
		 */
		var arrow_span = null;
		
		//--------------------------------------------------------------------------
		//
		//  Methods
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Initializes the styled select widget. Creates and adds any optional classes
		 * to the new 'styled_select' <div>, creates and adds its children, sets the
		 * indicator arrow image based on the 'image_base' option, determines the
		 * height of the new widget based on the height of the original <select> widget,
		 * and creates the event handler for changing options.
		 *
		 * If the required options are not present, throws an exception.
		 *
		 * @access		public
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @updated		1.1.6
		 * @throws		StyledSelectBox exception
		 */
		this.initStyledSelectBox = function() {
			// First check for valid 'styled_select_id' option.
			if (options.styled_select_id == null) {
				//alert('StyledSelectBox widget: no "styled_select_id" option was passed.');
				throw 'StyledSelectBox widget: no "styled_select_id" option was passed.';
				return;
			}
			// Next check for required options.
			if (options.image_base == null) {
				//alert('StyledSelectBox widget: no image base specified.');
				throw 'StyledSelectBox widget: no image base specified.';
				return;
			}
			
			// Create the replacement widget elements.
			replacement_container_div = $("<div class='styled_select' id='"+options.styled_select_id+"'></div>");
			selected_option_div = $("<div class='styled_select_option_display'></div");
			arrow_span = $("<span class='styled_select_arrow'>&nbsp;</span>").css({backgroundImage:'url('+options.image_base+'/small-arrow.png'+')'});
			
			if (options.include_separator_border) {
				// Only add the border if we specify to do so
				var arrow_left_border = replacement_container_div.css('border-left-width') + ' ' + replacement_container_div.css('border-left-style') + ' ' + replacement_container_div.css('border-left-color');
				arrow_span.css({borderLeft: arrow_left_border});
			}
			
			replacement_container_div.append(selected_option_div).append(arrow_span);
			linked_select_box.addClass('original_select_now_styled');
			
			if (options.z_index != null) {
				replacement_container_div.css({zIndex: options.z_index});
				linked_select_box.css({zIndex: (options.z_index+1)});
			}
			
			// Add optional classes.
			if (options.classes.length > 0) {
				for (var i = 0; i < options.classes.length; i++) {
					replacement_container_div.addClass(options.classes[i]);
				}
			}
			
			// Add the new replacement widget.
			linked_select_box.after(replacement_container_div);
			
			// Size the widget.
			this.resize();
			
			// Add the event handler(s).
			linked_select_box.on('change', this.setCurrentSelectedText).on('keyup', this.setCurrentSelectedText);
			
			// Add the current options as data on the new replacement container div
			replacement_container_div.data('styled_select_options', options);
			
			// Determine the option text to show.
			this.setCurrentSelectedText();
		}
		
		/**
		 * Determines the height and width of the new widget based on the height and
		 * width of the original <select> widget, and sets those values to the replacement
		 * container div.
		 *
		 * @access		public
		 * @memberOf	StyledSelectBox
		 * @since		1.1.4
		 * @updated		1.1.6
		 */
		this.resize = function() {
			// Set the calculated widths
			replacement_container_div.css({width:linked_select_box.outerWidth()+'px'});
			
			// Set the heights
			var sel_opt_css = {
				width:(parseInt(replacement_container_div.innerWidth()-arrow_span.outerWidth()))+'px'
			};
			if (options.widget_height != null) {
				var rpcd_css = {
					height:options.widget_height + "px"
				};
				linked_select_box.css({height:options.widget_height + "px",
									   lineHeight:(parseInt(options.widget_height)-2) + "px"});
				sel_opt_css['height'] = options.widget_height + "px";
				rpcd_css['lineHeight'] = (parseInt(options.widget_height)-2) + "px"; // default
				if ($.browser.msie && parseInt($.browser.version) <= 8) { // IE override
					rpcd_css['lineHeight'] = options.widget_height + "px";
				}
				replacement_container_div.css(rpcd_css);
			}
			else {
				sel_opt_css['height'] = linked_select_box.height() + "px";
			}
			selected_option_div.css(sel_opt_css);
		}
		
		/********* Event handlers *********/
		
		/**
		 * When the user selects a new <option> from the list of available values,
		 * or the default 'empty' value, it will update the 'styled_select_option_display'
		 * <div> element with the text of the newly selected <option>.
		 *
		 * @public
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @updated		1.1.5
		 *
		 * @param		change_event			jQuery.Event				jQuery 'change' Event
		 */
		this.setCurrentSelectedText = function(change_event) {
			var select_box = linked_select_box.get(0);
			var opts = linked_select_box.find('option');
			var selected_option = opts[select_box.selectedIndex];
			if (selected_option != null) {
				replacement_container_div.find('div.styled_select_option_display').html(selected_option.text);
			}
		}
		
		/********* Initialize the styled select box or call a specific function *********/
		if (typeof options_or_method == "string") {
			/* Call a specific function */
			replacement_container_div = linked_select_box.next('div.styled_select');
			selected_option_div = replacement_container_div.find('div.styled_select_option_display');
			arrow_span = replacement_container_div.find('span.styled_select_arrow');
			options = replacement_container_div.data('styled_select_options');
			
			if (options_or_method == 'resize') {
				// Resize the existing styledSelect widget according to the original select widget and
				// the options stored in the 'styled_select_options' data
				this.resize();
			}
			else if (options_or_method == 'update') {
				this.setCurrentSelectedText();
			}
		}
		else {
			/* Initialize the styled select box */
			options = $.extend(default_options, options_or_method);
			this.initStyledSelectBox();
		}
		
		/********* Return the newly extended element for chaining *********/
		return this;
	}
})(jQuery);
/**
 * Regular <select> widgets are not able to be styled to full satisfaction, so this
 * makes it possible for a user to fully integrate this commonly used widget into
 * whatever style they demand.
 *
 * Essentially it creates a new <div> element with the class 'styled_select'. This contains
 * a <span> element with the class 'styled_select_option_display' which displays
 * the text value of the currently selected <option> of the <select> element, plus
 * a <span> element with the class 'styled_select_arrow' which displays the icon indicating
 * that the element can drop down options. The original <select> widget then becomes completely
 * transparent but still exists overtop the new 'styled_select' <div>, registering all key and
 * mouse events, while appearing as other styled widgets on your page would.
 *
 * Works on IE7+, FF, Webkit, Opera.
 *
 * Requires jQuery.js 1.7.0 or higher to function.
 *
 * Usage:
 * 	Create a regular <select> widget in HTML. Override any CSS styles needed for
 * 	your theme. On page DOM load, simply call the styledSelectBox() function with
 * 	or without any special options. Required options:
 * 		styled_select_id		the ID of the new element that will be created
 * 		image_base				location of directory where images are located
 * 
 * @example		See example.html
 * @class		StyledSelectBox
 * @name		StyledSelectBox
 * @version		1.1.1
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
     *
     * @param		options				Object				An object containing various options.
     *
     * @returns		this				jQuery				The jQuery element being extended gets returned for chaining purposes
     */
	$.fn.styledSelectBox = function(options) {
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
		 * @updated		1.1
		 */
		var default_options = {
			styled_select_id : null,				// ID of the new element that'll be created. Default null. Required.
			image_base : null,						// Location of directory where images are located. Default null. Required.
			classes : [],							// A set of additional class names that will get applied to the replacement 'styled_select' <div>. Default []. Optional.
			widget_height : null					// The height of the widget in pixels. Default null. Optional.
		};
		options = $.extend(default_options, options);
		
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
		 * @access		public
		 * @memberOf	StyledSelectBox
		 * @since		1.0
		 * @updated		1.1.1
		 */
		this.initStyledSelectBox = function() {
			// First check for valid 'styled_select_id' option.
			if (options.styled_select_id == null) {
				alert('StyledSelectBox widget: no "styled_select_id" option was passed.');
				return;
			}
			// Next check for required options.
			if (options.image_base == null) {
				alert('StyledSelectBox widget: no image base specified.');
				return;
			}
			
			// Create the replacement widget elements.
			replacement_container_div = $("<div class='styled_select' id='"+options.styled_select_id+"'></div>");
			selected_option_div = $("<div class='styled_select_option_display'></div");
			var arrow_left_border = replacement_container_div.css('border-left-width') + ' ' + replacement_container_div.css('border-left-style') + ' ' + replacement_container_div.css('border-left-color');
			arrow_span = $("<span class='styled_select_arrow'>&nbsp;</span>").css({backgroundImage:'url('+options.image_base+'/small-arrow.png'+')',
																				   borderLeft: arrow_left_border});
			replacement_container_div.append(selected_option_div).append(arrow_span);
			linked_select_box.addClass('original_select_now_styled');
			
			// Set the calculated widths
			replacement_container_div.css({width:linked_select_box.outerWidth()+'px'});
			selected_option_div.css({width:(parseInt(replacement_container_div.innerWidth()-arrow_span.outerWidth()))+'px'});
			
			// Set the heights
			if (options.widget_height != null) {
				linked_select_box.css({height:options.widget_height + "px",
									   lineHeight:(parseInt(options.widget_height)-2) + "px"});
				replacement_container_div.css({height:options.widget_height + "px"});
				selected_option_div.css({height:options.widget_height + "px"});
				if ($.browser.msie && parseInt($.browser.version) <= 8) {
					replacement_container_div.css({lineHeight:options.widget_height + "px"});
				}
				else {
					replacement_container_div.css({lineHeight:(parseInt(options.widget_height)-2) + "px"});
				}
			}
			else {
				selected_option_div.css({height:linked_select_box.height() + "px"});
			}
			
			// Add optional classes.
			if (options.classes.length > 0) {
				for (var i = 0; i < options.classes.length; i++) {
					replacement_container_div.addClass(options.classes[i]);
				}
			}
			
			// Add the new replacement widget.
			linked_select_box.after(replacement_container_div);
			
			// Add the event handler(s).
			linked_select_box.on('change', this.setCurrentSelectedText);
			
			// Determine the option text to show.
			this.setCurrentSelectedText();
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
		 * @updated		1.1.1
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
			linked_select_box.blur();
		}
		
		/********* Initialize the styled select box *********/
		this.initStyledSelectBox();
		
		/********* Return the newly extended element for chaining *********/
		return this;
	}
})(jQuery);
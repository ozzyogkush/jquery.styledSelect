/**
 * jQuery Styled Select Box Widget Replacement Plugin
 * ==================================================
 * 
 * Regular `<select>` widgets are not able to be styled to full satisfaction, so this
 * makes it possible for a user to fully integrate this commonly used widget into
 * whatever style they demand. Allows for simply replacing the `<select>` element,
 * or the `<select>` element and all of its `<optgroup>` and `<option>` elements.
 *
 * Currently only works with single-select `<select>` elements.
 * 
 * Cross-platform Compatibility
 * ----------------------------
 * 
 * * Firefox 4+
 * * Webkit (Google Chrome, Apple's Safari)
 * * Internet Explorer 8+
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
 * * Easy to configure
 * 
 * Essentially it creates a new `<div>` element with the class 'styled\_select'. This contains
 * a `<span>` element with the class 'styled\_select\_option\_display' which displays
 * the text value of the currently selected `<option>` of the `<select>` element, plus
 * a `<span>` element with the class 'styled\_select\_arrow' which displays the icon indicating
 * that the element can drop down options. The original `<select>` widget then becomes completely
 * transparent but still exists overtop the new 'styled\_select' `<div>`, registering all key and
 * mouse events, while appearing as other styled widgets on your page would.
 *
 * If you specify full replacement through an option or data attribute, the original
 * `<select>` widget becomes hidden and replacement `<div>` elements are created for each
 * `<optgroup>` and `<option>` element and nested the same as the original set. This way,
 * the user can fully style the options as he/she sees fit. Mouse and key events simulate
 * the behavior of the regular `<select>` element.
 * 
 * Usage
 * =====
 * 
 * Create a regular `<select>` widget in HTML. Override any CSS styles needed for
 * your theme. On page DOM load, simply call the styledSelectBox() function with
 * or without any special options.
 * ####Required options:
 * * image\_base				location of directory where images are located
 * 
 * If you need to resize the widget (say after updating the list of options in the
 * original select box) or explicitly update the selected text, instead of passing
 * an object with options, you can pass a method name.
 * ####Exposed methods:
 * * resize
 * * update
 *
 * @changelog	2.0.1 -	fully replaced elements will now receive the 'title' attribute of the original select box if it is set
 * @changelog	2.0 -	refactored. removed 'styled\_select\_id' option. added full replacement and multi-line option options, and 'data-styled-select-...' attribute recognition<br />
 * @changelog	1.1.6 - bug fix: certain browsers were not properly setting width of the selected\_option\_div element<br />
 * @changelog	1.1.5 - added fix for navigating via key press events. added README<br />
 * @changelog	1.1.4 -	added 'method' parameter to enable the user to call a function<br />
 * @changelog	1.1.3 -	bug fix: added 'z\_index' option for using this with elements with high zIndex values, this can override.
 * 
 * @example		See example.html
 * @class		StyledSelectBox
 * @name		StyledSelectBox
 * @version		2.0.1
 * @author		Derek Rosenzweig <derek.rosenzweig@gmail.com, drosenzweig@riccagroup.com>
 */
(function($) {
	
	/**
	 * The helper class whose objects hold the constructed elements and references for
	 * each individual select box.
	 *
	 * @access		public
	 * @since		2.0
	 */
	function StyledSelect() {
		/**
		 * The <select> element which will be overlaid by the new widget.
		 *
		 * @access		public
		 * @type		HTMLElement <select>
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @default		this
		 */
		this.linked_select_box = null;
		
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
		 * @memberOf	StyledSelect
		 * @since		2.0
		 */
		this.options = {};
		
		/**
		 * The replacement 'styled_select' <div> element that will visually replace
		 * the linked_select_box <select> element.
		 *
		 * @access		public
		 * @type		HTMLElement <div>
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @default		null
		 */
		this.replacement_container_div = null;
		
		/**
		 * The replacement 'styled_select_options_container' <div> element that will
		 * visually replace the <optgroup> and <option> elements from the original
		 * linked_select_box <select> element.
		 *
		 * @access		public
		 * @type		HTMLElement <div>
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @default		null
		 */
		this.replacement_options_div = null;
		
		/**
		 * The 'styled_select_option_display' <div> element that contains the text
		 * of the currently selected <select> widget <option> value.
		 *
		 * @access		public
		 * @type		HTMLElement <div>
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @default		null
		 */
		this.selected_option_div = null;
		
		/**
		 * The 'styled_select_arrow' <span> element that contains the indicator
		 * dropdown arrow.
		 *
		 * @access		public
		 * @type		HTMLElement <span>
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @default		null
		 */
		this.arrow_span = null;
		
		/**
		 * The value of the currently selected option in the linked_select_box <select> element.
		 *
		 * @access		public
		 * @type		mixed
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @default		null
		 */
		this.current_value = null;
		
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
		 * @memberOf	StyledSelect
		 * @since		2.0
		 * @updated		2.0.1
		 * @throws		StyledSelect exception
		 *
		 * @param		original_select_box				jQuery				jQuery extended <select> element
		 * @param		options							Object				The actual final set of extended options that will be used in creating
		 * 																		the replacement styledSelect widget.
		 */
		this.initStyledSelect = function(original_select_box, options) {
			this.options = options;
			
			this.linked_select_box = $(original_select_box);
			
			var new_styled_select_id = null;
			if (this.linked_select_box.prop('id') != null) {
				new_styled_select_id = this.linked_select_box.prop('id')+"StyledSelect";
			}
			
			var full_replacement = (this.options.full_replacement == true ||
									(this.linked_select_box.attr('data-styled-select-type') != null &&
									 this.linked_select_box.attr('data-styled-select-type') == 'full'));
			var multiline = (this.options.multiline == true ||
							 (this.linked_select_box.attr('data-styled-select-multiline') != null &&
							  this.linked_select_box.attr('data-styled-select-multiline') == 'true'));
			
			// Create the replacement widget elements.
			this.replacement_container_div = $('<div></div>').addClass('styled_select').prop('id', new_styled_select_id);
			this.selected_option_div = $('<div></div>').addClass('styled_select_option_display');
			this.arrow_span = $('<span>&nbsp;</span>').addClass('styled_select_arrow').css({backgroundImage:'url('+this.options.image_base+'/small-arrow.png'+')'});
			
			if (options.include_separator_border) {
				// Only add the border if we specify to do so
				var arrow_left_border = this.replacement_container_div.css('border-left-width') + ' ' +
										this.replacement_container_div.css('border-left-style') + ' ' +
										this.replacement_container_div.css('border-left-color');
				this.arrow_span.css({borderLeft: arrow_left_border});
			}
			
			this.replacement_container_div
				.append(this.selected_option_div)
				.append(this.arrow_span);
			
			if (this.options.z_index != null) {
				this.replacement_container_div.css({zIndex: this.options.z_index});
				this.linked_select_box.css({zIndex: (this.options.z_index+1)});
			}
			
			// Add optional classes.
			if (this.options.classes.length > 0) {
				for (var i = 0; i < this.options.classes.length; i++) {
					this.replacement_container_div.addClass(this.options.classes[i]);
				}
			}
			
			if (full_replacement) {
				this.replacement_container_div.addClass('styled-select-full-replacement');
				this.linked_select_box.addClass('styled-select-full-replacement');
				
				if (multiline) {
					this.replacement_container_div.addClass('styled-select-multiline');
				}
				
				if (this.linked_select_box.attr('title') != null) {
					this.replacement_container_div.attr('title', this.linked_select_box.attr('title'));
				}
				
				if (this.linked_select_box.attr('tabindex') != null) {
					this.replacement_container_div.attr('tabindex', this.linked_select_box.attr('tabindex'));
					this.linked_select_box.attr('tabindex', -1);
				}
				else {
					this.replacement_container_div.attr('tabindex', 0);
				}
				// Generate and add the options and optgroups.
				this.generateOptions();
			}
			
			// Add the new replacement widget.
			this.linked_select_box.after(this.replacement_container_div);
			
			// Size the widget.
			this.resize();
			this.linked_select_box.addClass('original_select_now_styled');
			
			// Add the event handler(s).
			this.linked_select_box
				.on('change.styledSelect', $.proxy(this.setCurrentSelectedTextAndValue, this))
				.on('keyup.styledSelect', $.proxy(this.setCurrentSelectedTextAndValue, this));
			
			if (full_replacement) {
				// Full replacement widgets require extra event handlers
				this.replacement_container_div
					.on('click.styledSelect', $.proxy(this.simulateSelectBoxEvent, this))
					.on('keydown.styledSelect', $.proxy(this.simulateSelectBoxEvent, this))
					.on('focusout.styledSelect', $.proxy(this.simulateSelectBoxEvent, this));
				var current_window_events = $.data($(window).get(0), 'events');
				var add_window_resize_options_event = true;
				if (current_window_events != null) {
					$.each(current_window_events, function(guid, definition) {
						if (guid == 'resize' && definition[0].namespace == 'styledSelect') {
							add_window_resize_options_event = false;
						}
					});
				}
				
				if (add_window_resize_options_event) {
					$(window).on('resize.styledSelect', this.resizeOptions);
					this.resizeOptions();
				}
			}
			
			// Determine the option text to show.
			this.setCurrentSelectedTextAndValue();
		}
		
		/**
		 * Determines the height and width of the new widget based on the height and
		 * width of the original <select> widget, and sets those values to the replacement
		 * container div.
		 *
		 * @access		public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 */
		this.resize = function() {
			// Set the calculated widths
			this.replacement_container_div.css({width:this.linked_select_box.outerWidth()+'px'});
			
			// Set the heights
			var sel_opt_css = {
				width:(parseInt(this.replacement_container_div.innerWidth()-this.arrow_span.outerWidth()))+'px'
			};
			if (this.options.widget_height != null) {
				var rpcd_css = {
					height:this.options.widget_height + "px"
				};
				this.linked_select_box.css({height:this.options.widget_height + "px",
											lineHeight:(parseInt(this.options.widget_height)-2) + "px"});
				sel_opt_css['height'] = this.options.widget_height + "px";
				rpcd_css['lineHeight'] = (parseInt(this.options.widget_height)-2) + "px"; // default
				if ($.browser.msie && parseInt($.browser.version) <= 8) { // IE override
					rpcd_css['lineHeight'] = this.options.widget_height + "px";
				}
				this.replacement_container_div.css(rpcd_css);
			}
			else {
				sel_opt_css['height'] = this.linked_select_box.height() + "px";
			}
			this.selected_option_div.css(sel_opt_css);
		}
		
		/**
		 * Generate a list of <div> elements that contain the <optgroup> and <option>
		 * elements from the original <select> element, and add them to the
		 * 'replacement_container_div's DOM.
		 *
		 * @public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 */
		this.generateOptions = function() {
			this.replacement_options_div = $('<div></div>').addClass('styled_select_options_container');
			var replacement_options_html = this.linked_select_box.html();
			replacement_options_html = replacement_options_html
										.replace(/\<option/gi, '<div class="option"')
										.replace(/\<\/option/gi, '</div')
										.replace(/\<optgroup/gi, '<div class="optgroup"')
										.replace(/\<\/optgroup/gi, '</div');
			this.replacement_options_div.html(replacement_options_html);
			this.replacement_options_div.find('div.optgroup').each(function(index, optgroup) {
				$(optgroup).prepend($('<div></div>').html($(optgroup).attr('label')).addClass('optgroup_label'));
			});
			
			this.replacement_container_div.append(this.replacement_options_div);
		}
		
		/**
		 * Changes the display text and 'current value' for this widget, but the
		 * user has not yet committed to actually selecting the value and triggering
		 * the change event.
		 *
		 * @public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 *
		 * @param		current_option				jQuery				jQuery extended 'div.option' element indicating the currently highlighted <option>
		 * @param		current_option				jQuery				jQuery extended 'div.option' element indicating the <option> that we want to select
		 */
		this.triggerIntermediaryChange = function(current_option, new_option) {
			if (new_option != null && new_option.length > 0) {
				if (this.replacement_options_div.data('current_option') == null) {
					this.replacement_options_div.data('current_option', current_option);
				}
				this.replacement_options_div.data('new_option', new_option);
				
				if (this.replacement_options_div.hasClass('show')) {
					this.replacement_options_div.find('div.option').removeClass('highlight');
					new_option.addClass('highlight');
				}
				this.replacement_container_div.find('div.styled_select_option_display').html(new_option.html());
				this.current_value = new_option.attr('value');
			}
		}
		
		/**
		 * The user has committed to actually selecting the new option value, so
		 * we set the original <select> element's value and trigger the 'change'
		 * event, remove all option highlights, the current and new option data
		 * from the options div, and finally we hide the options div.
		 *
		 * @public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 *
		 * @param		new_value				mixed				A string or number indicating the value of an <option> element
		 */
		this.triggerValueChange = function(new_value) {
			this.linked_select_box.val(new_value).trigger('change');
			this.replacement_options_div.find('div.option').removeClass('highlight');
			this.replacement_options_div.removeData('current_option');
			this.replacement_options_div.removeData('new_option');
			this.replacement_options_div.removeClass('show');
		}
		
		/**
		 * The user has decided to cancel their change(s) to the selected value.
		 * If the options container div is being shown, we set the display text
		 * back to the original 'current option' text and reset the 'current value'
		 * to the original 'current option' value.
		 *
		 * Lastly, we remove all option highlights, the current and new option data
		 * from the options div, and finally we hide the options div.
		 *
		 * @public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 */
		this.undoIntermediateChanges = function() {
			if (this.replacement_options_div.hasClass('show')) {
				if (this.replacement_options_div.data('current_option') != null) {
					this.replacement_container_div.find('div.styled_select_option_display').html(this.replacement_options_div.data('current_option').html());
					this.current_value = this.replacement_options_div.data('current_option').attr('value');
				}
				this.replacement_options_div.find('div.option').removeClass('highlight');
				this.replacement_options_div.removeData('current_option');
				this.replacement_options_div.removeData('new_option');
				this.replacement_options_div.removeClass('show');
			}
		}
		
		/********* Event handlers *********/
		
		/**
		 * Handle simulating what the regular <select> element would do based on a click
		 * or keydown event, such that the replacement element(s) behave in a similar
		 * fashion.
		 *
		 * @public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 *
		 * @param		event				jQuery.Event				jQuery 'click', 'blur', or 'keydown' Event
		 */
		this.simulateSelectBoxEvent = function(event) {
			// FYI - 'this' variable === an instance of the StyledSelect class in this context
			
			var event_target = $(event.target);
			
			// Use the jQueryUI keyCode object if the user is using jQueryUI,
			// otherwise define what we need as we need them.
			var key_codes = ($.ui !== undefined ?
								$.ui.keyCode :
								{
									DOWN : 40,
									PAGE_DOWN : 34,
									UP : 38,
									PAGE_UP : 33,
									ENTER : 13,
									TAB : 9,
									ESCAPE : 27
								});
			
			if (event.type == 'keydown') {
				// The user pressed something on the keyboard...
				var new_option = null;
				var current_option = this.replacement_options_div.find('div.option[value="'+this.current_value+'"]');
				
				if (event.which == key_codes.ESCAPE) {
					this.undoIntermediateChanges();
				}
				else if ($.inArray(event.which, [key_codes.ENTER, key_codes.TAB]) != -1) {
					if (this.replacement_options_div.data('new_option') != null) {
						this.triggerValueChange(this.replacement_options_div.data('new_option').attr('value'));
					}
				}
				else {
					event.preventDefault();
					if (event.which == key_codes.DOWN) {
						new_option = current_option.next('div.option');
						if (new_option.length == 0) {
							new_option = current_option.next('div.optgroup').find('div.option').first();
						}
						if (new_option.length == 0) {
							new_option = current_option.parent('div.optgroup').next('div.optgroup').find('div.option').first();
						}
						if (new_option.length == 0) {
							new_option = current_option.parent('div.optgroup').next('div.option');
						}
					}
					else if (event.which == key_codes.PAGE_DOWN) {
						new_option = this.replacement_options_div.find('div.option').last();
					}
					else if (event.which == key_codes.UP) {
						new_option = current_option.prev('div.option');
						if (new_option.length == 0) {
							new_option = current_option.prev('div.optgroup').find('div.option').last();
						}
						if (new_option.length == 0) {
							new_option = current_option.parent('div.optgroup').prev('div.optgroup').find('div.option').last();
						}
						if (new_option.length == 0) {
							new_option = current_option.parent('div.optgroup').prev('div.option');
						}
					}
					else if (event.which == key_codes.PAGE_UP) {
						new_option = this.replacement_options_div.find('div.option').first();
					}
					else {
						// implement searching for elements
					}
					
					this.triggerIntermediaryChange(current_option, new_option);
				}
			}
			else if (event.type == 'focusout') {
				// The user's action removed focus from the replacement element...
				if (! this.replacement_options_div.is(':hover')) {
					//console.log('blurring!');
					if (this.replacement_options_div.hasClass('show')) {
						if (this.replacement_options_div.data('new_option') != null) {
							// ...and the user had started selecting a new option, so trigger the selection operation.
							this.triggerValueChange(this.replacement_options_div.data('new_option').attr('value'));
						}
						else {
							this.replacement_options_div.removeClass('show');
						}
					}
				}
			}
			else if (event.type == 'click') {
				// The user clicked on the element...
				if (event_target.closest('div.styled_select_options_container').length == 0) {
					// ...and it was not an option or an option group, so hide or show the list of options.
					this.replacement_options_div.toggleClass('show');
				}
				else if (event_target.hasClass('option')) {
					// ...and it was an option, so select that option and hide the list of options.
					this.triggerValueChange(event_target.attr('value'));
				}
			}
		}
		
		/**
		 * When the user selects a new <option> from the list of available values,
		 * or the default 'empty' value, it will update the 'styled_select_option_display'
		 * <div> element with the text of the newly selected <option>, and set the
		 * 'current_value' variable of this instance of the StyledSelect class
		 * to the value of the newly selected <option>.
		 *
		 * @public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 *
		 * @param		change_event			jQuery.Event				jQuery 'change' Event
		 */
		this.setCurrentSelectedTextAndValue = function(change_event) {
			// FYI - 'this' variable === an instance of the StyledSelect class in this context
			
			var select_box = this.linked_select_box.get(0);
			var opts = this.linked_select_box.find('option');
			var selected_option = opts[select_box.selectedIndex];
			if (selected_option != null) {
				this.replacement_container_div.find('div.styled_select_option_display').html(selected_option.text);
				this.current_value = selected_option.value;
			}
		}
		
		/**
		 * Set a max-height CSS property on all full replacement styled select
		 * elements based on the height of the viewport. Intended to avoid
		 * ugly scroll bars on the document viewport.
		 *
		 * @access		public
		 * @memberOf	StyledSelect
		 * @since		2.0
		 *
		 * @param		event					jQuery.Event				jQuery 'resize' Event
		 */
		this.resizeOptions = function(event) {
			var viewport_height = $(window).innerHeight();
			var new_max_height = viewport_height / 2;
			
			$('div.styled_select.styled-select-full-replacement').each(function(index, select_box) {
				$(select_box).find('div.styled_select_options_container').css({maxHeight:new_max_height+'px'});
			});
		}
	}
	
	/**
     * Constructor. Creates the new 'styled_select' <div> and its children, sets the indicator
     * arrow image based on the 'image_base' option, and determines the height of the new widget
     * based on the height of the original <select> widget. Creates all necessary event handlers for
     * changing options.
     *
     * @access		public
     * @memberOf	StyledSelectBox
     * @since		1.0
     * @updated		2.0
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
		 * @updated		2.0
		 */
		var default_options = {
			image_base : null,						// Location of directory where images are located. Default null. Required.
			classes : [],							// A set of additional class names that will get applied to the replacement 'styled_select' <div>. Default []. Optional.
			widget_height : null,					// The height of the widget in pixels. Default null. Optional.
			include_separator_border : true,		// Flag indicating whether to include a border separator between the dropdown arrow and the text content. Optional. Default true.
			z_index : null,							// Indicates a zIndex value for the new 'styled_select' <div>. Useful for when the default class-based zIndex is insufficient. Default null. Optional.
			full_replacement : false,				// Flag indicating whether this widget should completely replace the <select> widget and it child <option> and <optgroup> elements. Optional. Default false.
			multiline : false						// When in 'full_replacement' mode, this flag indicates whether the <option> element replacements should be multi-line. Optional. Default false.
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
		
		/********* Initialize the styled select box or call a specific function *********/
		if (typeof options_or_method == "string") {
			this.each(function(index, original_select_box) {
				var this_styled_select = $(original_select_box).data('styled_select');
				/* Call a specific function */
				
				if (options_or_method == 'resize') {
					// Resize the existing styledSelect widget according to the original select widget and
					// the options stored in the 'styled_select_options' data
					this_styled_select.resize();
				}
				else if (options_or_method == 'update') {
					this_styled_select.setCurrentSelectedTextAndValue();
				}
				
				$(original_select_box).data('styled_select', this_styled_select);
			});
		}
		else {
			options = $.extend(default_options, options_or_method);
			
			// First check for required options.
			if (options.image_base == null) {
				throw 'StyledSelectBox widget: no "image_base" option specified.';
				return this;
			}
			
			/* Initialize each styled select box */
			this.each(function(index, original_select_box) {
				var this_styled_select = new StyledSelect();
				this_styled_select.initStyledSelect($(original_select_box), options);
				$(original_select_box).data('styled_select', this_styled_select);
			});
		}
		
		/********* Return the newly extended element(s) for chaining *********/
		return this;
	}
})(jQuery);
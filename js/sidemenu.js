// Check if jQuery.js is loaded
try { jQuery; }
catch(err){ throw Error('You need to import jQuery.js for the plugin to work.'); }

// Check if Hammer.js is loaded
try { Hammer; }
catch(err){ throw Error('You need to import Hammer.js for the plugin to work.'); }

(function ($) {
	$.fn.mobileSideMenu = function( options ) {
		
		// ==================================================================
		// Configuration jQuery Plugin
		// ==================================================================

		// Setting Default Options
		var self 		= this,
			windowWidth	= window.innerWidth,
			settings 	= $.extend({
				leftZoneWidth: windowWidth / 15,
				allowOverlay: false,
				defaultStyle: true,
				pushContent: false,
				content: {},
			}, options );

		// Private Vars
		var body 			= $('body'),
			sideMenu 		= this,
			sideMenuWidth 	= this.outerWidth(true),
			leftZoneWidth	= settings.leftZoneWidth,
			allowOverlay 	= settings.allowOverlay,
			defaultStyle 	= settings.defaultStyle,
			pushContent 	= settings.pushContent,
			content 		= settings.content,
			sideMenuBg 		= {};

		// Public Vars
		self.isOpened = false;

		// Creates a Bg if allowed.
		if(allowOverlay) { 
			sideMenuBg = $('<div></div>').attr('data-mobile-sidemenu-bg', '');
			sideMenuBg.insertAfter(sideMenu);
		}

		// Apply Default Style if allowed
		if(defaultStyle) {
			sideMenu.addClass('default-style');
		}

		// Give a little time for the class to be applied and width calculated
		setTimeout(function(){
			sideMenuWidth = sideMenu.outerWidth(true);
			sideMenu.css('transform', 'translateX('+(-sideMenuWidth-10)+'px)');
		}, 50);

		// Apply data attribute for the style to be applied
		sideMenu.attr('data-mobile-sidemenu', '');

		// Apply data attribute to the content, if existent
		if(pushContent){
			try{
				content.attr('data-mobile-sidemenu-content', '');
				content.addClass('can-push');
				content.css('transform', 'translateX(0px)');
			} catch(err){
				throw Error('If you want a pushContent, you need to pass a content parameter to the initialization, which is a jQuery Object to push');
			}
		}


		// ==================================================================
		// Public Methods
		// ==================================================================
		// Close Side Menu
		this.close = function(){
			self = this;
			self.addClass('can-transition');
			self.css('transform', 'translateX('+(-sideMenuWidth)+'px)');

			// Bg if allowed
			if(allowOverlay){
				sideMenuBg.addClass('can-transition');
				sideMenuBg.css('opacity', 0);
			}
			// Pushing if allowed
			if(pushContent){
				content.addClass('can-transition');
				content.css('transform', 'translateX(0px)');
			}
			
			setTimeout(function(){
				self.removeClass('can-transition');
				self.isOpened = false;
				self.trigger('isClosed');
				self.removeClass('active');
				
				// Bg if allowed
				if(allowOverlay){
					sideMenuBg.removeClass('can-transition');
				}
				// Pushing if allowed
				if(pushContent){
					content.removeClass('can-transition');
				}
			}, 400);
		}
		// Open Side Menu
		this.open = function(){
			var self = this;
			self.addClass('can-transition');
			self.css('transform', 'translateX(0px)');

			// Bg if allowed
			if(allowOverlay){
				sideMenuBg.addClass('can-transition');
				sideMenuBg.css('opacity', 1);
			}
			// Pushing if allowed
			if(pushContent){
				content.addClass('can-transition');
				content.css('transform', 'translateX('+sideMenuWidth+'px)');
			}
			
			setTimeout(function(){
				self.removeClass('can-transition');
				self.isOpened = true;
				self.trigger('isOpened');
				self.addClass('active');
				
				// Bg if allowed
				if(allowOverlay){	
					sideMenuBg.removeClass('can-transition');
				}
				// Pushing if allowed
				if(pushContent){
					content.removeClass('can-transition');
				}
			}, 400);
		}

		// ==================================================================
		// Configuration Hammer.js
		// ==================================================================

		// Create Event Manager
		var MenuSwipe = new Hammer(body[0], {});
		MenuSwipe.get('pan').set({ 
			direction: Hammer.DIRECTION_HORIZONTAL,
			threshold: 0 
		});

		// Disable unnecessary events
		MenuSwipe.get('doubletap').set({ enable: false });
		MenuSwipe.get('press').set({ enable: false });
		MenuSwipe.get('swipe').set({ enable: false });
		MenuSwipe.get('pinch').set({ enable: false });
		MenuSwipe.get('rotate').set({ enable: false });

		// ==================================================================
		// Movement starts
		// ==================================================================
		// lastDeltaX makes the movement feels natural, following the same number of pixels the finger crossed
		var lastDeltaX = 0;

		MenuSwipe.on('panleft panright', function(evt) {

			// If Click was inside menu, ignore it
			if( sideMenu[0] == evt.target || $(evt.target).closest(sideMenu).length ) return false;

			var x 		= evt.center.x,
				deltaX 	= evt.deltaX;

			// Check if its left zone
			if(!self.isOpened && (x - deltaX) > leftZoneWidth) return false;

			var	sideMenuCurrentTranslate 	= parseTranslateX(sideMenu.css('transform')),
				finalTranslate				= sideMenuCurrentTranslate + (deltaX - lastDeltaX);

			if(finalTranslate > 0) finalTranslate = 0;
			if(finalTranslate < -sideMenuWidth) finalTranslate = -sideMenuWidth;

			sideMenu.css('transform', 'translateX('+finalTranslate+'px)');

			// Animate background if allowed
			if(allowOverlay){
				// Percentual
				var percentual 	= 1 - (-finalTranslate/sideMenuWidth);
				sideMenuBg.css('opacity', percentual);
			}

			// Push content if allowed
			if(pushContent){
				var finalTranslate = sideMenuWidth + finalTranslate;
				content.css('transform', 'translateX('+finalTranslate+'px)');
			}

			// End
			lastDeltaX = deltaX;
		})
		// ==================================================================
		// Movement ends
		// ==================================================================
		.on('panend', function(evt){
			
			// If Click was inside menu, ignore it
			if( sideMenu[0] == evt.target || $(evt.target).closest(sideMenu).length ) return false;

			// Restore values
			lastDeltaX 	= 0;

			// Check if send it to left or right
			sideMenuActualLeft = parseTranslateX(sideMenu.css('transform'));

			// Animate full to left (CLOSE)
			if(	sideMenuActualLeft*-1 > sideMenuWidth/1.3 ||
				sideMenuActualLeft*-1 < sideMenuWidth && self.isOpened) self.close();

			// Animate full to right (OPEN)
			else { self.open(); }
		})
		// Clicking outside menu
		.on('tap', function(evt){
			// If click was outside sidemenu
			if(self.isOpened && !$(evt.target).closest(sideMenu.selector).length) { self.close() };
		});

		// Make it possible to instantiate as a variable
		return this;
	};
	function parseTranslateX(str){
		var matrix = str.replace(/[^0-9\-.,]/g, '').split(',');
		return parseInt(matrix[4]);
	}
}( jQuery ));
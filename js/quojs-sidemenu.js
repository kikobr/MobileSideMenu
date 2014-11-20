// Initializations
var sideMenu 		= $$('#sidemenu'),
	sideMenuWidth 	= sideMenu[0].offsetWidth,
	windowWidth 	= window.innerWidth,
	accelFactor 	= windowWidth / (windowWidth*10),
	leftZoneWidth	= windowWidth / 15;

// Translate to pixels
sideMenu.vendor('transform', 'translateX('+(-sideMenuWidth-10)+'px)');
sideMenu.isOpened = false;

// Methods
sideMenu.close = function(){
	self = this;
	self.addClass('can-transition');
	self.vendor('transform', 'translateX('+(-sideMenuWidth-10)+'px)');
	setTimeout(function(){
		self.removeClass('can-transition');
		self.isOpened = false;
		self.trigger('isClosed');
		self.removeClass('active');
	}, 400);
}
sideMenu.open = function(){
	var self = this;
	self.addClass('can-transition');
	self.vendor('transform', 'translateX(0px)');
	setTimeout(function(){
		self.removeClass('can-transition');
		self.isOpened = true;
		self.trigger('isOpened');
		self.addClass('active');
	}, 400);
}

// ==================================================================
// Movement starts
// ==================================================================
var lastDeltaX = 0;
$$('body').swiping(function(e){

	var x 		= parseInt(e.touch.x),
		deltaX 	= parseInt(e.touch.delta.x);

	// Check if its left zone
	if(!sideMenu.isOpened && (x - deltaX) > leftZoneWidth) return false;

	var	sideMenuCurrentTranslate 	= parseTranslateX(sideMenu.style('transform')),
		finalTranslate				= sideMenuCurrentTranslate + (deltaX - lastDeltaX);

	// lastDeltaX makes the movement feels natural, following the same number of pixels the finger crossed
	lastDeltaX = deltaX;

	if(finalTranslate > 0) finalTranslate = 0;
	if(finalTranslate < -sideMenuWidth) finalTranslate = -sideMenuWidth;

	sideMenu.vendor('transform', 'translateX('+finalTranslate+'px)');
})
// ==================================================================
// Movement ends
// ==================================================================
.swipe(function(){
	lastDeltaX = 0;

	// Check if send it to left or right
	console.log(sideMenu.style('transform'));
	sideMenuActualLeft = parseTranslateX(sideMenu.style('transform'));

	// Animate full to left (CLOSE)
	if(	sideMenuActualLeft*-1 > sideMenuWidth/1.3 ||
		sideMenuActualLeft*-1 < sideMenuWidth && sideMenu.isOpened) sideMenu.close();

	// Animate full to right (OPEN)
	else { sideMenu.open(); }

})
.on('click', function(e){
	// If click was outside sidemenu
	if(sideMenu.isOpened && !$$(e.target).closest(sideMenu.selector).length) sideMenu.close();
});

console.log('here');
$$('.open-menu').on('click', function(){
	console.log('aee');
	sideMenu.open();
});


function parseTranslateX(str){
	return parseInt(str.replace(/translateX\((.?)(\d+)px\)/, '$1$2'))
}
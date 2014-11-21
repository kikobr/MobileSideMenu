MobileSideMenu
=

MobileSlideMenu is a draggable/swipe sidemenu plugin, using jQuery and Hammer.js. It takes advantage of CSS3 to make animations as smooth and light as possible, aiming to mobile devices. It mimics some behaviours from android's side menu.


## Setting it up
Include MobileSideMenu styles. You may also want to include a viewport to avoid bugs and unwanted scrolls.
```html
  <link rel="stylesheet" href="mobilesidemenu.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
```

Include jQuery, Hammer.js and then the plugin.
```html
    <!-- Dependencies -->
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="hammer.min.js"></script>
	<!-- MobileSideMenu -->
	<script type="text/javascript" src="mobilesidemenu.js"></script>
</body>
```


## Creating an html menu
Create a container inside document root (or wherever closest to there that you can get)
```html
<section id="sidemenu">		
	<ul>
		<li>
			<a href="#">Index</a>
		</li>
	</ul>
</section>
```


## Starting MobileSideMenu
That's really simple. Create a script tag below the previously imported ones and instantiate a menu.
```html
<!-- MobileSideMenu -->
<script type="text/javascript" src="mobilesidemenu.js"></script>
<script type="text/javascript">
  var sideMenu = $('#sidemenu').mobileSideMenu();
</script>
```


## Where's the options?
You can set some. By the time you have:
* **allowOverlay**: overlays content with a dark background when the menu is being swiped.
* **defaultStyle**: set to false if you want to get rid of the default styles applied to the sidemenu element. this will keep only the styles needed for the plugin to work.
* **pushContent**: set it to true if you want the menu to push content outside the screen.
* **content**: it's a jQuery Object of the content container. It's mandatory if you set pushContent to true. See index.html in this repository for an example.

#### Some tips about performance
You'll find that MobileSideMenu comes with allowOverlay and pushContent set to false as defaults. The reason for this is because it performs better on mobile devices. Depending on your needs, you can try out those options and see how they perform for your project. Just keep in mind that they add weight to the browser.

```javascript
var sideMenu = $('#sidemenu').mobileSideMenu({
	allowOverlay: false, // use with caution
	defaultStyle: true,
	pushContent: false, // use with caution
	content: {}, // jQuery Object, mandatory if you'll use pushContent
});
```

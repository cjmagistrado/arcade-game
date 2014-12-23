/* Resources.js
 * This is an image and sound loading utility.
 */
(function() {
	
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];
	
	var soundCache = {};
	var soundReadyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
		
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            _load(urlOrArr);
        }
    }
	
    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
	 
    function _load(url) {
		
    	if (resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
			
        }else{
			
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
				
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

               	 /* Once the image is actually loaded and properly cached,
                * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
					console.log("images ready");
                	readyCallbacks.forEach(function(func) { func(); });
                }
			}
				
        };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the images src attribute to the passed in URL.
             */
            resourceCache[url] = false;
			
           	img.src = url;
    }

    /* This is used by developer's to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been completed loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images and sounds are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
        soundReadyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
	
	/* Same process with sounds */
	function sLoad(urlOrArr) {
		
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _sLoad(url);
            });
        } else {
            _sLoad(urlOrArr);
        }
	}
	
    function _sLoad(url) {
		
    	if (soundCache[url]) {
			
            return soundCache[url];
			
        }else{
			
            var audio = new Audio();
            audio.onloadeddata = function() {
				
                soundCache[url] = audio;
				
                if(soundIsReady()) {
					console.log("sounds ready");
                	soundReadyCallbacks.forEach(function(func) { func(); });
                }
			}
        };
		
        soundCache[url] = false;
      	audio.src = url;
    }
	
    function sGet(url) {
        return soundCache[url];
    }
	
    function soundIsReady() {
        var ready = true;
        for(var k in soundCache) {
            if(soundCache.hasOwnProperty(k) &&
               !soundCache[k]) {
                ready = false;
            }
        }
        return ready;
    }
	
	window.Sounds = {
		load: sLoad,
		get: sGet,
	}
	
})();
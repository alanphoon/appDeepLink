/***********************************************
Jquery AppStore Deep Link Plugin
Version 1.0.0.js
Copyright (c) Alan Phoon, www.ampedupdesigns.com  
This notice MUST stay intact for legal use and may not be modified.
Licensed under GNU GENERAL PUBLIC LICENSE
***********************************************/

/* ==========================================================
 * appDeepLink.js v1.0.0
 * http://www.ampedupdesigns.com
 * ==========================================================
 * Copyright 2015 Alan Phoon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, http://www.gnu.org/licenses/.
 * ========================================================== */

(function($) {
  $.fn.extend({
     appDeepLink: function(options) {
        var defaults = {
            appleAppStoreLink: null,
            androidAppStoreLink: null,
            enableAppFallback: true,
            androidScheme: null,
            androidPackage: null
        };

        var options = $.extend(defaults, options);
        var _browserOS = (/(iPad|iPhone|iPod)/g.test( navigator.userAgent )) ? 'apple' : 'android';

        function launchIframeApproach(url) {
            var alt = (_browserOS == 'apple') ? options.appleAppStoreLink : options.androidAppStoreLink;
            $('<iframe id="appStore-iframe" />').attr('style', 'display:none;').appendTo('body'); 
            $('#appStore-iframe').on('load', function () {
                if(alt) {
                    document.location = alt;
                }
            });
            $('#appStore-iframe').attr('src', url);
        }

        function launchLocationSetApproach(url) {
            var alt = (_browserOS == 'apple') ? options.appleAppStoreLink : options.androidAppStoreLink;
            document.location = url;
            timer = setTimeout(function () {
                if(alt) {
                    document.location = alt;
                }
            }, 2500);
        }

        function launchiOSApp(url) {
            var now = new Date().valueOf();    
            setTimeout(function () {
                if (new Date().valueOf() - now > 500) return;
                $('#appStore-iframe').remove();
                if(options.enableAppFallback && options.appleAppStoreLink != null) {
                    window.location = options.appleAppStoreLink;
                }
            }, 100);
            $('<iframe id="appStore-iframe" />').attr('src', url).attr('style', 'display:none;').appendTo('body');         
        }

        function launchAndroidApp(url) {   
            var g_schemePackage = (options.androidScheme != null && options.androidPackage != null) ? "scheme=" + options.androidScheme + ";package=" + options.androidPackage + ";end" : null;
            if(typeof url == 'undefined' && options.enableAppFallback) {
                document.location = options.androidAppStore;
            } else if (navigator.userAgent.match(/Chrome/) && g_schemePackage != null) {
                var intent = url.replace(options.androidScheme,'intent') + '#Intent;' + g_schemePackage;
                document.location = intent;
            } else if (navigator.userAgent.match(/Firefox/)) {
                alert(url);
                launchLocationSetApproach(url, options.androidAppStoreLink);
                setTimeout(function () {
                    launchIframeApproach(url, options.androidAppStoreLink);
                }, 1500);
            } else {
                launchIframeApproach(url, options.androidAppStoreLink);
            }
        }
    
        function checkForApp(deeplink) {
            if(_browserOS == 'apple') {
                launchiOSApp(deeplink, options.enableAppFallback);
            }
            else {
                launchAndroidApp(deeplink, options.enableAppFallback);
            }
        }

        return this.each(function() {
            var o = options;
            var obj = $(this);
            var applink = obj.attr("data-deeplink");
            obj.on('click', function(e) {
                $(this).attr('disabled', true);
                e.preventDefault();
                checkForApp($(this).attr('data-deeplink'));
                $(this).removeAttr('disabled');
            });
            
        });

     }
  });
})(jQuery);
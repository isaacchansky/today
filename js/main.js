

(function function_name($) {
    historyData = {
        host: "http://history.muffinlabs.com/",

        /*
         * Lightweight JSONP fetcher
         * Copyright 2010-2012 Erik Karlsson. All rights reserved.
         * BSD licensed
         */

        /*
         * Usage:
         *
         * JSONP.get( 'someUrl.php', {param1:'123', param2:'456'}, function(data){
         *   //do something with data, which is the JSON object you should retrieve from someUrl.php
         * });
         */
        jsonP: (function(){
              var counter = 0, head, window = this, config = {};
              function load(url, pfnError) {
                    var script = document.createElement('script'),
                          done = false;
                    script.src = url;
                    script.async = true;

                    var errorHandler = pfnError || config.error;
                    if ( typeof errorHandler === 'function' ) {
                          script.onerror = function(ex){
                                errorHandler({url: url, event: ex});
                          };
                    }

                    script.onload = script.onreadystatechange = function() {
                          if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                                done = true;
                                script.onload = script.onreadystatechange = null;
                                if ( script && script.parentNode ) {
                                      script.parentNode.removeChild( script );
                                }
                          }
                    };

                    if ( !head ) {
                          head = document.getElementsByTagName('head')[0];
                    }
                    head.appendChild( script );
              }
              function encode(str) {
                    return encodeURIComponent(str);
              }
              function jsonp(url, params, callback, callbackName) {
                    var query = (url||'').indexOf('?') === -1 ? '?' : '&', key;

                    callbackName = (callbackName||config['callbackName']||'callback');
                    var uniqueName = callbackName + "_json" + (++counter);

                    params = params || {};
                    for ( key in params ) {
                          if ( params.hasOwnProperty(key) ) {
                                query += encode(key) + "=" + encode(params[key]) + "&";
                          }
                    }

                    window[ uniqueName ] = function(data){
                          callback(data);
                          try {
                                delete window[ uniqueName ];
                          } catch (e) {}
                          window[ uniqueName ] = null;
                    };

                    load(url + query + callbackName + '=' + uniqueName);
                    return uniqueName;
              }
              function setDefaults(obj){
                    config = obj;
              }
              return {
                    get:jsonp,
                    init:setDefaults
              };
        }()),
          load : function(options) {
                var callback, month, day, host;

                if ( typeof(options) == "function" ) {
                      callback = options;
                }
                else if ( typeof(options) == "object" ) {
                      callback = options.callback;
                      month = options.month;
                      day = options.day;
              }

                this.jsonP.get(this.host + '/date', {}, function(tmp) {
                        historyData.data = tmp.data;
                        historyData.url = tmp.url;
                        historyData.date = tmp.date;

                        if ( typeof(callback) == "function" ) {
                              callback(historyData.data);
                        }
                  });
          }
    }


    function _rt(key, text, animate) {
        var n =  $('[data-bind="'+key+'"]');
        n.html(text)
        if(animate) {
            n.addClass('is-rendered')
        }

    }

    var MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    var DAYS = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]


    var today = new Date();
    var todaysDateString = [
            MONTHS[today.getMonth()],
            today.getDate(),
        ].join(' ')

    _rt('date-today', todaysDateString, true);



    // class for active link
    window.addEventListener('hashchange', function() {
        $('a').removeClass('is-active');
        $('a[href="'+window.location.hash+'"]').addClass('is-active');
    })

    // init route
    window.location.hash = '';
    window.location.hash = 'events';


    function dataToTimelineHTML(item) {
        return [
            '<div class="timeline-item">',
                '<span class="timeline-year">',
                item.year,
                '</span>',
                '<p class="timeline-text">',
                item.html,
                '</p>',
            '</div>'
        ].join('')
    }

    function revSort(a,b) {
        return b.year - a.year
    }

    // Get data.
    historyData.load(function(data) {
        data.Events = data.Events.sort(revSort)
        data.Births = data.Births.sort(revSort)
        data.Deaths = data.Deaths.sort(revSort)
        var eventsHTML, birthsHTML, deathsHTML
        eventsHTML = data.Events.map(dataToTimelineHTML).join('')
        birthsHTML = data.Births.map(dataToTimelineHTML).join('')
        deathsHTML = data.Deaths.map(dataToTimelineHTML).join('')

        _rt('events', eventsHTML)
        _rt('births', birthsHTML)
        _rt('deaths', deathsHTML)
    });


})(jQuery)

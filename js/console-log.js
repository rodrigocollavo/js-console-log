/*
* jQuery UI Console-Log
*
* @version v1.0 (07/2014)
*
* Copyright 2014, Rodrigo Collavo
* Released under the MIT license.
* http://github.com/rodrigocollavo/js-console-log/LICENSE
*
* Homepage:
*   http://github.com/rodrigocollavo/js-console-log/
*
* Dependencies:
*   jQuery v1.4+
*   jQuery UI v1.8+
*/
(function($) {
    $.widget('ui.consolelog', {
        options: {
            width: 400,
            height: 300,
            minHeight:200,
            maxHeight: 600,
            ajaxUrl: null,
            preProcessDelegate: null,
            customAjaxRequestDelegate: null, /* function (successCallback, failedCallback) {}*/
            onAjaxRequest: null,
            onAjaxResult: null, /* function(success) {} */
            onResize: null,
            poll: 1000,
            maxLines: 300,
            fixRN: true,
            autoscroll: true
        },
        _create: function() {
            this.element.addClass('console-log');

            this.scroller = $('<div>');
            this.dataContainer = $('<div>');
            this.scroller.addClass('messages');
            this.dataContainer.addClass('msg');
            //this.dataContainer.height(this.options.height + "px");
            this.dataContainer.css('overflow', 'auto');
            this.scroller.append(this.dataContainer);
            this.element.append(this.scroller);

            var that = this;

            this.element.resizable({
                resize : function(event, ui) {
                    that.scroller.height(that.element.height());
                    if(that.options.onResize)
                        that.options.onResize();
                },
                minHeight : that.options.minHeight,
                maxHeight : that.options.maxHeight
            });

            this.scroller.height(this.options.minHeight);
        },
        start: function() {
            this.updateConsole();
        },
        updateConsole: function() {
            this.currentAjaxRequest = null;
            this.currentTimeout = null;

            if (this.loading)
                return;

            if (this._pause)
                return;

            this.loading = true;

            //call delegate
            if(this.options.onAjaxRequest)            
                this.options.onAjaxRequest();

            var that = this;

            var onSuccess = function(data) {
                that.loading = false;
                if(that.options.onAjaxResult)
                    that.options.onAjaxResult(true);

                if(that.options.preProcessDelegate)
                    data = that.options.preProcessDelegate(data);

                that.addData(data);
                that.currentTimeout = setTimeout(function() {that.updateConsole();}, that.options.poll);
            };

            var onFailed = function(xhr, s, t) {
                if(that.options.onAjaxResult)
                    that.options.onAjaxResult(false);

                that.loading = false;
                if (xhr.status === 416 || xhr.status == 404) {
                    /* 416: Requested range not satisfiable: log was truncated. */
                    /* 404: Retry soon, I guess */
                    that.addData("");
                    currentTimeout = setTimeout(that.updateConsole, poll);
                } else {
                    if (s == "error")
                        that.error(xhr.statusText);
                }
            };

            if(this.options.customAjaxRequestDelegate)
                this.currentAjaxRequest = this.options.customAjaxRequestDelegate(function(data) {
                        onSuccess(data);
                    }, function(xhr, s, t) {
                        onFailed(xhr, s, t);
                    });
            else {
                if(!this.options.ajaxUrl)
                    throw Error('ajaxUrl not defined');

                $.ajax(this.options.ajaxUrl, {
                    cache : false,
                    success : function(data) {
                        onSuccess(data);
                    },
                    error : function(xhr, s, t) {
                        onFailed(xhr, s, t);
                    }
                });
            } 
        },
        addData: function(data) {
            if (this._pause)
                return;

            if (data == null || data.length == 0)
                return;

            if (this.options.fixRN) {
                data = data.replace(/\n/g, "<br/>");
            }

            this.dataContainer.append(data);

            if(this.options.autoscroll)
                this.scroller.scrollTop(this.dataContainer.height());

            this.trim();
        },
        autoscroll: function(value) {
            if(value === undefined) {
                return this.options.autoscroll;
            }
            else {
                this.options.autoscroll = value;
            }
        },
        error: function(what) {
            //throw error
        },
        pause: function() {
            this._pause = true;
        },
        resume: function() {
            this._pause = false;
            if(this.currentAjaxRequest == null && this.currentTimeout == null) this.updateConsole();
        },
        trim: function() {
            var dataobj = this.dataContainer[0];
            var nodes = [].slice.call(dataobj.childNodes, dataobj.childNodes.length - this.options.maxLines);
            while (dataobj.firstChild) {
                dataobj.removeChild(dataobj.firstChild);
            }
            for (var index in nodes) {
                dataobj.appendChild(nodes[index]);
            }
        },
        reset: function() {
            if(this.currentAjaxRequest) this.currentAjaxRequest.abort();
            if(this.currentTimeout) clearTimeout(this.currentTimeout);
            this.currentAjaxRequest = null;
            this.currentTimeout = null;

            this.dataContainer.html("");
            this.scroller.scrollTop(this.dataContainer.height());
        }
    });
})(jQuery);

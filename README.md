JS - Console Log
----------------

Description
-----------
Customizable console for logging, with properties like resizing,
auto-update every X milliseconds, custom Ajax calls, and more.

Sample URL:  
http://rodrigocollavo.github.io/js-console-log/

Use
---
        <div id="console-log">
        </div>

        <script>
            $(function() {
                $("#console-log").consolelog({
                    ajaxUrl: 'text.txt'
                });
                $("#console-log").consolelog('start');
            });
        </script>


Options
-------
**width:** console width

**height:** console height

**minHeight:** console min height

**maxHeight:** console max height

**ajaxUrl:** url with the updated content to append in the console.
		 If this value is null, customAjaxRequestDelegate must
		 be implemented.
		 
**preProcessDelegate:** delegate method triggered after receive server
					response and before showing the data on the console
					
**customAjaxRequestDelegate:** if ajaxUrl is not defined, a custom request
						   can be processed with this delegate.
						   successCallback and failedCallback must be
						   called with the answers.
						   
**onAjaxRequest:** delegate method triggered before starting the ajax
			   request.
			   
**onAjaxResult:** delegate method triggere after receive server response
              with a success boolean indicating the result (Useful for
              loading icons, error messages, etc)
              
**onResize:** event triggered when console is resized

**poll:** poll time in milliseconds

**maxLines:** max log lines (old logs will be removed when max is reached)

**fixRN:** automatically fix \r\n and replace it by <br/>

**autoscroll:** initial autoscroll value
        
Methods
-------
**start:** start console

**autoscroll:** get/set, retrive or set autoscroll property

**pause:** pause console

**resume:** resume console

**reset:** reset console current content

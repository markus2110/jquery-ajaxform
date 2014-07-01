/* 
 * The MIT License
 *
 * Copyright 2014 Markus Sommerfeld (markus@simpleasthat.eu).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

(function($) {

    /**
     *
     * @type Object
     */
    var defaults = {
        
        beforeSubmit: function(form) {
            console.log(form.formDataArray, form.formDataString)
        },
        
        afterSubmit: function(response, form) {
            console.log(response, form.formDataString)
        },
        
        onError : function(form, jqXHR, textStatus, errorThrown){
            console.log(form, jqXHR, textStatus, errorThrown);
        }
    };
    /**
     *
     * @param {opject} options
     * @param {jqueryObject} element
     * @returns {MyPluginName}
     */
    var SatAjaxForm = function(options, element) {
        
        this.options = options;
        
        this.element = element;
        
        this.extractProperties();
        
        this.disableDefaultBehavior();
        
        return this;
    };
    
    /**
     * The Plugin Prototype
     */
    SatAjaxForm.prototype = {
        element: null,
        
        options: null,
        
        url : null,
        
        method : 'post',
        
        dataType : 'json',
        
        formDataArray : null,
        
        formDataString : null,
        
        extractProperties : function(){
            
            // set the submit url
            this.url    = this.element.attr('action');
            
            // set the submit method
            this.method = this.element.attr('method');
            
            this.dataType = this.element.attr('data-type');
            
        },
        
        /**
         * 
         * @returns {void}
         */
        disableDefaultBehavior : function(){
            this.element.find('input[type="submit"]').bind('click', this, this.submit);
            // clear the action url
            this.element.attr('action', '#');
        },
        
        /**
         * 
         * @param {type} event
         * @returns {Boolean} false to prevent default submit behavior
         */
        submit : function(event){
            var _this = event.data;

            _this.formDataArray     = _this.element.serializeArray();
            _this.formDataString    = _this.element.serialize();

            // trigger before submit event
            _this.options.beforeSubmit(_this);
            
            $.ajax({
                url         : _this.url,
                data        : _this.formDataString,
                dataType    : _this.dataType,
                type        : _this.method,

                //beforeSend  :  ,

                //complete    : ,

                error : function( jqXHR, textStatus, errorThrown ){
                    _this.options.onError(_this, jqXHR, textStatus, errorThrown);
                },
                
                success : function(data, textStatus, jqXHR ){
                    _this.options.afterSubmit(data, _this);
                }
            });
            
            return false;
        },
        
        
        getSelector: function() {
            return this.element.selector;
        }
    };
    
    
    /**
     * 
     * @param {type} options
     * @returns {undefined}
     */
    $.fn.satAjaxForm = function(options) {
        var options;
        options = $.extend({}, $.fn.satAjaxForm.defaults, options);


        this.each(function() {
            new SatAjaxForm(options, $(this));
        });
    };
    
    /**
     * 
     */
    $.fn.satAjaxForm.defaults = defaults;
    
    
//    function debug(obj){
//        console.log('Debug', obj);
//    };
})(jQuery);



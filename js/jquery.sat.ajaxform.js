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

        enableMessage : true,

        messagePosition : 'top', // or bottom

        messageMarkup : '<div></div>',

        successMessage : null,

        successClass : 'success',

        errorMessage : null,

        errorClass : 'error',

        beforeSubmit: function(form) {},

        afterSubmit: function(response, form) {},

        onError : function(form, jqXHR, textStatus, errorThrown){}
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

        this.init();

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


        init : function(){
            // is form valid for ajax submit
            if(this.checkForm()){
                this.extractProperties();
                this.disableDefaultBehavior();
                this.injectMessageBox();
            }

            // not valid, show message
            else{
                var mBox = $(this.options.messageMarkup);
                mBox.addClass('sat_ajaxform message_box');
                mBox.addClass(this.options.errorClass);
                mBox.html('<strong>Ups!</strong><br />The form might be not valid for a AJAX submit');
                this.element.prepend(mBox);
            }
        },

        checkForm : function(){
            // check is upload form
            if(typeof this.element.attr('enctype') !== 'undefined' && this.element.attr('enctype')==='multipart/form-data'){
                return false;
            }

            return true;
        },

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
            var submitBtn;

            // find input type=submit
            submitBtn = this.element.find('input[type="submit"]');

            // no input type, try to find button type=submit
            if(submitBtn.length === 0){
                submitBtn = this.element.find('button[type="submit"]');
            }

            submitBtn.bind('click', this, this.submit);

            // clear the action url
            this.element.attr('action', '#');
        },

        /**
         * Injects a message container to display Error or Success message
         *
         * @returns {void}
         */
        injectMessageBox : function(){
            if(this.options.enableMessage){
                var mBox = $(this.options.messageMarkup);
                mBox.addClass('sat_ajaxform message_box');
                mBox.css('display', 'none');
                switch(this.options.messagePosition){
                    case 'bottom':
                        this.element.append(mBox);
                        break;

                    case 'top':
                    default:
                        this.element.prepend(mBox);
                        break;
                }
            }
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

                error : function( jqXHR, textStatus, errorThrown ){
                    _this.onError(jqXHR, textStatus, errorThrown);

                },

                success : function(response, textStatus, jqXHR ){
                    _this.onSuccess(response, textStatus, jqXHR);
                }
            });

            return false;
        },


        /**
         *
         * @param {obj} jqXHR
         * @param {string} textStatus
         * @param {string} errorThrown
         * @returns {void}
         */
        onError : function(jqXHR, textStatus, errorThrown){
            // show error response, if messageBox is enabled
            var
                messageBox = this.element.find('.message_box'),
                message = (this.options.errorMessage) ? this.options.errorMessage : errorThrown;
            ;
            if(messageBox.length > 0){
                messageBox.show();
                messageBox.addClass(this.options.errorClass);
                messageBox.html(message);
            }

            // trigger onError Event
            this.options.onError(this, jqXHR, textStatus, errorThrown);
        },


        /**
         *
         * @param {mixed} response
         * @param {string} textStatus
         * @param {object} jqXHR
         * @returns {void}
         */
        onSuccess : function(response, textStatus, jqXHR){

            var
                messageBox = this.element.find('.message_box'),
                message = null
            ;

            // has message ?
            message = this.getMessage(response);

            if(messageBox.length > 0 && message){
                messageBox.show();
                messageBox.addClass(this.options.successClass);
                messageBox.html(message);
            }

            // trigger afterSubmit Event
            this.options.afterSubmit(response, this);
        },

        /**
         *
         * @param {mixed} response
         * @returns {Boolean|json.message|_L27.SatAjaxForm.options.successMessage|_L27.SatAjaxForm.options.errorMessage}
         */
        getMessage : function(response){
            var message;
            // is json
            switch(this.dataType){
                case 'json':
                    message = this.parseJSON(response);
                    break;

                case 'html':
                default:
                    message = response;
                break;
            }

            return message;
        },

        /**
         *
         * @param {JSON} json
         * @returns {json.message|_L27.SatAjaxForm.options.successMessage|_L27.SatAjaxForm.options.errorMessage|Boolean}
         */
        parseJSON : function(json){

            var message;

            // success = false
            if(!json.success){
                message = (typeof json.message !== "undefined" ) ? json.message : this.options.errorMessage;
                this.onError(json, 'error', message);
                return false;
            }

            // success = true
            if(json.success){
                message = (typeof json.message !== "undefined" ) ? json.message : this.options.successMessage;
                return message;
            }
        },



        /**
         *
         * @returns {_L27.SatAjaxForm.element.selector}
         */
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

})(jQuery);



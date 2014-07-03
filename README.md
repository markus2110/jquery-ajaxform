jquery-ajaxform
===============

jquery plugin to submit form data as XMLHttpRequest (AJAX)



```html
...
<form name="ajaxform" method="post" action="post.php" data-type="html">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" />
    <label for="password">Password</label>
    <input type="text" id="password" name="password" />
    <input type="submit" name="postForm" value="Login" />
</form>
...
<script type="text/javascript">
    jQuery(function() {
        $('form').satAjaxForm({
            // inject message container
            enableMessage   : true,

            // message container position (top | bottom)
            messagePosition : 'top',

            // message container html ( bootstrap alert )
            messageMarkup : '<div class="alert"></div>',

            // show this message on success
            successMessage : 'Form is OK',

            // class to add to the message container on success
            successClass : 'alert-success',

            // show this message on error
            errorMessage   : 'Sorry ... ERROR',

            // class to add to the message container on error
            errorClass : 'alert-danger',

            // do something before submit the form
            beforeSubmit : function(form){
                ...
            },

            // do something after successfully submitting the form
            afterSubmit : function(data, form){
                ...
            },

            // do something on error
            onError : function(form, jqXHR, textStatus, errorThrown){
                ...
            }
        });
    });
</script>
...
```

###Public Events
Event name | Parameters | Description
--- | --- | ---
| beforeSubmit | `SatAjaxForm` |
| afterSubmit | `Response`, `SatAjaxForm` |
| onError | `SatAjaxForm`, `jqXHR`, `textStatus`, `errorThrown` |

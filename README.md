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
  jQuery(function(){
     $('form').satAjaxForm();
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

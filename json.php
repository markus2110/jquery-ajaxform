<?php


$html = array(
        '<strong>Something went wrong </strong><br /><small>SUCCESS : false</small>',
);

die(json_encode(array('success' => false, 'message' => implode("",$html))));


?>
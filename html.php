<?php

print_r($_POST);
print_r($_FILES);

$html = array(
        '<strong>Alles OK</strong>',
);
die(implode("\n",$html));
?>
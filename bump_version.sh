#!/usr/bin/php

# PHP shell script to bump a new version into the readme file
<?php

if (!isset($argv[1])) {
    die("Error:\nEnter a new version number!\n\n");
}

if (file_exists('README.md')) {
    $file = file_get_contents('README.md');
    preg_match("/Version\:\s{1,1}.*/", $file, $match);
    $versionStr = trim($match[0]);

    echo "Found: ".$versionStr."\n";

    $versionNo = explode(" ", $versionStr);
    $newV = $versionNo[0] . ' ' . $argv[1]. " - ".date('Y-m-d H:i:s');
    $newFile = str_replace($versionStr, $newV, $file);
    if (file_put_contents('README.md', $newFile)) {
        die("Version bumped to " . $argv[1] . "\n");
    }
}

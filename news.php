<?
header ('Content-type: text/xml');

print '<?xml version="1.0" encoding="windows-1251"?>'."\n";
print '<FEELEE_News>'."\n";

include ($current_path.'include/download/news/enumerate.php');

for ($cntr = 0; $cntr < count ($news_to_show); $cntr ++ ) {
     $news_xml = '';
     include ($current_path.'include/download/news/fetch.php');

     print $news_xml."\n";
}

print '</FEELEE_News>';
?>
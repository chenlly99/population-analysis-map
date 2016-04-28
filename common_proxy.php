<?php
/*
 * $url=$_GET['url'].'?'.'&ltlat='.$_GET['ltlat'].'&ltlng='.$_GET['ltlng'].'&rblat='.$_GET['rblat'].'&rblng='.$_GET['rblng'];
 * echo $info;exit;
 *
 */
	if (! function_exists ( 'callHttpGET' )) 
	{
		function callHttpGET($url, $params = null) 
		{
			$get_url = '';
			foreach ( $params as $key => $value ) {
				if (isset ( $value )) {
					$get_url .= $key . '=' . $value . '&';
				}
			}
			$get_url = rtrim ( $get_url, '&' );
			$url = $url . '?' . $get_url;
			return $url;
		}
	}
	
	$url = base64_decode ( $_GET ['url'] );
	$data ['type'] = isset ( $_GET ['type'] )? $_GET ['type'] : null;
	$data ['cdScenicId'] = isset($_GET['cdScenicId']) ? $_GET['cdScenicId']: null;
	$data ['cdEndTime'] = isset($_GET['cdEndTime']) ? urlencode($_GET['cdEndTime']) : null;
	$data ['cdlink'] = isset($_GET['cdlink']) ? $_GET['cdlink']: null;
	
	
	$uri = callHttpGET ( $url, $data );
	$info = file_get_contents($uri);
	$responseInfo = $http_response_header;
	$ret = -1;//ret:0--成功； -1--失败； 1 --数据为空；2--没有权限
	if(!empty($responseInfo)){
		foreach ($responseInfo as $k => $v) {
			if(strpos($v,'ret') !== false){
				$ret = trim(substr($v,(strpos($v,':') + 1)));
			}
		}
	}
	if(!empty($info)){
		$info = json_decode($info,true);
	}
	$info['ret'] = $ret;
	echo json_encode($info);exit;
?>
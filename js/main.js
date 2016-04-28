var opts = {
		map: null,//百度地图实例
		echarts: null,
		ecConfig: null,
		
		center:[53640424/460800, 18388081/460800],//默认中心点是北京
		zoom:11,
		
		scenicId: null,//当前显示的景区ID
		hotPoints: {"points":[], "max": null},//热力区
        scenicData: null, //每个景区热力图数据
		heatmapOverlay: null,//热力区对象
		c1:0, c2:0, c3:0, c4:0,
		
		type: "scenicList",
		state: "now",
		lineId: "all"
};

var Echarts = {
		init: function(){
			require.config({
		        paths: {
		            echarts: './js'
		        }
		     });
			 require(
		        [
					'echarts',
					'echarts/chart/theme/default',
					'echarts/chart/line',
					'echarts/chart/bar',
					'echarts/chart/scatter',
					'echarts/chart/k',
					'echarts/chart/pie',
					'echarts/chart/radar',
					'echarts/chart/force',
					'echarts/chart/chord',
					'echarts/chart/gauge',
					'echarts/chart/funnel',
					'echarts/chart/eventRiver',
					'echarts/chart/venn',
					'echarts/chart/treemap',
					'echarts/chart/tree',
					'echarts/chart/wordCloud',
					'echarts/chart/heatmap',
					'echarts/chart/map'
		        ],
		        function (ec) {
		        	opts.echarts = ec;
		        }
		    );
			opts.ecConfig = require('echarts/config');
		},
};
var Charts = {
		myChart: null,
		dayChart: null,
		date: null, //日期
		option: {
			backgroundColor: '#ffffff',
		    title : {
		        text: '',
		        subtext: ''
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['进入人数','离开人数']
		    },
		    toolbox: {
		        show : false,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            axisLabel: {
		            	clickable: true
		            },
		            data : [] //'1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'进入人数',
		            type:'bar',
		            tooltip:{
		            	show: true,
		            	enterable: true
		            },
		            data:[], //2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最多'},
		                    {type : 'min', name: '最少'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'离开人数',
		            type:'bar',
		            data:[], //2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
		            markPoint : {
		                data : [
		                    {type : 'max', name : '最多'},
		                    {type : 'min', name : '最少'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name : '平均值'}
		                ]
		            }
		        }
		    ]
		},
		dayOption: {
			backgroundColor: '#ffffff',
		    title : {
		        text: '', //20160110
		        subtext: '',
		        x: "center",
		        y: "30"
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['进入人数','离开人数']
		    },
		    toolbox: {
		        show : false,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: false},
		            saveAsImage : {show: false}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            data : [] //'1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'进入人数',
		            type:'bar',
		            data:[], //2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最多'},
		                    {type : 'min', name: '最少'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'离开人数',
		            type:'bar',
		            data:[], //2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
		            markPoint : {
		                data : [
		                    {type : 'max', name : '最多'},
		                    {type : 'min', name : '最少'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name : '平均值'}
		                ]
		            }
		        }
		    ]
		},
		initClickBarItem: function(){
			Charts.myChart.on(opts.ecConfig.EVENT.CLICK, function(param){
				Charts.date = param.name.replace("年", "").replace("月","").replace("日", "");
				Charts.getOneDayScenicHeadData();
			});
		},
		init: function(){
			//Charts.option = {};
			
			Golbal.showMarkLayer();//显示loading
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/scenicList"), function(data){
			Golbal.getJSON("/unicom/scenicList", function(data){
				Golbal.handleJSON(data, "scenicList");
				if(data){
					Charts.getScenicHeadData(function(data){//加载每个景区数据
						Golbal.hideMarkLayer();//隐藏loading 
					});
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			}, null);
		},
		getScenicHeadData: function(fn, startTime, endTime){
			if(typeof fn == "function"){
				
			}else{
				Golbal.showMarkLayer();//显示loading
			}
			var url = "";
			if(startTime && endTime){
				//url = "common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultScenicInout") + "&type=1&cdScenicId=" + opts.scenicId + "&cdStartTime=" + startTime + "&cdEndTime=" +  endTime;
				url = "/unicom/resultScenicInout?type=1&cdScenicId=" + opts.scenicId + "&cdStartTime=" + startTime + "&cdEndTime=" +  endTime;
			}else{
				//url = "common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultScenicInout") + "&type=1&cdScenicId=" + opts.scenicId;
				url = "/unicom/resultScenicInout?type=1&cdScenicId=" + opts.scenicId;
			}
			Golbal.getJSON(url, function(json){
				if(json){
					Charts.option.xAxis[0].data = [];
					Charts.option.series[0].data = [];//进入人数
					Charts.option.series[1].data = [];//出园人数
					
					var computeAttributionData = json.data[0];
					if(computeAttributionData.length > 0){
						for(var i=computeAttributionData.length-1; i>=0; i--){
							var _item = computeAttributionData[i];
							Charts.option.xAxis[0].data.push(_item.reTime.slice(0,4) + "年" + _item.reTime.slice(4,6) + "月" + _item.reTime.slice(6,8) + "日");
							Charts.option.series[0].data.push(+_item.inNumber);
							Charts.option.series[1].data.push(+_item.outNumber);
							
							if(i == computeAttributionData.length-1){
								Charts.date = _item.reTime;
							}
						}
					}
					Charts.refresh();
					Charts.initClickBarItem();
					Charts.getOneDayScenicHeadData();
				}
				if(typeof fn == "function"){
					 fn(json);
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			}, null);
		},
		refresh: function(key){
			if (Charts.myChart && Charts.myChart.dispose) {
				Charts.myChart.dispose();
		    }
			Charts.myChart = opts.echarts.init(document.getElementById('data-chart-top'), {});
		    window.onresize = Charts.myChart.resize;
		    Charts.myChart.setOption(Charts.option, true);
		},
		getOneDayScenicHeadData: function(){
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultScenicInout") + "&cdEndTime=" + Charts.date + "&type=2&cdScenicId=" + opts.scenicId, function(json){
			Golbal.getJSON("/unicom/resultScenicInout?cdEndTime=" + Charts.date + "&type=2&cdScenicId=" + opts.scenicId, function(json){
				if(json){
					Charts.dayOption.title.text = Charts.date.slice(0, 4) + "年" + Charts.date.slice(4,6) + "月" + Charts.date.slice(6, 8) + "日";
					Charts.dayOption.xAxis[0].data = [];
					Charts.dayOption.series[0].data = [];//进入人数
					Charts.dayOption.series[1].data = [];//出园人数
					
					var computeAttributionData = json.data[0];
					if(computeAttributionData.length > 0){
						for(var i=0; i<computeAttributionData.length; i++){
							var _item = computeAttributionData[i];
							Charts.dayOption.xAxis[0].data.push(Number(_item.reTime.split(" ")[1])+"时");
							Charts.dayOption.series[0].data.push(+_item.inNumber);
							Charts.dayOption.series[1].data.push(+_item.outNumber);
						}
					}
					Charts.refreshDay();
				}
			}, null);
		},
		refreshDay: function(){
			if (Charts.dayChart && Charts.dayChart.dispose) {
				Charts.dayChart.dispose();
		    }
			Charts.dayChart = opts.echarts.init(document.getElementById('data-chart-bottom'), {});
		    window.onresize = Charts.dayChart.resize;
		    Charts.dayChart.setOption(Charts.dayOption, true);
		}
};
var MapTransfer = {
		myChart: null, 
		option:{
			backgroundColor: '#1b1b1b',
		    color: ['gold','aqua','lime'],
		    title : {
		        text: '',
		        subtext:'',
		        x:'center',
		        textStyle : {
		            color: '#fff'
		        }
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: '{b}'
		    },
		    legend: {
		        orient: 'vertical',
		        x:'left',
		        data:[],//'北京 Top10', '上海 Top10', '广州 Top10'
		        selectedMode: 'single',
		        selected:{},//'上海 Top10' : false,'广州 Top10' : false
		        textStyle : {
		            color: '#fff'
		        }
		    },
		    toolbox: {
		        show : true,
		        orient : 'vertical',
		        x: 'right',
		        y: 'center',
		        feature : {
		            mark : {show: false},
		            dataView : {show: true, readOnly: false},
		            restore : {show: false},
		            saveAsImage : {show: false}
		        }
		    },
		    dataRange: {
		        min : 0,
		        max : 100,
		        calculable : true,
		        color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
		        textStyle:{
		            color:'#fff'
		        }
		    },
		    series : [
		        {
		            name: '全国',
		            type: 'map',
		            roam: true,
		            hoverable: false,
		            mapType: 'china',
		            itemStyle:{
		                normal:{
		                    borderColor:'rgba(100,149,237,1)',
		                    borderWidth:0.5,
		                    areaStyle:{
		                        color: '#1b1b1b'
		                    }
		                }
		            },
		            data:[],
		            markLine : {
		                smooth:true,
		                symbol: ['none', 'circle'],  
		                symbolSize : 1,
		                itemStyle : {
		                    normal: {
		                        color:'#fff',
		                        borderWidth:1,
		                        borderColor:'rgba(30,144,255,0.5)'
		                    }
		                },
		                data : [],//[{name:'北京'},{name:'包头'}],
		            },
		            geoCoord: {}//'上海': [121.4648,31.2891],
		        },
		        {
		            name: '',//世园会
		            type: 'map',
		            mapType: 'china',
		            data:[],
		            markLine : {
		                smooth:true,
		                effect : {
		                    show: true,
		                    scaleSize: 1,
		                    period: 30,
		                    color: '#fff',
		                    shadowBlur: 10
		                },
		                itemStyle : {
		                    normal: {
		                        borderWidth:1,
		                        lineStyle: {
		                            type: 'solid',
		                            shadowBlur: 10
		                        }
		                    }
		                },
		                data : [] //[{name:'北京'}, {name:'上海',value:95}],
		            },
		            markPoint : {
		                symbol:'emptyCircle',
		                symbolSize : function (v){
		                    return 10 + v/10
		                },
		                effect : {
		                    show: true,
		                    shadowBlur : 0
		                },
		                itemStyle:{
		                    normal:{
		                        label:{show:false}
		                    },
		                    emphasis: {
		                        label:{position:'top'}
		                    }
		                },
		                data : []//{name:'上海',value:95},
		            }
		        }
		    ]
		},
		init: function(){
			//MapTransfer.option = {};
			
			Golbal.showMarkLayer();//显示loading
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/scenicList"), function(data){
			Golbal.getJSON("/unicom/scenicList", function(data){
				Golbal.handleJSON(data, "scenicList");
				if(data){
					MapTransfer.getScenicHeadData(function(data){//加载每个景区数据
						Golbal.hideMarkLayer();//隐藏loading 
					});
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			}, null);
		},
		getScenicHeadData: function(fn){//加载每个景区数据
			if(typeof fn == "function"){
				
			}else{
				Golbal.showMarkLayer();//显示loading
			}
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/computeAttribution") + "&cdScenicId=" + opts.scenicId, function(json){
			Golbal.getJSON("/unicom/computeAttribution?cdScenicId=" + opts.scenicId, function(json){
				if(json){
					MapTransfer.option.legend.data = []; //'北京 Top10', '上海 Top10', '广州 Top10'
					MapTransfer.option.legend.selected = {}; //'上海 Top10' : false,'广州 Top10' : false
					
					MapTransfer.option.dataRange.min = null;
					MapTransfer.option.dataRange.max = null;
					
					MapTransfer.option.series[0].markLine.data = []; //[{name:'北京'},{name:'包头'}],
					MapTransfer.option.series[0].geoCoord = {}//'上海': [121.4648,31.2891],
					
					MapTransfer.option.series[1].name = ""; //世园会
					MapTransfer.option.series[1].data = [];//归属地列表
					MapTransfer.option.series[1].markLine.data = []; //[{name:'北京'}, {name:'上海',value:95}],
					MapTransfer.option.series[1].markPoint.data = []; //{name:'上海',value:95},
					
					var computeAttributionData = json.data[0];
					for(var i=0; i<computeAttributionData.length; i++){
						var _item = computeAttributionData[i];
						if(+_item.attriNumber > 0){
							MapTransfer.option.series[1].data.push({name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber});
						}
						if(i == 0){
							if(+_item.attriNumber > 0){
								MapTransfer.option.series[0].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName},{name: _item.unicomBaseCityinfoVO.cityName}]);
							}
							
							var _point = MAP.gps84_To_Bd09(_item.unicomBaseScenicVO.longitude, _item.unicomBaseScenicVO.latitude);
							MapTransfer.option.series[0].geoCoord[_item.unicomBaseScenicVO.scenicName] = [_point[0], _point[1]];
							
							if(+_item.attriNumber > 0){
								var _point1 = MAP.gps84_To_Bd09(_item.unicomBaseCityinfoVO.longitude, _item.unicomBaseCityinfoVO.latitude);
								MapTransfer.option.series[0].geoCoord[_item.unicomBaseCityinfoVO.cityName] = [_point1[0], _point1[1]];
							}
							
							MapTransfer.option.series[1].name = _item.unicomBaseScenicVO.scenicName;
							
							if(+_item.attriNumber > 0){
								MapTransfer.option.series[1].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName}, {name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber}]);
								MapTransfer.option.series[1].markPoint.data.push({name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber});
								
								if(!MapTransfer.option.dataRange.max || MapTransfer.option.dataRange.max < +_item.attriNumber) MapTransfer.option.dataRange.max = +_item.attriNumber;
								if(!MapTransfer.option.dataRange.min || MapTransfer.option.dataRange.min > +_item.attriNumber) MapTransfer.option.dataRange.min = +_item.attriNumber;
							}
						}else{
							if(+_item.attriNumber > 0){
								MapTransfer.option.series[0].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName},{name: _item.unicomBaseCityinfoVO.cityName}]);
								
								var _point1 = MAP.gps84_To_Bd09(_item.unicomBaseCityinfoVO.longitude, _item.unicomBaseCityinfoVO.latitude);
								MapTransfer.option.series[0].geoCoord[_item.unicomBaseCityinfoVO.cityName] = [_point1[0], _point1[1]];
								
								MapTransfer.option.series[1].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName}, {name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber}]);
								MapTransfer.option.series[1].markPoint.data.push({name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber});
								
								if(!MapTransfer.option.dataRange.max || MapTransfer.option.dataRange.max < +_item.attriNumber) MapTransfer.option.dataRange.max = +_item.attriNumber;
								if(!MapTransfer.option.dataRange.min || MapTransfer.option.dataRange.min > +_item.attriNumber) MapTransfer.option.dataRange.min = +_item.attriNumber;
							}
						}
					}
					MapTransfer.refresh();
				}
				if(typeof fn == "function"){
					 fn(json);
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			}, null);
		},
		getHistoryScenicHeadData: function(endTime, fn){
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/computeAttribution") + "&cdScenicId=" + opts.scenicId + "&cdEndTime" + endTime, function(json){
			Golbal.getJSON("/unicom/computeAttribution?cdScenicId=" + opts.scenicId + "&cdEndTime=" + endTime, function(json){
				if(json){
					MapTransfer.option.legend.data = []; //'北京 Top10', '上海 Top10', '广州 Top10'
					MapTransfer.option.legend.selected = {}; //'上海 Top10' : false,'广州 Top10' : false
					
					MapTransfer.option.dataRange.min = null;
					MapTransfer.option.dataRange.max = null;
					
					MapTransfer.option.series[0].markLine.data = []; //[{name:'北京'},{name:'包头'}],
					MapTransfer.option.series[0].geoCoord = {}//'上海': [121.4648,31.2891],
					
					MapTransfer.option.series[1].name = ""; //世园会
					MapTransfer.option.series[1].data = [];//归属地列表
					MapTransfer.option.series[1].markLine.data = []; //[{name:'北京'}, {name:'上海',value:95}],
					MapTransfer.option.series[1].markPoint.data = []; //{name:'上海',value:95},
					
					var computeAttributionData = json.data[0];
					for(var i=0; i<computeAttributionData.length; i++){
						var _item = computeAttributionData[i];
						if(+_item.attriNumber > 0){
							MapTransfer.option.series[1].data.push({name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber});
						}
						if(i == 0){
							if(+_item.attriNumber > 0){
								MapTransfer.option.series[0].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName},{name: _item.unicomBaseCityinfoVO.cityName}]);
							}
							
							var _point = MAP.gps84_To_Bd09(_item.unicomBaseScenicVO.longitude, _item.unicomBaseScenicVO.latitude);
							MapTransfer.option.series[0].geoCoord[_item.unicomBaseScenicVO.scenicName] = [_point[0], _point[1]];
							
							if(+_item.attriNumber > 0){
								var _point1 = MAP.gps84_To_Bd09(_item.unicomBaseCityinfoVO.longitude, _item.unicomBaseCityinfoVO.latitude);
								MapTransfer.option.series[0].geoCoord[_item.unicomBaseCityinfoVO.cityName] = [_point1[0], _point1[1]];
							}
							
							MapTransfer.option.series[1].name = _item.unicomBaseScenicVO.scenicName;
							
							if(+_item.attriNumber > 0){
								MapTransfer.option.series[1].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName}, {name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber}]);
								MapTransfer.option.series[1].markPoint.data.push({name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber});
								
								if(!MapTransfer.option.dataRange.max || MapTransfer.option.dataRange.max < +_item.attriNumber) MapTransfer.option.dataRange.max = +_item.attriNumber;
								if(!MapTransfer.option.dataRange.min || MapTransfer.option.dataRange.min > +_item.attriNumber) MapTransfer.option.dataRange.min = +_item.attriNumber;
							}
						}else{
							if(+_item.attriNumber > 0){
								MapTransfer.option.series[0].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName},{name: _item.unicomBaseCityinfoVO.cityName}]);
								
								var _point1 = MAP.gps84_To_Bd09(_item.unicomBaseCityinfoVO.longitude, _item.unicomBaseCityinfoVO.latitude);
								MapTransfer.option.series[0].geoCoord[_item.unicomBaseCityinfoVO.cityName] = [_point1[0], _point1[1]];
								
								MapTransfer.option.series[1].markLine.data.push([{name: _item.unicomBaseScenicVO.scenicName}, {name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber}]);
								MapTransfer.option.series[1].markPoint.data.push({name: _item.unicomBaseCityinfoVO.cityName, value: +_item.attriNumber});
								
								if(!MapTransfer.option.dataRange.max || MapTransfer.option.dataRange.max < +_item.attriNumber) MapTransfer.option.dataRange.max = +_item.attriNumber;
								if(!MapTransfer.option.dataRange.min || MapTransfer.option.dataRange.min > +_item.attriNumber) MapTransfer.option.dataRange.min = +_item.attriNumber;
							}
						}
					}
					MapTransfer.refresh();
				}
				if(typeof fn == "function"){
					 fn(json);
				}
			});
		},
		refresh: function(key){
			if (MapTransfer.myChart && MapTransfer.myChart.dispose) {
				MapTransfer.myChart.dispose();
		    }
			MapTransfer.myChart = opts.echarts.init(document.getElementById('data-maptransfer'), {});
			window.onresize = MapTransfer.myChart.resize;
			MapTransfer.myChart.setOption(MapTransfer.option, true)
		}
};
var MAP = {
		initMap: function(){//初始化地图实例
			opts.map = new BMap.Map("Hui-article-box");
			opts.map.enableScrollWheelZoom(); // 允许滚轮缩放
		},
		setCenterAndZoom: function(point, zoom){//设置地图中心点和缩放比例尺
			var _point = new BMap.Point(point[0], point[1]);
			opts.map.centerAndZoom(_point, zoom);
		},
		gps84_To_Bd09: function(lon, lat){//gps84坐标转换成百度Bd09坐标
			var _point = PositionUtil.gps84_To_Gcj02(+lat,+lon);
			_point = PositionUtil.gcj02_To_Bd09(_point.wgLat, _point.wgLon);//return {"wgLat": bd_lat, "wgLon": bd_lon};   
			return[_point.wgLon, _point.wgLat];//[lon, loat]
		},
		changeAllLonLatToBd09: function(longLatArr){
			var newPointsArr = [];
			if(longLatArr){
				longLatArr = longLatArr.split(";");
				if(longLatArr.length > 0){
					for(var i=0; i<longLatArr.length; i++){
						var _point = longLatArr[i].split(",");
						_point = MAP.gps84_To_Bd09(_point[0], _point[1]);
						if (!MAP.maxBox.maxLon || MAP.maxBox.maxLon < _point[0]) MAP.maxBox.maxLon = _point[0];
	                    if (!MAP.maxBox.minLon || MAP.maxBox.minLon > _point[0]) MAP.maxBox.minLon = _point[0];
	                    if (!MAP.maxBox.maxLat || MAP.maxBox.maxLat < _point[1]) MAP.maxBox.maxLat = _point[1];
	                    if (!MAP.maxBox.minLat || MAP.maxBox.minLat > _point[1]) MAP.maxBox.minLat = _point[1];
						newPointsArr.push([_point[0], _point[1]]);
					}
				}
			}
			return newPointsArr;
		},
		//热力图--------------------------------------------
		setHeatMapOverly: function(){
			MAP.setCenterAndZoom(opts.center, opts.zoom);
			var points = [];
			if(opts.hotPoints.shape.length > 0){
				for(var i=0; i<opts.hotPoints.shape.length; i++){
					var v = opts.hotPoints.shape[i];
					var _point = new BMap.Point(v[0], v[1]);
					points.push(_point);
				}
			}
			opts.polygon = new BMap.Polygon(points, {strokeColor:"#0d9c9c", strokeWeight:1, strokeOpacity:0.5, fillOpacity:0.1});  //创建多边形
			opts.map.addOverlay(opts.polygon);
			if(opts.hotPoints && opts.hotPoints.points.length > 0 && opts.hotPoints.max){
				opts.heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
				opts.map.addOverlay(opts.heatmapOverlay);
				opts.heatmapOverlay.setDataSet({data:opts.hotPoints.points, max: opts.hotPoints.max});
			}
			$("#hotmap-order-box").find(".red").html(opts.c4);
			$("#hotmap-order-box").find(".yellow").html(opts.c3);
			$("#hotmap-order-box").find(".green").html(opts.c2);
			$("#hotmap-order-box").find(".blue").html(opts.c1);
		},
		showHeatmap: function(){
			if(opts.polygon){
				opts.polygon.show();
			}
			if(opts.heatmapOverlay){
				opts.heatmapOverlay.show();
			}
			$("#hotmap-order-box").show();
		},
		closeHeatmap: function(){
			if(opts.polygon){
				opts.polygon.hide();
			}
			if(opts.heatmapOverlay){
				opts.heatmapOverlay.hide();
			}
			$("#hotmap-order-box").hide();
		},
		//热力图------------------------------------END
		links: {},//{"id": {"startMarker": null, "endMarker": null, "line": [], "linkName": null, "roadName": null, "speed": null}}
		historyLinks:{},
		maxBox: {"maxlon": null, "maxLat": null, "minLon": null, "minLat": null},
		setLinks: function(){
			MAP.links = {};
			MAP.historyLinks = {};
			MAP.maxBox = {"maxlon": null, "maxLat": null, "minLon": null, "minLat": null};
			Golbal.showMarkLayer();//显示loading
			$("#data-maptransfer").addClass("hide");
			$("#data-chart").addClass("hide");
			$("#Hui-article-box").removeClass("hide");
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultRoad"), function(json){
			Golbal.getJSON("/unicom/resultRoad", function(json){
				if(json){
					var resultRoadArr = json.data[0];
					var _html = '<a href="javascript:void(0)" onclick="MAP.showLink(this)" type="all" class="active">全部道路</a>';
					if(resultRoadArr.length > 0){
						for(var i= 0;i<resultRoadArr.length; i++){
							var _road = resultRoadArr[i];
							var unicomBaseRoadpointV0 = _road.unicomBaseRoadpointVO;
							if(unicomBaseRoadpointV0){
								if(!MAP.links.hasOwnProperty(unicomBaseRoadpointV0.roadName)){
									 MAP.links[unicomBaseRoadpointV0.roadName] = [];
									 _html += '<a href="javascript:void(0)" onclick="MAP.showLink(this)" type="' + unicomBaseRoadpointV0.roadName + '" class="">' + unicomBaseRoadpointV0.roadName + '</a>';
								}
								var _link = {};
								
								_link.speed = +_road.velocity;
								
								_link.id = unicomBaseRoadpointV0.id;
								_link.linkName = unicomBaseRoadpointV0.linkName;
								_link.roadName = unicomBaseRoadpointV0.roadName;
								var longLatArr = unicomBaseRoadpointV0.longlat;
								longLatArr = longLatArr.substring(0,longLatArr.length-1);
								var bd09LinkPoints = MAP.changeAllLonLatToBd09(longLatArr);
								if(bd09LinkPoints.length > 0){
									_link.startMarker = bd09LinkPoints[0];
									_link.endMarker = bd09LinkPoints[bd09LinkPoints.length - 1];
									_link.line = bd09LinkPoints;
								}
								MAP.links[_link.roadName].push(_link);
							}
						}
					}
					$(".menu_dropdown").html(_html);
					
					MAP.showAllLink();
					Golbal.hideMarkLayer();//隐藏loading 
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			}, null);
		},
		setLink: function(roadName){
			Golbal.showMarkLayer();//显示loading
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultRoad") + "&roadName=" + roadName, function(json){
			Golbal.getJSON("/unicom/resultRoad?roadName=" + roadName, function(json){
				if(json){
					var resultRoadArr = json.data[0];
					if(resultRoadArr.length > 0){
						for(var i= 0;i<resultRoadArr.length; i++){
							var _road = resultRoadArr[i];
							var unicomBaseRoadpointV0 = _road.unicomBaseRoadpointVO;
							if(unicomBaseRoadpointV0){
								if(i==0) MAP.links[unicomBaseRoadpointV0.roadName] = [];
								
								var _link = {};
								_link.speed = +_road.velocity;
								
								_link.id = unicomBaseRoadpointV0.id;
								_link.linkName = unicomBaseRoadpointV0.linkName;
								_link.roadName = unicomBaseRoadpointV0.roadName;
								var longLatArr = unicomBaseRoadpointV0.longlat;
								longLatArr = longLatArr.substring(0,longLatArr.length-1);
								var bd09LinkPoints = MAP.changeAllLonLatToBd09(longLatArr);
								if(bd09LinkPoints.length > 0){
									_link.startMarker = bd09LinkPoints[0];
									_link.endMarker = bd09LinkPoints[bd09LinkPoints.length - 1];
									_link.line = bd09LinkPoints;
								}
								MAP.links[_link.roadName].push(_link);
							}
						}
					}
					MAP.showOneLink(roadName);
					Golbal.hideMarkLayer();//隐藏loading 
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			});
		},
		showAllLink: function(){
			opts.map.clearOverlays(); 
			$("#mapline-order-box").show();
			MAP.setCenterAndZoom([(MAP.maxBox.maxLon+MAP.maxBox.minLon)/2, (MAP.maxBox.maxLat+MAP.maxBox.minLat)/2], 11);
			for(var key in MAP.links){
				var _links = MAP.links[key];
				if(_links.length > 0){
					for(var i=0; i<_links.length; i++){
						var _link = _links[i];
						var _speed =  +_link.speed;
						var _lineArr =  _link.line;
						var points = [];
						if(_lineArr.length > 0){
							for(var n=0; n<_lineArr.length; n++){
								var _point = new BMap.Point(+_lineArr[n][0], +_lineArr[n][1]);
								points.push(_point);
							}
						}
						if(points.length > 0){
							var lineColor = (_speed >48)? "#0c9b05" : (_speed >20 && _speed <= 48)? "#fffd2c" : "#fb1409";
							var polyline = new BMap.Polyline(points, {strokeColor:lineColor, strokeWeight:5, strokeOpacity:0.8}); 
							opts.map.addOverlay(polyline);
							MAP.addMouseoverHandler((_speed|0)+" km/h", polyline);
						}
					}
				}
			}
		},
		showOneLink: function(roadName){
			var _links = MAP.links[roadName]
			
			opts.map.clearOverlays();    
			$("#mapline-order-box").show();
			if(_links.length > 0){
				var _maxBox = {"maxlon": null, "maxLat": null, "minLon": null, "minLat": null};
				for(var i=0;i<_links.length; i++){
					var _link = _links[i];
					var _speed =  +_link.speed;
					var _lineArr =  _link.line;
					var points = [];
					
					if(_lineArr.length > 0){
						for(var n=0; n<_lineArr.length; n++){
							if (!_maxBox.maxLon || _maxBox.maxLon < +_lineArr[n][0]) _maxBox.maxLon = +_lineArr[n][0];
		                    if (!_maxBox.minLon || _maxBox.minLon > +_lineArr[n][0]) _maxBox.minLon = +_lineArr[n][0];
		                    if (!_maxBox.maxLat || _maxBox.maxLat < +_lineArr[n][1]) _maxBox.maxLat = +_lineArr[n][1];
		                    if (!_maxBox.minLat || _maxBox.minLat > +_lineArr[n][1]) _maxBox.minLat = +_lineArr[n][1];
							
							var _point = new BMap.Point(+_lineArr[n][0], +_lineArr[n][1]);
							points.push(_point);
						}
					}
					
					if(points.length > 0){
						var lineColor = (_speed >48)? "#0c9b05" : (_speed >20 && _speed <= 48)? "#fffd2c" : "#fb1409";
						var polyline = new BMap.Polyline(points, {strokeColor:lineColor, strokeWeight:5, strokeOpacity:0.8}); 
						opts.map.addOverlay(polyline);
						MAP.addMouseoverHandler((_speed|0)+" km/h", polyline);
					}
					//var startMarker = _link.startMarker;
					//var endMarker = _link.endMarker;
					//var start_marker = new BMap.Marker(new BMap.Point(startMarker[0], startMarker[1]));
					//var end_marker = new BMap.Marker(new BMap.Point(endMarker[0], endMarker[1]));
					//opts.map.addOverlay(start_marker);
					//opts.map.addOverlay(end_marker);  
				}
				MAP.setCenterAndZoom([(_maxBox.maxLon+_maxBox.minLon)/2, (_maxBox.maxLat+_maxBox.minLat)/2], 14);
			}
		},
		historyAllLink: function(endTime){
			MAP.links = {};
			MAP.historyLinks = {};
			MAP.maxBox = {"maxlon": null, "maxLat": null, "minLon": null, "minLat": null};
			Golbal.showMarkLayer();//显示loading
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultRoad") + "&cdEndTime=" + endTime, function(json){
			Golbal.getJSON("/unicom/resultRoad?cdEndTime=" + endTime, function(json){
				if(json){
					var resultRoadArr = json.data[0];
					var _html = '<a href="javascript:void(0)" onclick="MAP.showLink(this)" type="all" class="active">全部道路</a>';
					if(resultRoadArr.length > 0){
						for(var i= 0;i<resultRoadArr.length; i++){
							var _road = resultRoadArr[i];
							var unicomBaseRoadpointV0 = _road.unicomBaseRoadpointVO;
							if(unicomBaseRoadpointV0){
								if(!MAP.links.hasOwnProperty(unicomBaseRoadpointV0.roadName)){
									 MAP.links[unicomBaseRoadpointV0.roadName] = [];
									 _html += '<a href="javascript:void(0)" onclick="MAP.showLink(this)" type="' + unicomBaseRoadpointV0.roadName + '" class="">' + unicomBaseRoadpointV0.roadName + '</a>';
								}
								var _link = {};
								
								_link.speed = +_road.velocity;
								
								_link.id = unicomBaseRoadpointV0.id;
								_link.linkName = unicomBaseRoadpointV0.linkName;
								_link.roadName = unicomBaseRoadpointV0.roadName;
								var longLatArr = unicomBaseRoadpointV0.longlat;
								longLatArr = longLatArr.substring(0,longLatArr.length-1);
								var bd09LinkPoints = MAP.changeAllLonLatToBd09(longLatArr);
								if(bd09LinkPoints.length > 0){
									_link.startMarker = bd09LinkPoints[0];
									_link.endMarker = bd09LinkPoints[bd09LinkPoints.length - 1];
									_link.line = bd09LinkPoints;
								}
								MAP.links[_link.roadName].push(_link);
							}
						}
					}
					$(".menu_dropdown").html(_html);
					
					MAP.showAllLink();
					Golbal.hideMarkLayer();//隐藏loading 
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			});
		},
		historyOneLink: function(roadName, endTime){
			Golbal.showMarkLayer();//显示loading
			//Golbal.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultRoad") + "&roadName=" + roadName + "&cdEndTime=" + endTime, function(json){
			Golbal.getJSON("/unicom/resultRoad?roadName=" + roadName + "&cdEndTime=" + endTime, function(json){
				if(json){
					var resultRoadArr = json.data[0];
					if(resultRoadArr.length > 0){
						for(var i= 0;i<resultRoadArr.length; i++){
							var _road = resultRoadArr[i];
							var unicomBaseRoadpointV0 = _road.unicomBaseRoadpointVO;
							if(unicomBaseRoadpointV0){
								if(i==0) MAP.links[unicomBaseRoadpointV0.roadName] = [];
								
								var _link = {};
								_link.speed = +_road.velocity;
								
								_link.id = unicomBaseRoadpointV0.id;
								_link.linkName = unicomBaseRoadpointV0.linkName;
								_link.roadName = unicomBaseRoadpointV0.roadName;
								var longLatArr = unicomBaseRoadpointV0.longlat;
								longLatArr = longLatArr.substring(0,longLatArr.length-1);
								var bd09LinkPoints = MAP.changeAllLonLatToBd09(longLatArr);
								if(bd09LinkPoints.length > 0){
									_link.startMarker = bd09LinkPoints[0];
									_link.endMarker = bd09LinkPoints[bd09LinkPoints.length - 1];
									_link.line = bd09LinkPoints;
								}
								MAP.links[_link.roadName].push(_link);
							}
						}
					}
					MAP.showOneLink(roadName);
					Golbal.hideMarkLayer();//隐藏loading 
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			});
		},
		showLink: function(dom){
			var that = this;
			dom = $(dom);
			
			$(".menu_dropdown").find("a").removeClass("active");
			dom.addClass("active");
			
			opts.lineId = $(dom).attr("type");
			if(opts.state == "history" && $.trim($("#end-datetimepicker").val())){
				if(opts.lineId == "all"){
					that.historyAllLink($.trim($("#end-datetimepicker").val()));
				}else{
					that.historyOneLink(opts.lineId, $.trim($("#end-datetimepicker").val()));
				}
			}else{
				if(opts.lineId == "all"){
					that.setLinks();
				}else{
					that.setLink(opts.lineId);
				}
			}
		},
		infoParams: {
			width : 60,     // 信息窗口宽度
			height: 30,     // 信息窗口高度
			title : "平均速度:" , // 信息窗口标题
			enableMessage:false//设置允许信息窗发送短息
	    },
		addMouseoverHandler: function(content,marker){//给地图添加标示
			var that = this;
			marker.addEventListener("click",function(e){
				var p = e.point;
				var point = new BMap.Point(p.lng, p.lat);
				var infoWindow = new BMap.InfoWindow(content, that.infoParams);
				opts.map.openInfoWindow(infoWindow,point); //开启信息窗口
			});
		}
};
var Golbal = {
		init: function(){
			var that = this;
			if(!Golbal.isSupportCanvas()){//判断浏览器是否支持canvas
				$(".gritter-with-image").html('<span class="gritter-title">您所使用的浏览器不能使用热力图功能~</span><p>热力图只支持有canvas支持的浏览器</p>');
				$("#gritter-notice-wrapper").fadeIn(300);
			}
			that.initResize();//绑定resize事件
			
			MAP.initMap();//载入百度地图
			Echarts.init();//载入echartJS
			
			if(opts.type == "scenicList"){
				that.setScenicList();//载入景区列表
			}
			that.domChangeHandler();//绑定各种dom事件
			
		},
		initResize: function(){
			$(window).on("resize", function() {
		        var winH = $(window).height();
		        $("#content").height(winH);
		        $("#content-box").height(winH - $("#header").height() - $("#content-header").height());
		    });
		    $(window).trigger("resize");
		    
		    $.datetimepicker.setLocale('zh');
		    $('#end-datetimepicker').datetimepicker({
				format:'Y-m-d H:i',
				step:5
			});
			$("#inout-start-timepicker").datetimepicker({
				format:'Y-m-d',
				timepicker:false
			});
			$("#inout-end-timepicker").datetimepicker({
				format:'Y-m-d',
				timepicker:false
			});
			
			$("#end-datetimepicker").on("change", function(e){
				if($.trim($("#end-datetimepicker").val())){
					$("#history-button").addClass("active");
				}
			});
			$("#inout-start-timepicker").on("change", function(e){
				if($.trim($("#inout-start-timepicker").val()) && $.trim($("#inout-end-timepicker").val())){
					$("#inout-history-button").addClass("active");
				}
			});
			$("#inout-end-timepicker").on("change", function(e){
				if($.trim($("#inout-start-timepicker").val()) && $.trim($("#inout-end-timepicker").val())){
					$("#inout-history-button").addClass("active");
				}
			});
			
			$("#history-button").on("click", function(e){
				if($(this).hasClass("active")){
					Golbal.loadHistoryData(null, $.trim($("#end-datetimepicker").val()));
				}
			});
			$("#inout-history-button").on("click", function(e){
				if($(this).hasClass("active")){
					Golbal.loadHistoryData($.trim($("#inout-start-timepicker").val())+" 23:59", $.trim($("#inout-end-timepicker").val())+" 23:59");
				}
			});
		},
		loadHistoryData: function(startTime, endTime){
			if(opts.type == "scenicList"){
				Golbal.showMarkLayer();//显示loading
				Golbal.getHistoryScenicHeadData(endTime, function(json){
					Golbal.handleJSON(json, "scenic");
					Golbal.hideMarkLayer();//隐藏loading 
				});
			}
			if(opts.type == "computeAttribution"){
				Golbal.showMarkLayer();//显示loading
				MapTransfer.getHistoryScenicHeadData(endTime, function(json){
					Golbal.hideMarkLayer();//隐藏loading 
				});
			}
			if(opts.type == "resultRoad"){
				if(opts.lineId == "all"){
					MAP.historyAllLink(endTime);
				}else{
					MAP.historyOneLink(opts.lineId, endTime);
				}
			}
			if(opts.type == "scenicInout"){
				Charts.getScenicHeadData(null,startTime, endTime);
			}
		},
		changeH1Title: function(){//opts.type == "scenicList" || "scenicInout" || "computeAttribution" || "resultRoad"
			if(opts.type == "scenicList" || opts.type == "scenicInout" || opts.type == "computeAttribution"){
				$("#pint-line").removeClass("active");
				$("#pint-scenic").addClass("active");
			}
			if(opts.type == "resultRoad"){
				$("#pint-scenic").removeClass("active");
				$("#pint-line").addClass("active");
			}
		},
		domChangeHandler: function(){//dom事件绑定
			var that = this;
			$("#sidebar-items li").on("click", function(e){
				var dom = $(this);
				Golbal.hideDataTimepicker();//隐藏时间控件
				if(dom.hasClass("submenu")){
					if(!dom.hasClass("open")){
						dom.find(".sub-items").slideDown(300);
					}else{
						dom.find(".sub-items").slideUp(300);
					}
					dom.toggleClass("open");
				}else{
					$("#sidebar-items li").removeClass("active");
					$("#sidebar-items ul>li a").removeClass("active");
					dom.addClass("active")
					
					var _text = dom.find("span:first").text();
					$("#breadcrumb").html('<a id="one-bar" href="javascript:void(0)" class="tip-bottom"><i class="icon-home"></i> '+_text+'</a>');
					
					that.initParams();//清空一切
					opts.map.clearOverlays(); 
					
					if(dom.find("a").attr("type")){
						opts.type = dom.find("a").attr("type");
					}
					Golbal.changeH1Title();//改变大标题
					if(opts.type == "scenicInout"){
						$("#data-maptransfer").addClass("hide");
						$("#Hui-article-box").addClass("hide");
						$("#data-chart").removeClass("hide");
						that.initParams();//清空热力图数据一切
						Golbal.showInoutDataTimepicker();
						Charts.init();
					}
				}
			});
			$("#sidebar-items ul>li a").on("click", function(event){
				var dom = $(this);
				if(event.stopPropagation){
					event.stopPropagation();
				}else{
					event.cancelBubble = true;
				}
				Golbal.hideDataTimepicker();//隐藏时间控件
				$("#sidebar-items li").removeClass("active");
				$("#sidebar-items ul>li a").removeClass("active");
				dom.addClass("active");
				
				var sub_text = dom.text();
				var p_text = dom.parent().parent().parent().find("span:first").text();
				$("#breadcrumb").html('<a id="one-bar" href="javascript:void(0)" class="tip-bottom"><i class="icon-home"></i> '+p_text+'</a><a id="two-bar" href="javascript:void(0)">'+sub_text+'</a>');
				
				that.initParams();//清空一切
				opts.map.clearOverlays(); 
				
				opts.type = dom.attr("type");
				Golbal.changeH1Title();//改变大标题
				if(opts.type == "scenicList"){
					opts.state = dom.attr("state");//now or history
					if(opts.state == "history"){
						Golbal.showDataTimepicker();//显示时间控件
					}
					$("#data-maptransfer").addClass("hide");
					$("#data-chart").addClass("hide");
					$("#Hui-article-box").removeClass("hide");
					
					that.setScenicList();//景区列表 and 显示第一个景区的热力图
				}
				if(opts.type == "computeAttribution"){
					opts.state = dom.attr("state");
					if(opts.state == "history"){
						Golbal.showDataTimepicker();//显示时间控件
					}
					$("#data-chart").addClass("hide");
					$("#Hui-article-box").addClass("hide");
					$("#data-maptransfer").removeClass("hide");
					that.initParams();//清空热力图数据一切
					MapTransfer.init();
				}
				if(opts.type == "resultRoad"){
					$("#data-chart").addClass("hide");
					$("#Hui-article-box").removeClass("hide");
					$("#data-maptransfer").addClass("hide");
					opts.state = dom.attr("state");
					if(opts.state == "history"){
						Golbal.showDataTimepicker();//显示时间控件
					}
					opts.lineId = "all";
					MAP.setLinks();
				}
			});
			$("#pint-scenic").on("click", function(e){
				$("#pint-line").removeClass("active");
				$("#pint-scenic").addClass("active");
				
				$("#sidebar-items li").removeClass("active");
				$("#sidebar-items ul>li a").removeClass("active");
				$("#sidebar-item-one").addClass("active").addClass("open");
				$("#scenicList-now").addClass("active");
				opts.type = "scenicList";
				opts.state ="now";
				Golbal.hideDataTimepicker();//隐藏时间控件
				
				$("#data-maptransfer").addClass("hide");
				$("#data-chart").addClass("hide");
				$("#Hui-article-box").removeClass("hide");
				
				that.initParams();//清空一切
				opts.map.clearOverlays(); 
				
				that.setScenicList();//景区列表 and 显示第一个景区的热力图
			});
			$("#pint-line").on("click", function(e){
				$("#pint-line").addClass("active");
				$("#pint-scenic").removeClass("active");
				
				$("#sidebar-items li").removeClass("active");
				$("#sidebar-items ul>li a").removeClass("active");
				$("#sidebar-item-last").addClass("active").addClass("open");
				$("#resultroad-now").addClass("active");
				opts.type = "resultRoad";
				opts.state ="now";
				Golbal.hideDataTimepicker();//隐藏时间控件
				
				$("#data-chart").addClass("hide");
				$("#Hui-article-box").removeClass("hide");
				$("#data-maptransfer").addClass("hide");
				
				that.initParams();//清空一切
				opts.map.clearOverlays(); 
				
				opts.lineId = "all";
				MAP.setLinks();
			});
			$(".gritter-close").on("click", function(e){
				$("#gritter-notice-wrapper").fadeOut(200);
			});
		},
		oneScenic: function(dom){
			var that = this;
			dom = $(dom);
			$(".menu_dropdown").find("a").removeClass("active");
			dom.addClass("active");
			
			that.initParams();//清空一切
			if(opts.type == "scenicList"){
				opts.center = [+dom.attr("lng"), +dom.attr("lat")];
				opts.zoom = 12;
				opts.scenicId = dom.attr("scenicid");
				opts.c1 = +dom.attr("c1");
				opts.c2 = +dom.attr("c2");
				opts.c3 = +dom.attr("c3");
				opts.c4 = +dom.attr("c4");
				Golbal.showMarkLayer();//显示loading
				if(opts.state == "history" && $.trim($("#end-datetimepicker").val())){
					Golbal.getHistoryScenicHeadData($.trim($("#end-datetimepicker").val()), function(json){
						Golbal.handleJSON(json, "scenic");
						Golbal.hideMarkLayer();//隐藏loading 
					});
				}else{
					that.getScenicHeadData(function(data){//加载每个景区数据
						Golbal.handleJSON(data, "scenic");
						Golbal.hideMarkLayer();//隐藏loading 
					});
				}
			}
			if(opts.type == "scenicInout"){
				opts.scenicId = dom.attr("scenicid");
				if($.trim($("#inout-start-timepicker").val()) && $.trim($("#inout-end-timepicker").val())){
					Charts.getScenicHeadData(null, $.trim($("#inout-start-timepicker").val())+" 23:59", $.trim($("#inout-end-timepicker").val())+" 23:59");
				}else{
					Charts.getScenicHeadData();
				}
			}
			if(opts.type == "computeAttribution"){
				opts.scenicId = dom.attr("scenicid");
				
				if(opts.state == "history" && $.trim($("#end-datetimepicker").val())){
					MapTransfer.getHistoryScenicHeadData($.trim($("#end-datetimepicker").val()), function(json){
						Golbal.hideMarkLayer();//隐藏loading 
					});
				}else{
					MapTransfer.getScenicHeadData();
				}
			}
		},
		displaynavbar: function(dom){
			Golbal.showMarkLayer();//显示loading
			if(!$(dom).hasClass("open")){
				$("#Hui-aside").addClass("_hide");
				$("#dislpayArrow").addClass("_hide");
				$("#Hui-article-box").addClass("full_show");
				$("#data-chart").addClass("full_show");
				$("#data-maptransfer").addClass("full_show");
			}else{
				$("#dislpayArrow").removeClass("_hide");
				$("#Hui-aside").removeClass("_hide");
				$("#Hui-article-box").removeClass("full_show");
				$("#data-chart").removeClass("full_show");
				$("#data-maptransfer").removeClass("full_show");
			}
			$(dom).toggleClass("open");
			setTimeout(function(){
				if(opts.type == "scenicList"){
					
				}
				if(opts.type == "scenicInout"){
					Charts.refresh();
					Charts.refreshDay();
				}
				if(opts.type == "computeAttribution"){
					MapTransfer.refresh();
				}
				Golbal.hideMarkLayer();//隐藏loading 
			}, 150);
		},
		initHeapParams: function(){//隐藏热力区 and 初始化热力区参数
			MAP.closeHeatmap();//隐藏热力区
			opts.hotPoints = {"points":[], "max": null, "min": null, "shape": []};//热力区
			opts.heatmapOverlay = null;
			opts.scenicId = null;
			opts.scenicData = null;
			opts.c1 = 0;
			opts.c2 = 0;
			opts.c3 = 0;
			opts.c4 = 0;
		},
		initCommonParams: function(){//初始化通用参数
			opts.center = [53640424/460800, 18388081/460800];//默认中心点是北京
			opts.zoom = 9;
		},
		initParams: function(){
			var that = this;
			that.initHeapParams();//隐藏热力区 and 初始化热力区参数
			that.initCommonParams();//初始化通用参数
			$("#mapline-order-box").hide();
		},
		getJSON: function(url, fn, opts){
			var ajaxTimeoutTest =$.ajax({
				url: url, 
				data: opts,
				timeout: 10000,
				dataType:'json',
				success:function(json){ //请求成功的回调函数
			　　　　if(typeof fn == "function"){
						if(json && json.isSuccess == 1 && json.message == "OK") fn(json);
						else fn(null);
				   }
			　　},
			  	error: function(){
			  		ajaxTimeoutTest.abort();
			  		$(".gritter-with-image").html('<span class="gritter-title">请求数据失败~</span><p>网络异常或者其他原因</p>');
				    $("#gritter-notice-wrapper").fadeIn(300);
				    fn(null);
			  	},
			　　complete: function(XMLHttpRequest,status){ //请求完成后最终执行参数
			　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
			 　　　　　 ajaxTimeoutTest.abort();
			  		  $(".gritter-with-image").html('<span class="gritter-title">请求数据超时~</span><p>网络异常或者其他原因</p>');
				      $("#gritter-notice-wrapper").fadeIn(300);
				      fn(null);
			　　　　}
			　　}
			});
		},
		setScenicList: function(){//景区列表 and 显示第一个景区的热力图
			var that = this;
			Golbal.showMarkLayer();//显示loading
			//that.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/scenicList"), function(data){
			that.getJSON("/unicom/scenicList", function(data){
				that.handleJSON(data, "scenicList");
				if(data){
					that.getScenicHeadData(function(data){//加载每个景区数据
						that.handleJSON(data, "scenic");
						Golbal.hideMarkLayer();//隐藏loading 
					});
				}else{
					Golbal.hideMarkLayer();//隐藏loading 
				}
			}, null);
		},
		handleJSON: function(json, type){
			
				if(type == "scenicList"){
					if(json){
						var _html = "";
						var scenicList = json.data[0];
						if(scenicList.length > 0){
							for(var i=0;i<scenicList.length; i++){
								var scenic = scenicList[i];
								var _bd09 = MAP.gps84_To_Bd09(+scenic.longitude, +scenic.latitude);
								scenic.longitude = _bd09[0];
								scenic.latitude = _bd09[1];
								var className = '';
								if(i==0){
									className = "active";
									opts.center = [_bd09[0], _bd09[1]];
									opts.zoom = 12;
									opts.scenicId = scenic.id;
									opts.c1 = +scenic.c1;
									opts.c2 = +scenic.c2;
									opts.c3 = +scenic.c3;
									opts.c4 = +scenic.c4;
								}
			                    _html += '<a href="javascript:void(0)" onclick="Golbal.oneScenic(this)" class="' + className + '" lng="'+_bd09[0]+'" lat="'+_bd09[1]+'" scenicId="' + scenic.id + '" c1=' + scenic.c1 + ' c2='+scenic.c2+' c3='+scenic.c3+' c4='+scenic.c4+'>' + scenic.scenicName + '</a>';
							}
						}
						$(".menu_dropdown").html(_html);
					}else{
						MAP.setHeatMapOverly();
						MAP.showHeatmap();
					}
				}
				if(type == "scenic"){
					if(json){
						MAP.closeHeatmap();
						opts.scenicData = json.data[0];
						if(opts.scenicData.length > 0){
							var  _shape = opts.scenicData[0].unicomBaseScenicVO.shape;//景区热力图范围
							_shape = _shape.substring(0, _shape.length - 1);
							_shape = _shape.split(";")
							var _shapeObj = [];
							if(_shape.length > 0){
								for(var i=0; i<_shape.length;i++){
									var v = _shape[i];
									v = v.split(",");
									v = MAP.gps84_To_Bd09(+v[0], +v[1]);
									_shapeObj.push(v);
								}
							}
							opts.hotPoints["shape"] = _shapeObj;	
							for(var i=0; i<opts.scenicData.length;i++){
								var _data = opts.scenicData[i];
								var _bd09 = MAP.gps84_To_Bd09(+_data.longitude, +_data.latitude);
								_data.longitude = _bd09[0];
								_data.latitude = _bd09[1];
								opts.hotPoints["points"].push({"lng":+_data.longitude,"lat":+_data.latitude,"count":+_data.coverNumber});
							}
							opts.hotPoints["min"] = +opts.c1; 
							opts.hotPoints["max"] = +opts.c4; 
							MAP.setHeatMapOverly();
							MAP.showHeatmap();
						}
					}else{
						MAP.setHeatMapOverly();
						MAP.showHeatmap();
					}
				}
		},
		getScenicHeadData: function(fn){//加载每个景区数据
			var that = this;
			//that.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultScenicBscover") + "&cdScenicId=" + opts.scenicId, function(data){
			that.getJSON("/unicom/resultScenicBscover?cdScenicId=" + opts.scenicId, function(data){
				if(typeof fn == "function") fn(data);
			}, null);
		},
		getHistoryScenicHeadData: function(endTime, fn){
			var that = this;
			//that.getJSON("common_proxy.php?url=" + Base64.base64_encode("http://27.223.95.246:8080/unicom/resultScenicBscover") + "&cdScenicId=" + opts.scenicId + "&cdEndTime=" + endTime, function(data){
			that.getJSON("/unicom/resultScenicBscover?cdScenicId=" + opts.scenicId + "&cdEndTime=" + endTime, function(data){
				if(typeof fn == "function") fn(data);
			}, null);
		},
		each: function(elements, callback){
	        var i, key
	        if (typeof elements.length == 'number') {
	          for (i = 0; i < elements.length; i++)
	            if (callback.call(elements[i], i, elements[i]) === false) return elements
	        } else {
	          for (key in elements)
	            if (callback.call(elements[key], key, elements[key]) === false) return elements
	        }

	        return elements
	    },
		showMarkLayer: function(container){
			container = container || document.querySelector("#content-box");
			var maskLayer = document.querySelector("#mask-layer");
			if(!maskLayer){
				maskLayer = document.createElement("div");
		    	maskLayer.id = "mask-layer";
		    	maskLayer.className = "mask-layer";
		    	
		    	var main_inner = document.createElement("div");
		    	main_inner.className = "main_inner clearfix";
		    	
		    	var mask_div = document.createElement("div");
		    	mask_div.className = "mask-div";
		    	
		    	var loader_inner = document.createElement("div");
		    	loader_inner.className = "loader-inner line-spin-fade-loader";
		    	
		    	var div1 = document.createElement("div");
		    	var div2 = document.createElement("div");
		    	var div3 = document.createElement("div");
		    	var div4 = document.createElement("div");
		    	var div5 = document.createElement("div");
		    	var div6 = document.createElement("div");
		    	var div7 = document.createElement("div");
		    	var div8 = document.createElement("div");
		    	loader_inner.appendChild(div1);
		    	loader_inner.appendChild(div2);
		    	loader_inner.appendChild(div3);
		    	loader_inner.appendChild(div4);
		    	loader_inner.appendChild(div5);
		    	loader_inner.appendChild(div6);
		    	loader_inner.appendChild(div7);
		    	loader_inner.appendChild(div8);
		    	
		    	mask_div.appendChild(loader_inner);
		    	main_inner.appendChild(mask_div);
		    	maskLayer.appendChild(main_inner);
		    	
		    	container.appendChild(maskLayer);
			}
			maskLayer.style.display = "block";
			maskLayer.style.opacity = 1;
		},
		hideMarkLayer: function(){
			var maskLayer = document.querySelector("#mask-layer");
			if(maskLayer){
				maskLayer.style.opacity = 0;
		    	setTimeout(function(){
		    		maskLayer.style.display = "none";
		    	}, 200);
			}
		},
		hideDataTimepicker: function(){
			$("#inout-start-timepicker").val("");
			$("#inout-end-timepicker").val("");
			$("#end-datetimepicker").val("");
			$(".inout-data-timepicker-box").css({"opacity": 0, "display": "none"});
			$(".data-datetimepicker-box").css({"opacity": 0, "display": "none"});
		},
		showDataTimepicker: function(){
			setTimeout(function(){
				$(".data-datetimepicker-box").css({"opacity": 1, "display": "inline-block"});
			}, 200);
		},
		showInoutDataTimepicker: function(){
			setTimeout(function(){
				$(".inout-data-timepicker-box").css({"opacity": 1, "display": "inline-block"});
			}, 200);
		},
		//判断浏览区是否支持canvas
	    isSupportCanvas: function(){
	        var elem = document.createElement('canvas');
	        return !!(elem.getContext && elem.getContext('2d'));
	    },
	    
};
$(function(){
	Golbal.init();
});
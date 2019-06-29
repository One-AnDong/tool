//--------------------------------------------工具API----------------------------------------
/**
	// 公用函数说明：
	formatDate: 	格式化日期
	getStyle:		获取元素综合样式
	setStyleCss3:	设置元素css3属性
	getOffset:		获取元素距离body的外边距
	randomNum:		生成指定范围的随机数
	extend:			浅拷贝
	addEvent:		绑定事件
	removeEvent:	移除事件
	startMove:		运动框架
	getUrlParam:	获取url参数
	addUrlParam:	添加url参数
	substr:			按文字个数截取字符串长度
	browser:		判断浏览器类型
	objToUrlParam: 	object转url参数
	getAjaxData:    获取ajax数据
	createTable:	创建指定表格
	drag:			拖动封装
	loadCss:		动态加载css
	inherit:		寄生组合式继承
	isArray:		判断是否为数组
	mouseWheel:		滚轮事件
	lazyLoadImg:	懒加载
	ready:			文档加载完成
	trim:			去除左右空格
	repeatStr:		重复某字符n次
	limitInput:		根据maxlength限制input或textarea的文字长度
	cookie:			cookie对象封装
*/
var T = {

	// 格式化日期 "yyyy-MM-dd HH:mm:ss"
	formatDate: function(fmt, time){
		var oDate = time ? new Date(time*1000) : new Date();
		var o = { 
			"M+" : oDate.getMonth()+1,                 // 月份 
			"d+" : oDate.getDate(),                    // 日 
			"H+" : oDate.getHours(),                   // 小时 
			"m+" : oDate.getMinutes(),                 // 分 
			"s+" : oDate.getSeconds(),                 // 秒 
			"q+" : Math.floor((oDate.getMonth()+3)/3), // 季度 
			"S"  : oDate.getMilliseconds()             // 毫秒 
		}; 
		if(/(y+)/gi.test(fmt)) {
			fmt=fmt.replace(RegExp.$1, (oDate.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		}
		for(var k in o) {
			if(new RegExp("("+ k +")").test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
		}
		return fmt; 
	},

	// 获取元素综合样式
	getStyle: function(elem, attr) {
		return getComputedStyle ? getComputedStyle(elem, null)[attr] : elem.currentStyle[attr];
	},

	// 设置元素css3样式
	setStyleCss3: function(elem, attr, value) {
		elem.style['Webkit' + attr.charAt(0).toUpperCase() + attr.substring(1)] = value;
		elem.style['Moz' + attr.charAt(0).toUpperCase() + attr.substring(1)] = value;
		elem.style['ms' + attr.charAt(0).toUpperCase() + attr.substring(1)] = value;
		elem.style[attr] = value;
	},

	// 获取元素距离body的外边距
    getOffset: function(elem) {
        var res = {
            left: 0,
            top: 0
        };
        while (elem) {
            res.left += elem.offsetLeft || 0;
            res.top += elem.offsetTop || 0;
            elem = elem.offsetParent
        }
        return res
	},
	
	// 生成指定范围的随机数
	randomNum: function(minNum, maxNum) {
		var delta = maxNum - minNum + 1;
		return Math.floor(Math.random() * delta + minNum);
	},

	// 拷贝继承
	extend: function(_preJson, _addJson){
		for(var key in _addJson){
			_preJson[key] = _addJson[key];
		}
		return _preJson;
	},

	// 添加事件
	addEvent: function(elem, type, fn) {
		if (elem.addEventListener) {
			elem.addEventListener(type, fn, false)
		} else {
			elem.attachEvent("on" + type, fn)
		}
	},

	// 移除事件
	removeEvent: function(elem, type, fn) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, fn, false)
		} else {
			elem.detachEvent("on" + type, fn)
		}
	},

	// 添加类名
	addClass: function(_dom, _class){
		var c = _dom.className.replace(/^\s+|\s+$/gm,'');	// 去除左右空格
		var arr = c.split(" ");
		for(var i = 0; i < arr.length; i++){
			arr[i].replace(/^\s+|\s+$/gm,'');
			if(arr[i] == _class){
				return;	// 存在该class退出函数
			}
		}
		arr.push(_class);
		_dom.className = arr.join(" ").replace(/^\s+|\s+$/gm,'');
	},

	// 移除类名
	removeClass:function(_dom, _class){
		var c = _dom.className.replace(/^\s+|\s+$/gm,'');	// 去除左右空格
		var arr = c.split(" ");
		for(var i = 0; i < arr.length; i++){
			arr[i].replace(/^\s+|\s+$/gm,'');
			if(arr[i] == _class){
				arr[i] = "";
			}
		}
		_dom.className = arr.join(" ");
	},

	// 运动函数
	startMove: function(elem, json, fnEnd, rate){
		var _self = this;
		var rate = typeof rate == "undefined" ? 6 : rate;
		clearInterval(elem.timer);			// 若物体之前开有定时器则先关闭
		elem.timer = setInterval(function(){
			var bStop = true; 				// 假设所有的属性值运动到了目标值
			for(var attr in json){			// 遍历物体传过来的json值
				var start = 0;
				var val = _self.getStyle(elem, attr);
				if(attr === 'opacity'){	
					start = Math.round(parseFloat(val)*100);
				}else{
					start = parseInt(val, 10);
				}
				if(start != json[attr]){	//若有属性值未到目标值，将bStop的值赋为false
					bStop = false;
				}
				var speed = (json[attr] - start)/rate;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);	//速度为正值向上取整，速度为负值向下取整
				if(attr === 'opacity'){
					elem.style.filter = 'alpha(opacity:'+ (start + speed) + ')';
					elem.style.opacity = (start + speed)/100;
				}else{
					elem.style[attr] = start + speed + 'px';
				}
			}
			if(bStop){	// 所有的属性值都运动到了目标值,则关闭定时器并执行回调函数
				clearInterval(elem.timer);
				if(fnEnd)fnEnd();
			}
		}, 30);
	},

	// 获取url参数
	getUrlParam: function(){
		var arr = location.href.split("?");
		var o = {};
		if(arr.length > 1){	// 有需要的字符
			var tarArr = arr[1].split("&");
			for(var i = 0; i < tarArr.length; i++){
				var tmpArr = tarArr[i].split("=");
				o[tmpArr[0]] = tmpArr[1];
			}
		}
		return o;
	},

	// 添加url参数
	addUrlParam: function(key, val){
		var url = ""
		var href = window.location.href;
		if(href.indexOf("?") >= 0){
			var website = href.split("?");
			var host = website[0];
			var query = website[1];
			if(query.length > 0){
				if(query.indexOf(key) >= 0){
					var arr = query.split("&");
					for(var i = 0; i < arr.length; i++){
						if(arr[i].indexOf(key) >= 0){
							arr[i] = key + "=" + val;
						}
					}
					url = host + "?" + arr.join("&");
				}else{
					url = href + "&" + key+ "=" + val;
				}
			}else{
				url = href + key + "=" + val;
			}
		}else{
			url = href + "?" + key + "=" + val;
		}	
		return url;
	},

	// 按文字个数截取字符串长度
	substr: function(_str, _len){	// _len按英文个数计算，中文算两个
		var re = /[\u4E00-\u9FA5]/g;
		var len = _str.length;
		var curLen = 0;
		var chnLen = 0;
		if(re.test(_str)){	// 有中文，计算个数
			for(var i = 0; i < len; i++){
				if(_str[i].test(re)){
					curLen += 2;
					chnLen += 1;
				}else{
					curLen += 1;
				}
				if(curLen >= _len)break;
			}
			curLen = curLen - chnLen;
		}else{
			curLen = _len > len ? len : _len;
		}
		return _str.substring(0, curLen);
	},

	// 判断浏览器类型
    browser: function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, 	//IE内核
            presto: u.indexOf('Presto') > -1, 		//opera内核
            webKit: u.indexOf('AppleWebKit') > -1, 	//苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,	//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,  //是否为移动端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),//ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1 , 	//是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, 		//是否iPad
            webApp: u.indexOf('Safari') == -1, 	//是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
	}(),
	
	// object转url参数
	objToUrlParam: function(obj){
		var a = [];
		for(var k in obj){
			var v = obj[k] + '';
			v = v.replace(/\n/g, '<br/>');
			v = encodeURIComponent(v);
			a.push( k + '=' + v);
		}
		return a.join('&');
	},

	// 获取ajax数据
	// {url:"", type:"GET", data:{}, fnSuccess:function(_data, _state){}, fnFailed:function(_state){}}
	getAjaxData: function(_json){

		var json2url = function(obj){	// 数据拼接成字符串
			var a = [];
			for(var k in obj){
				var v = obj[k] + '';
				v = v.replace(/\n/g, '<br/>');
				v = encodeURIComponent(v);
				a.push( k + '=' + v);
			}
			return a.join('&');
		};
		var url = _json.url || "";		// 请求路径
		var method = _json.type || "GET";	// 请求方式，默认get
		var data = _json.data ? json2url(data) : null;	// 请求数据	
		var fnSuccess = _json.fnSuccess || function(){};// 请求成功回调
		var fnFailed = _json.fnFailed || function(){};	// 请求失败回调
		var fnError = _json.fnError || function(){};	// 请求无效回调
		var oAjax= window.XMLHttpRequest ? new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
		
		if(method.toUpperCase() == 'POST'){
			oAjax.open('POST', url, true);
			oAjax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			try{
				oAjax.send(data);
			}catch(e){}
		}else{
			var time = new Date().getTime();	// 刷新时间参数，避免缓存影响
			if(data){
				url += '?'+ data + "&t=" + time;
			}else{
				if(url.indexOf("?") >= 0){
					url += "&t=" + time;
				}else{
					url += "?t=" + time;
				}	
			}
			oAjax.open('GET', url, true);
			try{
				oAjax.send();
			}catch(e){}
		}
		// console.log("[easymind.html]--getAjaxData()--url = " + url);
		oAjax.onreadystatechange = function(){
			if(oAjax.readyState == 4){
				if(oAjax.status == 200){
					var _res = oAjax.responseText;
					//console.log(_res)
					if(JSON.parse){
						_res = JSON.parse(_res);
					}else{
						_res = eval("(" + _res + ")")
					}
					fnSuccess(_res, oAjax.status);
				}else{
					fnFailed(oAjax.status);
				}
			}
		};
	},

	/**------------------------------------------------------------
	 * -------------------------创建标准表格-------------------------
	 **------------------------------------------------------------
		* @ param(object)	_json  属性如下：
		*  			【可选】title: "表格caption名称";
		*  			【必选】data: [[行数据],[行数据]]};
		*			【可选】footFlag: true/false; （是否使用tfoot，默认false）
		*	返回值：  table对象		
		* 
		* 案例: createTable({title: "全球人口年度统计", data:[[],[],[]], useFoot:true);
		*
	**/
	createTable: function(_json){
		var data = (_json && _json.data) || [["","",""],["", "", ""], ["", "", ""]];
		var wLen = data[0] && getMaxLen(data) || 1;
		var hLen = data.length || 3;
		var title = (_json && _json.title) || "";
		var footFlag = _json && _json.footFlag;  
		var table = document.createElement("table");
		var htmlStr = "";		
		for(var i = 0; i < hLen; i++){
			var td = "";
			for(var j = 0; j < wLen; j++){
				var text = typeof data[i][j] == "undefined" ? "" : data[i][j];
				td += (i == 0) ? "<th>" + text + "<\/th>" : "<td>" + text + "<\/td>" ;
			}	
			var tr = "<tr>" + td + "<\/tr>";
			if(i == 0){
				if(title){
					tr = "<caption>" + title + "<\/caption><thead>" + tr + "<\/thead><tbody>";
				}else{
					tr = "<thead>" + tr + "<\/thead><tbody>";
				}
			}else if(i == hLen - 1){
				if(footFlag){
					tr = "<\/tbody><tfoot>" + tr + "<\/tfoot>";
				}else{
					tr = tr + "<\/tbody>";
				}
			}
			htmlStr += tr;
		}
		function getMaxLen(_arr){
			var maxLen = 0;
			for(var i = 0; i < _arr.length; i++){
				var len = _arr[i].length;
				if(len > maxLen){
					maxLen = len;
				}
			}
			return maxLen;
		}	
		table.innerHTML = htmlStr;
		return table;
	},

	// 拖动函数
	drag: function(obj, oParent, fn) {
		var l = 0;
		var t = 0;
		var srcElem = null;
		var curTarget = null;
		var nTop = null;
		var disX = "";
		var disY = "";
		var is_mobile = +(T.browser.mobile);
		var oEvType = [
			{"start":"mousedown","move":"mousemove","end":"mouseup"},
			{"start":"touchstart","move":"touchmove","end":"touchend"}
		][is_mobile];

		function downEvent(ev){
			var e = ev || window.event;
			var clientX = is_mobile ? e.touches[0].clientX : e.clientX;
			var clientY = is_mobile ? e.touches[0].clientY : e.clientY;
			srcElem = e.target || e.srcElement;
			curTarget = e.currentTarget || e.srcElement.parentNode;
			nTop = document.documentElement.scrollTop || document.body.scrollTop;
			disX = clientX - oParent.offsetLeft - obj.offsetLeft;
			disY = clientY + nTop - oParent.offsetTop - obj.offsetTop;
			// console.log("disX:"+disX + " | disY:" + disY);
			T.addEvent(document, oEvType["move"], moveEvent);
			T.addEvent(document, oEvType["end"], clearEvent);
		};
			
		function moveEvent(ev){
			var e = ev || window.event;
			var nTop = document.documentElement.scrollTop || document.body.scrollTop;
			var maxL = oParent.offsetWidth - obj.offsetWidth;
			var maxT = oParent.offsetHeight - obj.offsetHeight;
			var clientX = is_mobile ? e.changedTouches[0].clientX : e.clientX;
			var clientY = is_mobile ? e.changedTouches[0].clientY : e.clientY;
			l = clientX - oParent.offsetLeft - disX;
			t = clientY + nTop - oParent.offsetTop - disY;
			//console.log("is_mobile:" + is_mobile + " | clientX:" + clientX + " | clientY" + clientY);
			if (l < 0) {
				l = 0;
			} else if (l > maxL) {
				l = maxL;
			}
			if (t < 0) {
				t = 0;
			} else if (t > maxT) {
				t = maxT;
			}
			if (fn) fn(t, l, maxT, maxL);
			//obj.style.left = l + "px";
			//obj.style.top = t + "px";		
			e.preventDefault() || (e.returnValue = false);
			e.stopPropagation() || (e.cancelBubble = true);
		};

		function clearEvent(){
			srcElem = null;
			curTarget = null;
			T.removeEvent(document, oEvType["move"], moveEvent);
			T.removeEvent(document, oEvType["end"], clearEvent);
		};
		
		T.addEvent(obj, oEvType["start"] ,downEvent);
	},

	// 动态加载css文件
	loadCss: function(_href){
		var oLink = document.createElement("link");
		oLink.type = "text/css";
		oLink.rel = "stylesheet";
		oLink.href = _href;
		if(document.head){
			document.head.appendChild(oLink);
		}else{
			document.getElementsByTagName("head")[0].appendChild(oLink);	
		}
		return oLink;
	},

	// 寄生组合式继承 
	inherit: function(subType, superType){
		function object(o) {
			function F() {}
			F.prototype = o;
			return new F();
		}
		var prototype = object(superType.prototype);
		prototype.constructor = subType;
		subType.prototype = prototype;
	},

	// 判断是否是数组
	isArray: function(_o){
		var flag = false;
		if(Array.isArray){
			flag = Array.isArray(_o);
		}else{
			flag = Object.prototype.toString.call(_o) == '[object Array]';
		}
		return flag;
	},

	// 鼠标滚轮事件
	mouseWheel: function(fn, dom){
		var t = null;
		var d = dom || document;
		var isPropagation = 0;
		var isBubble = 0;
		function wheel(_ev){
			var e = _ev || window.event;
			var self = this;
			var num = typeof e.wheelDelta == "undefined" ? e.detail * -40 :e.wheelDelta;
			var isNotDocument = this == document ? 0 : 1;
			clearTimeout(t);
			t = setTimeout(function(){
				fn && fn.call(self, -num/120);	// 负值向上，正值向下
			},30);
			if(e.preventDefault && isNotDocument) e.preventDefault();
			if(e.stopPropagation && isNotDocument) e.stopPropagation();
			if(isNotDocument) e.returnValue = false;
			if(isNotDocument) e.cancelBubble = true;
		}
		T.addEvent(d, "mousewheel", wheel);
		T.addEvent(d, "DOMMouseScroll", wheel);
	},

	// 懒加载
	lazyLoadImg: function(_dataSet){
		var dis = 200;
		var dSet = _dataSet || "data-src";
		var lazyImg = Array.prototype.slice.call(document.images, 0);
		var broswerHeight = document.documentElement.clientHeight;
		// 初始第一屏图片,滚动时执行加载图片的方法
		loadImg();
		oScroll.add(loadImg);
		function loadImg() {		// 按需加载图片
			for(var i = 0, len = lazyImg.length; i < len; i++){
				var getTD = lazyImg[i].getBoundingClientRect()["top"];
				if (!lazyImg[i].loaded && getTD > -dis && getTD < (broswerHeight + dis)){
					lazyImg[i].src = lazyImg[i].getAttribute(dSet);
					lazyImg[i].onerror = function(){
						this.onerror = null;
						this.src = "error.png";
					}
					lazyImg[i].removeAttribute(dSet);
					lazyImg[i].loaded = true;
				}
			}
		}
	},

	// document.ready
	ready: function(_fn){
		var readyFlag = false;
		T.addEvent(document, "DOMContentLoaded", function(){
			readyFlag = true;
			_fn && _fn();
		});
		window.onload = function(){
			if(!readyFlag){
				console.log("进入window.onload");
				_fn && _fn();
			}
		}
	},

	// 去除左右空格
	trim: function(_str){
		if (!String.prototype.trim) {
			String.prototype.trim = function(){
			  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
			};
		}
		return _str.trim();
	},

	// 重复某字符n次
	repeatStr: function(_str, _len){
		var len = _len || 1;
		var repStr = "";
		for(var i = 0; i < len; i++){
			repStr += _str;
		}
		return repStr;
	},

	// 限制input或textarea长度：长度值为maxlength的值，fnNowStr返回当前str、strlen
	limitInput: function(dom, fnNowStr){
		var fnNowStr = fnNowStr || function(_str, _len){}  

		// oninput: 用户复制内容可监听、内容变化才触发(低版本ie使用onpropertychange)
		var testinput = document.createElement('input'); 
		if('oninput' in testinput){  
			T.addEvent(dom, "input", onmyinput);  
		}else{  
			dom.onpropertychange = onmyinput;  
		}  

		// onpaste: 粘贴事件
		T.addEvent(dom, "paste", onmypaste);

		// keypress: 键盘事件
		T.addEvent(dom, "keypress", onmykeypress);
		
		// oninput监听的事件
		function onmyinput(ev) {
			var e = ev || window.event;
			var o = this;
			if (o.value.length >= o.getAttribute("maxlength")) {
				if (o.value.length > o.getAttribute("maxlength")) o.value = o.value.substring(0, o.getAttribute("maxlength"));
				if(e.preventDefault) e.preventDefault();
				e.returnValue = false;
			}
			fnNowStr(o.value, o.value.length);
		}
		function mygetclipdata() {
			if (!document.all) {
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
				var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
				var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
				trans.addDataFlavor('text/unicode');
				var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				clip.getData(trans, clip.kGlobalClipboard);
				var str = new Object();
				var strLength = new Object();
				trans.getTransferData("text/unicode", str, strLength);
				if (str) str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
				var pastetext;
				if (str) pastetext = str.data.substring(0, strLength.value / 2);
				return pastetext;
			} else {
				return window.clipboardData.getData("Text");
			}
		}
		function mysetclipdata(o) {
			if (!document.all) {
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
				var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
				var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
				trans.addDataFlavor("text/unicode");
				var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
				str.data = o;
				trans.setTransferData("text/unicode", str, o.length * 2);
				var clipid = Components.interfaces.nsIClipboard;
				clip.setData(trans, null, clipid.kGlobalClipboard);
			} else {
				window.clipboardData.setData("Text", o);
			}
		}

		// onpaste监听的事件
		function onmypaste(ev) {
			var e = ev || window.event;
			var o = this;
			var nMaxLen = o.getAttribute ? parseInt(o.getAttribute("maxlength")) : "";
			if (document.selection.createRange().text.length > 0) {
				var ovalueandclipboarddata = o.value + window.clipboardData.getData("Text");
				if (o.getAttribute && ovalueandclipboarddata.length - document.selection.createRange().text.length > nMaxLen) {
					if (window.clipboardData.getData("Text").substring(0, document.selection.createRange().text.length + nMaxLen - o.value.length) != "") {
						window.clipboardData.setData("Text", window.clipboardData.getData("Text").substring(0, document.selection.createRange().text.length + nMaxLen - o.value.length));
					} else {
						if(e.preventDefault) e.preventDefault();
						e.returnValue = false;
					}
				}
			} else {
				var ovalueandclipboarddata = o.value + window.clipboardData.getData("Text");
				if (o.getAttribute && ovalueandclipboarddata.length > nMaxLen) {
					if (ovalueandclipboarddata.substring(0, nMaxLen - o.value.length) != "") {
						window.clipboardData.setData("Text", ovalueandclipboarddata.substring(0, nMaxLen - o.value.length));
					} else {
						if(e.preventDefault) e.preventDefault();
						e.returnValue = false;
					}
				}
			}
			fnNowStr(o.value, o.value.length);
		}

		// onkeypress监听的事件
		function onmykeypress(ev) {
			var e = ev || window.event;
			var o = this;
			if (!document.all) {
				var nMaxLen = o.getAttribute ? parseInt(o.getAttribute("maxlength")) : "";
				if (e.ctrlKey == true) {
					if (e.which == 118) {
						if (o.selectionStart < o.selectionEnd) {
							var ovalueandclipboarddata = o.value + mygetclipdata();
							if (o.getAttribute && (ovalueandclipboarddata.length - o.selectionEnd + o.selectionStart > nMaxLen)) {
								if (mygetclipdata().substring(0, o.selectionEnd - o.selectionStart + nMaxLen - o.value.length) != "") mysetclipdata(mygetclipdata().substring(0, o.selectionEnd - o.selectionStart + nMaxLen - o.value.length));
								else {
									if(e.preventDefault) e.preventDefault();
									e.returnValue = false;
								}
							}
						} else {
							var ovalueandclipboarddata = o.value + mygetclipdata();
							if (o.getAttribute && ovalueandclipboarddata.length > nMaxLen) {
								if (ovalueandclipboarddata.substring(0, nMaxLen - o.value.length) != "") mysetclipdata(ovalueandclipboarddata.substring(0, nMaxLen - o.value.length));
								else {
									if(e.preventDefault) e.preventDefault();
									e.returnValue = false;
								}
							}
						}
					}
				}
				if (e.which == 0 || e.which == 8)  return fnNowStr(o.value, o.value.length);
				if (o.value.length >= o.getAttribute("maxlength")) {
					if (o.selectionStart < o.selectionEnd) return fnNowStr(o.value, o.value.length);
					if (o.value.length > o.getAttribute("maxlength")) o.value = o.value.substring(0, o.getAttribute("maxlength"));
					if(e.preventDefault) e.preventDefault();
					e.returnValue = false;
				} else return fnNowStr(o.value, o.value.length);
			} else {
				if (document.selection.createRange().text.length > 0) return fnNowStr(o.value, o.value.length);
				if (o.value.length >= o.getAttribute("maxlength")){
					if(e.preventDefault) e.preventDefault();
					e.returnValue = false;
				} else return fnNowStr(o.value, o.value.length);
			}
			fnNowStr(o.value, o.value.length);
		}
	},

	// cookie对象封装
	cookie: {
		// 读取
		 get: function(name){ 
			var cookieStr = "; " + document.cookie + "; "; 
			var index = cookieStr.indexOf("; " + name + "="); 
			if (index >= 0){ 
				var s = cookieStr.substring(index + name.length + 3, cookieStr.length); 
				return decodeURIComponent(s.substring(0, s.indexOf("; ")));
			}else{ 
				return ""; 
			} 
		}, 
		// 设置
		 set : function(name, value, expires){ 
			var expDays = expires ? expires*24*60*60*1000 : 0; 
			var expDate = new Date(); 
			expDate.setTime(expDate.getTime() + expDays); 
			var expString = expires ? ";expires=" + expDate.toGMTString() : ""; 
			var pathString = ";path=/"; 
			document.cookie = name + "=" + encodeURIComponent(value) + expString + pathString; 
		}, 
		// 删除
		 del : function(name){ 
			var s = T.cookie.get(name); 
			if(s) {
				T.cookie.set(name, s, -1);
			}
		} 
	}
};

/*--------------------------bind函数的封装----------------------*/
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
	  if (typeof this !== "function") {
		throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	  }
	  var aArgs = Array.prototype.slice.call(arguments, 1), 
		  fToBind = this, 
		  fNOP = function () {},
		  fBound = function () {
			return fToBind.apply(this instanceof fNOP && oThis
								   ? this
								   : oThis || window,
								 aArgs.concat(Array.prototype.slice.call(arguments)));
		  };
  
	  fNOP.prototype = this.prototype;
	  fBound.prototype = new fNOP();
	  return fBound;
	};
}


/*--------------------------window.requestAnimationFrame的封装----------------------*/
;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());

/*------------------------------window.onscroll的封装-------------------------------*/
;(function(){
	function Scroller(){
		this.fnArr = {};
		this.addFlag = false;
		this.animatedId = null;
		this.scrollTimer = null;
		this.scrollflag = false;

		// 添加指定的window.scroll事件
		this.add = function(fn){
			var S = this;
			var id = new Date().getTime() + "-" + T.randomNum(0,1000);
			if(fn) this.fnArr[id] = fn;
			window.onscroll = function(){

				// 函数节流后，执行其他函数
				clearTimeout(S.scrollTimer);
				S.scrollTimer = setTimeout(function(){	
					var curTop = document.body.scrollTop || document.documentElement.scrollTop;
					for(var key in S.fnArr){
						if(S.fnArr[key]){
							S.fnArr[key](curTop);	// 提供外用的scrollTop值
						}
					}
				},150);
			};
			return id;
		};

		// 移除指定的window.onscroll事件
		this.remove = function(_id){
			if(this.fnArr[_id]){
				delete this.fnArr[_id];
			}
		};

		// 以_speed速度滚屏到指定_top位置
		this.scrollToTop = function(_top, _speed){
			this.top = parseInt(_top);
			this.rate = _speed || 6;
			this.scrollFlag = true;
			// 开始滚动
			this.animatedId = requestAnimationFrame(this.moveByStep.bind(this));
			// 用户滚动时清除定时器
			T.mouseWheel(this.stopScorll.bind(this), document);
		};

		// 用户滚动时清除定时器
		this.stopScorll = function(){
			this.scrollFlag = false;
			cancelAnimationFrame(this.animatedId);
			//console.log("外部scrollFlag：" + this.scrollFlag)
		}

		// 不断步移完成回顶部动画
		this.moveByStep = function(){
			var curTop = document.body.scrollTop || document.documentElement.scrollTop;
			if(this.top == curTop){
				this.stopScorll();
			}else{
				var speed = (this.top - curTop)/this.rate;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);	// 速度为正值向上取整，速度为负值向下取整
				// console.log("curTop = " + curTop + " || top = " + top + " || speed = " + speed);
				document.body.scrollTop = document.documentElement.scrollTop = curTop + speed;
				this.scrollFlag = true;
				this.animatedId = requestAnimationFrame(this.moveByStep.bind(this));
			}
			//console.log("内部scrollFlag:" + this.scrollFlag)
		};
	}
	window.oScroll = new Scroller();
}());

/*------------------------------window.onresize的封装-------------------------------*/
;(function(){
	function Resize(){
		this.fnArr = {};
		this.timer = null;

		// 添加指定的window.resize事件
		this.add = function(fn){
			var S = this;
			var id = new Date().getTime() + "-" + T.randomNum(0,1000);
			this.fnArr[id] = fn;
			window.onresize = function(){
				clearTimeout(S.timer);
				S.timer = setTimeout(function(){
					for(var key in S.fnArr){
						if(S.fnArr[key]){
							S.fnArr[key]();
						}
					}
				}, 200);
			};
		};

		// 移除指定的window.resize事件
		this.remove = function(_id){
			if(this.fnArr[_id]){
				delete this.fnArr[_id];
			}
		};
	}
	window.oResize = new Resize();
}());
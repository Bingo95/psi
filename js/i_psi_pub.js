//获取url参数
function GetParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

//时间控件防止滑动脱离
$(".Wdate").click(function () {
	$("<div class='timeWrap'></div>").appendTo("body");
})

//解除事件控件控制
$(".Wdate").blur(function () {
	$(".timeWrap").remove();
})

//按钮点击禁用
$(document).on("btn_change", ".btn_style", function () {
	$(this).addClass("prohibit_btn").attr('disabled', "true");
})

//ajax
var getData = function (ajaxobj) {
	var dfd = $.Deferred();
	$.ajax({
		type: 'post',
		dataType: "json",
		data: ajaxobj.param,
		contentType: "application/json",
		url: ajaxobj.ajaxurl,
		beforeSend: function () {
			$("<div class='loadingWrap'></div>").appendTo("body");
		},
		success: function (data) {
			//console.log(data)
			flag_val = data.Flag;
			msg_val = data.Msg;
			if (flag_val == 1) {
				dfd.resolve(data);
				$(".loadingWrap").remove();
			} else {
				$(".loadingWrap").remove();
				flag_type(flag_val, msg_val);
			}
		},
		error: function () {
			$(".loadingWrap").remove();
		},
		complete: function () {
			$(".btn_style").removeClass("prohibit_btn").removeAttr("disabled");
		}
	});
	return dfd.promise();
}

//输入小数和数字
function clearNoNum(_this) {
	if (isNaN($(_this).val())) {
		$(_this).val(0);
		$(_this).focus();
		if (GetParameter("active") == "i_newpur", "i_newsale") {
			table_tr_price();
		}
		alert("请输入数字。");
	}
}

//flag参数判断
function flag_type(flag_val, msg_val) {
	$(".loadingWrap2").remove();
	//var url = window.location.pathname;
	var url = window.location.href; //获取带参数文件名
	var page = url.substring(url.lastIndexOf('/') + 1, url.length);

	if (flag_val == -11) { //获取openid
		window.location.href = "i_login.html";
	} else if (flag_val == 9) {
		error_msg(msg_val);
	} else {
		alert(msg_val);
	}
}

//判断浏览器类型
function myBrowser() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	//alert(navigator.userAgent.toLowerCase())
	var isOpera = userAgent.indexOf("Opera") > -1;
	if (isOpera) {
		return "Opera";
	}; //判断是否Opera浏览器
	if (userAgent.indexOf("Firefox") > -1) {
		return "FF";
	} //判断是否Firefox浏览器
	if (userAgent.indexOf("Chrome") > -1) {
		return "Chrome";
	}
	if (userAgent.indexOf("Safari") > -1) {
		return "Safari";
	} //判断是否Safari浏览器
	if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		return "IE";
	}; //判断是否IE浏览器
}

//监听浏览器版本，右边部分随着边框改变
var Browser_type = myBrowser();
$(window).load(function () {
	var min_width = 1350;
	var left_width = 210;
	var right_width = 1140;
	if ("IE" == Browser_type) {
		var theUA = window.navigator.userAgent.toLowerCase();
		var _theUA = theUA.match(/msie\s\d+/);
		if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])) {
			var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
			if (ieVersion <= 7) {
				min_width = 1366;
				left_width = 240;
				right_width = 1150;
				psi_show_width(min_width, left_width, right_width);
			} else {
				psi_show_width(min_width, left_width, right_width);
			}
		}
	} else {
		psi_show_width(min_width, left_width, right_width);
	}
})

function psi_show_width(min_width, left_width, right_width) {
	var getdw = $(window).width();
	var wid = (getdw - left_width) + "px";
	if (getdw < min_width) {
		wid = right_width + "px";
	}
	$(".div_overlay").css("width", wid);
	$(".content_right").css("width", wid);

	$(window).resize(function () {
		var w = $(window).width();
		var wd = (w - left_width) + "px";
		if (w < min_width) {
			wd = right_width + "px";
		}
		$(".div_overlay").css("width", wd);
		$(".content_right").css("width", wd);
	});
}

//获取时间
//data_time 传入当前时间new Date(); data_val 偏移值;data_type 类型
//type 1是天; 2是周; 3是月; 4是年; 5是自定义传入日期;
//没有传入值是当前时间
function get_data(data_time, data_val, data_type) {

	//为单数加个0
	function day_zero(s) {
		return s < 10 ? '0' + s : s;
	}

	var myDate = data_time;
	if (data_time == "" || data_time == null || data_time == undefined) {
		myDate = new Date();
	}

	if (data_type == 1) {
		myDate.setDate(myDate.getDate() - data_val);
	} else if (data_type == 3) {
		myDate.setMonth(myDate.getMonth() - data_val);
	} else if (data_type == 4) {
		myDate.setFullYear(myDate.getFullYear() - data_val);
	} else if (data_type == 5) {
		var myDate = new Date(data_time.replace("-", "/").replace("-", "/"));
		myDate.setDate(myDate.getDate() + data_val);
	}

	//获取年
	var year = myDate.getFullYear();
	//获取月
	var month = myDate.getMonth() + 1;
	//获取日
	var date = myDate.getDate();
	/*当前时间*/
	var now = year + '-' + day_zero(month) + "-" + day_zero(date);
	return now;
};

//替换特殊字符  
function encodeWordURI(tplan) {
	tplan = encodeURIComponent(tplan); //一般转换完成
	tplan = tplan.replace(/\+/g, "%2B");
	tplan = tplan.replace(/\ /g, "%20");
	tplan = tplan.replace(/\//g, "%2F");
	tplan = tplan.replace(/\#/g, "%23");
	tplan = tplan.replace(/\&/g, "%26");
	tplan = tplan.replace(/\=/g, "%3D");
	tplan = tplan.replace(/\?/g, "%3F");
	tplan = tplan.replace(/%5C/g, "\\"); //转换\
	tplan = tplan.replace(/%22/g, "\""); //转换"
	return tplan;
}

$(".white_btn").mouseover(function () {
	$(this).css("background", "#e8e8e8");
})

$(".white_btn").mouseout(function () {
	$(this).css("background", "#FFFFFF");
})

//图片路径获取
var img_name = window.location.href;
img_name = img_name.substring(img_name.lastIndexOf('/') + 1, img_name.length).split(".")[0];
img_name = "./img/" + img_name + "-help.png";
$(function () {
	//判断是否有帮助图片，有则添加帮助按钮
	//console.log(img_name)
	var ImgObj = new Image();
	ImgObj.src = img_name;
	ImgObj.onload = function () {
		$(".content_top").prepend(
			"<label id='img_prompt' class='nav—prompt' style='margin-top:20px'>帮助</label>"
		);
	}
})

//帮助附加
$(document).on("click", "#img_prompt", function () {
	if ($("#model_prmpt_div").length == 0) {
		$(".content_right").css("overflow", "hidden");
		$(".content_right").append(
			"<div class='bg-model div_overlay' id='model_prmpt_div' style='display:block'>" +
			"<div class='content div_content' style='width: 70%;margin-top: 6%;display:block;min-width: 1050px;margin-bottom: 30px;'>" +
			"<div class='model_nav' style='padding-top:10px'>" +
			"<i id='model_prompt_clear' class='icon-clear back_model' style='position: absolute;right: 0;margin-right: 10px;'>&#xe8e7;</i>" +
			"</div>" +
			"<img src='" + img_name + "' style='width:100%;height:100%;margin-bottom:10px'/>" +
			"</div>" +
			"</div>"
		);
	}
})

//关闭帮助
$(document).on("click", "#model_prmpt_div", function () {
	$("#model_prmpt_div").remove();
	$(".content_right").css("overflow", "auto");
})
$(function () {
	user_data();
})

function user_data() {
	var _param = {};

	_param.action_sort = "10010";
	_param.data = {};
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)

		.done(function (data) {
			//console.log(data)
			naver_menu(data);
		})

		.always(function (data) {
			nav_left(data);
		})

		.always(function () {
			active_set();
		})

		.done(function (data) {
			interface_content();
		})
}

var naver_menu = function (_data) {
	var recharge_points = "";
	var edit_pwd = "<a href='i_changepwd.html?login_code="+_data.userinfo.login_code+"' class=''>修改密码</a>";
	var overplus_day = _data.Data.app_remind_day;
	//console.log(overplus_day);
	if (_data.userinfo.app_end_stat != 0) {
		recharge_points = "<a id='navber_pay_link' href='i_recharge.html?active=i_recharge' class='recharge_pay model_recharge'>您的账号在<span id='nav_enddate'>'" + (_data.Data.app_end_date).substring(0, 10) + "'</span>到期，点击可续费！</a>";
		edit_pwd = "";
	}
	$("body").append(
		"<div class='navber_box'>" +
		"<div class='navber_inner'>" +
		"<div class='navber_content'>" +
		"<label id='appname_enddate' class='navber_title' name='" + (_data.Data.app_end_date).substring(0, 10) + "'>" + _data.Data.app_name + "</label>" +
		"<div class='user_login_box'>" +
		recharge_points +
		"你好，<label>" + _data.userinfo.login_name + "</label>" +
		edit_pwd +
		"<a href='#' class='quit_login'>退出登录</a>" +	
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>"
	);
}

var nav_left = function (_data) {
	var allow_list = "<li><a class='nav-header'><i class='icon-style' style='margin:0px 5px'>&#xe640;</i>进货管理</a>" +
		"<ul>" +
		"<li id='i_newpur' class='href_url'><a>进货开单</a></li>" +
		"<li id='i_purlist' class='href_url'><a>进货查看</a></li>" +
		"<li id='i_purpaylist' class='href_url'><a>付款查看</a></li>" +
		"<li id='i_supplylist' class='href_url'><a>供应商管理</a></li>" +
		"</ul>" +
		"</li>" +
		"<li><a class='nav-header'><i class='icon-style' style='margin:0px 5px'>&#xe656;</i>销售管理</a>" +
		"<ul>" +
		"<li id='i_newsale' class='href_url'><a>销售开单</a>" +
		"</li>" +
		"<li id='i_salelist' class='href_url'><a>销售查看</a></li>" +
		"<li id='i_salepaylist' class='href_url'><a>收款查看</a></li>" +
		"<li id='i_clientlist' class='href_url'><a>客户管理</a></li>" +
		"</ul>" +
		"</li>" +
		"<li><a class='nav-header'><i class='icon-style' style='margin:0px 5px'>&#xe6cb;</i>库存管理</a>" +
		"<ul>" +
		"<li id='i_stocklist' class='href_url'><a>库存查询</a></li>" +
		// "<li class='href_url'><a>售价查询</a></li>" +
		"</ul>" +
		"</li>" +
		"<li><a class='nav-header'><i class='icon-style' style='margin:0px 5px'>&#xe722;</i>统计管理</a>" +
		"<ul>" +
		"<li id='i_prodpurlist' class='href_url'><a>产品进货统计</a></li>" +
		"<li id='i_prodsalelist' class='href_url'><a>产品销售统计</a></li>" +
		// "<li class='href_url'><a>单品进货统计</a></li>" +
		// "<li class='href_url'><a>单品销售统计</a></li>" +
		"</ul>" +
		"</li>";

	var allow_set = "<li id='i_productlist' class='href_url'><a>商品管理</a></li>" +
		"<li id='i_company_inf' class='href_url'><a>公司信息</a></li>" +
		"<li id='i_pubmenu' class='href_url'><a>系统设置</a></li>";

	if (_data.userinfo.app_end_stat == 2) {
		allow_list = "";
		allow_set = "";
	}

	$(".row-fluid").prepend(
		"<div class='nav_left' style='overflow: auto;'>" +
		"<div class='nav_content'>" +
		"<ul class='nav nav-list'>" +
		allow_list +
		"<li><a class='nav-header'><i class='icon-style' style='margin:0px 5px 0 5px'>&#xe68f;</i>系统管理</a>" +
		"<ul>" +
		allow_set +
		// "<li class='href_url'><a>用户管理</a></li>" +
		"<li id='i_recharge' class='href_url'><a>系统续费</a></li>" +
		"</ul></li></ul>" +
		"</div></div>"
	);
}

//退出登录
$(document).on("click", ".quit_login", function () {
	var _param = {};

	_param.action_sort = "80112";
	_param.data = {};
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		//成功后跳转
		.done(function (data) {
			//console.log(data)
		})

		.always(function () {
			window.location.href = "i_login.html";
		})
})

$(document).on("click", ".navber_title", function () {
	window.location.href = "index.html";
})

//设置激活菜单项目
var active = GetParameter("active");
var active_set = function () {
	/*$("#" + active).parent("ul").css("display", "block");*/
	$("#" + active).addClass("active").parents("ul").siblings(".nav-header").attr("stat", 1);
	$(".nav").find(".nav-header").attr("stat", 1);
}

//菜单隐藏与显示
$(document).on("click", ".nav-header", function () {
	if ($(this).attr("stat") == 1) {
		$(this).siblings("ul").slideUp(200);
		$(this).removeAttr("stat");
		return;
	}
	/*$(".nav-header").removeAttr("stat");*/
	$(this).attr("stat", 1);
	/*$(".nav-header").siblings("ul").slideUp(200);*/
	$(this).siblings("ul").slideDown(200);
})

//左侧菜单跳转
$(document).on("click", ".href_url", function () {
	var urlname = $(this).attr("id");
	window.location.href = urlname + ".html?active=" + urlname;
})

//获取url参数
function GetParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}
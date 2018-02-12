var interface_content = function () {
	$(function () {
		pubmenu_login();
	})
}

//列表加载，获取数据
function pubmenu_login() {
	var _param = {};
	var p_data = {};

	p_data.fieldsort = 2;

	_param.action_sort = "90101";
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存",_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			//console.log(data)
			var _data = data.Data;
			var listcontent = $("#pubmenu_click");
			// listcontent.html("");

			if (_data.length == 0) {
				listcontent.append("暂无配置目录。")
			} else {
				for (var i = 0; i < _data.length; i++) {
					listcontent.append(
						"<div class='pubmenu_box' style='width:33.333%;margin:25px 0;'>" +
						"<button class='defar_btn' id='" + _data[i].fieldname + "' name =" + _data[i].fieldtitle + ">" +
						"<i class='icon-style' style='margin:0px 5px;font-size:18px'>&#xe696;</i>" + _data[i].fieldtitle + "</button>" +
						"</div>"
					);
				}
			}
		})

		.done(function () {
			$(".content_right").removeClass("dispy_none");
		})

		.done(function () {
			$(".defar_btn").click(function () {
				var name = $(this).attr("name");
				$(".content_top #pubmenu_title").html(
					"<a href='javascript:pubmenu_back_btn();' class='out_pubmenu' style='font-size:22px'>系统设置</a>-><span style='font-size:25px'>" + name + "</span>"
				);
				var config_type = $(this).attr("id");
				pub_list(config_type);
			})
		})

		.done(function () {
			$(".one").show();
		})
};

//配置列表
function pub_list(config_type) {
	var _param = {};
	var _data = {};

	_data.fieldsort = 2;
	_data.fieldname = config_type;
	_data.stat = 9;

	_param.action_sort = "9010201";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出",_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			//console.log(data)
			$(".two").attr("id", config_type);
			$("#table_center tbody").html("");
			var _data = data.Data.fieldlist;
			var btn_content;
			for (var i = 0; i < _data.length; i++) {
				btn_content = "";
				if (_data[i].stat == 0) {
					btn_content = "<a class='pubmen_table_del' name='" + _data[i].id + "' ptype='" + config_type + "' onclick='alert_model(this," + 0 + ")'>删除</a>" +
						"<a class='pubmen_table_edit' onclick='edit_click(" + _data[i].id + ")''>修改</a>";
				} else if (_data[i].stat == 1) {
					btn_content = "<a class='pubmen_table_out' name='" + _data[i].id + "' onclick='alert_model(this," + 1 + ")'>还原</a>";
				}
				$("#table_center tbody").append(
					"<tr>" +
					"<td class='pubmen_table_td1'><div class='pubmen_table_bor'></div></td>" +
					"<td class='pubmen_table_td2'>" + _data[i].sysname + "(" + _data[i].sn + ")" + "</td>" +
					"<td class='pubmen_table_td3'>" + btn_content +
					"</td>" +
					"</tr>"
				);
			}
		})

		.done(function () {
			list_number();
		})

		.done(function () {
			$(".one").unbind("hide").hide(50, function () {
				$(".two").show(100);
				$(".pubmenu_back").css("display", "block");
				$(".pub_btn_add").css("display", "block");
			});
		})

}

//配置增加序号
function publist_add() {
	var _param = {};
	var _data = {};
	_data.fieldname = $(".two").attr("id");
	_data.fieldsort = 2;
	_param.action_sort = "90102021";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			$("#pubmenu_num").val(data.Data.sn);
		})

		.done(function () {
			//显示遮罩
			$("#save_product").show();
			$("#edit_product").hide();
			$(".model_nav label").text("新增");
			$("#active_model_div").show();
			$(".content").fadeIn(200);
			$(".prompt_model").hide();
			$("#pubmenu_name").val("").focus();
			$(".model_nav label").attr("stat", 1);
			$(".pub_btn_add").unbind("click");
			$(".content_right").css("overflow", "hidden");
		})
}

//配置增加
function publist_addcontent() {
	var _param = {};
	var _data = {};
	_data.fieldname = $(".two").attr("id");
	_data.sn = encodeWordURI($.trim($("#pubmenu_num").val()));
	_data.fieldsort = 2;
	_data.sysname = encodeWordURI($.trim($("#pubmenu_name").val()));
	_data.fieldtitle = "";
	_param.action_sort = "90102022";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			//console.log(data)
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})

		.done(function () {
			$("#active_model_div").hide();
			$(".content_right").css("overflow", "auto");
		})

		.done(function () {
			add_new_pub();
		})
}

//配置修改
var edit_click = function (pubid) {
	publist_edit(pubid);
}

//配置修改
function publist_edit(pubid) {
	var _param = {};
	var _data = {};
	_data.id = pubid;

	_param.action_sort = "90102031";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			$("#pubmenu_name").val(data.Data.sysname);
			$("#pubmenu_num").val(data.Data.sn);
			$("#save_product").hide();
			$("#edit_product").show();
			$("#edit_product").attr("name", pubid);
			$(".model_nav label").text("修改");
			$("#active_model_div").show();
			$(".content").fadeIn(200);
			$(".prompt_model").hide();
			$("#pubmenu_name").focus();
			$(".model_nav label").attr("stat", 0);
			$(".pub_btn_add").unbind("click");
			$(".content_right").css("overflow", "hidden");
		})
}

//配置修改保存
function publist_editcontent() {
	var _param = {};
	var _data = {};
	_data.fieldname = encodeWordURI($.trim($(".two").attr("id")));
	_data.sn = encodeWordURI($.trim($("#pubmenu_num").val()));
	_data.id = encodeWordURI($.trim($("#edit_product").attr("name")));
	_data.fieldsort = 2;
	_data.sysname = encodeWordURI($.trim($("#pubmenu_name").val()));
	_data.fieldtitle = "";

	_param.action_sort = "90102032";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})

		.done(function () {
			$("#active_model_div").hide();
			$(".content_right").css("overflow", "auto");
		})

		.done(function () {
			add_new_pub();
		})
}

//提示框
var alert_model = function (_this, stat) {
	var pub_name = $(_this).parents("tr").find("td").eq(1).text().split("(");
	var _id = $(_this).attr("name");
	$("#alert_model_div").attr("model_stat", 1);
	$("#alert_model_div").find(".model_nav label").text("提示");
	$(".prompt_model").hide();
	$(".pub_btn_add").unbind("click");
	//console.log(_id)
	if (stat == 0) {
		$("#alert_text").text("您确定要删除【" + pub_name[0] + "】")
		$("#alert_ok").attr("onclick", "publist_del(" + _id + ")");
	} else if (stat == 1) {
		$("#alert_text").text("您确定要还原【" + pub_name[0] + "】")
		$("#alert_ok").attr("onclick", "undel_click(" + _id + ")");
	}
	$("#alert_model_div").show();
	$("#alert_model_div .content").fadeIn(200);
}

//配置删除
function publist_del(_id) {
	var _param = {};
	var _data = {};
	_data.id = _id;

	_param.action_sort = "9010204";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})

		.done(function () {
			$("#alert_model_div").hide();
			$("#alert_model_div").attr("model_stat", 0);
			$(".content_right").css("overflow", "auto");
		})

		.done(function () {
			add_new_pub();
		})
}

//配置还原
function undel_click(p_id) {
	var _param = {};
	var _data = {};
	_data.id = p_id;

	_param.action_sort = "9010205";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})

		.done(function () {
			$("#alert_model_div").hide();
			$("#alert_model_div").attr("model_stat", 0);
			$(".content_right").css("overflow", "auto");
		})

		.done(function () {
			add_new_pub();
		})
}

document.onkeydown = keyDownSearch;

function keyDownSearch(e) {
	//兼容FF和IE和Opera    
	var theEvent = e || window.event;
	var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
	if (code == 13 && $("#alert_model_div").attr("model_stat") != 1 && $("#active_model_div").css("display") == "none") {
		if ($(".one").css("display") == "none" && $("#alert_model_div").css("display") == "none" && $("#active_model_div").css("display") == "none") {
			$(".pub_btn_add").trigger("click").unbind("click");
		}
	} else if ($("#alert_model_div").attr("model_stat") == 1 && $("#alert_model_div").css("display") != "none") {
		$("#alert_ok").trigger("click");
		$(".pub_btn_add").unbind("click");
	}
	stopPropagation(e);
}

function stopPropagation(e) {
	e = window.event || e;
	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}

$(".model_form").find("input").keydown(function (e) {
	var theEvent = e || window.event;
	var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
	if (code == 13) { //回车键的键值为13
		if ($(".model_nav label").attr("stat") == 1 && $(this).attr("id") == "pubmenu_num") {
			$("#save_product").trigger("click");
		} else if ($(".model_nav label").attr("stat") == 0 && $(this).attr("id") == "pubmenu_num") {
			$("#edit_product").trigger("click");
		} else {
			$(this).parents(".model_form").next().find("input").focus();
		}
	}
	stopPropagation(e);
})

//确定新增
$("#save_product").click(function () {
	if ($.trim($("#pubmenu_name").val()) == "") {
		$("#pubmenu_name").focus();
		$(".prompt_model").text("请输入名称").show();
	} else if ($.trim($("#pubmenu_num").val()) == "" || isNaN($.trim($("#pubmenu_num").val()))) {
		$("#pubmenu_num").focus();
		$(".prompt_model").text("请输入正确排序号").show();
	} else {
		$(this).trigger("btn_change");
		publist_addcontent();
	}
})

//新增绑定事件
function add_new_pub() {
	$(".pub_btn_add").unbind("click").bind("click", function () {
		$(this).trigger("btn_change");
		publist_add();
	});
}

//确定修改
$("#edit_product").click(function () {
	if ($.trim($("#pubmenu_name").val()) == "") {
		$("#pubmenu_name").focus();
		$(".prompt_model").text("请输入名称").show();
	} else if ($.trim($("#pubmenu_num").val()) == "" || isNaN($.trim($("#pubmenu_num").val()))) {
		$("#pubmenu_num").focus();
		$(".prompt_model").text("请输入正确序号").show();
	} else {
		$(this).trigger("btn_change");
		publist_editcontent();
	}
})

//新增按钮
$(".pub_btn_add").click(function () {
	$(this).trigger("btn_change");
	publist_add();
})

//关闭模拟
$(".back_model").click(function () {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
	$(".content_right").css("overflow", "auto");
	add_new_pub();
})

//列表计数
function list_number() {
	//$('table tr:not(:first)').remove();
	var len = $('#table_center tbody tr').length;
	var a;
	for (var i = 0; i < len; i++) {
		a = i + 1;
		$('#table_center tbody tr:eq(' + i + ') td:first').css("padding", "0");
		$('#table_center tbody tr:eq(' + i + ') td:first').find(".pubmen_table_bor").text(a);
	}
};

//返回
$(".pubmenu_back").click(function () {
	pubmenu_back_btn();
})

//返回显示
function pubmenu_back_btn() {
	$(".two").hide(50, function () {
		$(".one").show(100);
		$(".content_top #pubmenu_title").text("系统设置");
		$(".pubmenu_back").css("display", "none");
		$(".pub_btn_add").css("display", "none");
	});
}

//错误提示
var error_msg = function (msg) {
	$(".prompt_model").html(msg).show();
}
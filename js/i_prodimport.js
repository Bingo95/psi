var interface_content = function() {
	$(function() {
		$(".content_right").removeClass("dispy_none");
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
		.done(function(data) {
			//console.log(data)
			var _data = data.Data;
			var listcontent = $("#pubmenu_click");
			listcontent.html("");
			if(_data.length == 0) {
				listcontent.append("暂无配置目录。")
			} else {
				for(var i = 0; i < _data.length; i++) {
					listcontent.append(
						"<div class='pubmenu_box'>" +
						"<button class='defar_btn' id='" + _data[i].fieldname + "'>" + _data[i].fieldtitle + "</button>" +
						"</div>"
					);
				}
			}
		})

		.done(function() {
			$(".defar_btn").click(function() {
				var name = $(this).text();
				$(".content_top label").html("<a href='javascript:pubmenu_back_btn();' class='out_pubmenu'>系统设置</a>---" + name + "设置");
				var config_type = $(this).attr("id");
				pub_list(config_type);
			})
		})

		.done(function() {
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
		.done(function(data) {
			//console.log(data)
			$(".two").attr("id", config_type);
			$("#table_center tbody").html("");
			var _data = data.Data.fieldlist;
			var btn_content;
			for(var i = 0; i < _data.length; i++) {
				btn_content = "";
				if(_data[i].stat == 0) {
					btn_content = "<a class='pubmen_table_del' name='" + _data[i].id + "' ptype='" + config_type + "' onclick='publist_del(this)'>删除</a>" +
						"<a class='pubmen_table_edit' onclick='edit_click(" + _data[i].id + ")''>修改</a>";
				} else if(_data[i].stat == 1) {
					btn_content = "<a class='pubmen_table_out' onclick='undel_click(" + _data[i].id + ")''>还原</a>";
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

		.done(function() {
			list_number();
		})

		.done(function() {
			$(".one").unbind("hide").hide(50, function() {
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
		.done(function(data) {
			$("#pubmenu_num").val(data.Data.sn);
		})

		.done(function() {
			//显示遮罩
			$("#pubmenu_name").val("");
			$("#save_product").show();
			$("#edit_product").hide();
			$(".model_nav title").text("新增");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
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
		.done(function(data) {
			//console.log(data)
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})

		.done(function() {
			$(".div_overlay").hide();
		})
}

//配置修改
var edit_click = function(pubid) {
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
		.done(function(data) {
			$("#pubmenu_name").val(data.Data.sysname);
			$("#pubmenu_num").val(data.Data.sn);
			$("#save_product").hide();
			$("#edit_product").show();
			$("#edit_product").attr("name", pubid);
			$(".model_nav title").text("修改");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
		})
}

//配置修改保存
function publist_editcontent() {
	var _param = {};
	var _data = {};
	_data.fieldname = $(".two").attr("id");
	_data.sn = encodeWordURI($.trim($("#pubmenu_num").val()));
	_data.id = $("#edit_product").attr("name");
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
		.done(function(data) {
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})

		.done(function() {
			$(".div_overlay").hide();
		})
}

//配置删除
function publist_del(_this) {
	var _param = {};
	var _data = {};
	_data.id = $(_this).attr("name");

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
		.done(function(data) {
			var config_type = $(_this).attr("ptype")
			pub_list(config_type);
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
		.done(function(data) {
			var config_type = $(".two").attr("id");
			pub_list(config_type);
		})
}

//确定新增
$("#save_product").click(function() {
	if($.trim($("#pubmenu_name").val()) == "") {
		alert("请输入名称");
	} else {
		$(this).trigger("btn_change");
		publist_addcontent();
	}
})

//确定修改
$("#edit_product").click(function() {
	if($.trim($("#pubmenu_name").val()) == "") {
		alert("请输入名称");
	} else if($.trim($("#pubmenu_num").val()) == "" || isNaN($.trim($("#pubmenu_num").val()))) {
		alert("请输入正确序号");
	} else {
		$(this).trigger("btn_change");
		publist_editcontent();
	}
})

//新增按钮
$(".pub_btn_add").click(function() {
	$(this).trigger("btn_change");
	publist_add();
})

//关闭模拟
$("#out_model").click(function() {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
})

//列表计数
function list_number() {
	//$('table tr:not(:first)').remove();
	var len = $('#table_center tbody tr').length;
	var a;
	for(var i = 0; i < len; i++) {
		a = i + 1;
		$('#table_center tbody tr:eq(' + i + ') td:first').css("padding", "0");
		$('#table_center tbody tr:eq(' + i + ') td:first').find(".pubmen_table_bor").text(a);
	}
};

//返回
$(".pubmenu_back").click(function() {
	pubmenu_back_btn();
})

function pubmenu_back_btn() {
	$(".two").hide(50, function() {
		$(".one").show(100);
		$(".content_top label").text("系统设置");
		$(".pubmenu_back").css("display", "none");
		$(".pub_btn_add").css("display", "none");
	});
}
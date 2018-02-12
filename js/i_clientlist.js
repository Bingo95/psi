var page_no = 1;
var interface_content = function () {
	$(function () {
		clientlist_login(page_no);
	})
}
//列表加载，获取数据
function clientlist_login(page_no) {
	var _param = {};
	var p_data = {};

	p_data.cust_name = encodeWordURI($.trim($("#cust_name_s").val()));
	p_data.cust_address = encodeWordURI($.trim($("#cust_address_s").val()));
	p_data.cust_tel = encodeWordURI($.trim($("#cust_tel_s").val()));
	p_data.cust_stat = encodeWordURI($.trim($("#cust_stat_s option:selected").val()));
	p_data.page_no = page_no;
	p_data.page_size = 10;

	_param.action_sort = "70101";
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			//console.log(data)
			var _data = data.Data.List;
			var listcontent = $("#table_center tbody");
			listcontent.html("");
			if (_data.length == 0) {
				listcontent.append("<tr><td colspan='8' style='text-align:center'>没有找到数据！</td></tr>")
			} else {
				var cust_name, cust_address, cust_tel, cust_stat, cust_others, cust_inputdate, cust_con;
				//列表
				for (var i = 0; i < _data.length; i++) {
					cust_name = _data[i].cust_name; //客户名字
					cust_con = _data[i].cust_con; //客户联系人
					cust_address = _data[i].cust_address; //客户地址
					cust_tel = _data[i].cust_tel; //客户电话
					cust_stat = _data[i].cust_stat; //状态
					cust_others = _data[i].cust_others; //备注
					cust_inputdate = _data[i].cust_inputdate; //录入时间

					if (cust_stat == 0) {
						cust_stat = "有效";
					} else {
						cust_stat = "无效";
					}

					listcontent.append(
						"<tr style='font-size:15px'>" +
						"<td style='text-align:left !important;padding:5px 5px;'>" + cust_name + "</td>" +
						"<td>" + cust_address + "</td>" +
						"<td>" + cust_con + "</td>" +
						"<td>" + cust_tel + "</td>" +
						"<td style='text-align: center !important;'>" + cust_stat + "</td>" +
						"<td>" + cust_others + "</td>" +
						"<td style='text-align: center !important;'>" + cust_inputdate + "</td>" +
						"<td><a style='color:#16A8E0;cursor:pointer;' href='#' onclick='edit_click(" + _data[i].cust_id + ")'>修改</a></td></tr>"
					);
				}
			}
		})

		//分页初始化
		.done(function (data) {
			var total_cnt = data.Data.total_cnt; //总条数
			var page_cnt = Math.ceil(total_cnt / 10); //总页数
			var page_no = data.Data.page_no //当前页
			$("#page_no").text(page_no);
			var page_content = $(".page_div"); //页数区域
			//分页初始化
			$(".page_div").paging({
				pageNo: page_no,
				totalPage: page_cnt,
				totalSize: total_cnt,
				callback: function (num) {
					//console.log(num);
					$("#page_no").text(num);
					clientlist_login(num);
				}
			});
		})

		.done(function () {
			other_click()
		})

		.done(function () {
			$(".content_right").removeClass("dispy_none");
		})
};

//供货商新增
function save_data() {
	$(".model_form input").val("");
	var _param = {};
	var _data = {};
	_param.action_sort = "70103";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)

		.done(function () {
			//显示遮罩
			$("#save_cust").show();
			$("#edit_cust").hide();
			$(".content_right").css("overflow", "hidden");
			$(".model_nav label").text("客户新增");
			$(".edit_none").addClass("dispy_none");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
			$("#cust_name").focus();
			$(".model_nav label").attr("stat", 1);
		})
}

//保存
function save_cust(stat) {
	var _param = {};
	var _data = {};

	_data.cust_name = encodeWordURI($.trim($("#cust_name").val()));
	_data.cust_address = encodeWordURI($.trim($("#cust_address").val()));
	_data.cust_tel = encodeWordURI($.trim($("#cust_tel").val()));
	_data.cust_con = encodeWordURI($.trim($("#cust_con").val()));
	_data.cust_others = encodeWordURI($.trim($("#cust_others").val()));
	if (stat == 0) {
		_data.cust_stat = encodeWordURI($.trim($("#cust_stat option:selected").val()));
		_data.cust_id = encodeWordURI($.trim($("#edit_cust").attr("name")));
		_param.action_sort = "70106";
	} else {
		_param.action_sort = "70104";
	}
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)

		.done(function () {
			$(".model_form input").val("");
			$(".model_form select").val(0);
			$(".div_overlay").hide();
			$(".prompt_model").hide();
			$(".content_right").css("overflow", "auto");
		})

		.done(function () {
			clientlist_login(1);
		})
}

/*回车下一个*/
$(".edit_input").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) {
		if ($(".model_nav label").attr("stat") == 1 && $(this).attr("id") == "cust_others") {
			$("#save_cust").trigger("click");
		} else if ($(".model_nav label").attr("stat") == 0 && $(this).attr("id") == "cust_stat") {
			$("#edit_cust").trigger("click");
		} else if ($(".model_nav label").attr("stat") == 0 && $(this).attr("id") == "cust_others") {
			$(this).parent().next().find("#cust_stat").focus();
		} else {
			$(this).parent().next().find(".edit_input").focus();
		}
	}
})

function other_click() {
	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function () {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

//搜索
$("#search_btn").click(function () {
	$(this).trigger("btn_change");
	clientlist_login(1);
})

//回车搜索
$(".supplylist").find("input").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		$("#search_btn").trigger("btn_change");
		clientlist_login(1);
	}
});

//新增按钮
$("#add_btn").click(function () {
	$(this).trigger("btn_change");
	save_data();
})

//关闭模拟
$("#out_model").click(function () {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
	$(".content_right").css("overflow", "auto");
})

//新增
$("#save_cust").click(function () {
	check_data_all(1, this);
})

//修改保存
$("#edit_cust").click(function () {
	check_data_all(0, this);
})

//校验数据完整性
function check_data_all(stat, _this) {
	if ($.trim($("#cust_name").val()) == "") {
		$(".prompt_model").html("请输入客户名称！").show();
	} else if ($.trim($("#cust_address").val()) == "") {
		$(".prompt_model").html("请输入客户地址！").show();
	} else if ($.trim($("#cust_tel").val()) == "") {
		$(".prompt_model").html("请输入客户电话！").show();
	} else {
		$(_this).trigger("btn_change");
		save_cust(stat);
	}
}

//获得焦点
$(".model_form input").focus(function () {
	$(this).select();
})

//修改
var edit_click = function (cust_id) {
	cust_detail(cust_id);
}

//详情
function cust_detail(cust_id) {
	var _param = {};
	var _data = {};

	_data.cust_id = cust_id;
	_param.action_sort = "70105";
	_param.data = _data;
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
			var _data = data.Data;
			$("#cust_name").val(_data.cust_name);
			$("#cust_con").val(_data.cust_con);
			$("#cust_address").val(_data.cust_address);
			$("#cust_tel").val(_data.cust_tel);
			$("#cust_stat").val(_data.cust_stat);
			$("#cust_others").val(_data.cust_others);
			$("#operator").val(_data.cust_operator);
			$("#inputdate").val(_data.cust_inputdate);
		})

		.done(function (data) {
			$("#save_cust").hide();
			$("#edit_cust").show().attr("name", cust_id);
			$(".model_nav label").text("客户修改");
			$(".edit_none").removeClass("dispy_none");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
			$("#cust_name").focus();
			$(".model_nav label").attr("stat", 0);
			$(".content_right").css("overflow", "hidden");
		})
}
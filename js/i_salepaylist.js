var page_no = 1;
var interface_content = function () {
	$(function () {
		pay_select();
	})
}

//支付方式列表
function pay_select() {
	var _param = {};
	var _data = {};

	_data.fieldsort = 2;
	_data.fieldname = "paysort";
	_data.stat = 0;

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
			var _data = data.Data.fieldlist;
			//console.log("信息", _data)
			$("#paysort_s").html("<option value=''>全部</option>");
			for (var i = 0; i < _data.length; i++) {
				$("#paysort_s").append(
					"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
				);
			}
		})

		.done(function (data) {
			//console.log(data)
			var _data = data.Data.fieldlist;
			for (var i = 0; i < _data.length; i++) {
				$("#paysort").append(
					"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
				);
			}
		})

		.done(function () {
			cust_select();
		})
}

//客户列表
function cust_select() {
	var _param = {};
	var p_data = {};

	p_data.cust_name = "";
	p_data.cust_address = "";
	p_data.cust_tel = "";
	p_data.cust_stat = 0;
	p_data.page_no = 1;
	p_data.page_size = 999;

	_param.action_sort = "70101";

	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log(_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);
	//参数填充
	$.when(dfd)
		.done(function (data) {
			var _data = data.Data.List;
			//console.log("用户信息", data)
			for (var i = 0; i < _data.length; i++) {
				$("#custname_select").append(
					"<option value=" + _data[i].cust_id + ">" + _data[i].cust_name + "</option>"
				);
			}
		})

		.done(function () {
			//可搜索的select选择框初始化
			$('#custname_select').searchableSelect();
		})

		.done(function () {
			$(".searchable-select").css("left", "50px");
			$(".searchable-select").css("margin-top", "-26px");
		})

		.done(function () {
			$("#custname_select").val(GetParameter("cust_id"));
			var select_val = $("#custname_select option:selected").text();
			$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
		})

		.done(function () {
			page_no = GetParameter("page_no");
			if (page_no == null) {
				paylist_login(1);
				return;
			}
			$("#page_no").text(GetParameter("page_no"));
			$("#paycode_s").val(GetParameter("paycode_s"));
			$("#paydatef_s").val(GetParameter("paydatef_s"));
			$("#paydatet_s").val(GetParameter("paydatet_s"));
			$("#paysort_s").val(GetParameter("paysort_s"));
			paylist_login(page_no);
		})
}



//列表加载，获取数据
function paylist_login(page_no) {
	var _param = {};
	var p_data = {};

	p_data.paycode = encodeWordURI($.trim($("#paycode_s").val()));
	p_data.cust_id = encodeWordURI($.trim($("#custname_select").val()));
	p_data.paydatef = encodeWordURI($.trim($("#paydatef_s").val()));
	p_data.paydatet = encodeWordURI($.trim($("#paydatet_s").val()));
	p_data.paysort = encodeWordURI($.trim($("#paysort_s").val()));
	p_data.page_no = page_no;
	p_data.page_size = 10;

	_param.action_sort = "30125";
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存",_param)
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
			$("#sum_totalmoney").html("<label style='color:#666666'>总金额：</label></label><span style='color:#0073A9;'>" + data.Data.sum_paymoney + "</span><label style='color:#666666'>元</label>");
			if (_data.length == 0) {
				listcontent.append("<tr><td colspan='9'>没有找到数据！</td></tr>");
			} else {
				var salecode, paydate, paycode, paysort_value, cust_name, payothers, saleothers, operator, input_date, paymoney;
				//列表
				for (var i = 0; i < _data.length; i++) {
					paydate = _data[i].paydate;
					paysort_value = _data[i].paysort_value;
					paycode = _data[i].paycode;
					cust_name = _data[i].cust_name;
					paymoney = _data[i].paymoney;
					payothers = _data[i].payothers;
					saleothers = _data[i].saleothers;
					operator = _data[i].operator;
					input_date = _data[i].input_date;
					salecode = _data[i].salecode;

					listcontent.append(
						"<tr style='font-size:15px'>" +
						"<td>" + paydate.substring(0, 10) + "</td>" +
						"<td>" + paycode + "</td>" +
						"<td>" + paysort_value + "</td>" +
						"<td style='text-align:right;'>" + paymoney + "</td>" +
						"<td style='color:#16A8E0;cursor:pointer;padding: 5px 0;' onclick='detail_click(this)'>" + salecode + "</td>" +
						"<td style='text-align:left;'>" + cust_name + "</td>" +
						"<td style='text-align:left;'>" + payothers + "</td>" +
						"<td>" + operator + "</td>" +
						"<td>" + input_date.substring(5) + "</td>" +
						"<td>" +
						"<a class='pay_table_btn' onclick='edit_pay(this)'>修改</a>" +
						"<a class='pay_table_btn' onclick='del_detail(this)'>删除</a>" +
						"</td></tr>"
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
					paylist_login(num);
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



//支付增加
function pay_addcontent() {
	var _param = {};
	var _data = {};
	_data.salecode = GetParameter("salecode");
	_data.paydate = $("#paydate").val();
	_data.paysort = $("#paysort").val();
	_data.paymoney = encodeWordURI($.trim($("#paymoney").val()));
	_data.payothers = encodeWordURI($.trim($("#payothers").val()));
	_param.action_sort = "30121";
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
			paylist_login(1);
		})

		.done(function () {
			$("#active_model_div").hide();
			$(".content_right").css("overflow", "auto");
		})
}

//修改支付信息
var edit_pay = function (_this) {
	var code = $(_this).parents("tr").find("td").eq(1).text();
	$("#edit_pay").attr("name", code);
	//console.log($("#edit_pay").attr("name"))
	model_show(0);
}

//修改信息
function edit_paycontent() {
	var _param = {};
	var _data = {};

	_data.paycode = $("#edit_pay").attr("name");
	_param.action_sort = "30122";
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
			$("#paydate").val((data.Data.paydate).substring(0, 10));
			$("#paysort").val(data.Data.paysort);
			$("#paymoney").val(data.Data.paymoney).attr("readonly", "true");
			$("#payothers").val(data.Data.payothers);
		})
}

//确定修改
$("#edit_pay").click(function () {
	if ($.trim($("#paydate").val()) == "") {
		$(".prompt_model").text("请选择支付日期").show();
	} else if ($.trim($("#paymoney").val()) == "" || $.trim($("#paymoney").val()) == 0 || isNaN($.trim($("#paymoney").val()))) {
		$("#paymoney").focus();
		$(".prompt_model").text("请输入支付金额").show();
	} else if ($.trim($("#paysort").val()) == "") {
		$(".prompt_model").text("请选择支付方式").show();
	} else {
		$(this).trigger("btn_change");
		pay_editcontent();
	}
})

//修改保存
function pay_editcontent() {
	var _param = {};
	var _data = {};
	_data.paycode = $("#edit_pay").attr("name");
	_data.paydate = $("#paydate").val();
	_data.paysort = $("#paysort").val();
	_data.paymoney = encodeWordURI($.trim($("#paymoney").val()));
	_data.payothers = encodeWordURI($.trim($("#payothers").val()));

	_param.action_sort = "30123";
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
			paylist_login(1);
		})

		.done(function () {
			$("#active_model_div").hide();
			$(".content_right").css("overflow", "auto");
		})
}

function other_click() {
	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function () {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

//删除提示
var del_detail = function (_this) {
	alert_model(_this);
}

//提示框
var alert_model = function (_this) {
	var pay_code = $(_this).parents("tr").find("td").eq(1).text();
	$("#alert_model_div").find(".model_nav label").text("提示");
	$(".prompt_model").hide();

	$("#alert_text").text("您确定要删除收款单【" + pay_code + "】吗？")
	$("#alert_ok").attr("name", pay_code);

	$("#alert_model_div").show();
	$("#alert_model_div .content").fadeIn(200);
	$(".content_right").css("overflow", "hidden");
}

$("#alert_ok").click(function () {
	var pay_code = $("#alert_ok").attr("name");
	pay_del(pay_code);
})

//pay删除
function pay_del(pay_code) {
	var _param = {};
	var _data = {};
	_data.paycode = pay_code;

	_param.action_sort = "30124";
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
			paylist_login(1);
		})

		.done(function () {
			$("#alert_model_div").hide();
			$("#alert_model_div").attr("model_stat", 0);
			$(".content_right").css("overflow", "auto");
		})
}


//搜索
$("#search_btn").click(function () {
	$(this).trigger("btn_change");
	paylist_login(1);
})

//回车搜索
$("#paycode_s").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		$("#search_btn").trigger("btn_change");
		paylist_login(1);
	}
});


//显示遮罩，修改。添加。
function model_show(stat) {
	if (stat == 0) {
		$("#save_pay").hide();
		$("#edit_pay").show();
		$(".model_nav label").text("支付修改");
		edit_paycontent();
	}
	$("#active_model_div").show();
	$(".content").fadeIn(200);
	$(".prompt_model").hide();
	$(".content_right").css("overflow", "hidden");

}

//支付录入
$("#pay_add").click(function () {
	model_show(1)
})

//确定新增
$("#save_pay").click(function () {
	if ($.trim($("#paydate").val()) == "") {
		$(".prompt_model").text("请选择支付日期").show();
	} else if ($.trim($("#paymoney").val()) == "" || $.trim($("#paymoney").val()) == 0 || isNaN($.trim($("#paymoney").val()))) {
		$("#paymoney").focus();
		$(".prompt_model").text("请输入支付金额").show();
	} else if ($.trim($("#paysort").val()) == "") {
		$(".prompt_model").text("请选择支付方式").show();
	} else {
		$(this).trigger("btn_change");
		pay_addcontent();
	}
})

//关闭模拟
$(".back_model").click(function () {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
	$(".content_right").css("overflow", "auto");
})

//错误提示
var error_msg = function (msg) {
	$(".prompt_model").html(msg).show();
}

/*回车下一个*/
$("#payothers").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) {
		$("#edit_pay").trigger("click");
	}
})


//详情跳转
var detail_click = function (_this) {
	var salecode = $(_this).parents("tr").find("td").eq(4).text();
	var paycode_s = $("#paycode_s").val();
	var cust_id = $("#custname_select").val();
	var paydatef_s = $("#paydatef_s").val();
	var paydatet_s = $("#paydatet_s").val();
	var paysort_s = $("#paysort_s").val();
	page_no = $("#page_no").text();
	window.location.href = "i_saledetail.html?active=i_salepaylist&page_no=" + page_no + "&salecode=" + salecode + "&cust_id=" +
		cust_id + "&paydatef_s=" + paydatef_s + "&paydatet_s=" + paydatet_s + "&paycode_s=" + paycode_s + "&paysort_s=" + paysort_s;
}
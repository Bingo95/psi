var interface_content = function () {
	$(function () {
		detail_list();
	})
}
//列表加载，获取数据
function detail_list() {
	var _param = {};
	var p_data = {};

	p_data.purcode = GetParameter("purcode");
	$("#purcode").text(GetParameter("purcode"));

	_param.action_sort = "20102";
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
			var _data = data.Data.Detail;
			//console.log(data)
			var listcontent = $("#table_center tbody");
			listcontent.html("");
			var prodid = barcode = prodname = prodsort = priceout = unit = cost = amount = prodcode = purdetailothers = "";
			//表单
			$("#moneyleft").text(data.Data.moneyleft);
			$("#purdate").val((data.Data.purdate).substring(0, 10));
			$("#cust_name").text(data.Data.cust_name);
			$("#sum_amount").text(data.Data.sum_amount);
			$("#table_totalmoney").text(data.Data.totalmoney);
			if ((data.Data.senddate).substring(0, 10) == "1900-01-01") {
				$("#senddate").val("");
			} else {
				$("#senddate").val((data.Data.senddate).substring(0, 10));
			}
			$("#purothers").text(data.Data.purothers);
			$("#input_date").text(data.Data.input_date);
			$("#operator").text(data.Data.operator);
			//列表
			for (var i = 0; i < _data.length; i++) {
				cost = _data[i].cost;
				amount = _data[i].amount; //数量
				prodcode = _data[i].prodcode; //规格型号
				prodid = _data[i].prodid;
				storename = _data[i].storename; //仓库名称
				barcode = _data[i].prod_barcode;
				prodname = _data[i].prodname;
				prodsort = _data[i].prodsort;
				priceout = _data[i].pricein;
				unit = _data[i].unit;
				purdetailothers = _data[i].purdetailothers;

				listcontent.append(
					"<tr style='font-size:15px'><td style='min-width:51px'></td>" +
					"<td>" + barcode + "</td>" +
					"<td class='table_prodname'>" + prodname + "</td><td class='table_prodsort'>" + prodcode + "</td><td class='table_unit'>" + unit + "</td>" +
					"<td width='100px'>" + storename + "</td>" +
					"<td width='100px' style='text-align: right;'>" + amount + "</td><td width='100px' style='text-align: right;'>" + priceout + "</td>" +
					"<td class='table_allprice' style='text-align: right;'>" + cost + "</td><td width='100px'>" + purdetailothers + "</td></tr>"
				);
			}
		})

		.done(function () {
			pay_select();
		})
};

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
			$("#paysort").html("<option value=''>选择</option>");
			for (var i = 0; i < _data.length; i++) {
				$("#paysort").append(
					"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
				);
			}
		})

		.done(function () {
			pay_list();
		})
}

//获取支付列表
function pay_list() {
	var _param = {};
	var p_data = {};

	p_data.purcode = GetParameter("purcode");

	_param.action_sort = "20120";
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
			var _data = data.Data.Detail;
			//console.log(data)
			var listcontent2 = $("#pay_table tbody");
			listcontent2.html("");
			if (_data.length > 0) {
				var paydate = paycode = prodname = paysort_value = operator = input_date = payothers = paymoney = "";
				//表单
				$("#sum_paymoney").text(data.Data.sum_paymoney);
				//列表
				for (var i = 0; i < _data.length; i++) {
					input_date = _data[i].input_date;
					payothers = _data[i].payothers; //数量
					paymoney = _data[i].paymoney;
					paydate = _data[i].paydate;
					paysort_value = _data[i].paysort_value;
					paycode = _data[i].paycode;
					prodname = _data[i].prodname;
					prodsort = _data[i].prodsort;
					operator = _data[i].operator;
					payothers = _data[i].payothers;

					listcontent2.append(
						"<tr style='font-size:15px'><td></td>" +
						"<td>" + paycode + "</td>" +
						"<td>" + paydate.substring(0, 10) + "</td>" +
						"<td>" + paysort_value + "</td>" +
						"<td style='text-align:right;'>" + paymoney + "</td>" +
						"<td>" + operator + "</td>" +
						"<td>" + input_date + "</td>" +
						"<td style='text-align:left;'>" + payothers + "</td>" +
						"<td style='color:#16A8E0;'>" +
						"<a class='pay_table_btn' onclick='edit_pay(this)'>修改</a>" +
						"<a class='pay_table_btn' onclick='del_detail(this)'>删除</a>" +
						"</td></tr>"
					);
				}
			}
		})

		.done(function () {
			other_click();
			list_number();
		})

		.done(function () {
			$(".content_right").removeClass("dispy_none");
		})
};

//列表计数
function list_number() {
	//$('table tr:not(:first)').remove();
	var len = $('#table_center tbody tr').length;
	var a;
	for (var i = 0; i < len; i++) {
		a = i + 1;
		$('#table_center tbody tr:eq(' + i + ') td:eq(2)').css("position", "relative");
		$('#table_center tbody tr:eq(' + i + ') td:first').text(a);
		$('#table_center tbody tr:eq(' + i + ') td:first').css("padding", "5px 8px");
	}

	var len2 = $('#pay_table tbody tr').length;
	var b;
	for (var i = 0; i < len2; i++) {
		b = i + 1;
		$('#pay_table tbody tr:eq(' + i + ') td:eq(2)').css("position", "relative");
		$('#pay_table tbody tr:eq(' + i + ') td:first').text(b);
		$('#pay_table tbody tr:eq(' + i + ') td:first').css("padding", "5px 8px");
	}
};

function other_click() {
	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function () {
		$("#table_center tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})

	$("#pay_table tbody tr").unbind("click").click(function () {
		$("#pay_table tbody tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

$("#out_btn").click(function () {
	var active = GetParameter("active");
	var add_parm = "";
	if (active == "i_purlist", "i_prodpurlist") {
		var page_no = GetParameter("page_no");
		var purcode2 = GetParameter("purcode2");
		var cust_id = GetParameter("cust_id");
		var purdatef = GetParameter("purdatef");
		var purdatet = GetParameter("purdatet");
		if (active == "i_prodpurlist") {
			var prodname = GetParameter("prodname");
			var prodsort_select = GetParameter("prodsort_select");
			var prodcode = GetParameter("prodcode");
			var prod_barcode = GetParameter("prod_barcode");
			add_parm = "&prodname=" + prodname + "&prodsort_select=" + prodsort_select + "&prodcode=" + prodcode + "&prod_barcode=" + prod_barcode;
		}
		window.location.href = "" + active + ".html?active=" + active + "&page_no=" + page_no + "&cust_id=" + cust_id + "&purdatef=" + purdatef +
			"&purdatet=" + purdatet + "&purcode2=" + purcode2 + add_parm;
	} else {
		window.location.href = "i_newpur.html?active=i_newpur";
	}
})

$("#edit_purdetail").click(function () {
	var active = GetParameter("active");
	var add_parm = "";
	if (active == "i_purlist", "i_prodpurlist") {
		var page_no = GetParameter("page_no");
		var purcode2 = GetParameter("purcode2");
		var cust_id = GetParameter("cust_id");
		var purdatef = GetParameter("purdatef");
		var purdatet = GetParameter("purdatet");
		if (active == "i_prodpurlist") {
			var prodname = GetParameter("prodname");
			var prodsort_select = GetParameter("prodsort_select");
			var prodcode = GetParameter("prodcode");
			var prod_barcode = GetParameter("prod_barcode");
			add_parm = "&prodname=" + prodname + "&prodsort_select=" + prodsort_select + "&prodcode=" + prodcode + "&prod_barcode=" + prod_barcode;
		}
		window.location.href = "i_purmodify.html?active=" + active + "&purcode=" + GetParameter("purcode") + "&page_no=" + page_no + "&cust_id=" + cust_id + "&purdatef=" + purdatef +
			"&purdatet=" + purdatet + "&purcode2=" + purcode2 + add_parm;
	} else {
		window.location.href = "i_purmodify.html?active=i_newpur&purcode=" + GetParameter("purcode");
	}
})

//显示遮罩，修改。添加。
function model_show(stat) {
	//显示遮罩
	if (stat == 1) {
		$("#save_pay").show();
		$("#edit_pay").hide();
		$(".model_nav label").text("支付录入");
		$("#paydate").val(get_data());
		$("#paysort").val("");
		$("#paymoney").val($("#moneyleft").text()).removeAttr("readonly").removeClass("inallowed_input");
		$("#payothers").val("").focus();
	} else if (stat == 0) {
		$("#save_pay").hide();
		$("#edit_pay").show();
		$(".model_nav label").text("支付修改");
		edit_paycontent();
	}
	$("#active_model_div").show();
	$(".content").fadeIn(200);
	$(".prompt_model").hide();

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

//支付增加
function pay_addcontent() {
	var _param = {};
	var _data = {};
	_data.purcode = GetParameter("purcode");
	_data.paydate = $("#paydate").val();
	_data.paysort = $("#paysort").val();
	_data.paymoney = $.trim($("#paymoney").val());
	_data.payothers = $.trim($("#payothers").val());
	_param.action_sort = "20121";
	_param.data = _data;
	_param = JSON.stringify(_param);
	console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			//console.log(data)
			detail_list();
		})

		.done(function () {
			$("#active_model_div").hide();
		})
}

//修改支付信息
var edit_pay = function (_this) {
	var code = $(_this).parents("tr").find("td").eq(1).text();
	$("#edit_pay").attr("name", code);
	model_show(0);
}

function edit_paycontent() {
	var _param = {};
	var _data = {};
	_data.paycode = $("#edit_pay").attr("name");
	_param.action_sort = "20122";
	_param.data = _data;
	_param = JSON.stringify(_param);
	// console.log("输出", _param)
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
			$("#paymoney").val(data.Data.paymoney).attr("readonly", "true").addClass("inallowed_input");
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
	_data.paymoney = $.trim($("#paymoney").val());
	_data.payothers = $.trim($("#payothers").val());

	_param.action_sort = "20123";
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
			detail_list();
		})

		.done(function () {
			$("#active_model_div").hide();
		})
}


var del_detail = function (_this) {
	alert_model(_this);
}

//提示框
var alert_model = function (_this) {
	var pay_code = $(_this).parents("tr").find("td").eq(1).text();
	$("#alert_model_div").find(".model_nav label").text("提示");
	$(".prompt_model").hide();

	$("#alert_text").text("您确定要删除(" + pay_code + ")吗？")
	$("#alert_ok").attr("name", pay_code);

	$("#alert_model_div").show();
	$("#alert_model_div .content").fadeIn(200);
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

	_param.action_sort = "20124";
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
			detail_list();
		})

		.done(function () {
			$("#alert_model_div").hide();
			$("#alert_model_div").attr("model_stat", 0);
		})
}

//关闭模拟
$(".back_model").click(function () {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
})

//错误提示
var error_msg = function (msg) {
	$(".prompt_model").html(msg).show();
}
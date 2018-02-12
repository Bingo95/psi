var page_no = 1;
var interface_content = function () {
	$(function () {
		$("<div class='loadingWrap2'></div>").appendTo("body");
		var getdw = $(window).width();
		if (getdw < 1465) {
			$("#moneyleft_box").css("width", "210px");
			$("#moneyleft").css("margin-left", "40px");
		} else {
			$("#moneyleft_box").css("width", "165px");
			$("#moneyleft").css("margin-left", "0px");
		}

		model_typelist();
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
			$(".searchable-select").css("left", "33px");
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
				purlist_login(1);
				return;
			}
			$("#salecode").val(GetParameter("salecode2"));
			$("#saledatef").val(GetParameter("saledatef"));
			$("#employeename").val(GetParameter("employeename"));
			$("#saledatet").val(GetParameter("saledatet"));
			$("#moneyleft").val(GetParameter("moneyleft"));
			purlist_login(page_no);
		})
}

//营销列表
function model_typelist() {
	var _param = {};
	var p_data = {};
	var configtype = [];

	_param.action_sort = "9010200";
	configtype.push("employeename");
	p_data.fieldsort = 2;
	p_data.configtype = configtype;
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log(_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "pubConfig"
	};

	var dfd = getData(ajaxobj);
	//填充参数
	$.when(dfd)

		.done(function (data) {
			var _data = data.Data.data_lists.employeename;
			for (var i = 0; i < _data.length; i++) {
				$("#employeename").append(
					"<option value=" + _data[i].sysname + ">" + _data[i].sysname + "</option>"
				);
			}
		})

		.done(function () {
			cust_select();
		})
}

//列表加载，获取数据
function purlist_login(page_no) {
	var _param = {};
	var p_data = {};

	p_data.salecode = encodeWordURI($.trim($("#salecode").val()));
	p_data.cust_id = encodeWordURI($.trim($("#custname_select").val()));
	p_data.employeename = encodeWordURI($.trim($("#employeename").val()));
	p_data.saledatef = encodeWordURI($.trim($("#saledatef").val()));
	p_data.saledatet = encodeWordURI($.trim($("#saledatet").val()));
	p_data.moneyleft = encodeWordURI($.trim($("#moneyleft").val()));
	p_data.page_no = page_no;
	p_data.page_size = 10;

	_param.action_sort = "30103";
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
			$("#sum_totalmoney").html("<label style='color:#666666'>总金额：</label></label><span style='color:#0073A9;'>" + data.Data.sum_totalmoney + "</span><label style='color:#666666'>元</label>");
			if (_data.length == 0) {
				listcontent.append("<tr><td colspan='11'>没有找到数据！</td></tr>");
			} else {
				var senddate, salecode, saledate, cust_name, totalmoney, saleothers, operator, input_date, employeename, moneyleft;
				//列表
				for (var i = 0; i < _data.length; i++) {
					senddate = _data[i].senddate; //进货日期
					if (senddate.substring(0, 10) == "1900-01-01") {
						senddate = "";
					}
					saledate = _data[i].saledate; //进货日期
					salecode = _data[i].salecode; //进货单号
					cust_name = _data[i].cust_name; //供应商
					employeename = _data[i].employeename; //营销
					totalmoney = _data[i].totalmoney; //金额
					saleothers = _data[i].saleothers; //备注
					operator = _data[i].operator; //录入人
					input_date = _data[i].input_date; //录入日期
					moneyleft = _data[i].moneyleft;//余款

					listcontent.append(
						"<tr style='font-size:15px'>" +
						"<td>" + saledate.substring(0, 10) + "</td>" +
						"<td style='color:#16A8E0;cursor:pointer;padding: 5px 0;' onclick='detail_click(this)'>" + salecode + "</td>" +
						"<td style='text-align:left !important;'>" + cust_name + "</td>" +
						"<td>" + senddate.substring(0, 10) + "</td>" +
						"<td>" + employeename + "</td>" +
						"<td style='text-align:right !important;'>" + totalmoney + "</td>" +
						"<td style='text-align:right !important;'>" + moneyleft + "</td>" +
						"<td>" + saleothers + "</td>" +
						"<td>" + operator + "</td>" +
						"<td>" + input_date + "</td>" +
						"<td style='color:#16A8E0;cursor:pointer;' onclick='del_detail(this)'>删除</td></tr>"
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
					purlist_login(num);
				}
			});
		})

		.done(function () {
			other_click()
		})

		.done(function () {
			$(".content_right").removeClass("dispy_none");
			$(".loadingWrap2").remove();
		})
};

function other_click() {
	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function () {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

$("#search_btn").click(function () {
	$(this).trigger("btn_change");
	purlist_login(1);
})

//回车搜索
$("#salecode").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		$("#search_btn").trigger("btn_change");
		purlist_login(1);
	}
});

var detail_click = function (_this) {
	var salecode = $(_this).parents("tr").find("td").eq(1).text();
	var salecode2 = $("#salecode").val();
	var cust_id = $("#custname_select").val();
	var employeename = $("#employeename").val();
	var saledatef = $("#saledatef").val();
	var saledatet = $("#saledatet").val();
	var moneyleft = $("#moneyleft").val();
	page_no = $("#page_no").text();
	window.location.href = "i_saledetail.html?active=i_salelist&page_no=" + page_no + "&salecode=" + salecode + "&cust_id=" + cust_id +
		"&saledatef=" + saledatef + "&saledatet=" + saledatet + "&salecode2=" + salecode2 + "&employeename=" + employeename + "&moneyleft=" + moneyleft;
}

var del_detail = function (_this) {
	alert_model(_this);
}

//提示框
var alert_model = function (_this) {
	var pub_name = $(_this).parents("tr").find("td").eq(1).text();
	var _id = $(_this).parents("tr").find("td").eq(1).text();
	$("#alert_model_div").find(".model_nav label").text("提示");
	$(".prompt_model").hide();

	$("#alert_text").text("您确定要删除销售单【" + pub_name + "】吗？")
	$("#alert_ok").attr("name", _id);

	$("#alert_model_div").show();
	$("#alert_model_div .content").fadeIn(200);
	$(".content_right").css("overflow", "hidden");
}

$("#alert_ok").click(function () {
	var _id = $("#alert_ok").attr("name");
	purlist_del(_id);
})

//配置删除
function purlist_del(_id) {
	var _param = {};
	var _data = {};
	_data.salecode = _id;

	_param.action_sort = "30106";
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
			page_no = $("#page_no").text();
			if (page_no == "") {
				page_no = 1;
			}
			purlist_login(page_no);
		})

		.done(function () {
			$("#alert_model_div").hide();
			$("#alert_model_div").attr("model_stat", 0);
			$(".content_right").css("overflow", "auto");
		})
}

//关闭模拟
$(".back_model").click(function () {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
	$(".content_right").css("overflow", "auto");
})

$(window).resize(function () {
	var getdw = $(window).width();
	if (getdw < 1465) {
		$("#moneyleft_box").css("width", "210px");
		$("#moneyleft").css("margin-left", "40px");
	} else {
		$("#moneyleft_box").css("width", "165px");
		$("#moneyleft").css("margin-left", "0px");
	}
});

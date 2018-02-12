var interface_content = function() {
	$(function() {
		//客户列表
		cust_select(0, "");
	})
}

//列表加载，获取暂存数据
function newsalelist_list() {
	var _param = {};
	var p_data = {};

	p_data.salecode = GetParameter("salecode");

	_param.action_sort = "30104";
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function(data) {
			var _data = data.Data.Detail;
			//console.log(data)
			var listcontent = $("#table_center tbody");
			var prodid = barcode = prodname = prodsort = priceout = unit = cost = amount = prodcode = purdetailothers = "";
			//表单
			$("#saledate").val((data.Data.saledate).substring(0, 10));
			$("#senddate").val((data.Data.senddate).substring(0, 10));
			//console.log(data.Data.saledate)
			if(data.Data.saledate == "" || data.Data.saledate == null) {
				$("#saledate").val(get_data());
			}
			if(data.Data.senddate == "1900-01-01 00:00:00") {
				$("#senddate").val("");
			}

			$("#select_value").text(data.Data.cust_id);
			$("#custname_select").val(data.Data.cust_id);
			$("#sum_amount").text(data.Data.sum_amount);
			$("#table_totalmoney").text(data.Data.totalmoney);
			$("#input_date").text(data.Data.input_date);
			$("#operator").text(data.Data.operator);
			$("#employeename").val(data.Data.employeename);
			var select_val = $("#custname_select option:selected").text();
			//console.log($("#custname_select").val(data.Data.cust_id))
			$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
			$("#saleothers").val(data.Data.saleothers);
			//列表
			for(var i = 0; i < _data.length; i++) {
				cost = _data[i].cost;
				amount = _data[i].amount; //数量
				prodcode = _data[i].prodcode; //规格型号
				prodid = _data[i].prodid;
				storename = _data[i].storename; //仓库名称
				barcode = _data[i].prod_barcode;
				prodname = _data[i].prodname;
				prodsort = _data[i].prodsort;
				priceout = _data[i].priceout;
				unit = _data[i].unit;
				saledetailothers = _data[i].saledetailothers;

				listcontent.append(
					"<tr style='font-size:15px'><td style='min-width:51px'></td>" +
					"<td>" + barcode + "</td>" +
					"<td class='table_prodname'>" + prodname + "</td><td class='table_prodsort'>" + prodcode + "</td><td class='table_unit'>" + unit + "</td>" +
					"<td width='100px'>" + storename + "</td>" +
					"<td width='100px' style='text-align: right;'>" + amount + "</td><td width='100px' style='text-align: right;'>" + priceout + "</td>" +
					"<td class='table_allprice' style='text-align: right;'>" + cost + "</td><td width='100px'>" + saledetailothers + "</td></tr>"
				);
			}
		})

		.done(function() {
			other_click()
			list_number()
		})

		.done(function() {
			$(".content_right").removeClass("dispy_none");
		})
};

//保存方法
function save_data() {
	var _param = {};
	var _data = {};
	_data.saledate = $("#saledate").val();
	_data.cust_id = $.trim($("#select_value").text());
	_data.senddate = $("#senddate").val();
	_data.employeename = encodeWordURI($("#employeename").val());
	_data.saleothers = encodeWordURI($("#saleothers").val());
	_data.salecode = GetParameter("salecode");

	_param.action_sort = "30105";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		//保存成功后跳转
		.done(function(data) {
			var salecode = data.Data.salecode;
			//console.log(data);
			//清除暂存
			var active = GetParameter("active");
			if(active == "i_salelist", "i_prodsalelist") {
				var page_no = GetParameter("page_no");
				var salecode2 = GetParameter("salecode2");
				var cust_id = GetParameter("cust_id");
				var saledatef = GetParameter("saledatef");
				var saledatet = GetParameter("saledatet");
				if(active == "i_salelist") {
					var employeename = GetParameter("employeename");
					add_parm = "&employeename=" + employeename;
				} else if(active == "i_prodsalelist") {
					var prodname = GetParameter("prodname");
					var prodsort_select = GetParameter("prodsort_select");
					var prodcode = GetParameter("prodcode");
					var prod_barcode = GetParameter("prod_barcode");
					add_parm = "&prodname=" + prodname + "&prodsort_select=" + prodsort_select + "&prodcode=" + prodcode + "&prod_barcode=" + prod_barcode;
				}
			}
			window.location.href = "i_saledetail.html?active=" + active + "&salecode=" + salecode + "&page_no=" + page_no +
				"&cust_id=" + cust_id + "&saledatef=" + saledatef + "&saledatet=" + saledatet + "&salecode2=" + salecode2 + add_parm;
		})
}

//分类列表
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
		.done(function(data) {
			//console.log(data)
			var _data = data.Data.data_lists.employeename;
			for(var i = 0; i < _data.length; i++) {
				$("#employeename").append(
					"<option value=" + _data[i].sysname + ">" + _data[i].sysname + "</option>"
				);
			}
		})

		.done(function() {
			newsalelist_list();
		})
}

//客户列表
function cust_select(stat, Cust_id) {
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
		.done(function(data) {
			var _data = data.Data.List;
			$("#custname_select").html("<option value=''>选择</option>");
			//console.log("用户信息", data)
			for(var i = 0; i < _data.length; i++) {
				$("#custname_select").append(
					"<option value=" + _data[i].cust_id + ">" + _data[i].cust_name + "</option>"
				);
			}
		})

		.done(function() {
			$(".searchable-select").remove();
			//可搜索的select选择框初始化
			$('#custname_select').searchableSelect();
		})

		.done(function() {
			if(stat != 1) {
				model_typelist();
			}
		})

		.done(function() {
			if(stat == 1) {
				$("#select_value").html($.trim(Cust_id));
				var select_val = $("#cust_name").val();
				$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
			}
		})
}

//保存按钮
$("#modifysave_btn").click(function() {
	//检测否有未填参数
	if($("#select_value").text() == "") {
		alert("请选择客户");
	} else if($("#saledate").val() == "") {
		alert("请选择销售日期");
	} else {
		$(this).trigger("btn_change");
		$(this).attr("stat", 1);
		save_data();
	}
})

//客户参数记录
$("#custname_select").change(function() {
	$("#select_value").text($("#custname_select").val());
})

//计算价格数量
function table_tr_price() {
	var price_input = $(".table_allprice");
	var price, allprice;
	var prodnum = num = totalmoney = 0;
	for(var i = 0; i < price_input.length; i++) {
		num = price_input.eq(i).parents("tr").find(".table_num").val(); //数量
		price = price_input.eq(i).parents("tr").find(".table_piceout").val(); //单价
		allprice = (parseFloat(num) * parseFloat(price)).toFixed(2); //一行金额
		prodnum += parseFloat(num); //总数量
		price_input.eq(i).text(allprice);
		totalmoney += Number(parseFloat(num) * parseFloat(price)); //总金额
	}
	//总数量
	$("#table_totalnum").text(prodnum);
	//总金额
	$("#table_totalmoney").text(totalmoney.toFixed(2));
}

//列表计数
function list_number() {
	//$('table tr:not(:first)').remove();
	var len = $('#table_center tbody tr').length;
	var a;
	for(var i = 0; i < len; i++) {
		a = i + 1;
		$('#table_center tbody tr:eq(' + i + ') td:eq(2)').css("position", "relative");
		$('#table_center tbody tr:eq(' + i + ') td:first').text(a);
		$('#table_center tbody tr:eq(' + i + ') td:first').css("padding", "5px 8px");
	}
};

function other_click() {
	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function() {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

$("#out_saledetail").click(function() {
	window.history.back(-1);
})

//客户新增
function client_data() {
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

		.done(function() {
			//显示遮罩
			$(".prompt_model").hide();
			$(".model_form input").val("");
			$("#save_cust").show();
			$("#client_add .model_nav label").text("客户新增");
			$("#client_add").show();
			$(".content").fadeIn(200);
			$("#cust_name").focus();
		})
}

//新增按钮
$("#client_btn").click(function() {
	$(this).trigger("btn_change");
	client_data();
})

//新增
$("#save_cust").click(function() {
	check_data_all(this);
})

//校验数据完整性
function check_data_all(_this) {
	if($.trim($("#cust_name").val()) == "") {
		$(".prompt_model").html("请输入客户名称！").show();
	} else if($.trim($("#cust_address").val()) == "") {
		$(".prompt_model").html("请输入客户地址！").show();
	} else if($.trim($("#cust_tel").val()) == "") {
		$(".prompt_model").html("请输入客户电话！").show();
	} else {
		$(_this).trigger("btn_change");
		save_cust();
	}
}

//保存
function save_cust() {
	var _param = {};
	var _data = {};

	_data.cust_name = encodeWordURI($.trim($("#cust_name").val()));
	_data.cust_address = encodeWordURI($.trim($("#cust_address").val()));
	_data.cust_tel = encodeWordURI($.trim($("#cust_tel").val()));
	_data.cust_con = encodeWordURI($.trim($("#cust_con").val()));
	_data.cust_others = encodeWordURI($.trim($("#cust_others").val()));

	_param.action_sort = "70104";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)

		.done(function() {
			$(".div_overlay").hide();
			$(".prompt_model").hide();
		})

		.done(function(data) {
			cust_select(1, data.Data.cust_id);
		})
}

//隐藏遮罩
$(".clear_model_icon").click(function() {
	$(".div_overlay").hide();
	$(".model_prodtype ul li").removeClass("model_active");
	$(".model_prodtype ul li").eq(0).addClass("model_active");
})

/*回车下一个*/
$(".edit_input").keydown(function() {
	if(event.keyCode == 13) {
		if($(this).attr("id") == "cust_others") {
			$("#save_cust").trigger("click");
		} else {
			$(this).parent().next().find(".edit_input").focus();
		}
	}
})
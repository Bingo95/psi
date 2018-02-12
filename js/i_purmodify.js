var interface_content = function() {
	$(function() {
		//供应商列表
		supply_select(0, "");
	})
}

//列表加载，获取暂存数据
function newsalelist_list() {
	var _param = {};
	var p_data = {};

	p_data.purcode = GetParameter("purcode");

	_param.action_sort = "20104";
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
			$("#purdate").val((data.Data.purdate).substring(0, 10));
			$("#senddate").val((data.Data.senddate).substring(0, 10));
			//console.log(data.Data.purdate)
			if(data.Data.purdate == "" || data.Data.purdate == null) {
				$("#purdate").val(get_data());
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
			$("#purothers").val(data.Data.purothers);
			var select_val = $("#custname_select option:selected").text();
			//console.log($("#custname_select").val(data.Data.cust_id))
			$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
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
				pricein = _data[i].pricein;
				unit = _data[i].unit;
				purdetailothers = _data[i].purdetailothers;

				listcontent.append(
					"<tr style='font-size:15px'><td style='min-width:51px'></td>" +
					"<td>" + barcode + "</td>" +
					"<td class='table_prodname'>" + prodname + "</td><td class='table_prodsort'>" + prodcode + "</td><td class='table_unit'>" + unit + "</td>" +
					"<td width='100px'>" + storename + "</td>" +
					"<td width='100px' style='text-align: right;'>" + amount + "</td><td width='100px' style='text-align: right;'>" + pricein + "</td>" +
					"<td class='table_allprice' style='text-align: right;'>" + cost + "</td><td width='100px'>" + purdetailothers + "</td></tr>"
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
	_data.purdate = $("#purdate").val();
	_data.cust_id = $.trim($("#select_value").text());
	_data.senddate = $("#senddate").val();
	_data.purothers = encodeWordURI($("#purothers").val());
	_data.purcode = GetParameter("purcode");

	_param.action_sort = "20105";
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
			var purcode = data.Data.purcode;

			var active = GetParameter("active");
			var add_parm = "";
			if(active == "i_purlist", "i_prodpurlist") {
				var page_no = GetParameter("page_no");
				var purcode2 = GetParameter("purcode2");
				var cust_id = GetParameter("cust_id");
				var purdatef = GetParameter("purdatef");
				var purdatet = GetParameter("purdatet");
				if(active == "i_prodpurlist") {
					var prodname = GetParameter("prodname");
					var prodsort_select = GetParameter("prodsort_select");
					var prodcode = GetParameter("prodcode");
					var prod_barcode = GetParameter("prod_barcode");
					add_parm = "&prodname=" + prodname + "&prodsort_select=" + prodsort_select + "&prodcode=" + prodcode + "&prod_barcode=" + prod_barcode;
				}
				window.location.href = "i_purdetail.html?active=" + active + "&purcode=" + purcode + "&page_no=" + page_no +
					"&cust_id=" + cust_id + "&purdatef=" + purdatef + "&purdatet=" + purdatet + "&purcode2=" + purcode2 + add_parm;
			} else {
				window.location.href = "i_purdetail.html?active=" + GetParameter("active") + "&purcode=" + purcode;
			}
		})
}

//供应商列表
function supply_select(stat, Cust_id) {
	var _param = {};
	var p_data = {};

	p_data.page_no = 1;
	p_data.page_size = 999;
	p_data.cust_name = "";
	p_data.cust_address = "";
	p_data.cust_stat = 0;
	p_data.cust_tel = "";

	_param.action_sort = "60101";
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
				newsalelist_list();
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
		alert("请选择供应商");
	} else if($("#purdate").val() == "") {
		alert("请选择进货日期");
	} else {
		$(this).trigger("btn_change");
		$(this).attr("stat", 1);
		save_data();
	}
})

//供应商参数记录
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

//供应商新增
function supply_data() {
	$(".model_form input").val("");
	var _param = {};
	var _data = {};
	_param.action_sort = "60103";
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
			$("#save_cust").show();
			$(".model_nav label").text("供应商新增");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
			$("#cust_name").focus();
			$(".model_nav label").attr("stat", 1);
		})
}

//新增按钮
$("#supply_btn").click(function() {
	$(this).trigger("btn_change");
	supply_data();
})

//新增
$("#save_supply").click(function() {
	check_data_all(this);
})

//校验数据完整性
function check_data_all(_this) {
	if($.trim($("#cust_name").val()) == "") {
		$(".prompt_model").html("请输入供应商名称！").show();
	} else if($.trim($("#cust_address").val()) == "") {
		$(".prompt_model").html("请输入供应商地址！").show();
	} else if($.trim($("#cust_tel").val()) == "") {
		$(".prompt_model").html("请输入供应商电话！").show();
	} else {
		$(_this).trigger("btn_change");
		save_supply();
	}
}

//保存
function save_supply() {
	var _param = {};
	var _data = {};

	_data.cust_name = encodeWordURI($.trim($("#cust_name").val()));
	_data.cust_address = encodeWordURI($.trim($("#cust_address").val()));
	_data.cust_tel = encodeWordURI($.trim($("#cust_tel").val()));
	_data.cust_con = encodeWordURI($.trim($("#cust_con").val()));
	_data.cust_others = encodeWordURI($.trim($("#cust_others").val()));

	_param.action_sort = "60104";
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
			supply_select(1, data.Data.cust_id);
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
			$("#save_supply").trigger("click");
		} else {
			$(this).parent().next().find(".edit_input").focus();
		}
	}
})
var page_no = 1;
var interface_content = function () {
	$(function () {
		prodsort_unit_param();
		prodlist_login(1);
	})
}
//商品类型
function prodsort_unit_param() {
	var _param = {};
	var _data = {};
	var configtype = [];

	configtype.push("prodsort");
	configtype.push("unit");
	_data.fieldsort = 2;
	_data.configtype = configtype;

	_param.action_sort = "9010200";
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
			var _data = data.Data.data_lists.prodsort;
			$.each(_data, function (i, obj) {
				$("#prodsort").append(
					"<option value=" + obj.id + ">" + obj.sysname + "</option>"
				);
			});

			$.each(_data, function (i, obj) {
				$("#prodsort_s").append(
					"<option value=" + obj.id + ">" + obj.sysname + "</option>"
				);
			});
		})

		.done(function (data) {
			var _data = data.Data.data_lists.unit;
			$.each(_data, function (i, obj) {
				$("#unit").append(
					"<option value=" + obj.id + ">" + obj.sysname + "</option>"
				);
			});
		})
}

//列表加载，获取数据
function prodlist_login(page_no) {
	var _param = {};
	var p_data = {};

	p_data.prodname = encodeWordURI($.trim($("#prodname_s").val()));
	p_data.prodcode = encodeWordURI($.trim($("#prodcode_s").val()));
	p_data.prodsort = encodeWordURI($.trim($("#prodsort_s").val()));
	p_data.prod_barcode = encodeWordURI($.trim($("#prod_barcode_s").val()));
	p_data.prodstat = encodeWordURI($.trim($("#prodstat_s").val()));
	p_data.page_no = page_no;
	p_data.page_size = 10;

	_param.action_sort = "10101";
	_param.data = p_data;
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
			var _data = data.Data.List;
			var listcontent = $("#table_center tbody");
			listcontent.html("");
			if (_data.length == 0) {
				listcontent.append("<tr><td colspan='10'>没有找到数据！</td></tr>")
			} else {
				var prodname, prodcode, prod_barcode, unit_value, prodsort_value, pricein, priceout, prodothers, prodstat;
				//列表
				for (var i = 0; i < _data.length; i++) {
					prodname = _data[i].prodname; //商品名称
					prodcode = _data[i].prodcode; //商品型号
					prod_barcode = _data[i].prod_barcode; //商品编码
					prodstat = _data[i].prodstat;
					if (prodstat == 0) {
						prodstat = "有效";
					} else {
						prodstat = "无效";
					}
					unit_value = _data[i].unit_value; //单位
					prodsort_value = _data[i].prodsort_value; //商品类型
					pricein = _data[i].pricein; //进价
					priceout = _data[i].priceout; //售价
					prodothers = _data[i].prodothers; //备注

					listcontent.append(
						"<tr style='font-size:15px'>" +
						"<td style='text-align:left !important;'>" + prodname + "</td>" +
						"<td>" + prodcode + "</td>" +
						"<td>" + prod_barcode + "</td>" +

						"<td>" + prodsort_value + "</td>" +
						"<td>" + unit_value + "</td>" +
						"<td style='text-align:right !important;'>" + pricein + "</td>" +
						"<td style='text-align:right !important;'>" + priceout + "</td>" +
						"<td>" + prodothers + "</td>" +
						"<td>" + prodstat + "</td>" +
						"<td style='color:#16A8E0;cursor:pointer;padding: 5px 3px;' onclick='edit_click(" + _data[i].prodid + ")'>修改</td></tr>"
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
					prodlist_login(num);
				}
			});
		})

		.done(function () {
			other_click();
		})

		.done(function () {
			$(".content_right").removeClass("dispy_none");
		})
};

//商品新增
function save_data() {
	$(".model_form input").val("");
	var _param = {};
	var _data = {};
	_param.action_sort = "10103";
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
			$("#prod_barcode").val(data.Data.prod_barcode);
		})

		.done(function () {
			//显示遮罩
			$("#save_product").show();
			$("#edit_product").hide();
			$(".model_nav label").text("商品新增");
			$(".edit_none").addClass("dispy_none");
			$(".model_form select").val("");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
			$("#prodname").focus();
			$(".content_right").css("overflow", "hidden");
		})
}

//配置增加序号
function pub_addprodsort() {
	var _param = {};
	var _data = {};
	_data.fieldname = "prodsort";
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
			publist_addprodsort(data.Data.sn);
		})
}

//添加类型
function publist_addprodsort(sn) {
	var _param = {};
	var _data = {};
	_data.fieldname = "prodsort";
	_data.sn = sn;
	_data.fieldsort = 2;
	_data.sysname = encodeWordURI($.trim($("#prodsort_val").val()));
	_data.fieldtitle = "";
	_param.action_sort = "90102022";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存", _param)

	$.ajax({
		type: "post",
		dataType: "json",
		contentType: "application/json",
		data: _param,
		url: "pubConfig",
		success: function (data) {
			flag_val = data.Flag;
			msg_val = data.Msg;
			if (flag_val == 1 || flag_val == 9) {
				$("#prodsort_val").attr("name", data.Data);
				pub_addunit();
			} else {
				flag_type(flag_val, msg_val);
			}
		},
		error: function () {
			alert("服务器忙碌，请稍候重试！");
		}
	});
}

//配置增加序号
function pub_addunit() {
	var _param = {};
	var _data = {};
	_data.fieldname = "prodsort";
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
			publist_addunit(data.Data.sn);
		})
}

//添加单位
function publist_addunit(sn) {
	var _param = {};
	var _data = {};
	_data.fieldname = "unit";
	_data.sn = sn;
	_data.fieldsort = 2;
	_data.sysname = encodeWordURI($.trim($("#unit_val").val()));
	_data.fieldtitle = "";
	_param.action_sort = "90102022";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存", _param)

	$.ajax({
		type: "post",
		dataType: "json",
		contentType: "application/json",
		data: _param,
		url: "pubConfig",
		success: function (data) {
			flag_val = data.Flag;
			msg_val = data.Msg;
			if (flag_val == 1 || flag_val == 9) {
				$("#unit_val").attr("name", data.Data);

				save_prod();

			} else {
				flag_type(flag_val, msg_val);
			}
		},
		error: function () {
			alert("服务器忙碌，请稍候重试！");
		}
	});
}

//保存
function save_prod() {
	var _param = {};
	var _data = {};

	_data.prodname = encodeWordURI($.trim($("#prodname").val()));
	_data.prod_barcode = encodeWordURI($.trim($("#prod_barcode").val()));
	_data.priceout = encodeWordURI($.trim($("#priceout").val()));
	_data.pricein = encodeWordURI($.trim($("#pricein").val()));
	_data.prodcode = encodeWordURI($.trim($("#prodcode").val()));
	_data.unit = encodeWordURI($.trim($("#unit_val").attr("name")));
	_data.prodsort = encodeWordURI($.trim($("#prodsort_val").attr("name")));
	_data.prodothers = encodeWordURI($.trim($("#prodothers").val()));

	if ($(".model_nav label").attr("stat") == 1) {
		_param.action_sort = "10104";
	} else if ($(".model_nav label").attr("stat") == 0) {
		_data.prodid = encodeWordURI($.trim($("#edit_product").attr("name")));
		_data.prodstat = encodeWordURI($.trim($("#prodstat").val()));
		_param.action_sort = "10106";
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
			$(".model_form select").val("");
			$(".div_overlay").hide();
			$(".prompt_model").hide();
			$(".content_right").css("overflow", "auto");
		})

		.done(function () {
			if ($(".model_nav label").attr("stat") == 1) {
				prodlist_login(1);
			} else if ($(".model_nav label").attr("stat") == 0) {
				page_no = $('#page_no').text();
				prodlist_login(page_no);
			}
		})

		.done(function () {
			$(".model_nav label").attr("stat", "");
		})
}

//点击一行时，修改颜色
function other_click() {
	$("#table_center tbody tr").unbind("click").click(function () {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

$("#prodsort").change(function () {
	$("#prodsort_val").val($(this).find("option:selected").text());
	$("#prodsort_val").attr("name", $(this).find("option:selected").val());
})

$("#unit").change(function () {
	$("#unit_val").val($(this).find("option:selected").text());
	$("#unit_val").attr("name", $(this).find("option:selected").val());
})

//搜索
$("#search_btn").click(function () {
	$(this).trigger("btn_change");
	prodlist_login(1);
})

//回车搜索
$(".product_search input").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		$("#search_btn").trigger("btn_change");
		prodlist_login(1);
	}
});

//新增按钮
$("#add_btn").click(function () {
	$(this).trigger("btn_change");
	$(".model_nav label").attr("stat", 1);
	save_data();
})

//关闭模拟
$("#out_model").click(function () {
	$(".div_overlay").hide();
	$(".prompt_model").hide();
	$(".content_right").css("overflow", "auto");
})

//商品新增
$("#save_product").click(function () {
	check_data_all(this);
})

//修改保存
$("#edit_product").click(function () {
	check_data_all(this);
})

//校验数据完整性
function check_data_all(_this) {
	if ($.trim($("#prodname").val()) == "") {
		$(".prompt_model").html("请输入商品名称！").show();
	} else if ($.trim($("#prodcode").val()) == "") {
		$(".prompt_model").html("请输入商品型号！").show();
	} else if ($.trim($("#prod_barcode").val()) == "" || isNaN($.trim($("#prod_barcode").val()))) {
		$(".prompt_model").html("请正确输入商品编码！").show();
	} else if ($.trim($("#prodsort_val").val()) == "") {
		$(".prompt_model").html("请选择商品类型！").show();
	} else if ($.trim($("#unit_val").val()) == "") {
		$(".prompt_model").html("请选择商品单位！").show();
	} else if ($.trim($("#pricein").val()) == "") {
		$(".prompt_model").html("请输入商品进价！").show();
	} else if ($.trim($("#priceout").val()) == "") {
		$(".prompt_model").html("请输入商品售价！").show();
	} else {
		$(_this).trigger("btn_change");
		pub_addprodsort();
	}
}

$(".model_form input").focus(function () {
	$(this).select();
})

$(".model_form input").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		if ($(".model_nav label").attr("stat") == 1 && $(this).attr("id") == "prodothers") {
			$("#save_product").trigger("click");
		} else if ($(".model_nav label").attr("stat") == 0 && $(this).attr("id") == "prodothers") {
			$(this).parent().next().find("#prodstat").focus();
		} else {
			$(this).parents().next().find("input").focus();
		}
	}
})

//点击事件
$("#prodstat").keydown(function () {
	if ($(".model_nav label").attr("stat") == 0 && $(this).attr("id") == "prodstat") {
		$("#edit_product").trigger("click");
	}
})

//修改
var edit_click = function (prodid) {
	$(".model_nav label").attr("stat", 0);
	product_detail(prodid);
}

//商品详情
function product_detail(prodid) {
	var _param = {};
	var _data = {};

	_data.prodid = prodid;
	_param.action_sort = "10105";
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
			$("#prodname").val(_data.prodname);
			$("#prod_barcode").val(_data.prod_barcode);
			$("#priceout").val(_data.priceout);
			$("#pricein").val(_data.pricein);
			$("#prodcode").val(_data.prodcode);
			$("#prodstat").val(_data.prodstat);
			$("#unit_val").val(_data.unit_value);
			$("#prodsort_val").val(_data.prodsort_value);
			$("#prodothers").val(_data.prodothers);
			$("#operator").val(_data.operator);
			$("#inputdate").val(_data.inputdate);
		})

		.done(function (data) {
			$("#save_product").hide();
			$("#edit_product").show();
			$("#edit_product").attr("name", prodid);
			$(".model_nav label").text("商品修改");
			$(".edit_none").removeClass("dispy_none");
			$(".div_overlay").show();
			$(".content").fadeIn(200);
			$("#prodname").focus();
			$(".content_right").css("overflow", "hidden");
		})
}

var error_msg = function (msg) {
	$(".prompt_model").html(msg).show();
}
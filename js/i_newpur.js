var interface_content = function () {
	$(function () {
		$("#purdate").val(get_data());
		//供货商列表
		cust_select(0, "");
	})
}

//页面切换、关闭暂存
window.onbeforeunload = function () {
	var stat = $("#modifysave_btn").attr("stat");
	if (stat != 1) {
		add_data();
	}
};

//添加暂存
function add_data() {
	var _param = {};
	var _data = {};
	var obj = "";
	_data.draft_sort = 201;
	_data.draft_json = data_check(obj);
	_param.action_sort = "9018001";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存", _param)

	$.ajax({
		type: "post",
		dataType: "json",
		async: false,
		contentType: "application/json",
		data: _param,
		url: "pubConfig",
		success: function (data) {
			flag_val = data.Flag;
			msg_val = data.Msg;
			if (data.Flag == 1) {

			} else {
				flag_type(flag_val, msg_val);
			}
		},
		error: function () {
			alert("服务器忙碌，请稍候重试！");
		},
		complete: function () { }
	});
}

//列表加载，获取暂存数据
function productlist_list(type) {
	var _param = {};
	var p_data = {};
	var _data = "";
	var ajaxurl;

	if (GetParameter("purcode") != null) {
		if (type == 1) {
			p_data.purcode = GetParameter("purcode");
			_param.action_sort = "20102";
			ajaxurl = "psi";
		} else {
			p_data.draft_sort = 201;
			_param.action_sort = "9018002";
			ajaxurl = "pubConfig";
		}
	} else {
		p_data.draft_sort = 201;
		_param.action_sort = "9018002";
		ajaxurl = "pubConfig";
	}

	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存",_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: ajaxurl
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		//列表内容填充
		.done(function (data) {
			//console.log(data);
			for (var List in data.Data) {
				_data = 1;
			}
			if (_data == 1) {
				$("#table_center tbody").html("");
				_data = data.Data.List;
				if (GetParameter("purcode") != null) {
					if (type == 1) {
						_data = data.Data.Detail;
					} else {
						_data = data.Data.List;
					}
				}
				var listcontent = $("#table_center tbody");
				var prodid = barcode = prodname = prodsort = priceout = unit = cost = amount = prodcode = purdetailothers = "";
				//表单
				$("#purdate").val((data.Data.purdate).substring(0, 10));
				//console.log(data.Data.purdate)
				if (data.Data.purdate == "" || data.Data.purdate == null) {
					$("#purdate").val(get_data());
				}

				$("#table_totalmoney").text(data.Data.totalmoney);
				$("#senddate").val((data.Data.senddate).substring(0, 10));
				if ((data.Data.senddate).substring(0, 10) == "1900-01-01") {
					$("#senddate").val("");
				}
				$("#purothers").val(data.Data.purothers);
				$("#select_value").text(data.Data.cust_id);
				$("#custname_select").val($("#select_value").text());
				var select_val = $("#custname_select option:selected").text();
				$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
				//列表
				for (var i = 0; i < _data.length; i++) {

					cost = _data[i].cost;
					amount = _data[i].amount; //数量
					prodcode = _data[i].prodcode;
					prodid = _data[i].prodid;
					barcode = _data[i].prod_barcode;
					prodname = _data[i].prodname;
					prodsort = _data[i].prodsort;
					if (GetParameter("purcode") != null) {
						if (type == 1) {
							prodsort = _data[i].prodcode;
						} else {
							prodsort = _data[i].prodsort;
						}
					}
					priceout = _data[i].pricein;
					if (priceout == "") {
						priceout = 0;
					}
					unit = _data[i].unit;
					purdetailothers = _data[i].purdetailothers;

					listcontent.append(
						"<tr><td width='36px'></td>" +
						"<td width='68px'><a href='#' title='加行' class='table_btn_add'>+</a>&nbsp;" +
						"<a href='#' title='删单行' class='table_btn_red' style='font-size:18px'>x</a></td>" +
						"<td class='p_id'><input class='id per_id search_id' code='" + prodcode + "' name='" + prodid + "' value='" + barcode + "'/><i class='icon-search'>&#xe693;</i></td>" +
						"<td class='table_prodname'>" + prodname + "</td><td class='table_prodsort' val='" + prodsort + "'>" + prodcode + "</td><td class='table_unit' val='" + unit + "'>" + unit + "</td>" +
						"<td width='100px'><select class='storename_select'></select></td>" +
						"<td width='100px'><input class='table_num' type='number' value='" + amount + "' onblur='clearNoNum(this)' maxlength='10'/></td><td width='100px'><input type='number' class='table_piceout' onblur='clearNoNum(this)' maxlength='10' value='" + priceout + "'/></td>" +
						"<td class='table_allprice'>" + cost + "</td><td width='100px'><input class='table_prodothers' value='" + purdetailothers + "'/></td></tr>"
					);
				}
			}
		})

		//仓库菜单填充
		.done(function (data) {
			for (var List in data.Data) {
				_data = 1;
			}
			if (_data == 1) {
				_data = data.Data.List;
				if (GetParameter("purcode") != null) {
					if (type == 1) {
						_data = data.Data.Detail;
					} else {
						_data = data.Data.List;
					}
				}
				var select_name = $(".storename_select");
				storename_select();
				for (var i = 0; i < _data.length; i++) {
					storename = _data[i].storename; //仓库名称
					select_name.eq(i).text(storename);
				}
			}
		})

		//搜索框填充
		.always(function () {
			var listcontent = $("#table_center tbody");
			listcontent.append(
				"<tr><td style='padding:8px 8px;background-color: #fbfbfb;'></td><td></td>" +
				"<td class='search_id'><input class='id per_id search_input' />" +
				"<i id='search_btn' class='icon-search'>&#xe693;</i></td>" +
				"<td></td><td></td><td></td><td width='100px'></td>" +
				"<td width='100px'></td><td width='100px'></td><td></td>" +
				"<td width='100px'></td></tr>"
			);
		})

		//计算列，附加事件，计算金额
		.done(function () {
			list_number();
			other_click();
			table_tr_price();
		})
		//显示内容
		.done(function () {
			$(".content_right").removeClass("dispy_none");
			$(".search_input").focus();
		})

};

//保存方法
function save_data() {
	var _param = {};
	var obj = "";
	_param.action_sort = "20101";
	_param.data = data_check(obj);
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		//保存成功后跳转
		.done(function (data) {
			var purcode = data.Data.purcode;
			//console.log(purcode);
			//清除暂存
			clear_data();
			window.location.href = "i_purdetail.html?active=i_newpur&purcode=" + purcode;
		})
}

//暂存清空
function clear_data() {
	var _param = {};
	var _data = {};
	_data.draft_sort = 201;
	_param.action_sort = "9018003";
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
			console.log(data)
		})
}

//重新开单
$(".clear_newpur").click(function () {
	clear_data();
	$("#table_center tbody").html("");
	productlist_list(0);
})

//获取存需要的参数，整合成obj传递
function data_check(obj) {
	var draft_json = $("#table_center tbody tr");
	var _data_stat;
	var _data = {};
	var data = {};
	var draft_data = [];

	for (var i = 0; i < (draft_json.length - 1); i++) {
		_data_stat = draft_json.eq(i).find("td");
		data = {};
		data.sn = _data_stat.eq(0).text(); //序号
		data.prodid = _data_stat.find("input").eq(0).attr("name"); //商品id
		data.prodcode = encodeWordURI(_data_stat.find("input").eq(0).attr("code")); //规格型号
		data.storename = encodeWordURI(_data_stat.find("select option:selected").text()); //仓库名称
		data.storeid = encodeWordURI(_data_stat.find("select option:selected").val()); //仓库id
		data.prod_barcode = encodeWordURI(_data_stat.find("input").eq(0).val()); //商品编码
		data.amount = encodeWordURI(_data_stat.find("input").eq(1).val()); //数量
		data.pricein = encodeWordURI(_data_stat.find("input").eq(2).val()); //单价
		data.prodname = encodeWordURI(_data_stat.eq(3).text()); //商品名称
		data.prodsort = encodeWordURI(_data_stat.eq(4).text()); //类型
		data.unit = encodeWordURI(_data_stat.eq(5).text()); //单位
		data.cost = _data_stat.eq(9).text(); //总价
		data.purdetailothers = encodeWordURI(_data_stat.find("input").eq(3).val()); //备注

		draft_data.push(data);
	}
	//console.log(JSON.stringify(draft_data))
	var purdate = $("#purdate").val();
	var cust_id = $.trim($("#select_value").text());
	var totalmoney = $("#table_totalmoney").text();
	var senddate = $("#senddate").val();
	var purothers = encodeWordURI($("#purothers").val());

	_data.purdate = purdate;
	_data.cust_id = cust_id;
	_data.totalmoney = totalmoney;
	_data.senddate = senddate;
	_data.purothers = purothers;

	_data.List = draft_data;

	obj = _data;
	return obj;
}

//模拟框分类列表
function model_typelist() {
	var _param = {};
	var p_data = {};
	var configtype = [];

	_param.action_sort = "9010200";
	configtype.push("prodsort");
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
			var _data = data.Data.data_lists.prodsort;
			//console.log("信息", _data)
			for (var i = 0; i < _data.length; i++) {
				$(".model_type_ul").append(
					"<li value=" + _data[i].id + ">" + _data[i].sysname + "</li>"
				);
			}
		})
		.done(function () {
			$(".model_prodtype ul li").click(function () {
				$(".model_prodtype ul li").removeClass("model_active");
				$(this).addClass("model_active");
				model_search(1);
			})
		})

		.done(function () {
			productlist_list(1);
		})
}

//供货商列表
function cust_select(stat, Cust_id) {
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
		.done(function (data) {
			var _data = data.Data.List;
			$("#custname_select").html("<option value=''>选择</option>");
			//console.log("用户信息", data)
			for (var i = 0; i < _data.length; i++) {
				$("#custname_select").append(
					"<option value=" + _data[i].cust_id + ">" + _data[i].cust_name + "</option>"
				);
			}
		})

		.done(function () {
			$(".searchable-select").remove();
			//可搜索的select选择框初始化
			$('#custname_select').searchableSelect();
		})

		.done(function () {
			if (stat != 1) {
				model_typelist();
			}
		})

		.done(function () {
			if (stat == 1) {
				$("#select_value").html($.trim(Cust_id));
				var select_val = $("#cust_name").val();
				$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
			}
		})
}

//仓库列表
function storename_select(_this) {
	var _param = {};
	var _data = {};

	_data.fieldsort = 2;
	_data.fieldname = "storename";
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
	//参数填充
	$.when(dfd)
		.done(function (data) {
			//console.log(data)
			var _data = data.Data.fieldlist;
			if (_this != undefined) {
				$(_this).find(".storename_select").html("");
				for (var i = 0; i < _data.length; i++) {
					$(_this).find(".storename_select").append(
						"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
					);
				}
			} else {
				//console.log("信息", _data)
				$(".storename_select").html("");
				for (var i = 0; i < _data.length; i++) {
					$(".storename_select").append(
						"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
					);
				}
			}
		});
}

//表格商品搜索
function table_barcode(_this, stat) {
	var _param = {};
	var p_data = {};

	_param.action_sort = "10111";
	p_data.prod_barcode = encodeWordURI($.trim($(_this).val()));
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log(_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			//获取数据
			var _data = data.Data;
			//console.log("商品信息", data)
			//填充参数
			if (stat == 0) {
				var tr = $(_this).parents("tr");
				$(_this).attr("name", _data.prodid);
				$(_this).attr("code", _data.prodcode);
				tr.find(".table_prodname").text(_data.prodname);
				tr.find(".table_prodsort").text(_data.prodcode);
				tr.find(".table_prodsort").attr("val", _data.prodsort);
				tr.find(".table_unit").attr("val", _data.unit);
				tr.find(".table_unit").text(_data.unit_value);
				tr.find(".table_num").val(1);
				tr.find(".table_piceout").val(_data.priceout);
				tr.find(".table_prodothers").val("");
				return;
			}
			//添加一行
			add_tr(_this, _data, stat);
		})
		//计算数量价格
		.done(function () {
			table_tr_price();
		})
}

//模拟框搜索page_no;当前页
var page_no = 1;

function model_search(page_no) {
	var _param = {};
	var p_data = {};
	var model_active = encodeWordURI($.trim($(".model_active").val()));
	//console.log(model_active);
	if (model_active == -1 || model_active == 0) {
		model_active = "";
	}
	_param.action_sort = "10121";
	p_data.prodsort = model_active;
	p_data.keywords = encodeWordURI($.trim($(".model_search").val()));
	p_data.page_size = 10;
	p_data.page_no = page_no;
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log(_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		//表格参数填充
		.done(function (data) {
			//获取数据
			var _data = data.Data.List;
			//console.log("商品信息", data);
			var modeltable = $(".model_table2").find("tbody");
			modeltable.html("");
			if (_data.length == 0) {
				modeltable.append("<tr><td colspan='3'>没有此商品数据！</td></tr>")
			} else {
				for (var i = 0; i < _data.length; i++) {
					modeltable.append("<tr><td>" + _data[i].prodname + "</td><td value='" + _data[i].prodsort + "'>" + _data[i].prodcode + "</td><td>" + _data[i].prod_barcode + "</td></tr>")
				}
			}
		})
		//鼠标划过变色
		.done(function () {
			$(".model_table2").find("tbody tr").mouseenter(function () {
				$(this).css("background-color", "#EDEDED");
			});

			$(".model_table2").find("tbody tr").mouseleave(function () {
				$(this).css("background-color", "#FFFFFF");
			});
		})
		//自动搜索填充
		.done(function () {
			$(".model_table2").find("tbody tr").click(function () {
				var prodcode = $(this).find("td").eq(2).text();
				var _tr = $(".model_table2").attr("val");
				$("#table_center").find("tbody tr").eq(_tr).find(".per_id").val(prodcode);
				$(".div_overlay").hide();
				$(".content_right").css("overflow", "auto");
				var e = jQuery.Event("keydown"); //模拟一个键盘事件
				e.keyCode = 13; //keyCode=13是回车
				$("#table_center").find("tbody tr").eq(_tr).find(".per_id").focus().trigger(e);
				$(".model_prodtype ul li").removeClass("model_active");
				$(".model_prodtype ul li").eq(0).addClass("model_active");
			})
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
					model_search(num);
				}
			});
		})
}

//添加一行
var add_tr = function (_this, _data, stat) {
	//检测否有未填参数
	var callback = check_id();
	if (callback == false) {
		alert("请先在空白行录入商品后再操作，如果空白行不需要，请删除！");
	} else {
		var tr_eq = $(_this).parents("tr").index();
		var table_tr = $("#table_center").find("tbody tr");
		var tr_data = table_tr.eq(tr_eq);

		//表格内参数定义获取
		var prodid = barcode = prodname = prodsort = priceout = unit = cost = amount = prodcode = purdetailothers = "";
		if (_data != "") {
			cost = _data.cost;
			amount = _data.amount; //数量
			prodcode = _data.prodcode; //商品编码
			prodid = _data.prodid;
			barcode = _data.prod_barcode;
			prodname = _data.prodname;
			prodsort = _data.prodsort_value;
			priceout = _data.pricein;
			unit = _data.unit_value;
			purdetailothers = _data.prodothers;
		} else {
			priceout = 0;
		}
		var content_add = "<tr><td width='36px'></td>" +
			"<td width='68px'><a href='#' class='table_btn_add' title='加行'>+</a>&nbsp;" +
			"<a href='#' class='table_btn_red' title='删单行' style='font-size:18px'>x</a></td>" +
			"<td class='p_id'><input class='id per_id search_id' code='" + prodcode + "' name='" + prodid + "' value='" + barcode + "'/><i class='icon-search'>&#xe693;</i></td>" +
			"<td class='table_prodname'>" + prodname + "</td><td class='table_prodsort' val='" + prodsort + "'>" + prodcode + "</td><td class='table_unit' val='" + unit + "'>" + unit + "</td>" +
			"<td width='100px'><select class='storename_select'></select></td>" +
			"<td width='100px'><input class='table_num' type='number' value='1' onblur='clearNoNum(this)'/></td><td width='100px'><input type='number' class='table_piceout' onblur='clearNoNum(this)' value='" + priceout + "'/></td>" +
			"<td class='table_allprice'>" + cost + "</td><td width='100px'><input class='table_prodothers' value=''/></td></tr>";
		//附加位置：最后一个搜索框附加其在上方，表格内input附加在其下方
		if (stat == 1) {
			tr_data.after(content_add);
		} else {
			tr_data.before(content_add);
		}
		table_tr = $("#table_center").find("tbody tr");
		tr_eq = $(_this).parents("tr").index();
		if (stat == 1) {
			tr_eq = tr_eq + 1;
		} else {
			tr_eq = tr_eq - 1;
		}
		//填充完执行方法	
		list_number(); //列表计数
		other_click(); //点击事件
		storename_select(table_tr.eq(tr_eq)); //仓库下拉菜单
		//自动获取焦点
		table_tr.eq(tr_eq).find(".search_input").focus();
	}
}

//保存按钮
$("#modifysave_btn").click(function () {
	//检测否有未填参数
	var sata;
	var callback = check_id(sata);
	var td_list = $(".id").length;
	if ((td_list - 1) == 0) {
		alert("还未选择商品");
	} else if ($("#select_value").text() == "") {
		alert("请选择供货商");
	} else if ($("#purdate").val() == "") {
		alert("请选择进货日期");
	} else if (callback == false) {
		alert("请先在空白行录入商品后再操作，如果空白行不需要，请删除！");
	} else if (callback == true) {
		alert("请先添加仓库！");
	} else if ($("#table_totalmoney").text() == "NaN") {
		alert("金额错误，请检查商品");
	} else {
		$(this).attr("stat", 1);
		$(this).trigger("btn_change");
		save_data();
	}
})

//模拟框输入搜索事件
$(".model_search").bind('keyup', function () {
	model_search(1);
})

//删除一行
var remove_tr = function (_this) {
	var tr_eq = $(_this).parents("tr").index();
	var tr_data = $("#table_center").find("tbody tr").eq(tr_eq);
	tr_data.remove();
	list_number(); //列表计数
	table_tr_price(); //计算价格数量
	$("#table_center tbody tr").find(".search_input").focus();
}

//检查是否有一行信息没有输入数据
function check_id(sata) {
	var td_list = $(".id");
	var tr_list = $("#table_center").find("tbody tr");
	var td_prodname = tr_list.find(".table_prodname");
	var td_data;
	var prod_name;
	var td_storename = tr_list.find(".storename_select");
	for (var i = 0; i < (td_list.length - 1); i++) {
		//console.log(td_storename.eq(i).val());
		td_data = prod_name = "";
		td_data = td_list.eq(i).val().length;
		prod_name = td_prodname.eq(i).text().length;
		if (td_data < 1 || prod_name < 1) {
			td_list.eq(i).focus();
			$("tr").css("background-color", "#FFFFFF");
			return false;
		} else if (td_storename.eq(i).val() == null) {
			return true;
		}
	}
}

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

		.done(function () {
			//显示遮罩
			$(".prompt_model").hide();
			$(".model_nav label").text("供货商新增");
			$("#supply_add").show();
			$(".content").fadeIn(200);
			$(".content_right").css("overflow", "hidden");
			$("#cust_name").focus();
		})
}

//新增按钮
$("#supply_btn").click(function () {
	$(this).trigger("btn_change");
	supply_data();
})

//新增
$("#save_supply").click(function () {
	check_data_all(this);
})

//校验数据完整性
function check_data_all(_this) {
	if ($.trim($("#cust_name").val()) == "") {
		$(".prompt_model").html("请输入供应商名称！").show();
	} else if ($.trim($("#cust_address").val()) == "") {
		$(".prompt_model").html("请输入供应商地址！").show();
	} else if ($.trim($("#cust_tel").val()) == "") {
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

		.done(function () {
			$("#supply_add").hide();
			$(".prompt_model").hide();
		})

		.done(function (data) {
			cust_select(1, data.Data.cust_id);
		})
}

//供货商参数记录
$("#custname_select").change(function () {
	$("#select_value").text($("#custname_select").val());
})

//计算价格数量
function table_tr_price() {
	var price_input = $(".table_allprice");
	var price, allprice;
	var prodnum = num = totalmoney = 0;
	for (var i = 0; i < price_input.length; i++) {
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
	for (var i = 0; i < len; i++) {
		a = i + 1;
		$('#table_center tbody tr:eq(' + i + ') td:eq(2)').css("position", "relative");
		$('#table_center tbody tr:eq(' + i + ') td:first').text(a);
		$('#table_center tbody tr:eq(' + i + ') td:first').css("background-color", "#f3f3f3");
		$('#table_center tbody tr:eq(' + i + ') td:first').css("padding", "5px 8px");
	}
};

//显示遮罩
var model_show = function (_tr) {
	$(".model_table2").attr("val", _tr);
	$("#sale_prod").show();
	$('.model_search').val("");
	model_search(1);
	$(".content_right").css("overflow", "hidden");
	$(".content").fadeIn(200);
}

//隐藏遮罩
$(".clear_model_icon").click(function () {
	$(".div_overlay").hide();
	$(".content_right").css("overflow", "auto");
	$(".model_prodtype ul li").removeClass("model_active");
	$(".model_prodtype ul li").eq(0).addClass("model_active");
})

function other_click() {
	//删除一行
	$(".table_btn_red").unbind("click").click(function () {
		remove_tr(this);
	});

	//添加一行
	$(".table_btn_add").unbind("click").click(function () {
		add_tr(this, "", 1);
	});

	//显示搜索遮罩
	$(".icon-search").unbind("click").click(function () {
		var _tr = $(this).parents("tr").index();
		model_show(_tr);
		$(".content_right").css("overflow", "hidden");
		$(".model_nav").find(".model_search").focus();
	});

	//搜索
	$(".search_input").unbind("keydown").keydown(function (e) {
		var e = e || event;
		if (e.keyCode == 13) { //回车键的键值为13
			if ($.trim($(this).val()) != "") {
				table_barcode(this, 2);
				$(".search_input").val("");
			}
		}
	})

	//默认设置金额
	$(".table_piceout").unbind("blur").blur(function () {
		if ($.trim($(this).val()) == "") {
			$(this).val(0);
			table_tr_price();
		}
	})

	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function () {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})

	//获得焦点时全选
	$(".per_id").unbind("focus").focus(function () {
		$(this).select();
		$(this).parents("tr").css("background-color", "#f9f9f9");
	})

	$(".table_num").unbind("focus").focus(function () {
		$(this).select();
	})

	$(".table_piceout").unbind("focus").focus(function () {
		$(this).select();
	})

	//修改数量计算
	$(".table_num").unbind("change").change(function () {
		if ($.trim($(this).val()) == "") {
			$(this).val(0);
		}
		table_tr_price();
	})

	//修改金额时计算
	$(".table_piceout").unbind("change").change(function () {
		table_tr_price();
	})

	//失去焦点时样式
	$(".per_id").unbind("blur").blur(function () {
		$(this).parents("tr").css("background-color", "#FFFFFF");
	})

	//搜索回车
	$(".search_id").unbind("keydown").keydown(function (e) {
		var e = e || event;
		if (e.keyCode == 13) { //回车键的键值为13
			if ($.trim($(this).val()) != "") {
				table_barcode(this, 0); //执行搜索
			}
		}
	})
}

/*回车下一个*/
$(".edit_input").keydown(function (e) {
	var e = e||window.event;
	if (e.keyCode == 13) {
		if ($(this).attr("id") == "cust_others") {
			$("#save_supply").trigger("click");
		} else {
			$(this).parent().next().find(".edit_input").focus();
		}
	}
})
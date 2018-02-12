var page_no = 1;
var interface_content = function () {
	prodsort_select();
}

//商品类型列表
function prodsort_select() {
	var _param = {};
	var _data = {};
	var configtype = [];

	configtype.push("prodsort");
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
			//console.log("信息", _data)
			for (var i = 0; i < _data.length; i++) {
				$("#prodsort_select").append(
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
			$(".searchable-select").css("left", "74px");
		})

		.done(function () {
			page_no = GetParameter("page_no");
			if (page_no == null) {
				salelist_login(1);
				return;
			}
			$("#select_value").text(GetParameter("cust_id"));
			$("#custname_select").val($("#select_value").text());
			var select_val = $("#custname_select option:selected").text();
			$("#custname_select").siblings(".searchable-select").find(".searchable-select-holder").text(select_val);
			$("#prodname").val(GetParameter("prodname"));
			$("#prodsort_select").val(GetParameter("prodsort_select"));
			$("#prodcode").val(GetParameter("prodcode"));
			$("#prod_barcode").val(GetParameter("prod_barcode"));
			$("#salecode").val(GetParameter("salecode2"));
			$("#saledatef").val(GetParameter("saledatef"));
			$("#saledatet").val(GetParameter("saledatet"));
			salelist_login(page_no);
		})
}

var page_size = 16;

//列表加载，获取数据
function salelist_login(page_no) {
	var _param = {};
	var p_data = {};

	p_data.salecode = encodeWordURI($.trim($("#salecode").val()));
	p_data.cust_id = encodeWordURI($.trim($("#custname_select").val()));
	p_data.saledatef = encodeWordURI($.trim($("#saledatef").val()));
	p_data.saledatet = encodeWordURI($.trim($("#saledatet").val()));
	p_data.prod_barcode = encodeWordURI($.trim($("#prod_barcode").val()));
	p_data.prodcode = encodeWordURI($.trim($("#prodcode").val()));
	p_data.prodname = encodeWordURI($.trim($("#prodname").val()));
	p_data.prodsort = encodeWordURI($.trim($("#prodsort_select").val()));
	p_data.page_no = page_no;
	p_data.page_size = page_size;

	_param.action_sort = "30110";
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
			$("#sum_totalmoney").html(
				"<label style='color:#666666'>总金额：</label></label><span style='color:#0073A9;'>" + data.Data.sum_totalmoney + "</span><label style='color:#666666'>元</label>"
			);
			if (_data.length == 0) {
				listcontent.append("<tr><td colspan='10'>没有找到数据！</td></tr>");
			} else {
				var unit, salecode, saledate, cust_name, prod_barcode, prodname, prodcode, amount, pricein, cost;
				//列表
				for (var i = 0; i < _data.length; i++) {
					saledate = _data[i].saledate; //销售日期
					salecode = _data[i].salecode; //销售单号
					cust_name = _data[i].cust_name; //客户名称
					prod_barcode = _data[i].prod_barcode; //产品编码
					prodname = _data[i].prodname; //产品名称
					prodcode = _data[i].prodcode; //产品型号
					amount = _data[i].amount; //数量
					unit = _data[i].unit; //单位
					pricein = _data[i].pricein; //单价
					cost = _data[i].cost; //金额

					listcontent.append(
						"<tr style='font-size:15px'>" +
						"<td style='text-align: left;'>" + saledate.substring(0, 10) + "</td>" +
						"<td style='color:#16A8E0;cursor:pointer;padding: 5px 0;' onclick='detail_click(this)'>" + salecode + "</td>" +
						"<td style='text-align: left;'>" + cust_name + "</td>" +
						"<td style='text-align: left;'>" + prod_barcode + "</td>" +
						"<td style='text-align: left;'>" + prodname + "</td>" +
						"<td style='text-align: left;'>" + prodcode + "</td>" +
						"<td style='text-align: right;'>" + amount + "</td>" +
						"<td>" + unit + "</td>" +
						"<td style='text-align: right;'>" + pricein + "</td>" +
						"<td style='text-align: right;'>" + cost + "</td>" +
						"</tr>"
					);
				}
			}
		})

		//分页初始化
		.done(function (data) {
			var total_cnt = data.Data.total_cnt; //总条数
			var page_cnt = Math.ceil(total_cnt / page_size); //总页数
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
					salelist_login(num);
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

function other_click() {
	//点击一行时，修改颜色
	$("#table_center tbody tr").unbind("click").click(function () {
		$("tr").css("background-color", "#FFFFFF");
		$(this).css("background-color", "#f9f9f9");
	})
}

//搜索按钮
$("#search_btn").click(function () {
	$(this).trigger("btn_change");
	salelist_login(1);
})

//回车搜索
$(".form_content input").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		$("#search_btn").trigger("btn_change");
		salelist_login(1);
	}
});

//页面跳转
var detail_click = function (_this) {
	var salecode = $(_this).parents("tr").find("td").eq(1).text();
	var salecode2 = $("#salecode").val();
	var prodname = $("#prodname").val();
	var cust_id = $("#custname_select").val();
	var prodsort_select = $("#prodsort_select").val();
	var prodcode = $("#prodcode").val();
	var prod_barcode = $("#prod_barcode").val();
	var saledatef = $("#saledatef").val();
	var saledatet = $("#saledatet").val();
	page_no = $("#page_no").text();
	window.location.href = "i_saledetail.html?active=i_prodsalelist&page_no=" + page_no + "&salecode=" + salecode + "&cust_id=" + cust_id +
		"&saledatef=" + saledatef + "&saledatet=" + saledatet + "&salecode2=" + salecode2 + "&prodsort_select=" + prodsort_select +
		"&prodname=" + prodname + "&prodcode=" + prodcode + "&prod_barcode=" + prod_barcode;
}
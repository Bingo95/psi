var page_no = 1;
var interface_content = function () {
	$(function () {
		prodsort_select();
		stocklist_login(page_no);
	})
}

//商品类型列表
function prodsort_select() {
	var _param = {};
	var _data = {};
	var configtype = [];

	configtype.push("prodsort");
	configtype.push("storename");
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
				$("#prodsort").append(
					"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
				);
			}
		})

		.done(function (data) {
			//console.log(data)
			var _data = data.Data.data_lists.storename;
			for (var i = 0; i < _data.length; i++) {
				$("#storename").append(
					"<option value=" + _data[i].id + ">" + _data[i].sysname + "</option>"
				);
			}
		});
}

//列表加载，获取数据
function stocklist_login(page_no) {
	var _param = {};
	var p_data = {};

	p_data.prodname = encodeWordURI($.trim($("#prodname").val()));
	p_data.prodcode = encodeWordURI($.trim($("#prodcode").val()));
	p_data.prod_barcode = encodeWordURI($.trim($("#prod_barcode").val()));
	p_data.prodsort = encodeWordURI($.trim($("#prodsort").val()));
	p_data.storeid = encodeWordURI($.trim($("#storename").val()));
	p_data.page_no = page_no;
	p_data.page_size = 10;

	_param.action_sort = "50101";
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

			if (_data.length == 0) {
				listcontent.append("<tr><td colspan='8'>没有找到数据！</td></tr>")
			} else {
				var prodname, prodcode, prod_barcode, prodsort_value, priceout, amount, unit_value, storename;
				//列表
				for (var i = 0; i < _data.length; i++) {
					prodname = _data[i].prodname; //商品名称
					prodcode = _data[i].prodcode; //商品型号
					prod_barcode = _data[i].prod_barcode; //商品编码

					prodsort_value = _data[i].prodsort_value; //商品类型
					priceout = _data[i].priceout; //售价
					storename = _data[i].storename; //仓库
					amount = _data[i].amount; //库存数
					unit_value = _data[i].unit_value; //单位

					listcontent.append(
						"<tr style='font-size:15px'>" +
						"<td style='text-align:left !important;padding:5px 5px;'>" + prodname + "</td>" +
						"<td>" + prodcode + "</td>" +
						"<td>" + prod_barcode + "</td>" +
						"<td>" + prodsort_value + "</td>" +
						"<td style='text-align:right !important;'>" + priceout + "</td>" +
						"<td>" + storename + "</td>" +
						"<td style='text-align:right !important;'>" + amount + "</td>" +
						"<td>" + unit_value + "</td></tr>"
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
					stocklist_login(num);
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

//搜索 
$("#search_btn").click(function () {
	$(this).trigger("btn_change");
	stocklist_login(1);
})

//回车搜索
$(".stock_search").find("input").keydown(function (e) {
	var e = e || event;
	if (e.keyCode == 13) { //回车键的键值为13
		$("#search_btn").trigger("btn_change");
		stocklist_login(1);
	}
});
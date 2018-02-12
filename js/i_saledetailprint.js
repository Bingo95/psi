//-----  下面是打印控制语句  ----------
window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;
//打印之前隐藏不想打印出来的信息
function beforePrint() {
	$(".print_centent").css("margin", "0");
	$(".print_now a").hide();
}
//打印之后将隐藏掉的信息再显示出来
function afterPrint() {
	$(".print_centent").css("margin", "auto");
	$(".print_now a").show();
}

function printit(printDiv, type) {
	if (type == 'Preview' && !-[1,]) {
		document.all.WebBrowser.ExecWB(7, 1);
	} else {
		var newstr = document.getElementById(printDiv).innerHTML;
		var oldstr = document.body.innerHTML;
		document.body.innerHTML = newstr;
		window.print();
		document.body.innerHTML = oldstr;
	}
}

//页面加载
detail_list();

//列表加载，获取数据
function detail_list() {
	var _param = {};
	var p_data = {};

	p_data.salecode = GetParameter("salecode");
	$("#salecode").text(GetParameter("salecode"));

	_param.action_sort = "30102";
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出",_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function (data) {
			var _data = data.Data.Detail;
			//console.log(data)
			var listcontent = $(".print_content_table tbody");
			var prodid = barcode = prodname = prodsort = priceout = unit = cost = amount = prodcode = purdetailothers = "";
			//表单
			$("#saledate").text((data.Data.saledate).substring(0, 10));
			$("#senddate").text((data.Data.senddate).substring(0, 10));
			if ((data.Data.senddate).substring(0, 10) == "1900-01-01") {
				$("#senddate").css("padding-right", "112px").text("");
			}
			$("#app_name").text(data.userinfo.app_name);
			$("#salecode").text(data.Data.salecode);
			$("#cust_content").text(data.Data.cust_name + " " + data.Data.cust_address + " " + data.Data.cust_tel);
			$("#employeename").text(data.Data.employeename);
			$("#sum_amount").text(data.Data.sum_amount);
			$("#totalmoney").text(data.Data.totalmoney);
			$("#totalmoney_big").text(data.Data.totalmoney_big);
			$("#app_words").html(data.userinfo.app_words);
			$("#purothers").text(data.Data.purothers);
			$("#input_date").text(data.Data.input_date);
			$("#operator").text(data.Data.operator);
			$("#saleothers").text(data.Data.saleothers);
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
				priceout = _data[i].priceout;
				unit = _data[i].unit;
				saledetailothers = _data[i].saledetailothers;

				listcontent.append(
					"<tr>" +
					"<td></td>" +
					"<td>" + barcode + "</td>" +
					"<td style='text-align: left;'>" + prodname + "</td>" +
					"<td style='text-align: left;'>" + prodcode + "</td>" +
					"<td style='text-align: right;'>" + amount + "</td>" +
					"<td>" + unit + "</td>" +
					"<td style='text-align: right;'>" + priceout + "</td>" +
					"<td style='text-align: right;'>" + cost + "</td>" +
					"<td style='text-align: left;'>" + saledetailothers + "</td>" +
					"</tr>"
				);
			}
		})

		.done(function () {
			list_number();
		})
};


//列表计数
function list_number() {
	//$('table tr:not(:first)').remove();
	var len = $('.print_content_table tbody tr').length;
	var a;
	for (var i = 0; i < len; i++) {
		a = i + 1;
		$('.print_content_table tbody tr:eq(' + i + ') td:first').text(a);
		$('.print_content_table tbody tr:eq(' + i + ') td:first').css("padding", "5px 8px");
	}
};
var interface_content = function () {
	$(function () {
		$("#end_time").text($(".navber_box").find(".navber_title").attr("name"));
		newuser_data();
	})
}

//续费时间
function recharge_day() {
	var _param = {};

	_param.action_sort = "10029";
	_param.data = {};
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)

		.done(function (data) {
			//console.log(data);
			var _data = data.Data;
			var select_val;
			var is_default;
			for (var i = 0; i < _data.length; i++) {
				is_default = "";
				is_default = _data[i].is_default;
				if (is_default == 1) {
					select_val = _data[i].pay_month;
					$("#recharge_money").val(_data[i].pay_money);
				}
				$("#recharge_paysort").append(
					"<option value='" + _data[i].pay_month + "' name='" + _data[i].pay_money + "'>" + _data[i].pay_words + "</option>"
				);
			}
			$("#recharge_paysort").val(select_val);
		})

		.done(function () {
			$(".content_right").removeClass("dispy_none");
			$("#img_prompt").remove();
		})
}

//充值
function recharge_paydata(sort) {
	var _param = {};
	var _data = {};
	_data.pay_month = $("#recharge_paysort option:selected").val();
	_data.pay_money = $("#recharge_paysort option:selected").attr("name");
	_data.pay_sort = sort;

	_param.action_sort = "10020";
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
			//console.log(data);
			$("#recharge_code").attr("src", data.Data.qrcode_url).attr("name", data.Data.trans_id);
			$(".recharge_code_box label").css("display", "block");
		})

		.done(function () {
			$("#wx_rechargepay").off("click");
		})

		.done(function () {
			paypolling.stat();
		})
}

//充值轮询
var recharge_Polling;
var paypolling = {
	//开始轮询
	stat: function () {
		recharge_Polling = setInterval(function () {
			var _param = {};
			var _data = {};
			_data.trans_id = $("#recharge_code").attr("name");

			_param.action_sort = "10021";
			_param.data = _data;
			_param = JSON.stringify(_param);
			//console.log("输出", _param)

			$.post("psi", _param,
				function (data) {
					//console.log(data);
					if (data.Data.pay_stat == 1) {
						$("#recharge_box").hide();
						$("#recharge_success .model_form").find(".btn_style").remove();
						$("#recharge_success").show();
						newuser_data();
						paypolling.end();
					}
				},
				"JSON"
			);
		}, 3000)
	},
	//关闭轮询
	end: function () {
		window.clearInterval(recharge_Polling)
	}
}

//用户信息
function newuser_data() {
	var _param = {};

	_param.action_sort = "10010";
	_param.data = {};
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
			var nowtime = new Date(Date.parse(get_data()));
			var endtime = new Date(Date.parse((data.Data.app_end_date).substring(0, 10)));
			$("#end_time").text((data.Data.app_end_date).substring(0, 10));
			$("#nav_enddate").text((data.Data.app_end_date).substring(0, 10));
			if (nowtime <= endtime) {
				$("#navber_pay_link").remove();
				$("#recharge_success .model_form").append(
					"<a href='index.html' class='save_btn btn_style' style='margin-top: 20px'>进入系统</a>"
				);
			} else {
				$("#recharge_success .model_form").append(
					"<a href='i_recharge.html?active=i_recharge' class='save_btn btn_style' style='margin-top: 20px'>继续续费</a>"
				);
			}
		})

		.done(function () {
			recharge_day();
		})
}

//微信
$("#wx_rechargepay").click(wx_rechargepay);

function wx_rechargepay() {
	paypolling.end();
	$("#pay_prompt").remove();
	recharge_paydata(0);
}

//支付宝
$("#ali_rechargepay").click(function () {
	hide_prompt();
	$(".recharge_code_box").append("<span id='pay_prompt' style='margin-top:55px;display:block;'>暂未开通支付宝续费。</span>");
	$("#recharge_code").attr("src", "");
})


//月份改变
$(document).on("change", "#recharge_paysort", function () {
	hide_prompt();
	$("#recharge_code").attr("src", "");
	$("#recharge_money").val($("#recharge_paysort option:selected").attr("name"));
})

//隐藏提示
function hide_prompt() {
	paypolling.end();
	$("#wx_rechargepay").off("click").click(wx_rechargepay);
	$("#pay_prompt").remove();
	$(".recharge_code_box label").hide();
}
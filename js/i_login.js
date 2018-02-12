//验证码
$(document).ready(function() {
	$('#VerificationCode').click(function() {
		$("#login_rand").focus().select();
		jQuery(this).attr('src', "VerificationCode.jsp?" + Math.random());
	})
})

/*$(function() {
	$("#login_code").focus();
})*/

//登录
$("#get_login").live("click", function() {
	$("#error_title").hide();
	var username = $.trim($("#login_code").val());
	var pwd = $.trim($("#login_pwd").val());
	var ident = $.trim($("#login_rand").val());
	if(username == "" || !username.match(/^1(3|4|5|6[6]|7|8|9[89])\d{9}$/)) {
		$("#login_code").select();
		error_msg("请输入正确手机号");
	} else if(pwd == "") {
		$("#login_pwd").select();
		error_msg("请输入密码!");
	} else if(ident == "") {
		$("#login_rand").select();
		error_msg("请输入验证码!");
	} else {
		$(this).trigger("btn_change");
		go_login();
	}
})

//logiin
function go_login() {
	var _param = {};
	var _data = {};

	_data.login_code = encodeWordURI($.trim($("#login_code").val()));
	_data.login_pwd = encodeWordURI($.trim($("#login_pwd").val()));
	_data.login_rand = encodeWordURI($.trim($("#login_rand").val()));

	_param.action_sort = "80111";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		//成功后跳转
		.done(function(data) {
			//console.log(data)
			if(data.userinfo.app_end_stat == 2){
				window.location.href = "i_recharge.html?active=i_recharge";
			}else{
				window.location.href = "index.html";
			}
		})
}


/*回车下一个*/
$(".login_input").keydown(function(e) {
	var login_code = $.trim($("#login_code").val());
	var login_pwd = $.trim($("#login_pwd").val());
	var login_rand = $.trim($("#login_rand").val());
	var e = e || event;
	if(e.keyCode == 13 || e.keyCode == 40) { //回车键的键值为13 上38 下40
		$(".login_input").removeClass('cancel_bag');
		if($.trim($(this).val()) == "") {
			if($(this).attr("id") == "login_code") {
				error_msg("请输入手机号!");
			} else if($(this).attr("id") == "login_pwd") {
				error_msg("请输入密码!");
			} else if($(this).attr("id") == "login_rand") {
				error_msg("请输入验证码!");
			}
			$(this).addClass("cancel_bag");
		} else {
			if($(this).attr("id") == "login_code") {
				if(!login_code.match(/^1(3|4|5|7|8)\d{9}$/)) {
					error_msg("请输入正确手机号！");
					$("#login_code").select();
					$(this).addClass("cancel_bag");
				} else {
					$("#error_title").hide();
					$(".login_input").removeClass('cancel_bag');
					$(this).parent().next().find(".login_input").select();
				}
			} else if($(this).attr("id") == "login_rand") {
				$("#get_login").trigger("click");
			} else {
				$("#error_title").hide();
				$(".login_input").removeClass('cancel_bag');
				$(this).parent().next().find(".login_input").select();
			}
		}
	} else if(event.keyCode == 38) {
		$(this).parent().prev().find(".login_input");
		var t = $(this).parent().prev().find(".login_input").attr("id");
		var a = $("#" + t).val();
		$("#" + t).val("").select().val(a);
	}
});

$(".login_input").focus(function() {
	$(this).addClass("border_green");
	$(this).select();
})

$(".login_input").blur(function() {
	$(this).removeClass("border_green");
})

var error_msg = function(msg) {
	$("#error_title").html(msg).show();
}
//验证码
$(document).ready(function() {
	$('#VerificationCode').click(function() {
		$("#login_rand").focus().select();
		jQuery(this).attr('src', "VerificationCode.jsp?" + Math.random());
	})
})

/*$(function() {
	$("#app_name").focus();
})*/

//register

function go_register() {

	var _param = {};
	var _data = {};

	_data.app_name = encodeWordURI($.trim($("#app_name").val()));
	_data.app_tel = encodeWordURI($.trim($("#app_tel").val()));
	_data.login_pwd = encodeWordURI($.trim($("#login_pwd").val()));
	_data.login_pwd_confirm = encodeWordURI($.trim($("#login_pwd_confirm").val()));
	_data.app_email = encodeWordURI($.trim($("#app_email").val()));
	_data.login_rand = encodeWordURI($.trim($("#login_rand").val()));

	_param.action_sort = "80101";
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
			window.location.href = "index.html";
		})
}

//注册
$("#go_register").click(function() {
	$("#error_title").hide();
	$(".login_input").removeClass('cancel_bag');
	var app_name = $.trim($("#app_name").val());
	var app_tel = $.trim($("#app_tel").val());
	var pwd = $.trim($("#login_pwd").val());
	var pwd_r = $.trim($("#login_pwd_confirm").val());
	var app_email = $.trim($("#app_email").val());
	var ident = $.trim($("#login_rand").val());

	if(app_name == "") {
		$("#app_name").focus().select();
		error_msg("请输入公司名称!");
	} else if(app_tel == "" || !app_tel.match(/^1(3|4|5|7|8|9)\d{9}$/)) {
		$("#app_tel").focus().select();
		error_msg("请输入正确手机号");
	} else if(pwd == "" || pwd_r == "" || pwd != pwd_r) {
		$("#login_pwd").focus().select();
		$("#login_pwd_confirm").addClass("border_green");
		error_msg("两次密码输入不一致!");
	} else if(app_email == "" || !app_email.match(/^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/)) {
		$("#app_email").focus().select();
		error_msg("请输入正确的邮箱帐号!");
	} else if(ident == "") {
		$("#login_rand").focus().select();
		error_msg("请输入验证码!");
	} else {
		$(this).trigger("btn_change");
		go_register();
	}
})

/*回车下一个*/
$(".login_input").keydown(function() {
	var app_name = $.trim($("#app_name").val());
	var app_tel = $.trim($("#app_tel").val());
	var pwd = $.trim($("#login_pwd").val());
	var pwd_r = $.trim($("#login_pwd_confirm").val());
	var app_email = $.trim($("#app_email").val());
	var ident = $.trim($("#login_rand").val());

	if(event.keyCode == 13 || event.keyCode == 40) { //回车键的键值为13 上38 下40
		$(".login_input").removeClass('cancel_bag');
		if($.trim($(this).val()) == "") {
			if($(this).attr("id") == "app_name") {
				error_msg("请输入公司名称!");
			} else if($(this).attr("id") == "app_tel") {
				error_msg("请输入联系手机!");
			} else if($(this).attr("id") == "login_pwd") {
				error_msg("请输入密码!");
			} else if($(this).attr("id") == "login_pwd_confirm") {
				error_msg("请再次输入密码!");
			} else if($(this).attr("id") == "app_email") {
				error_msg("请输入邮箱!");
			} else if($(this).attr("id") == "login_rand") {
				error_msg("请输入验证码!");
			}
			$(this).addClass("cancel_bag");
		} else {
			if($(this).attr("id") == "app_tel") {
				if(!app_tel.match(/^1(3|4|5|7|8|9)\d{9}$/)) {
					error_msg("请输入正确手机号！");
					$("#app_tel").focus().select();
					$(this).addClass("cancel_bag");
				} else {
					$("#error_title").hide();
					$(".login_input").removeClass('cancel_bag');
					$(this).parent().next().find(".login_input").focus();
				}
			} else if($(this).attr("id") == "login_rand") {
				$("#go_register").trigger("click");
			} else {
				$("#error_title").hide();
				$(".login_input").removeClass('cancel_bag');
				$(this).parent().next().find(".login_input").focus();
			}
		}
	} else if(event.keyCode == 38) {
		$(this).parent().prev().find(".login_input");
		var t = $(this).parent().prev().find(".login_input").attr("id");
		var a = $("#" + t).val();
		$("#" + t).val("").focus().val(a);
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
	$("#error_title").text(msg);
	$("#error_title").show();
}
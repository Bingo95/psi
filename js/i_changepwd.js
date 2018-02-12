var login_code = GetParameter("login_code");

var interface_content = function () {
    if (login_code == null) {
        $(".edit_loginpwd").html("修改账户错误，请重试。")
    }
    $(".content_right").removeClass("dispy_none");
}


$("#modifypwd_btn").click(function () {
    var pwd_old = $.trim($("#login_pwd_old").val());
    var pwd = $.trim($("#login_pwd").val());
    var pwd_r = $.trim($("#login_pwd_confirm").val());
    $("#error_title").hide();
    if (pwd_old == "") {
        $("#login_pwd_old").select();
        error_msg("请输入原密码!");
    } else if (pwd == "") {
        $("#login_pwd").select();
        error_msg("请输入新密码!");
    } else if (pwd_r == "" || pwd != pwd_r) {
        $("#login_pwd").select();
        error_msg("两次密码输入不一致!");
    } else {
        $(this).trigger("btn_change");
        go_pwdedit();
    }
})


//forget
function go_pwdedit() {
    var _param = {};
    var _data = {};

    _data.login_code = encodeWordURI($.trim(login_code));
    _data.login_pwd_old = encodeWordURI($.trim($("#login_pwd_old").val()));
    _data.login_pwd = encodeWordURI($.trim($("#login_pwd").val()));
    _data.login_pwd_confirm = encodeWordURI($.trim($("#login_pwd_confirm").val()));

    _param.action_sort = "80104";
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
            $(".edit_loginpwd").html(
                "您的登录密码已经修改成功，请继续使用系统！"
            );
        })
}

/*回车下一个*/
$(".login_input").keydown(function (e) {
    var e = e || window.event;
    if (e.keyCode == 13) {
        //console.log(1)
        if ($(this).attr("id") == "login_pwd_confirm") {
            $("#modifypwd_btn").trigger("click");
        } else {
            $(this).parent().next().find(".login_input").select();
        }
    }
})

var error_msg = function (msg) {
    $("#error_title").html(msg).show();
}
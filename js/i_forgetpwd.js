//验证码
$(document).ready(function () {
    $('#VerificationCode').click(function () {
        $("#login_rand").focus().select();
        jQuery(this).attr('src', "VerificationCode.jsp?" + Math.random());
    })
})

$("#forget_send").click(function () {
    var app_email = $("#app_email").val();
    var ident = $.trim($("#login_rand").val());
    $("#error_title").hide();
    if (app_email == "" || !app_email.match(/^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/)) {
        $("#app_email").select();
        error_msg("请输入正确的邮箱帐号!");
    } else if (ident == "") {
        $("#login_rand").select();
        error_msg("请输入验证码!");
    } else {
        $(this).trigger("btn_change");
        $("<div class='loadingWrap2'></div>").appendTo("body");
        go_forget();
    }
})

//forget
function go_forget() {
    var _param = {};
    var _data = {};

    _data.app_email = encodeWordURI($.trim($("#app_email").val()));
    _data.login_rand = encodeWordURI($.trim($("#login_rand").val()));

    _param.action_sort = "80102";
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
        .done(function (data) {
            //console.log(data)
            $(".loadingWrap2").remove();
            $("#forgetpwd_content").hide();
            $(".login_center").append(
                "<div id='send_success' class='login_from' style='padding-top: 10%;'>" +
                "我们已往邮箱" + $('#app_email').val() + "发送了密码重置邮件，请进入邮箱阅读邮件并重置密码！" +
                "<div class='login_form_item'>" +
                "<a id='go_email' href='#' class='save_btn btn_style' style='margin-top:45px'>立即进入邮箱</a>" +
                "</div>" +
                "</div >"
            )
        })

        .done(function () {
            // 点击登录邮箱
            var _mail = $("#app_email").val().split('@')[1];    //获取邮箱域
            for (var j in hash) {
                if (j == _mail) {
                    //console.log(hash[_mail])
                    $("#go_email").attr("href", hash[_mail]);//设置登陆链接
                }
            }
        })
}

var hash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.com': 'http://www.foxmail.com',
    'outlook.com': 'http://www.outlook.com'
}

var error_msg = function (msg) {
    $("#error_title").html(msg).show();
}

/*回车下一个*/
$(".login_input").keydown(function (e) {
    var e = e || window.event;
    if (e.keyCode == 13) {
        //console.log(1)
        if ($(this).attr("id") == "login_rand") {
            $("#forget_send").trigger("click");
        } else {
            $(this).parent().next().find(".login_input").select();
        }
    }
})
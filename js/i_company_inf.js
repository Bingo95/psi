var interface_content = function() {
	$(function() {
		company_inf();
	})
}

//实例化编辑器
var editor = UM.getEditor('company_inf', {
	//设置toolbar不占位
	withoutToolbar: true,
	autoHeightEnabled: false,
	//去掉其他所有按钮
	toolbar: [
		'bold italic underline strikethrough justifyleft justifycenter justifyright justifyjustify |',
		' forecolor backcolor | removeformat | superscript subscript |',
		' selectall cleardoc paragraph | fontfamily fontsize',
	]
});

//列表加载，获取数据
function company_inf() {
	var _param = {};
	var p_data = {};

	_param.action_sort = "10010";
	_param.data = p_data;
	_param = JSON.stringify(_param);
	//console.log("输出暂存",_param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function(data) {
			//console.log(data);
			$("#company_name").val(data.Data.app_name);
			editor.setContent(data.Data.app_words);
		})

		.done(function(data) {
			$(".content_right").removeClass("dispy_none");
		})
};

//配置修改保存
function company_editcontent() {
	var _param = {};
	var _data = {};
	_data.app_name = $("#company_name").val();
	_data.app_words = editor.getContent();

	_param.action_sort = "10011";
	_param.data = _data;
	_param = JSON.stringify(_param);
	//console.log("输出", _param)
	var ajaxobj = {
		param: _param,
		ajaxurl: "psi"
	};

	var dfd = getData(ajaxobj);

	$.when(dfd)
		.done(function(data) {
			//console.log(data);
			$(".company_form_prompt").removeClass("company_prompt_warn").text("公司信息保存成功！");
		})

		.done(function() {
			company_inf();
		})
}

var error_msg = function(msg_val) {
	$(".company_form_prompt").addClass("company_prompt_warn").text(msg_val);
}

//确定修改
$("#modifysave_btn").click(function() {
	$(".company_form_prompt").removeClass("company_prompt_warn").text("");
	if($.trim($("#company_name").val()) == "") {
		$(".company_form_prompt").addClass("company_prompt_warn").text("请输入公司名称!")
	} else {
		$(this).trigger("btn_change");
		company_editcontent();
	}
})
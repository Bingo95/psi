;
(function(window) {
	//仅在不支持 placeholder 的时执行
	if(!('placeholder' in document.createElement('input'))) {
		//兼容：IE7、IE8
		var _event = 'attachEvent';
		var _eventadd = 'on';
		//兼容：firefox、chrome、IE(除7.8)、safari、opera
		if('addEventListener' in window) {
			_event = 'addEventListener';
			_eventadd = '';
		}

		//解决ie8下getElementsByClassName不能使用的问题
		if(!document.getElementsByClassName) {
			document.getElementsByClassName = function(className, element) {
				var children = (element || document).getElementsByTagName('*');
				var elements = new Array();
				for(var i = 0; i < children.length; i++) {
					var child = children[i];
					var classNames = child.className.split(' ');
					for(var j = 0; j < classNames.length; j++) {
						if(classNames[j] == className) {
							elements.push(child);
							break;
						}
					}
				}
				return elements;
			};
		}

		//页面加载时
		window[_event](_eventadd + 'load', function() {
			//防止在 respond.js和html5shiv.js之前执行
			setTimeout(function() {
				_placeholder.add('input').add('textarea');
			}, 50);
		});

		//窗口大小改变时重新定位
		window[_event](_eventadd + 'resize', function() {
			//根据之前设置的class名字(这里设置了“iEnew_placeholder”102行左右)删除原先的所有附加
			_placeholder.removediv('iEnew_placeholder');
			//重新添加
			_placeholder.add('input').add('textarea');
		})

		var _placeholder = {
			//添加输入项
			add: function(entry_type) {
				//获取控件对象obj
				var obj = document.getElementsByTagName(entry_type);
				for(var i = 0; i < obj.length; i++) {
					this.render(obj[i]);
				}
				return this;
			},

			//渲染
			render: function(dom) {
				//获取placeholder参数值
				var _value = dom.getAttribute('placeholder');
				//!!对于unll和undefined忽略
				if(!!_value) {
					this.attachEvent(dom, this.setStyle_dom(dom, _value));
				}
			},

			removediv: function(_className) {

				var obj = document.getElementsByClassName(_className);
				for(var i = 0; i < obj.length; i++) {
					obj[i].parentNode.removeChild(obj[i]);
				}
				return true;
			},

			//设置样式
			setStyle_dom: function(dom, _value) {
				//创建div
				var div = document.createElement('div');

				div.style.position = 'absolute';
				div.style.width = this.getPosition(dom, 'Width') + 'px';
				div.style.height = this.getPosition(dom, 'Height') + 'px';
				div.style.left = this.getPosition(dom, 'Left') + 'px';
				div.style.top = this.getPosition(dom, 'Top') + 'px';
				div.style.color = '#868686'; //字体颜色
				div.style.textIndent = '10px'; //缩进像素
				div.style.zIndex = 999; //堆叠
				div.style.background = dom.style.background; //背景色
				div.style.border = dom.style.border; //边框
				div.style.cursor = 'text'; //鼠标样式
				div.innerHTML = _value; //设置显示值
				//texttarea标签 行高
				if('TEXTAREA' == dom.tagName.toUpperCase()) {
					div.style.lineHeight = '35px';
				} else {
					div.style.lineHeight = div.style.height;
				}
				//附加的时候设置一个class名字方便删除元素节点
				document.getElementsByTagName('body')[0].appendChild(div).className = 'iEnew_placeholder';
				return div;
			},

			//计算当前输入项目的位置
			getPosition: function(dom, name, parentDepth) {
				var offsetName = 'offset' + name;
				var offsetVal = dom[offsetName];
				var parentDepth = parentDepth || 0;
				if(!offsetVal && parentDepth < 3) {
					offsetVal = this.getPosition(dom.parentNode, name, ++parentDepth);
				}
				return offsetVal;
			},

			//添加事件
			attachEvent: function(dom, div) {

				//激活时，隐藏 placeholder
				dom[_event](_eventadd + 'focus', function() {
					div.style.display = 'none';
				});

				//失去焦点时，无值显示 placeholder有值隐藏
				dom[_event](_eventadd + 'blur', function(e) {
					if(e.srcElement.value == '') {
						div.style.display = '';
					}
				});

				//placeholder 点击时，对应的输入框激活
				div[_event](_eventadd + 'click', function(e) {
					e.srcElement.style.display = 'none';
					dom.focus();
				});
			}
		};
	}
})(window);
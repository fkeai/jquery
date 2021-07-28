/**
 * @description dialog实现,提示框alert和确认框confirm，弹出框open
 * 使用方法：
 * 1、提示框
 * $.dialog.alert("提示标题", "提示内容", null);   
 * // 第三个参数为回调函数，点击确认后触发
 * 2、确认框
 *  $("#confirm").bind("click", function () {   
 *        $.dialog.confirm(null, '确认要删除吗？',function(r){  
 *           //点确定之后执行的内容  
 *           window.location.href="http://www.baidu.com"  
 *        });  	
 *  });
 * 3、弹出框
 * 3.1 打开弹出框
 * $.dialog.open({title:"标题", url:"页面url", height: '530px', width: '700px'}); 
 * 3.2 关闭弹出框
 * $.dialog.close();
 * 
 * @author yuandong
 * @version 2021-07-21
 */
(function($) { 	
 
    $.dialog = { 
		doc : top.document,
		currentDialogIndex: 0,
        alert: function(title, message, callback) {  
            if( title == null ) title = '提示';  
            $.dialog.show(title, message, null, 'alert', function(result) {  
                if( callback ) callback(result);  
            });  
        },  
           
        confirm: function(title, message, okCallback, noCallback) {  
            if(title == null ) title = '确认提示';  
            $.dialog.show(title, message, null, 'confirm', function(result) {  
 				if(result) {
					if(okCallback) okCallback(result); 
				} else {
					if(noCallback) noCallback(result); 
				}
            });  
        },  
        open_options_defaults : {
            title: '标题',
            url: '',
            icon: '',
            width: '500px',
            height: '500px',
            event: {
                beforeOpen: null,
                afterOpen: null,
                beforeClose: null,
                afterClose: null
            }
        },
        open: function(options) {  
			var o = $.extend( true, $.dialog.open_options_defaults, options);
            var _html = "";  
            _html += '<div class="yd_box"></div><div class="yd_content"><span class="yd_title">' + o.title + '</span>'; 
            _html += '<span class="yd_close_icon">X</span>'; 
            _html += '<iframe width="100%" height="100%" frameborder="0" src="'+o.url+'"/>';
            _html += '</div>';  
            
            $.dialog.appendToBody(_html); 
            $.dialog.render();  
            $(".yd_content[index='"+$.dialog.currentDialogIndex+"']", $.dialog.doc).css({width: o.width, height:o.height});
            $(".yd_close_icon", $.dialog.doc).click( function(e) {
				$.dialog.hide();  
				e.stopPropagation();    //  阻止事件冒泡
			}); 
            $.dialog.resetPosition();
        }, 
        close: function() {
            $.dialog.hide();
        },     
        show: function(title, msg, value, type, callback) {  
            
            var _html = "";  

            _html += '<div class="yd_box"></div><div class="yd_content"><span class="yd_title">' + title + '</span>'; 
            _html += '<span class="yd_close_icon">X</span>'; 
            _html += '<div class="yd_msg">';
            _html += '<img class="yd_msg_icon" src="'+$.dialog.getUrlRootPath()+'/newui/images/icons/'+type+'.png"/>'
            _html +=  msg + '</div><div class="yd_btnbox">';  
            
            if (type == "alert") {  
                _html += '<input class="yd_btn_ok" type="button" value="确定" />';  
            } else if (type == "confirm") {  
                _html += '<input class="yd_btn_no" type="button" value="取消" />';  
                _html += '<input class="yd_btn_ok" type="button" value="确定" />';  
            }  
            _html += '</div></div>';  
            
            //必须先将_html添加到body，再设置Css样式  
            $.dialog.appendToBody(_html); 
            $.dialog.render();  
           
            switch( type ) {  
                case 'alert':  
                    $(".yd_btn_ok", $.dialog.doc).click( function() {  
                        $.dialog.hide();  
                        callback(true);  
                    }); 
                    $(".yd_close_icon", $.dialog.doc).click( function() {$(".yd_btn_ok", $.dialog.doc).click();}); 
                    $(".yd_btn_ok", $.dialog.doc).focus().keypress( function(e) {  
                        if( e.keyCode == 13 || e.keyCode == 27 ) $(".yd_btn_ok").trigger('click');  
                    });  
                break;  
                case 'confirm':  
                     
                    $(".yd_btn_ok", $.dialog.doc).click( function() {  
                        $.dialog.hide();  
                        if( callback ) callback(true);  
                    });  
                    $(".yd_btn_no", $.dialog.doc).click( function() {  
                        $.dialog.hide();  
                        if( callback ) callback(false);  
                    }); 
                    $(".yd_close_icon", $.dialog.doc).click( function() {
                        $(".yd_btn_no", $.dialog.doc).click();
                    });  
                    $(".yd_btn_no", $.dialog.doc).focus();  
                    $(".yd_btn_ok, .yd_btn_no", $.dialog.doc).keypress( function(e) {  
                        if( e.keyCode == 13 ) $(".yd_btn_ok", $.dialog.doc).trigger('click');  
                        if( e.keyCode == 27 ) $(".yd_btn_no", $.dialog.doc).trigger('click');  
                    });  
                break;
            }  
        },
        hide: function() {  
            // var curIndex = $.dialog.currentDialogIndex;
            // //$(".yd_box,.yd_content", $.dialog.doc).remove();  
            // var $curDialog = $(".yd_box[index='"+curIndex+"'],.yd_content[index='"+curIndex+"']", $.dialog.doc);	
			// var preIndex = $curDialog.attr("pre-index");
			// $curDialog.remove();
            // $.dialog.currentDialogIndex = preIndex;
            /**
             * 在iframe里打开窗口时，iframe里面的页面引用了自己的dialog.js导致新开窗口时，
             * currentDialogIndex属性获取失败,进而pre-index一直为0。
             * 在关闭时用会把currentDialogIndex置为0导致下一个窗口关闭不了
             */
            $(".yd_box:last,.yd_content:last", $.dialog.doc).remove();  
        },
        appendToBody: function(_html) {
			var currentIndex = $.dialog.currentDialogIndex;
            var nextIndex = $.dialog.uuid();
            var $tmp = $("<div/>").append(_html);
            $tmp.find(".yd_box,.yd_content").attr("index", nextIndex).attr("pre-index",currentIndex);//.css({zIndex: 100+nextIndex});
            $("body", $.dialog.doc).append($tmp.html());
            $.dialog.currentDialogIndex = nextIndex;
            debugger;
        },
		/**渲染界面**/
		render: function () {  
		
		   	var boxZIndex = 100 + $(".yd_content", $.dialog.doc).length;			
			$(".yd_box[index='"+$.dialog.currentDialogIndex+"']", $.dialog.doc).css({ width: '100%', height: '100%', zIndex: boxZIndex, position: 'absolute',  
			  filter: 'Alpha(opacity=30)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.3'  
			});  
		   
		    var contentZIndex = 101 + $(".yd_content", $.dialog.doc).length;
			$(".yd_content[index='"+$.dialog.currentDialogIndex+"']", $.dialog.doc).css({ zIndex: contentZIndex, width: '350px',height:'200px', position: 'absolute',  
			  backgroundColor: 'White' 
			});  
		   
			$(".yd_title", $.dialog.doc).css({ display: 'block', fontSize: '16px', color: '#333E53', padding: '12px 15px',  
              backgroundColor:'#F6F9FF'//,backgroundColor: '#DDD'
              , borderRadius: '15px 15px 0 0',  fontFamily: '微软雅黑'  , fontWeight: 'bold'
			});  
		   
			$(".yd_msg", $.dialog.doc).css({ padding: '20px 60px 20px 88px', textAlign:'center', //lineHeight: '30px',
			  fontSize: '14px' ,color:'#333E53', fontFamily: '微软雅黑'  
			});  
           
            $(".yd_msg_icon", $.dialog.doc).css({position:'absolute', left: '38px', top: '55px',width:'50px', height:'50px'});
            
			$(".yd_close_icon", $.dialog.doc).css({ display: 'block', position: 'absolute', right: '10px', top: '9px',  
			   width: '18px', height: '18px', textAlign: 'center',  //border: '1px solid Gray',
			  lineHeight: '16px', cursor: 'pointer', borderRadius: '12px', fontFamily: '微软雅黑'  
			});  
		   
			$(".yd_btnbox", $.dialog.doc).css({ margin: '15px 0px 10px 0', textAlign: 'center' });  
            $(".yd_btn_ok,.yd_btn_no", $.dialog.doc).css({ fontFamily: '微软雅黑'  ,width: '80px', height: '30px', 
                color: 'white', border: 'none', borderRadius:'4px',cursor:'pointer'
            });  
			$(".yd_btn_ok", $.dialog.doc).css({ backgroundColor: '#0A82FF' });  
			$(".yd_btn_no", $.dialog.doc).css({ backgroundColor: 'gray', marginRight: '40px' });  
		   
		   
			//右上角关闭按钮hover样式  
			$(".yd_close_icon", $.dialog.doc).hover(function () {  
			  $(this).css({ backgroundColor: 'Red', color: 'White' });  
			}, function () {  
			  $(this).css({ backgroundColor: '#F6F9FF', color: 'black' });  
			});  
            $.dialog.resetPosition();
		    
        },
         /**重置位置*/
        resetPosition: function () {
            var $container = $("body",top.document);
			var containerWidth = $container.width();  
			var containerHeight = $container.height();  
           
		    var curIndex = $.dialog.currentDialogIndex;
			//debugger;
            var $curDialog = $(".yd_content[index='"+curIndex+"']", $.dialog.doc);
			var boxWidth = $curDialog.width();  
			var boxHeight = $curDialog.height();  
		   
			//让提示框居中  
            $curDialog.css({ 
                top: (containerHeight - boxHeight) / 2 + "px", 
                left: (containerWidth - boxWidth) / 2 + "px" 
            });  
        },
        /**
         * js获取项目根路径 yuandong 2021-05-10
         * 返回结果示例： http://localhost:8083/uimcardprj
         */
        getUrlRootPath: function() {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath=window.document.location.href;
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName=window.document.location.pathname;
            var pos=curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            var localhostPaht=curWwwPath.substring(0,pos);
            //获取带"/"的项目名，如：/uimcardprj
            var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
            return(localhostPaht+projectName);
        },
        uuid: function() {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";

			var uuid = s.join("");
			return uuid;
		}
		
    } 

           
   

   
  
})(jQuery);
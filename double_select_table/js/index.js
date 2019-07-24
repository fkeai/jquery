$(function(){
	//全选函数
	$('.checkbox-all').click(function(){
		var checklilst = $(this).parents("div").next().children().find('.checkboxs');
		//alert("checklilst="+checklilst.length+",checked="+$(this).prop('checked'));
		if($(this).prop('checked')){
			checklilst.prop("checked",true);
		}else{
			checklilst.prop('checked',false);
		}
		changeBtnStatus();
	});

	//单个checkbox与全选的关系函数
	$('.select-content').on('click','.checkboxs',function(e){
		var checkboxlist = $(this).parents('ul').children().find('.checkboxs');
		var checkednums = 0;
		$.each(checkboxlist, function(i, data){
			if($(this).prop('checked')) {
				checkednums ++;
			}
		});
		//alert("checkboxlist="+checkboxlist.length + ",checkednums="+checkednums);
		var checkedAll = $(this).parents('.select-content').prev().find('.checkbox-all');
		if(checkboxlist.length == checkednums) {
			checkedAll.prop('checked',true);
		} else {
			checkedAll.prop('checked',false);
		}
		
		//stopFunc(e);
	});
	
	// 点击label时触发checkbox
	$('.select-content').find('label').on('click',function(){
		$(this).prev(".checkboxs").click();
		changeBtnStatus();
	});
	
	// 点击行时选择checkbox
	$('.select-content').on('click','li',function(){
		$(this).find("span").children('.checkboxs').click();
		changeBtnStatus();
	});
	
	// 动态判断改变btn状态
	function changeBtnStatus(){
		var left_btn = false
		var right_btn = false
        var btn1 =document.getElementsByClassName('right')[0]
		var btn2 =document.getElementsByClassName('left')[1]
		$(".unselect-ul").find(".checkboxs").each(function(){
			//alert($(this).is(":checked"));
			if($(this).is(":checked")) {
				right_btn = true;
			}
			
		});
		$(".selected-ul").find(".checkboxs").each(function(){
			//alert($(this).is(":checked"));
			if($(this).is(":checked")) {
				left_btn = true;
			}
		});
		
		if(left_btn){
			btn1.classList.add('btn-cursor')
		}else{
			btn1.classList.remove('btn-cursor')
		}
		if(right_btn){
			btn2.classList.add('btn-cursor')
		}else{
			btn2.classList.remove('btn-cursor')
		}
		
	}
	//左右移按钮点击事件
	$('.arrow-btn').click(function(){
		var checkboxs,origin,target,num=0;
		if($(this).hasClass('left')){
			origin = $('.unselect-ul');
			target = $('.selected-ul');
		}else{
			origin = $('.selected-ul');
			target = $('.unselect-ul');
		}
		checkboxs = origin.find('.checkboxs');
		for(var i=0; i<checkboxs.length; i++){					
			if($(checkboxs[i]).prop('checked')){
				var that = $(checkboxs[i]).parent().parent().clone();
				that.children('input').prop('checked',false);
				target.append(that);
				$(checkboxs[i]).parent().parent().remove();
			}else{
				num++;
			}
		}
		if(checkboxs.length == num){
			alert('未选中任何一项');
		}else{
			origin.parent().prev().find('.checkbox-all').prop('checked',false);
		}
		changeBtnStatus();
	});
/**------------------------------------------------------------------------------------------*/
	/**调用初始化**/
	init();
	
	/**输入元素绑定回车查询**/
	$(".search").find("input").keyup(function(event){
		if(event.keyCode ==13){
			$(this).parents(".search").children().find("button").trigger("click");
		}
	});

	/**点击查询按钮**/
	$(".search").find("button").click(function(){
		var searchType = $(this).attr("searchType");
		var params = {};
		$(this).parents(".search").children().find("input").each(function(){
			var name = $(this).attr("name");
			var value = $(this).val();
			//alert("name=" + name + ",value="+value)
			log("name=" + name + ",value="+value);
			params[name] = value;
		});
		
		if("selected" === searchType) {
			refreshSelectedList(params);
		} else if("unselect" === searchType) {
			refreshUnSelectList(params);
		}
		changeBtnStatus();
	});
	
	/**初始化**/
	function init() {
		refreshSelectedList(null);
		refreshUnSelectList(null);
	}
	
	/**刷新已绑定列表 params查询参数json对象**/
	function refreshSelectedList(params) {
		// 已绑定
		var selectedList = new Array();
		for(var i=11; i<20; i++) {
			var data = {
				"attr1" : "产品"+guid(),
				"attr2" : "融资对象",
				"attr3" : "融资类型",
				"attr4" : "其他要素"
			};
			selectedList.push(data);
		}
		
		//unselectList = getData("selected", params);			
		generateList("selected-ul", selectedList);
	}
	
	/**刷新未绑定列表 params查询参数json对象**/
	function refreshUnSelectList(params) {
		// 未绑定
		var unselectList = new Array();
		for(var i=11; i<20; i++) {
			var data = {
				"attr1" : "产品"+guid(),
				"attr2" : "融资对象",
				"attr3" : "融资类型",
				"attr4" : "其他要素"
			};
			unselectList.push(data);
		}

		//unselectList = getData("unselect", params);
		generateList("unselect-ul", unselectList);
	}
	
	/**请求后台数据 listType 列表类型，params查询参数json对象**/
	function getData(listType, params) {
		var dataList = new Array();
		var url = "&listType="+listType+"&unitType="+$("#unitType").val()+"&unitId="+$("#unitId").val();
		log(url);
		$.ajax({
			url:url,
			params:params,
			success:function(data){
				dataList = JSON.parse(data);
			},
			error:function() {
				alert("加载数据出错，请重试！");
			}
		});
		return dataList;
	}
	
	/**生成列表，listClass 容器class，dataList 数据列表**/
	function generateList(listClass, dataList) {
		$("."+listClass).empty();
		appendRow(listClass, dataList);
	}
	
	/**追加内容，listClass 容器class，dataList 数据列表**/
	function appendRow(listClass, dataList) {
		$.each(dataList, function(i, data){
			var cur_index = "tyue-checkbox-blue" + guid();
			var checkbox = $("<input type='checkbox' class='checkboxs'>").attr("id", cur_index);
			var label = $("<label>").attr("for",cur_index);
			var checkCol = $("<span>").css({"width":"30px"}).append(checkbox).append(label);
			var newRow = $("<li>").append(checkCol);
			newRow.append($("<span>").text(data.attr1));
			newRow.append($("<span>").text(data.attr2));
			newRow.append($("<span>").text(data.attr3));
			newRow.append($("<span>").text(data.attr4));			
			$("."+listClass).append(newRow);
		});
	}

	/**
	 *获取id
	 */
	function guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
	
	function log(msg) {
		if(console.log) {
			console.log(msg);
		}		
	}
})

/**
function stopFunc(e){
	e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
}**/
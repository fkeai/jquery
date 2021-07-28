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
	
	// 点击行时选择checkbox,
	$('.select-content').on('click','li',function(e){
		// 判断如果是点击的checkbox就不用再点一次了，不然点击失效
		if(! $(e.target).is('.checkboxs')) {
			$(this).find("span").children('.checkboxs').click();
		}
		changeBtnStatus();
	});
	
	// 动态判断改变btn状态
	function changeBtnStatus(){
		var left_btn = false
		var right_btn = false
        var btn1 =$("#rightBtn");
		var btn2 =$("#leftBtn");
		$(".unselect-ul").find(".checkboxs").each(function(){
			if($(this).is(":checked")) {
				right_btn = true;
			}
			
		});
		$(".selected-ul").find(".checkboxs").each(function(){
			if($(this).is(":checked")) {
				left_btn = true;
			}
		});
		
		if(left_btn){
			btn1.addClass('btn-cursor')
		}else{
			btn1.removeClass('btn-cursor')
		}
		if(right_btn){
			btn2.addClass('btn-cursor')
		}else{
			btn2.removeClass('btn-cursor')
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
		var idArray = new Array();
		for(var i=0; i<checkboxs.length; i++){					
			if($(checkboxs[i]).prop('checked')){
				var id=$(checkboxs[i]).attr("keyId");
				idArray.push(id);
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
			
			var ids = idArray.join(",");
			var operType = $(this).hasClass('left') ? "selected" : "unselect";
			save(ids, operType);
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
			//log("name=" + name + ",value="+value);
			params[name] = value;
		});
		
		if("selected" === searchType) {
			refreshSelectedList(params);
		} else if("unselect" === searchType) {
			refreshUnSelectList(params);
		}
		changeBtnStatus();
		//log($(this).parents(".search").next(".head").html());
		$(this).parents(".search").next(".head").find(".checkbox-all").prop("checked",false);
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
			var id = guid();
			var data = {
				"poolAppId"    : id,
				"productName" : "产品"+id,
				"productCode" : "融资对象",
				"productType" : "融资类型",
				"largeClassName" : "其他要素"
			};
			selectedList.push(data);
		}
		
		
		var url = $("#querySelectedURL").val();
		url += "&unitType="+$("#unitType").val()+"&unitId="+$("#unitId").val();
		//var selectedList = getData(url, params);	
		$(".selected-ul").empty();
		$.each(selectedList, function(i, data){
			var cur_index = guid();
			var checkbox = $("<input type='checkbox' class='checkboxs'>").attr("id", cur_index).attr("keyId", data.poolAppId);
			//var label = $("<label>").attr("for",cur_index);
			var checkCol = $("<span>").css({"width":"30px","border-left":"0px","text-align": "center"}).append(checkbox);//.append(label);
			var newRow = $("<li>").append(checkCol);
			
			newRow.append($("<span>").text(data.productName));
			newRow.append($("<span>").text(data.productCode));
			newRow.append($("<span>").text(data.productType));
			newRow.append($("<span>").text(data.largeClassName));			
			$(".selected-ul").append(newRow);
		});
	}
	
	/**刷新未绑定列表 params查询参数json对象**/
	function refreshUnSelectList(params) {

		var unselectList = new Array();
		for(var i=11; i<20; i++) {
			var id = guid();
			var data = {
				"appId"    : id,
				"productName" : "产品"+id,
				"productCode" : "融资对象",
				"productType" : "融资类型",
				"largeClassName" : "其他要素"
			};
			unselectList.push(data);
		}
		var url = $("#queryUnselectURL").val();
		url += "&unitType="+$("#unitType").val()+"&unitId="+$("#unitId").val();
		//var unselectList = getData(url, params);
		$(".unselect-ul").empty();
		$.each(unselectList, function(i, data){
			var cur_index = guid();
			var checkbox = $("<input type='checkbox' class='checkboxs'>").attr("id", cur_index).attr("keyId", data.appId);
			//var label = $("<label>").attr("for",cur_index);
			var checkCol = $("<span>").css({"width":"30px","border-left":"0px","text-align": "-webkit-center"}).append(checkbox);//.append(label);
			var newRow = $("<li>").append(checkCol);
			newRow.append($("<span>").text(data.productName));
			newRow.append($("<span>").text(data.productCode));
			newRow.append($("<span>").text(data.productType));
			newRow.append($("<span>").text(data.largeClassName));			
			$(".unselect-ul").append(newRow);
		});
	}
		
	function save(ids, operType){
		log("ids="+ids+",operType="+operType);
		var url = "";
		if("selected" === operType) {
			url = $("#addURL").val() +  "&productAppIds="+ids+"&unitPoolType="+$("#unitType").val()+"&unitId="+$("#unitId").val();
		} else {
			url = $("#delURL").val() + "&Ids="+ids;
		}
		log(url);
		$.ajax({
			url:url,
			//params:params,
			success:function(data){
				log(data)
			},
			error:function() {
				alert("保存数据出错，请重试！");
			}
		});
	}
	
	/**请求后台数据 url 请求url，params查询参数json对象**/
	function getData(url, params) {
		log(url);
		log(params);
		var dataList = null;
		$.ajax({
			url:url,
			contentType:'application/json',
			data:params,
			async : false,//此处需要注意的是要想获取ajax返回的值这个async属性必须设置成同步的，否则获取不到返回值
			success:function(data){
				log(data);
				dataList = JSON.parse(data);
		    },
			error:function() {
				alert("加载数据出错，请重试！");
			}
		});
		return dataList;
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
	/**
	 * 打印日志 
	 * */
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
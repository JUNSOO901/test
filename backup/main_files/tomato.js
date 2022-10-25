
// 특정 키워드에 명령어 세트를 만들어서, 한번에 실행
// 사용예 . inline에서 tr 리프레시 할때 실행
// refresher.set("tr.refresh",function(_target){});
function isNull (obj) {
	return (typeof obj != "undefined" && obj!=null && obj!="") ? false : true;
}
function __refresher (name,fn,fname) {
	this.list = []; // 실행할 함수 목록
	this.fnamelist = []; // targetName 검색 속도 최적화 위해 실행될 함수 이름만 저장
	this.dummy = []; // targetName 이 없는 애들은 여기에 임시로 저장. execute할때 다시 정렬하고 그래도 남는 애들은 list 실행 후에 순서대로 실행
	if (name) this.set(name,fn,fname);
}
__refresher.prototype = {
	list:[],
	fnamelist:[],
	dummy:[],
	set:function (name,fn,fname,targetName,direction) {// direction. 0=before, 1=after
		this.list[name] = this.list[name]?this.list[name]:[];
		this.dummy[name] = this.dummy[name]?this.dummy[name]:[];
		this.fnamelist[name] = this.fnamelist[name]?this.fnamelist[name]:[];
		this.fnamelist[name][fname] = 1;
		if (!targetName) this.list[name][this.list[name].length]={"fname":fname,"fn":fn};
		else if (!this.fnamelist[name][targetName]) { // 없는 함수를 targetName으로 지정했을 경우
			this.dummy[name][this.dummy[name].length]={"fname":fname,"fn":fn,"direction":direction,"targetName":targetName};
		} else {
			var l = this.list[name].length-1;
			for (var i=l;i>=0;i--) {
				this.list[name][i+1] = this.list[name][i];
				if (this.list[name][i]["fname"]==targetName) {
					this.list[name][i+direction]={"fname":fname,"fn":fn};
					return false;
				}
			}

		}
	},
	resort:function (name) {
		var dummyL = this.dummy[name].length;
		for (var i=1;i<=dummyL;i++) { // dummy에 있는 개수 많큼 실행 (한 번에 한 번씩 사라질 테니까)
			var l = this.dummy[name].length;
			for (var j=0;j<l;j++) {
				if (this.fnamelist[name][this.dummy[name][j]["targetName"]]) {//있는 함수면
					this.set(name,
						this.dummy[name][j]["fn"],
						this.dummy[name][j]["fname"],
						this.dummy[name][j]["targetName"],
						this.dummy[name][j]["direction"]);
					this.dummy[name][j] = null;
				}
			}
		}
	},
    execute:function (name,_target,arg2) {
    	console.log("execute:"+name);
        if (this.dummy[name]) this.resort(name);
        for (var i in this.list[name]) {
            if (!this.list[name][i]) continue;
            // console.log("__refresher."+name+"."+this.list[name][i]["fname"]+" from list");
            this.list[name][i]["fn"](_target,arg2);
        }
        for (var i in this.dummy[name]) {
            if (!this.dummy[name][i]) continue;
            console.log("__refresher."+name+"."+this.dummy[name][i]["fname"]+" from dummy");
            this.dummy[name][i]["fn"](_target,arg2);
        }
    },
	clear:function (name,fname) {
		if (!fname) {
			this.list[name]=[];
			this.dummy[name]=[];
			this.fnamelist[name]=[];
		} else {
			this.fnamelist[name][fname]=null;
			var fIndex = 0,i=0;
			$.map(this.list[name],function (n) {
				if (n.fname==fname) fIndex = i;
				i++;
			})
			this.list[name][fIndex]=null;
		}
	},
	after:function (name,fn,fname,afterWhat) {
		this.set(name,fn,fname,afterWhat,1);
	},
	before:function (name,fn,fname,beforeWhat) {
		this.set(name,fn,fname,beforeWhat,0);
	}
}
var refresher = new __refresher ();





function __SYSTEM () {
	this.start();

}
__SYSTEM.prototype = {
	getCookie:function (name) {
	var from_idx = document.cookie.indexOf(name+'=');
	   if (from_idx != -1) {
	   from_idx += name.length + 1;        
	   to_idx = document.cookie.indexOf(';', from_idx);        
	   if (to_idx == -1) {            
	   	to_idx = document.cookie.length;        
	   }       
	   return unescape(document.cookie.substring(from_idx, to_idx))     
	 } 
	},
	start:function () {
		this.excel = this._generatorOutputFunction("excel");
		this.print = this._generatorOutputFunction("print");
		this.bSkinPrint = this._generatorOutputFunction("bSkinPrint");
	},
	_generatorOutputFunction:function (optionName) {
		return function (bId,search) {window.open("/"+bId+"/list."+optionName+"/?"+search);}
	},
	setCookie:function (name,value,expire,expireType) {   
		var todayDate = new Date();    
		if (expireType=="m")
		{
			todayDate.setDate(todayDate.getDate());    todayDate.setHours(todayDate.getDate());    todayDate.setMinutes()+expire;    todayDate.setSeconds(0); 
		 }
		if (expireType=="H")
		{
			todayDate.setDate(todayDate.getDate());    todayDate.setHours(todayDate.getDate()+expire);    todayDate.setMinutes(0);    todayDate.setSeconds(0); 
		}
		if (expireType=="D")
		{
			todayDate.setDate(todayDate.getDate()+expire);    todayDate.setHours(0);    todayDate.setMinutes(0);    todayDate.setSeconds(0); 
		}
		if (expireType=="M")
		{
			expire *=30;
			todayDate.setDate(todayDate.getDate()+expire);    todayDate.setHours(0);    todayDate.setMinutes(0);    todayDate.setSeconds(0); 
		}
		//alert (todayDate.toGMTString());
		document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"   
	},
	refresh:function  () {
        // location.href = location.href;
        location.reload(true);
    },
	set_hrefNone:function  () {
		$("a[href=#none]").each (function () {
			$(this).attr("onClick",($(this).attr("onClick")?$(this).attr("onClick"):"")+";return false;");

		})
	},
	getset:function  (v) { //게터 세터 + private 변수
		var V = v;
		return function (g) {
			if (g!==undefined) V = g;
			else return V; 
		}
	},
	typeOfMatching :function (F,V) { //frame, Variable
		// F의 key와 V의 각 변수 종류를 매칭시킨 Object를 반환한다.
		// ex) __TYPEOF_MATCHING({"object":"option","function":"callback","string":"identity"},{"name":"sean","meta":{"age":"30","job":"programmer"},"go":function (A) {return A}})
		//  return {"option":{"age":"30","job":"programmer"},"callback":function (A) {return A},"identity":"sean"}


		//1. jqueryMap으로 V를 object->array로 변경
		//2. reduce로 typeof으로 매칭

		return $
			.map(V,function (v) {
				return [v]})
			.reduce(function (obj,v) {
				return obj[F[typeof(v)]]=v,obj;
			},
			{});
	}

}

var TOMATOSYSTEM = new __SYSTEM();
// refresher.set("onload",function () {TOMATOSYSTEM = new __SYSTEM();})

function __FIELD () {

}
__FIELD.prototype = {
	sendSelect:function (from,to,target,targetFrom) {
		from = document.all[from];
		to = document.all[to];
		
		 var x = 0; 
		var l = from.length;
		 for (x=0;x<l;x++) 
		 { 
			if (from[x].selected) 
			{ 
			to.options.length++;
			to.options[to.options.length-1].value=from.options[x].value;
			to.options[to.options.length-1].text=from.options[x].text;
			} 
		 }
		 for (x=l-1;x>=0;x--) 
		 { 
			if (from[x].selected) 
			{ 
			from.options[x]=null;
			} 
		 } 
		/*
		if (from.selectedIndex>-1){
			to.options.length++;
			to.options[to.options.length-1].value=from.options[from.selectedIndex].value;
			to.options[to.options.length-1].text=from.options[from.selectedIndex].text;
			from.options[from.selectedIndex]=null;
		}*/
		this.logicSelect (target,targetFrom);

	},
	moveSelect:function  (from,move,target,targetFrom) {
		from = document.all[from];
		 var x = 0; 
		var l = from.length;
		 for (x=0;x<l;x++) 
		 { 
			if (move==1)
			{
				var index = l-1-x;
			}else {
				var index = x;
			}
			if (from[index].selected) 
			{ 
				tempValue = from.options[index].value;
				tempText = from.options[index].text;
				from.options[index].value = from.options[index+move].value;
				from.options[index].text = from.options[index+move].text;
				from.options[index+move].value = tempValue;
				from.options[index+move].text = tempText;
				from.options[index].selected=false;
				from.options[index+move].selected=true;
			}
		 } 
		this.logicSelect (target,targetFrom);
	},
	logicSelect:function  (target,from) {
		from = document.all[from];target = document.all[target];i = 0;j = "";while (i<from.length){j = j + from.options[i].value;if (i<from.length-1){j = j+",";}i++;}target.value = j;
	},
	resize_multiFile:function  (target) {
		$("#"+target).height($("#"+target).contents().find("body")[0].scrollHeight);
	}
	,
	referenceMultiCheck_check:function (target) {
		var name = $(target).attr("name");
		var v = "";
		$(target).parent().parent().parent().find("input[name="+name+"]").each(function () {
			if ($(this).prop("checked")) v+=(v?",":"")+$(this).val();
		});
		$("#"+$(target).attr("target")).val(v);
	}
	,
	textBoxSetting:function (target) {
		//$("input:password").iphonePassword();
		//$("#b").iphonePassword();
		// console.log("textBoxSetting");
		if (!target) $target = $("html");
		else $target = $(target);

		$target.find("input[type=text]").addClass("text");
		$target.find("textarea").addClass("text");
		$target.find("input[type=password]").addClass("password");
		$target.find("input[type=button]").addClass("button");
		$target.find("input[type=submit]").addClass("submit");

		$target.find("[default]").each(function () {
			// console.log($(this));
			// $(this).hide()
			// console.log("val:"+$(this).val());
			// console.log("default:"+$(this).attr("default"));
			if (!$(this).val()&&!$(this).is(':focus'))
			{
				$(this).addClass("default");
				$(this).removeClass("variabled");
				$(this).val($(this).attr("default"));
				// console.log("ts 1");
			} else if($(this).val()!=$(this).attr("default")&&$(this).val()) {
				$(this).removeClass("default");
				$(this).addClass("variabled");
				// console.log("ts 2");
			} else if ($(this).val()==$(this).attr("default")&&$(this).val()) {
				$(this).addClass("default");
				$(this).removeClass("variabled");
				$(this).val($(this).attr("default"));
			}
			$(this).bind("focus click mousedown",function () {
				if ($(this).hasClass("default"))
				{
					$(this).val("");
					$(this).addClass("variabled");
					$(this).removeClass("default");
				}
			});
			$(this).bind("blur change",function () {
				if (!$(this).val())
				{
					$(this).removeClass("variabled");
					$(this).addClass("default");
					$(this).val($(this).attr("default"));
				}
			});
		});
	}
	,
	set_enter4next:function  (target) {
		if (!target) target = "body ";
		else target+=" ";
		$(target+"input[type=text]").add(target+"input[type=radio]").add(target+"input[type=checkbox]").add(target+"select").not(".referenceS").not(".datepicker").not(".noEnter").bind("keydown",function (e) {
			var self = $(this)
			, form = self.parents('form:eq(0)')
			, focusable
			, next
			;
			if (e.keyCode == 13) {
				$(this).blur();
				focusable = form.find(':input:visible:not([readonly]):not([tabIndex])');
				next = focusable.eq(focusable.index(this)+1);
				if (next.length) {
					next.focus();
				} else {
					form.submit();
				}
				//e.keyCode==9;
				return false;
			}
		});
		$(target+".datepicker").unbind("keyup").bind("keyup",function (e) {
			var self = $(this)
			, form = self.parents('form:eq(0)')
			, focusable
			, next
			;
			if (e.keyCode == 13) {
				focusable = form.find(':input:visible:not([readonly]):not([tabIndex])');
				next = focusable.eq(focusable.index(this)+1);
				if (next.length) {
					next.focus();
				} else {
					form.submit();
				}
				//e.keyCode==9;
				$(this).datepicker("hide");
				return false;
			}
		});
		$(target+".referenceS").bind("keyup",function (e) {
			var self = $(this)
			, form = self.parents('form:eq(0)')
			, focusable
			, next
			;
			if (e.keyCode == 13) {
				$(this).blur();
				focusable = form.find(':input:visible:not([readonly]):not([tabIndex])');
				next = focusable.eq(focusable.index(this)+1);
				if (next.length) {
					next.focus();
				} else {
					form.submit();
				}
				return false;
			}
		});
	},
	set_upDownKey:function  (target) {
		if (!target) target = "body ";
		else target+=" ";
		//multiple 에서 표 내부에서의 포커스 상하 이동
		//38 : up , 
		//40 : down
		$(target+"input[type=text]").add(target+"input[type=radio]").add(target+"input[type=checkbox]").add(target+"select").not(".referenceS").not(".datepicker").bind("keydown",function (e) {
			var $td = $(this).closest("td");
			var $tr = $td.closest("tr");
			var ind = $(this).closest("tr").children("td").index($td);
			// alert (ind);
			dbg(ind);
			if (e.keyCode == 38) {
				if ($tr.prev().length) $tr.prev().children("td:eq("+ind+")").find("input").focus();
				return false;
			}
			if (e.keyCode == 40) {
				if ($tr.next().length) $tr.next().children("td:eq("+ind+")").find(":input:visible:not([readonly])").focus();
				return false;
			}
		});
		$(target+".datepicker").unbind("keyup").bind("keyup",function (e) {
			var $td = $(this).closest("td");
			var $tr = $(this).closest("tr");
			var ind = $(this).closest("tr").children("td").index($td);
			if (e.keyCode == 38) {
				$(this).blur();
				if ($tr.prev().length) $tr.prev().children("td:nth-child("+ind+")").find(":input:visible:not([readonly])").focus();
				return false;
			}
			if (e.keyCode == 40) {
				$(this).blur();
				if ($tr.next().length) $tr.next().children("td:nth-child("+ind+")").find(":input:visible:not([readonly])").focus();
				return false;
			}
		});
		$(target+".referenceS").bind("keyup",function (e) {
			var $td = $(this).closest("td");
			var $tr = $(this).closest("tr");
			var ind = $(this).closest("tr").children("td").index($td);
			if (e.keyCode == 38) {
				$(this).blur();
				if ($tr.prev().length) $tr.prev().children("td:nth-child("+ind+")").find(":input:visible:not([readonly])").focus();
				return false;
			}
			if (e.keyCode == 40) {
				$(this).blur();
				if ($tr.next().length) $tr.next().children("td:nth-child("+ind+")").find(":input:visible:not([readonly])").focus();
				return false;
			}
		});
	},
	setDatepicker:function  () {

		var toDate = new Date();
		var thisYear = toDate.getFullYear();
		$(".datepicker").not(".datepicker[readonly=readonly]").datepicker({
			inline:true,changeMonth:true,changeYear:true,showAnim:"",
			dateFormat:"y-mm-dd",
			showButtonPanel:true,
			yearRange: "1900:"+(thisYear+2),
            closeText: "닫기",
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
            monthNames: [ "1월","2월","3월","4월","5월","6월",
            "7월","8월","9월","10월","11월","12월" ],
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월",
            "7월","8월","9월","10월","11월","12월" ],
            dayNames: [ "일요일","월요일","화요일","수요일","목요일","금요일","토요일" ],
            dayNamesShort: [ "일","월","화","수","목","금","토" ],
            dayNamesMin: [ "일","월","화","수","목","금","토" ],
            weekHeader: "주",
            yearSuffix: "년",
			onSelect: function(dateText, inst) {
				$(this).removeClass("default");
				$(this).addClass("variabled");
				var _this = this;
				if ($(this).attr("callback")=='tableSortSearch.auto') setTimeout((function (_this) {tableSortSearch.auto(_this);})($(this)),50);
				else if ($(this).attr("callback")) eval ($(this).attr("callback"));
			}
		});
		$(".datepicker[data-default=today]").each(function () {
			if (!$(this).val()) $(this).datepicker("setDate","today");
		});
	}

}
var TOMATOFIELD = false;
refresher.set("onload",function () {TOMATOFIELD = new __FIELD();})

String.prototype.delComma = function () {
	return this.replace(/,/gi,'');
}
String.prototype.left = function (n) {
	if (n <= 0)
	  return "";
	else if (n > String(this).length)
	  return String(this).substring(0,String(this).length);
	else
	  return String(this).substring(0,n);
}
String.prototype.right = function (n) {
  if (n <= 0)
     return "";
  else if (n > String(this).length)
     return String(this).substring(0,String(this).length);
  else {
     var iLen = String(this).length;
     return String(this).substring(iLen, iLen - n);
  }
}
String.prototype.replaceAll = function(_findValue, _replaceValue) {
	return this.replace(new RegExp(_findValue.toString(),"g"), _replaceValue);
};
String.prototype.set_clipboard=function () {
    var IE=(document.all)?true:false;
    if (IE) {
            window.clipboardData.setData("text", this);
    } else {
        temp = prompt("Ctrl+C를 눌러 클립보드로 복사하세요", this);
    }
}


String.prototype.castMoney = function () {
	var num = this+"";
	if (num) {
		num = num.replace(/,/gi,'');
		var pattern = /(-?[0-9]+)([0-9]{3})/;
		while(pattern.test(num)) {
			num = num.replace(pattern,"$1,$2");
		}
		return num;
	} else {
		return num;
	}
}
Number.prototype.castMoney = function () {
	var num = this+"";
	if (num) {
		num = num.replace(/,/gi,'');
		var pattern = /(-?[0-9]+)([0-9]{3})/;
		while(pattern.test(num)) {
			num = num.replace(pattern,"$1,$2");
		}
		return num;
	} else {
		return num;
	}
}


Date.prototype.getWeekday = function () {
	var week = new Array('일', '월', '화', '수', '목', '금', '토');
	return week[this.getDay()];
}


function L(text) {
	return text;
}


function selectToCheckbox(checkbox) {
	var $checkbox = $("input[name="+$(checkbox).attr("name")+"]");
	var $target = $("input[name="+$(checkbox).attr("target")+"]");
	var val = "";
	$checkbox.each(function () {
		if ($(this).is(":checked")==true) {
			if (val) val+=";";
			val+=$(this).val();
		}
	})
	$target.val(val);
	// if ($target.attr("callback")) eval($target.attr("callback"));
	if ($target.attr("callback")) refresher.execute($target.attr("callback"),$target);
}






$(function () {
	setTimeout(function () {refresher.execute("onload");},100);
})

$(window).unload(function () {
	console.log("close");
	console.log(location.href);
})

$(window).resize(function () {
	setTimeout(function () {refresher.execute("resize");},10);
});


window.onscroll = function () {
 	setTimeout(function () {refresher.execute("scroll");},10);
}


// 캐쉬
// 주 키와 보조 키를 이용. 주 키는 바로 지정해서 사용하고, 보조 키는 검색 해서 일치하는 것 사용

function __cache (timeOutSec) {
	this.list=[];
	this.timeout = false;
	this.timeOutSec = timeOutSec?timeOutSec:60;
}
__cache.prototype = {
	list:[],
	set:function (key,subKey,variable,cookieEnable) { //set New Cache
		cookieEnable= false;
		this.list[key]=[];
		this.list[key]["subKey"] = subKey;
		this.list[key]["variable"] = variable;
		// console.log ("cacher.set : "+subKey);
		if (cookieEnable) setCookie("__cache_"+key,variable,2,"D"); //3일 지정
		this.complete();
	},
	get:function (key,cookieEnable) { //get saved cache
		cookieEnable= false;
		this.complete();
		if (this.list[key])	return this.list[key]["variable"];
		if (cookieEnable&&getCookie("__cache_"+key)) {
			var ret = getCookie("__cache_"+key);
			setCookie("__cache_"+key,ret,3,"D"); //사용시 3일씩 연장
			return ret;
		}
		return false;
	},
	search:function (subKey) { //search cache
		this.complete();
		for (var i in this.list) {
			if (this.list[i]["subKey"]==subKey) {
				// console.log ("cacher.search.result : "+this.list[i]["variable"]);
				return this.list[i]["variable"];
			}

		}
	},
	complete:function () { // Clear cache after timeOutSec from last using
		clearTimeout(this.timeout);
		var t = this;
		this.timeout = setTimeout(function () {t.clear()},this.timeOutSec*1000); 
	},
	clear:function () { // clear cache all
		// console.log("cache.clear");
		this.list=[];
	}
}

var cacher = false;
refresher.set("onload",function () {cacher = new __cache ()});


function __hash () {
	this.tomato = new tomato("HashAddress");
}
__hash.prototype = {
	getCurrent:function () {
		return location.hash.replaceAll("#",""); //현재 화면의 해시
	},
	get:function () {
		return window.parent.location.hash.replaceAll("#","");
	},
	set:function (hash) {
		if (hash) {
			cacher.set("hashUpdated","hashUpdated",true);
			if (window.parent.location.hash!=hash) window.parent.location.hash = hash;
			setTimeout(function () {
				cacher.set("hashUpdated","hashUpdated",false);
			},100);
		}
	},
	getAddress:function () {
		var url = location.href;
		var urlA = url.split("#");
		// console.log("get Address : "+urlA[0]);
		return urlA[0];
	},
	searchHash:function (hash,callback) {
		if (!hash) var hash = this.get();
		if (hash) this.search(true,hash,callback);
		else if (typeof callback == 'function') callback(location.href.replace(location.origin+"/",""));
	},
	searchAddress:function (address,callback) {
		if (!address) var address = this.getAddress();
		if (address) this.search(false,address,callback);
	},
	search:function (hash,val,callback) {
		cacher.set("hashVal","hashVal",val);
		// this.tomato = new tomato(2680)
		// console.log("search("+hash+","+val+"");
		// hash = 1 -> hash
		// hash = 0 -> address
		if (!val) return false;
		var keyname = (hash?"hash_":"address_")+val;
		var ret = cacher.get(keyname,1);
		if (ret&&typeof callback == 'function') {
				callback(ret);
				return true; }// check cache

		var search = new Object();
		if (hash) search.etc_bs_hashAddress__code = val;
		else search.etc_bs_hashAddress__address = val;
		var _this = this;
		// console.log("검색:"+val);
		var tomato = this.tomato;

		tomato.list(search,function (J) {
			// console.log("search:"+J);
			var J = $.parseJSON(J);
			//값이 없는 경우는 단축 주소 새로 저장 하고 새로 검색
			if (J.length==0&&!hash) {
				// console.log("new save");
				var va = new Object();
				va.address=val;
				tomato.insertAc(va,function () {
					_this.search(hash,val,callback)
				});
			} else if (J.length>0) {
				var ret = (hash?J[0].address:J[0].code);
				// console.log("saved");
				var keyname_ = (hash?"address_":"hash_")+ret;
				cacher.set(keyname,keyname,ret,1); //save at cache and cookie
				cacher.set(keyname_,keyname_,val,1); //save reverse information at cache and cookie
				if(J.length>0&&typeof callback == 'function') callback(ret);
			}
		});
	},
	parsingParameter:function (url) {
		// console.log(url);
		if (!url) var url = location.href;
		url = url.replace(location.origin+"/","");
		if (url.substr(0,1)=="/") url = url.substr(1);
		// console.log(url);
		urlA = url.split("?");
		var ret = [];
		var host = urlA[0].split("/");
		if (host.length) {
			ret['_host'] = host;
		}
		if (urlA[1]) urlA = urlA[1].split("#");
		else return ret;
		if (urlA[0]) {
			url = urlA[0];
			var urlA = url.split("&");
			for (var i in urlA) {
				var p = urlA[i].split("=");
				// console.log(p[0]);
				// console.log(p[1]);
				ret[p[0]] = p[1];
			}
			return ret;
		};
	}
}
var hasher = false;
refresher.set("onload",function () {hasher = new __hash();})

// var hasher = new __hash();

$.datepicker._defaults.onAfterUpdate = null;
var datepicker__updateDatepicker = $.datepicker._updateDatepicker;
$.datepicker._updateDatepicker = function( inst ) {
  datepicker__updateDatepicker.call( this, inst );

  var onAfterUpdate = this._get(inst, 'onAfterUpdate');
  if (onAfterUpdate)
     onAfterUpdate.apply((inst.input ? inst.input[0] : null),
        [(inst.input ? inst.input.val() : ''), inst]);
}
var cur = -1, prv = -1;






function __inline () {
	this.saveRealTimer=false;
}
__inline.prototype = {
	saveRealTime:function (target) {
		this.saveRealTime2(target);
		return false;
		//return false;
		clearTimeout(this.saveRealTimer);
		var _this = this;
		this.saveRealTimer = setTimeout(function () {_this.saveRealTime2(target);},500);
	},
	saveRealTime2:function  (target) {
		// alert (target);
		var _this = this;
		target = "#"+target;
		var $tr = $(target).closest("tr");
		var mode;

		if ($tr.hasClass("this_is_realtime_insert")) mode = "insert";
		else mode="realtime";
		var id = $(target).closest("tr").attr("id");
		// console.log("id:"+id);
		var $table = $(target).closest("table");
		var bId = $table.attr("bId");
		var name = $(target).attr("name");

		if ($(target).attr("type")=="checkbox") var val = ($(target).is(":checked")==true)?$(target).val():"";
		else var val = $(target).val();

		$(target).addClass("saving");
		var packet = '"'+name+'"' +':"'+val+'","method":"api"';
		packet = "{"+packet+"}";
		// alert (packet);
		packet = $.parseJSON(packet);
		//return false;
		$.post("/"+bId+"/"+mode+":save/"+id,packet,function (msg) {
			if (msg) {
				// alert (msg);
				j = $.parseJSON(msg);
				if (j.message!="ok") {
					alert (j.message);
					// return false;
				}
			}
			$(target).removeClass("saving");
			 if (mode=="realtime") {
			 	_this.reloadRealTime($tr,target);
			 } else {
			 	//cancelInline($tr);
			 	_this.reloadRealTime($tr);
			 	_this.loadInsert();
			 	$tr.removeClass("this_is_realtime_insert");
			 }
		});
	},
	reloadRealTime:function (target,detailTarget) {
		if (detailTarget) var detailTarget = detailTarget.replaceAll("#","");
		var $tr = $(target);
		var id = $(target).attr("id");
		var $table = $tr.closest("table");
		var bId = $table.attr("bId");
		var _this = this;
		$.get("/"+bId+"/realtime.json",{mode:"realtime",bId:bId,searchKey:"id",searchWord:id,searchRelation:'=',r:Math.floor(Math.random() * 99999) + 1},function (html) {
			//$("textarea").val(html);
			var html = "<["+html+"]>";
			html = _this.encodeInline(html);
			html = "[{"+html+"}]";
			// dbg (html);
			var json = $.parseJSON(html);

			for (var key in json[0]) {
				var field = _this.decodeInline(json[0][key]);
				//$("textarea").text(field);
				var manner = /<script>(.*?)<\/script>/gi;
				script = manner.exec(field);
				if (script!=null) {
					script = script[0];
					script = script.replaceAll("<script>","");
					script = script.replaceAll("</script>","");
					//alert (script);
					// $("textarea").text(script);
					eval(script);
				}
				var field = field.replace(manner, "");		

				if ($tr.children("td."+key).length>0&&!detailTarget) $tr.children("td."+key).html(field);
				else if (detailTarget&&$("#"+detailTarget).closest("td").hasClass(key)) {
					$tr.children("td."+key).html(field);
				}
			}
			$tr.children("td:last-child").children(".inlineX").show().click(function () {
				var id = $(this).closest("tr").attr("id");
				_this.delInline (bId,id,$(this));
			});	
		});
	},
	setInline:function  () {
		var _this = this;
		$(".this_is_inline_table").each (function () {
			$table = $(this).closest("table");
			var bId = $table.attr("bId");
			var thTag = "<th class='inlineButtons'>&nbsp;</th>";
			$table.find(".this_is_inline_table").children("td").addClass("inlineButtons");
			var tdTag = $table.find(".this_is_inline_table").html();
			if ($table.children("thead").children("tr").children("th:last-child.inlineButtons").length==0) $table.children("thead").children("tr").children("th:last-child").after(thTag);
			$table.children("tbody").children("tr[mode!=insert]").not(".this_is_inline_table").not(".index").each(function () {
				if ($(this).children("td:last-child.inlineButtons").length==0) $(this).children("td:last-child").after(tdTag);
				$(this).children("td:last-child").children(".inlineX").show().click(function () {
					var id = $(this).closest("tr").attr("id");
					_this.delInline (bId,id,$(this));
				});	
			})

		})
	},
	saveInline:function  (target,realMode) {
		var _this = this;
		var $tr = $(target).closest("tr");

		var mode = $tr.attr("mode");
		var id = $(target).closest("tr").attr("id");
		var parent = $(target).closest("tr").attr("parent")?$(target).closest("tr").attr("parent"):0;
		var $table = $(target).closest("table");
		var $trOriginal = $table.children("tbody").children("tr.original[id="+id+"]");
		var bId = $table.attr("bIdentity")?$table.attr("bIdentity"):$table.attr("bId");
		var packet = "";
		$tr.find("[tomato=true]").each(function () {
			var name = $(this).attr("name");
			var val = null;

			if ($(this).attr("type")=="checkbox") val = ($(this).is(":checked")==true)?$(this).val():"";
			else val = ($(this).hasClass("default")||$(this).val()==""?"":$(this).val()).replaceAll('"','\\'+'"').replaceAll('\n','<br>');
			if (packet) packet += ",";
			packet += '"'+name+'"' +':"'+val+'"';

			if (realMode!="realtime"&&$(this).attr("type")!="hidden") $(this).closest("td").html(val);
		});
			if (packet) packet += ",";
		// packet += '"bId":"'+bId+'","id":"'+id+'","mode":"'+mode+'","method":"api","parent":"'+parent+'"';
		packet += '"method":"api","parent":"'+parent+'"';
		packet = "{"+packet+"}";
		// alert (packet);
		packet = packet.replace(/[\r\n]/g, '<br>');
		packet = $.parseJSON(packet);
		//return false;
		$.post("/"+bId+"/"+mode+":save/"+id,packet,function (msg) {
			if (msg) {
				// alert (msg);
				j = $.parseJSON(msg);
				if (j.message!="ok") {
					alert (j.message);
					// return false;
				}
			}
			if (mode=="mod") {
				_this.reloadInline($trOriginal);
				_this.cancelInline($tr);
			} else {
				//cancelInline($tr);
				if (realMode=="realtime") _this.reloadRealTime($trOriginal);
				else _this.reloadInline($trOriginal);
				$trOriginal.children("td:last-child").children(".inlineX").hide();
				$trOriginal.children("td:last-child").children(".inlineOk").hide();
				$trOriginal.removeClass("this_is_inline_insert");
				$trOriginal.removeClass("this_is_realtime_insert");
				$trOriginal.removeClass("original");
				$trOriginal.attr("mode","");
				if (mode=="insert") {
					_this.loadInsert(null,3);
				}
			}
            callBack = $trOriginal.attr("callback");
            if (callBack) eval(callBack);						
		});
	},
	reloadInline:function (target) {
		var $tr = $(target);
		var id = $(target).attr("id");
		var $table = $tr.closest("table");
		var bId = $table.attr("bId");
		$.getJSON("/"+bId+"/inline.json",{mode:"inline",bId:bId,searchKey:"id",searchWord:id,r:Math.floor(Math.random() * 99999) + 1},function (json) {
			for (var key in json[0]) {
				var field = "<a href='#loadInline_"+json[0].Id+"' onClick='INLINE.loadInline("+json[0].Id+",this)'>"+json[0][key]+"</a>";
				$tr.children("td."+key).html(field);
				$tr.children("td:last-child").children(".bt_trash").show();
				refresher.execute("tr.refresh",$tr	);
			}
		});
	},
	delInline:function  (bId,id,target) {
		// event.preventDefault();
		// event.stopPropagation();
		if (!confirm("삭제하시겠습니까?")) return false;
		$(target).closest("tr").hide();
		$.post('/'+bId+'/del:save/'+id,{method:"api"},function (msg) {
			packet = $.parseJSON(msg);
			msg = packet.message;
			if (msg=="ok") {
				$(target).closest("tr").remove();
			} else {
				$(target).closest("tr").show();
			}
		});
	},
	loadInsert:function  (_target,n,ansId) {
		var _this = this;

		if (_target) $target = $(_target);
		else if ($(".this_is_inline_table").length>0) {
			$target = $(".this_is_inline_table").not("original");
			$target.attr("realmode","inline");
		} else if ($(".this_is_realtime_table").length>0) {
			$target = $(".this_is_realtime_table");
			$target.attr("realmode","realtime");
		} else if (!_target) return false;


		$target.each(function () {
			// alert (mode);
			var realmode = $(this).attr("realmode");
			$table = $(this).closest("table");
			if ($table.children("tbody").children("tr[mode=insert]").length>0) return true;
			if ($table.hasClass("onlyUpdate")) {
				$table.children("tbody").children("tr:last-child").hide();
				return true;
			}
			var bId = $table.attr("bId");
			var $trInsert = $(this).next().hide().clone().addClass("original");
			// alert ("this_is_"+mode+"_insert");
			$trInsert.addClass("this_is_"+realmode+"_insert")


			//$(this).next().after($trInsert);
			if (ansId) {
				$trInsert.attr("mode","ans");
				$("tr[id="+ansId+"]").after($trInsert);
				$trInsert.attr("parent",ansId);
				var mode = "ans";
			} else {
				$trInsert.attr("mode","insert");
				if ($table.hasClass("inlineAddDown")) $table.children("tbody").append($trInsert);
					else $table.children("tbody").prepend($trInsert);
				var mode = "insert";
			}
			// alert (mode);
			$trInsert.show();


			$.get("/"+bId+"/"+mode+".json",{bId:bId,mode:mode,parent:ansId},function (html) {

				var html = "<["+html+"]>";
				html = _this.encodeInline(html);
				html = "[{"+html+"}]";
				//console.log(html);
				var json = $.parseJSON(html);

				$trInsert.attr("Id",json[0].Id);

				$trInsert.children("td:last-child").children(".inlineX").hide().unbind("click").click(function () {
					var id = json[0].Id;
					_this.delInline (bId,id,$(this));
				});
				$trInsert.children("td:last-child").children(".inlineOk").show().unbind("click").click(function () {
					_this.saveInline(this,realmode);
				});
				// $trInsert.children("td:last-child").children(".inlineClose").show().unbind("click").click(function () {
				// 	cancelInline(this);
				// });

				// $tr.after($trInsert);
				//alert (json[0].identity);
				for (var key in json[0]) {
					//alert (key);
					var field = (json[0][key]);
					field = _this.decodeInline (field);
					//alert (field);

					var manner = /<script>(.*?)<\/script>/gi;
					script = manner.exec(field);
					if (script!=null) {
						script = script[0];
						script = script.replaceAll("<script>","");
						script = script.replaceAll("</script>","");
						//alert (script);
						//$("textarea").text(script);
						eval(script);
					}
					var field = field.replace(manner, "");			

					if ($trInsert.children("td."+key).length>0) $trInsert.children("td."+key).html(field);
					//alert (key);
				}
				TOMATOFIELD.setDatepicker();
				$trInsert.bind("click",function () {_this.cancelInlineAll();})
				// $trInsert.children("td").each(function () {
				// 	var t1 = $(this).find("input[tomato=true].text");
				// 	var t2 = $(this).find("select[tomato=true]");
				// 	var t3 = $(this).find("input.text");
				
				// 	if (t1.length) t1.focus();
				// 	else if (t2.length) t2.focus();
				// 	else if (t3.length) t3.focus();
				// 	if (t1.length||t2.length||t3.length) return false;
				// });
				TOMATOFIELD.textBoxSetting($trInsert);
			})
		});
	},
	loadInline:function  (id,target,callBack) {
		// event.preventDefault();
		// event.stopPropagation();
		//cancelInline(target);
		var $table = $(target).closest("table");
		var $tr = $(target).closest("tr");
		var $td = $(target).closest("td");
		if (!$td.attr("id")) $td.attr("id",newId());
		var tdCount=-1;
		$tr.children("td").each(function (n) {
			if ($(this).attr("id")==$td.attr("id")) {
				tdCount = n+1;
				return false;
			}
		});
		if ($tr.hasClass("inline")) return false;
		//$table.find(".inline").remove();
		//$table.find(".original").show();
		var bId = $table.attr("bId");
		var url = "/"+bId+"/mod.json/"+id;
		var _this = this;
		// console.log(url);
		$.get(url,{},function (html) {
			// alert (html);
			 //$("body").append("<textarea></textarea>");
			 _this.cancelInlineAll();
			var html = "<["+html+"]>";
			html = _this.encodeInline(html);

			//alert (html);
			html = "[{"+html+"}]";
			//$("textarea").html(html);
			//alert (html[0].bs_tableId)
			var jsonInline = $.parseJSON(html);
			var $trMod = $tr.clone().addClass("inline").attr("mode","mod");
			$tr.addClass("original").addClass("loadInlineCall").hide();	
			$trMod.children("td:last-child").children(".inlineX").remove();
			$trMod.children("td:last-child").children(".inlineOk").show().unbind("click").click(function () {
				_this.saveInline(this);
			});
			// $trMod.children("td:last-child").children(".inlineClose").show().unbind("click").click(function () {
			// 	cancelInline(this);
			// });


			
			$tr.after($trMod);
			//alert (json[0].identity);
			for (var key in jsonInline[0]) {
				var field = (jsonInline[0][key]);
				field = _this.decodeInline (field);
				//alert (field);

				var manner = /<script>(.*?)<\/script>/ig;

				script = manner.exec(field);	
				if (script!=null) {
					script = script[0];
					script = script.replaceAll("<script>","");
					script = script.replaceAll("</script>","");
					//alert (script);
					//$("textarea").text(script);
					eval(script);
				}
				var field = field.replace(manner, "");		

				if ($trMod.children("td."+key).length>0) $trMod.children("td."+key).html(field);
				//alert (key);
			}
			if (tdCount) 
				$trMod.children("td:nth-child("+tdCount+")").find(".field_interface").focus();
			
			_this.cancelInline(target,$tr,$trMod);
			set_checkbox();
			TOMATOFIELD.setDatepicker();
			// textBoxSetting($trMod);

			if (typeof(callBack)=="function") callBack(id,target);
			$(document).keydown(function() 
			{ 
				if ( event.keyCode == 27 ) _this.cancelInlineAll();
			});

		})
	},
	encodeInline:function  (html) {
		html = html.replace(/[\n\r]/g, '!@13@!');

		html = html.replace(/\<\[\[{/gi,'');
		html = html.replace(/}\]\]\>/gi,'');

		html = html.replace(/\[{/gi,'!@93123@!');
		html = html.replace(/}\]/gi,'!@12393@!');

		html = html.replace(/[\{]/gi, '!@123@!');
		html = html.replace(/[\}]/gi, '!@125@!');
		html = html.replace(/[\]]/gi, '!@91@!');
		html = html.replace(/[\[]/gi, '!@93@!');
		html = html.replace(/\t/g, '');
		return html;
	},
	decodeInline:function  (html) {
		if (!html) return html;
	 	html = html.replaceAll("!@13@!","\n\r");
	 	html = html.replaceAll("!@93123@!","[{");
	 	html = html.replaceAll("!@12393@!","}]");
	 	html = html.replaceAll("!@123@!","{");
	 	html = html.replaceAll("!@125@!","}");
	 	html = html.replaceAll("!@91@!","]");
	 	html = html.replaceAll("!@93@!","[");

		return html;
	},
	cancelInlineAll:function  (without1) {
		var _this = this;
		$(".this_is_inline_table").each (function () {
			_this.cancelInline($(this),without1);
		});
	},
	cancelInline:function (target,without1,without2) {
		$(document).unbind("keydown");
		$(without1).addClass("temp_live");
		$(without2).addClass("temp_live");
		var $table = $(target).closest("table");
		var $tr = $(target).closest("tr");
		$table.children("tbody").children("tr.original").not("tr.temp_live").show();
		$table.children("tbody").children("tr.inline").not("tr.temp_live").remove();
		if ($tr.hasClass("this_is_inline_insert")) $tr.remove();
		$(without1).removeClass("temp_live");
		$(without2).removeClass("temp_live");
	}
}
var INLINE=false;
refresher.set("onload",function () {INLINE = new __inline ()});


function fnInlineDefault() {
	INLINE.setInline();
	INLINE.loadInsert(null,3);
}
refresher.set("onload",fnInlineDefault,"fnInlineDefault");













/// tomatojs
//향후 inline.js가 tomato.js를 사용하도록 변경 필요, 및 reference류도 tomatojs로 통합 필요

function tomato (bId) {
	this._bId = bId;
	this._method="api";
	this._noMessage="true";
	this._packet = "";

	this.setbId = function (bId) {
		this._bId = bId;
	}
	this._makePacket = function (vA) {
		this._vA = (vA?vA:new Object());;
		// this._vA._bId = this._bId;
		this._vA.method = this._method;
		this._vA.noMessage = this._noMessage;
		this._packet = "";
		// console.log (vA);
		for (i in vA) {
			if (this._packet) this._packet+=",";
			this._packet+='"'+i+'":"'+(vA[i]?vA[i].toString().replaceAll('"','\\'+'"'):'')+'"';
		}
		this._packet = '{'+this._packet+'}';
		// console.log("packet");
		// console.log(this._packet);

		return $.parseJSON(this._packet);
	}

	this.save = function (packet,callBack) {
		// console.log(packet);
		var mode = packet._mode;
		packet._mode = null;
		$.post("/"+this._bId+"/"+mode+":save"+(packet._id?"/"+packet._id:""),packet,function (result) {
			if (typeof(callBack)=="function") callBack(result);
		})
	}
	this.load = function (packet,callBack) {
		// console.log(packet);
		var mode = (packet._mode?packet._mode:"list");
		packet._mode = null;
		$.get("/"+this._bId+"/"+mode+".json"+(mode=="list"&&packet.page?"/"+packet.page:""),packet,function (result) {
			// console.log("result:"+result);
			if (typeof(callBack)=="function") callBack(result);
		})
	}
	this.list = function (search,callBack) {
		this.search = (search?search:new Object());
		this.search._mode = "list";
		this.load(this._makePacket(this.search),callBack);
	}
	this.view = function (id,callBack) {
		this.vA = new Object();
		this.vA._id = id;
		this.vA._mode = "view";
		// console.log(this.vA);
		this.load(this._makePacket(this.vA),callBack);
	}
	this.insert = function (callBack) {
		this.vA = new Object();
		this.vA._mode = "insert";
		this.load(this._makePacket(this.vA),callBack);
	}
	this.insertAc = function (vA,callBack) {
		this.vA = (vA?vA:new Object());
		this.vA._mode = "insert";
		// console.log(this.vA);
		// console.log(callBack);
		this.save(this._makePacket(this.vA),callBack);
	}
	this.ans = function (id,vA,callBack) {
		// this.vA = (vA?vA:new Object());
		// this.vA._mode = "ans";
		// this.vA._parent = id;
		// this.save(this._makePacket(this.vA),callBack);
	}
	this.ansAc = function (id,vA,callBack) {
		// this.vA = (vA?vA:new Object());
		// this.vA._mode = "ans";
		// this.vA._parent = id;
		// this.save(this._makePacket(this.vA),callBack);
	}
	this.del = function (id,callBack) {
		this.save(this._makePacket({"_id":id,"_mode":"del"}),callBack);
	}
	this.mod = function (id,callBack) {
		this.vA = new Object();
		this.vA._mode = "mod";
		this.vA._id = id;
		this.load(this._makePacket(this.vA),callBack);
	}
	this.modAc = function (id,vA,callBack) {
		this.vA = (vA?vA:new Object());
		this.vA._mode = "mod";
		this.vA._id = id;
		this.save(this._makePacket(this.vA),callBack);
	}
	this._encodeJSON = function (html) {
		html = html.replace(/[\n\r]/g, '!@13@!');

		html = html.replace(/\<\[\[{/gi,'');
		html = html.replace(/}\]\]\>/gi,'');

		html = html.replace(/\[{/gi,'!@93123@!');
		html = html.replace(/}\]/gi,'!@12393@!');

		html = html.replace(/[\{]/gi, '!@123@!');
		html = html.replace(/[\}]/gi, '!@125@!');
		html = html.replace(/[\]]/gi, '!@91@!');
		html = html.replace(/[\[]/gi, '!@93@!');
		html = html.replace(/\t/g, '');
		return html;
	}
	this._decodeJSON = function (html) {
	 	html = html.replaceAll("!@13@!","\n\r");

	 	html = html.replaceAll("!@93123@!","[{");
	 	html = html.replaceAll("!@12393@!","}]");

	 	html = html.replaceAll("!@123@!","{");
	 	html = html.replaceAll("!@125@!","}");

	 	html = html.replaceAll("!@91@!","]");
	 	html = html.replaceAll("!@93@!","[");
		return html;
	}
	this.encode = function (html) {
		var html = "<["+html+"]>";
		html = this._encodeJSON(html);
		html = "[{"+html+"}]";
		// console.log("encode result : "+html);
		return $.parseJSON(html);
	}
	this.decode = function (element) {
		var field = this._decodeJSON(element);
		var manner = /<script>(.*?)<\/script>/gi;
		script = manner.exec(field);
		if (script!=null) {
			script = script[0];
			script = script.replaceAll("<script>","");
			script = script.replaceAll("</script>","");
			//alert (script);
			// $("textarea").text(script);
			eval(script);
		}
		return field.replace(manner, "");
	}
}


function __page () {
}
__page.prototype = {
	loading:function (id,vA,callBack) {
		var vA = (vA?vA:new Object());
		vA.id = id;
		var packet = "";
		for (i in vA) packet+=(packet?",":"")+'"'+i+'":"'+vA[i]+'"';
		$.get("/tomato/page.php",$.parseJSON('{'+packet+'}'),function (result) {
			if (typeof(callBack)=="function") callBack(result);
		});
	}
}

function __versionCheck () {
	var agt = navigator.userAgent.toLowerCase();
	if (agt.indexOf("chrome") != -1) return 'Chrome'; 
	if (agt.indexOf("opera") != -1) return 'Opera'; 
	if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
	if (agt.indexOf("webtv") != -1) return 'WebTV'; 
	if (agt.indexOf("beonex") != -1) return 'Beonex'; 
	if (agt.indexOf("chimera") != -1) return 'Chimera'; 
	if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
	if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
	if (agt.indexOf("firefox") != -1) return 'Firefox'; 
	if (agt.indexOf("safari") != -1) return 'Safari'; 
	if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
	if (agt.indexOf("msie") != -1) return 'Internet Explorer'; 
	if (agt.indexOf("netscape") != -1) return 'Netscape'; 
	if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla'; 
}

function __console (id) {
	this.id = id;
	this.start();
	this.on = false;
}
__console.prototype={
	log:function (msg) {
		if (!$("#"+this.id).length) {
			// $("body").append("<div id='"+this.id+"' class='debugWindow'></div>");
			if (this.on) $("#"+this.id).addClass("show");
		}
		$("#"+this.id).append("<p>"+msg+"</p>");
	},
	start:function () {
	},
	turnOn:function () {
		this.on = true;
	}
}
var versionCheck = __versionCheck();
if (versionCheck!="Chrome") {
	// var console = new __console("debug");
	if (window.console==undefined) {console={log:function () {}}}

	// console.turnOn();
}


function __tomato_class_generator () {
}
__tomato_class_generator.prototype = {
	standby:function (opt,D) {
		//D : 기본값 묶음에서 선언된 것은 opt에서 , 선언되지 않은 것은 D에서
		// console.log(D);
		opt = opt?opt:{};
		for (var key in D) {
			// console.log(key);
			var key=key;
			(function (key,_this) {
				_this["set_"+key]=function (v) {_this[key]=v}
				_this["s_"+key]=function (v) {_this[key]=v}
				_this["get_"+key]=function () {return _this[key]}
				_this["g_"+key]=function () {return _this[key]}
			})(key,this);
			if (typeof this["set_"+key] === "function") this["set_"+key](opt[key]?opt[key]:D[key]); // D를 opt로 덮어 씌움
		}
	}
}


function __TOMATOOBJECT () {
}
__TOMATOOBJECT.prototype = {
    getopt:function (Head,A,Object) { //Object[접두사+A]=null
        for (h in Head) for (a in A) Object[Head[h]+a]=A[a];
        return Object;
    },
    standby:function (opt,D) {
        var opt = opt?opt:{};
        for (var key in D) {
            this[key] = this.getset(opt[key]!==undefined?opt[key]:D[key]);
        }
    },
    getset:function  (v,fn) { //게터 세터 + private 변수
        var V = v;
        var _fn = fn ? fn : undefined;
        return function (setV,noSync) {
            if (setV!==undefined) {
                V = setV; // set
                // console.log(_fn);
                if (_fn!==undefined && !noSync) _fn(setV);
                return V; //return 
            } else {
                return V; // get
            }
        }
    },
    setVariable:function (key,V) {
        this[key]=V;
    },
    setSync:function () {
    },
    setOutlet:function () { 
        if (!this.outlet ) return false;
        var _this = this;

        $.map(
            this.outlet(),
            function (m) { // if,fn,event,v
                // console.log(m);
                //오브젝트 고유 ID 확보
                if (!_this[m[0]])  console.log(m[0] + "라는 이름의 멤버 함수가 없음");
                if (!$(_this[m[0]]()).attr("data_tomato_id")) 
                    $(_this[m[0]]()).attr("data_tomato_id","tomato_id_"+newId());


                if (m[3] && _this[m[0]]()) { // v가 있을 때는, v의 변경 함수에 따라 if 값을 바꿔줌
                    if (!_this[m[3]]) {
                        console.log(m[3] + "라는 이름의 멤버 함수가 없음");
                    }
                    refresher.set($(_this[m[0]]()).attr("data_tomato_id")+"_"+m[2],function (e,target) {
                        var _if = $(target);
                        switch((_if.attr("type")?_if.attr("type"):_if[0].tagName).toLowerCase()) {
                            case "checkbox":
                                console.log(_if.prop("checked"));
                                 _this[m[3]](_if.prop("checked"),true);
                                break;
                            default:
                                _this[m[3]](_if.val(),true);
                                break;
                        }
                    });

                    var _if = _this[m[0]]();
                    if (_if.length>0) {
                        // console.log(_if.length);

                        // console.log(m[0]);
                        _this[m[3]] = _this.getset(_this[m[3]](),function (setV) {

                            console.log(_if.attr("type")?_if.attr("type"):_if[0].tagName);

                            switch ((_if.attr("type")?_if.attr("type"):_if[0].tagName).toLowerCase()) {
                                case "radio":
                                    var _setV = setV;
                                    $.map(_if,function (radio) {
                                        // console.log($(radio).attr("value"));
                                        if ($(radio).attr("value")==_setV) $(radio).prop("checked",true);
                                        else $(radio).prop("checked",false);
                                    });
                                    break;
                                case "checkbox":
                                    var _setV = setV;
                                    $.map(_if,function (checkbox) {
                                        // console.log("checkbox value:"+$(checkbox).attr("value"));
                                        if ($(checkbox).attr("value")==_setV || _setV===true || _setV=="on") $(checkbox).prop("checked",true);
                                        else $(checkbox).prop("checked",false);
                                    });
                                    break;
                                break;
                                case "select":
                                case "text":
                                default:
                                    _if.val(setV);
                                break;                      
                            }
                        })
                        _this[m[3]](_this[m[3]]());
                        // console.log(m[3] + ":" + _this[m[3]]());
                    }
                }

                refresher.set($(_this[m[0]]()).attr("data_tomato_id")+"_"+m[2],function (e,target) {
                    _this[m[1]](e,target);
                });

                if (_this[m[0]]()) _this[m[0]]().unbind(m[2]).bind(m[2]
                    ,function (e) {
                        refresher.execute($(_this[m[0]]()).attr("data_tomato_id")+"_"+m[2],e,this);

                    // _this[m[1]](e,this);
                    // m[1]();
                    // _this.call(m[1]);
                });
            }
        );
    },
    makeCallBack:function (total,callback) {
        var count=0;
        return function (J) {
            // console.log("cs"+count);
            if (total-1==count++) callback(J);
        };
    },
    typeOfMatching :function (F,V) { 
        return $
            .map(V,function (v) {
                return [v]})
            .reduce(function (obj,v) {
                return obj[F[typeof(v)]]=v,obj;
            },
            {});
    }
}



function __OBJECT () {  // __tomato_class_generator하고 비슷한데 , getset 쪽을 분리했고.   set -> name("sean")   get -> name() 이렇게 변경
}
__OBJECT.prototype = {
	standby:function (opt,D) {
		var opt = opt?opt:{};
		for (var key in D) {
			this[key] = TOMATOSYSTEM.getset(opt[key]!==undefined?opt[key]:D[key]);
		}
	},
	setVariable:function (key,V) {
		this[key]=V;
	},
	setOutlet:function () {
		if (!this.outlet ) return false;
		var _this = this;

		$.map(
			this.outlet(),
			function (m) {
				// console.log(m);
				if (_this[m[0]]()) _this[m[0]]().unbind(m[2]).bind(m[2],function (e) {
					_this[m[1]](e);
					// m[1]();
					// _this.call(m[1]);
				});
			}
		);
	},
	makeCallBack:function (total,callback) {
		var count=0;
		return function (J) {
			// console.log("cs"+count);
			if (total-1==count++) callback(J);
		};
	}
}

function __TOMATO_SINGLE_MODULE (opt) {
	this.standby(
		opt,
		{
			"bId":null, //tomato bId
			"Id":null
		}
	)
	// this.J = TOMATOSYSTEM.getset(new Object());
	this.setVariable("J",new Object());
	//method

	this._encodeJSON = function (html) {
		html = html.replace(/[\n\r]/g, '!@13@!');

		html = html.replace(/\<\[\[{/gi,'');
		html = html.replace(/}\]\]\>/gi,'');

		html = html.replace(/\[{/gi,'!@93123@!');
		html = html.replace(/}\]/gi,'!@12393@!');

		html = html.replace(/[\{]/gi, '!@123@!');
		html = html.replace(/[\}]/gi, '!@125@!');
		html = html.replace(/[\]]/gi, '!@91@!');
		html = html.replace(/[\[]/gi, '!@93@!');
		html = html.replace(/\t/g, '');
		return html;
	}
	this.encode = function (html) {
		var html = "<["+html+"]>";
		html = this._encodeJSON(html);
		html = "[{"+html+"}]";
		// console.log("encode result : "+html);
		return $.parseJSON(html);
	}
}
__TOMATO_SINGLE_MODULE.prototype = new __OBJECT ();
__TOMATO_SINGLE_MODULE.prototype.getJ = function () {
	this.J.method = "api";
	this.J.noMessage = "0";
	// this.J.noMessage = this.noMessage.get();
	return this.J;
}
__TOMATO_SINGLE_MODULE.prototype.save = function () { // ( packet || callback || packet,callback )
	var ARGS = TOMATOSYSTEM.typeOfMatching({"object":"packet","function":"callback"},arguments);
	ARGS.packet?this.setVariable("J",ARGS.packet):false;
	// if (!this.J.length||!this.Id.get()) return false;
	$.post("/"+this.bId()+"/mod:save/"+this.Id(),this.getJ(),function (J) {
		if (ARGS.callback) ARGS.callback($.parseJSON(J));
	})
}
__TOMATO_SINGLE_MODULE.prototype.load = function () { // (id || callback || id,callback)
	var ARGS = TOMATOSYSTEM.typeOfMatching({"string":"Id","function":"callback"},arguments);
	ARGS.Id?this.Id(ARGS.Id):(this.Id()?this.Id():false);
	if (!this.Id()) return false;
	var _this = this;
	$.getJSON("/"+this.bId()+"/view.jsonRaw/"+this.Id(),this.getJ(),function (J) {
		_this.setVariable("J",J[0]);
		if (ARGS.callback) ARGS.callback(J);
	})
}
__TOMATO_SINGLE_MODULE.prototype.display = function () { // (id || callback || id,callback)
	var ARGS = TOMATOSYSTEM.typeOfMatching({"string":"Id","function":"callback"},arguments);
	ARGS.Id?this.Id(ARGS.Id):(this.Id()?this.Id():false);
	if (!this.Id()) return false;
	var _this = this;
	$.getJSON("/"+this.bId()+"/view.json/"+this.Id(),this.getJ(),function (J) {
		_this.setVariable("J",J[0]);
		if (ARGS.callback) ARGS.callback(J);
	})
}
__TOMATO_SINGLE_MODULE.prototype.new = function () {
	var ARGS = TOMATOSYSTEM.typeOfMatching({"function":"callback"},arguments);
	var _this = this;
	// this.J.slideShowId=1;

	$.post("/"+this.bId()+"/insert:save/",this.getJ(),function (J) {
		var J = $.parseJSON(J);
		_this.Id(J.id)
		_this.J = {};
		if (ARGS.callback) ARGS.callback(J?J:null);
	})

	// $.get("/"+this.bId()+"/insert.json",function (J) {
	// 	_this.Id(_this.encode(J)[0].Id);
	// 	$.post("/"+_this.bId()+"/insert:save/"+_this.Id(),_this.getJ(),function (J) {
	// 		if (ARGS.callback) ARGS.callback(J?$.parseJSON(J):null);
	// 	})
	// })
}
__TOMATO_SINGLE_MODULE.prototype.del = function () {
	var _this = this;
	var ARGS = TOMATOSYSTEM.typeOfMatching({"string":"Id","function":"callback"},arguments);
	ARGS.Id?this.Id(ARGS.Id):false;
	if (!this.Id()) return false;
	$.post("/"+this.bId()+"/del:save/"+this.Id(),this.getJ(),function (J) {
		_this.Id(null);
		_this.J={};
		if (ARGS.callback) ARGS.callback($.parseJSON(J));
	})
}

__TOMATO_SINGLE_MODULE.prototype.list = function () { // (id || callback || id,callback)
	var ARGS = TOMATOSYSTEM.typeOfMatching({"object":"search","function":"callback"},arguments);
	var _this = this;
	$.getJSON("/"+this.bId()+"/list.json/",(ARGS.search?ARGS.search:null),function (J) {
		// _this.setVariable("J",J);
		// console.log(_this.J);
		if (ARGS.callback) ARGS.callback(J);
	})
}






function __tomato (opt) {
	this.standby(
		opt,
		{
			"bId":null, //tomato bId
			"method":"api", //tomato
			"noMessage":"true", //tomato save JSON
			"J":null // send Packet Data
		}
	)
}
tomato.prototype = new __tomato_class_generator ();
tomato.prototype.save = function (callback) {
	$.post("/"+this.get_bId()+"/"+this.get_mode()+":save"+(this.get_J().Id?"/"+this.get_J().Id:""),this.get_J(),function (J) {
		if (typeof(callBack)=="function") callBack(J);
	})
}


/// tomatojs
//향후 inline.js가 tomato.js를 사용하도록 변경 필요, 및 reference류도 tomatojs로 통합 필요

function __tomato (bId) {
	this._bId = bId;
	this._method="api";
	this._noMessage="true";
	this._packet = "";

	this.setbId = function (bId) {
		this._bId = bId;
	}
	this._makePacket = function (vA) {
		this._vA = (vA?vA:new Object());;
		// this._vA._bId = this._bId;
		this._vA.method = this._method;
		this._vA.noMessage = this._noMessage;
		this._packet = "";
		// console.log (vA);
		for (i in vA) {
			if (this._packet) this._packet+=",";
			this._packet+='"'+i+'":"'+(vA[i]?vA[i].toString().replaceAll('"','\\'+'"'):'')+'"';
		}
		this._packet = '{'+this._packet+'}';
		// console.log("packet");
		// console.log(this._packet);

		return $.parseJSON(this._packet);
	}

	this.save = function (packet,callBack) {
		console.log(packet);
		var mode = packet._mode;
		packet._mode = null;
		$.post("/"+this._bId+"/"+mode+":save"+(packet._id?"/"+packet._id:""),packet,function (result) {
			if (typeof(callBack)=="function") callBack(result);
		})
	}
	this.load = function (packet,callBack) {
		// console.log(packet);
		var mode = (packet._mode?packet._mode:"list");
		packet._mode = null;
		$.get("/"+this._bId+"/"+mode+".json"+(mode=="list"&&packet.page?"/"+packet.page:""),packet,function (result) {
			// console.log("result:"+result);
			if (typeof(callBack)=="function") callBack(result);
		})
	}
	this.list = function (search,callBack) {
		this.search = (search?search:new Object());
		this.search._mode = "list";
		this.load(this._makePacket(this.search),callBack);
	}
	this.view = function (id,callBack) {
		this.vA = new Object();
		this.vA.id = id;
		this.vA._mode = "view";
		// console.log(this.vA);
		this.load(this._makePacket(this.vA),callBack);
	}
	this.insert = function (callBack) {
		this.vA = new Object();
		this.vA._mode = "insert";
		this.load(this._makePacket(this.vA),callBack);
	}
	this.insertAc = function (vA,callBack) {
		this.vA = (vA?vA:new Object());
		this.vA._mode = "insert";
		console.log(this.vA);
		// console.log(callBack);
		this.save(this._makePacket(this.vA),callBack);
	}
	this.ans = function (id,vA,callBack) {
		// this.vA = (vA?vA:new Object());
		// this.vA._mode = "ans";
		// this.vA._parent = id;
		// this.save(this._makePacket(this.vA),callBack);
	}
	this.ansAc = function (id,vA,callBack) {
		// this.vA = (vA?vA:new Object());
		// this.vA._mode = "ans";
		// this.vA._parent = id;
		// this.save(this._makePacket(this.vA),callBack);
	}
	this.del = function (id,callBack) {
		this.save(this._makePacket({"_id":id,"_mode":"del"}),callBack);
	}
	this.mod = function (id,callBack) {
		this.vA = new Object();
		this.vA.mode = "mod";
		this.vA.id = id;
		this.load(this._makePacket(this.vA),callBack);
	}
	this.modAc = function (id,vA,callBack) {
		this.vA = (vA?vA:new Object());
		this.vA._mode = "mod";
		this.vA._id = id;
		console.log(this.vA);
		this.save(this._makePacket(this.vA),callBack);
	}
	this._encodeJSON = function (html) {
		html = html.replace(/[\n\r]/g, '!@13@!');

		html = html.replace(/\<\[\[{/gi,'');
		html = html.replace(/}\]\]\>/gi,'');

		html = html.replace(/\[{/gi,'!@93123@!');
		html = html.replace(/}\]/gi,'!@12393@!');

		html = html.replace(/[\{]/gi, '!@123@!');
		html = html.replace(/[\}]/gi, '!@125@!');
		html = html.replace(/[\]]/gi, '!@91@!');
		html = html.replace(/[\[]/gi, '!@93@!');
		html = html.replace(/\t/g, '');
		return html;
	}
	this._decodeJSON = function (html) {
	 	html = html.replaceAll("!@13@!","\n\r");

	 	html = html.replaceAll("!@93123@!","[{");
	 	html = html.replaceAll("!@12393@!","}]");

	 	html = html.replaceAll("!@123@!","{");
	 	html = html.replaceAll("!@125@!","}");

	 	html = html.replaceAll("!@91@!","]");
	 	html = html.replaceAll("!@93@!","[");
		return html;
	}
	this.encode = function (html) {
		var html = "<["+html+"]>";
		html = this._encodeJSON(html);
		html = "[{"+html+"}]";
		// console.log("encode result : "+html);
		return $.parseJSON(html);
	}
	this.decode = function (element) {
		var field = this._decodeJSON(element);
		var manner = /<script>(.*?)<\/script>/gi;
		script = manner.exec(field);
		if (script!=null) {
			script = script[0];
			script = script.replaceAll("<script>","");
			script = script.replaceAll("</script>","");
			//alert (script);
			// $("textarea").text(script);
			eval(script);
		}
		return field.replace(manner, "");
	}
}




function __TOMATOTAB (opt) {
	this.standby(opt,{
		if_tomatoTab:null,
		on:"on",
		outlet:[
			["if_tomatoTab","fn_tomatoTab","click"]
		]
	});
	this.setOutlet();
	this.start();
}
__TOMATOTAB.prototype = new __TOMATOOBJECT();
__TOMATOTAB.prototype.start = function () {
	var _this = this;
	$(this.if_tomatoTab()).filter("."+this.on()).each(function () {
		_this.fn_selectThis(this);
	})
}
__TOMATOTAB.prototype.fn_tomatoTab = function (e,t) {
	$(t).parent().find(".tomatoTab[data-target="+$(t).attr("data-target")+"]").removeClass(this.on());
	$(t).addClass(this.on());
	this.fn_selectThis(t);
}
__TOMATOTAB.prototype.fn_selectThis = function (target) {
	$("."+$(target).attr("data-target")).removeClass(this.on());
	if ($(target).hasClass(this.on())) 
		$("."+$(target).attr("data-target")+"[data-num="+$(target).attr("data-num")+"]").addClass(this.on());
}
function __TOMATOTIP (opt) {
	this.standby(opt,{
		if_tomatoTip:null,
		outlet:[
			["if_tomatoTip","fn_tomatoTipOn","mouseover"],
			["if_tomatoTip","fn_tomatoTipOff","mouseout"]
		]
	})
}
__TOMATOTIP.prototype = new __TOMATOOBJECT();
__TOMATOTIP.prototype.fn_tomatoTipOn =function (e,t) {

}
__TOMATOTIP.prototype.fn_tomatoTipOff =function (e,t) {

}
var TOMATOTAB;
// var TOMATOTIP;
$(function () {
	TOMATOTAB = new __TOMATOTAB({
		if_tomatoTab:$(".tomatoTab"),
		on:"on"
	});
})


function __UDZ_UPLOAD (opt) {
	this.standby(opt,{
		if_button:null,
		if_upload:null,
		dom_upload:'<input type="file" multiple>',
		fn_callback:null,
		v_defaultFormData:null,
		v_uploadUrl:null,
		v_maxFile:30,
		v_uploadParameterName:null,
		outlet:[
			["if_button","fn_click","click"],
			["if_upload","fn_upload","change"]
		]
	});
	this.fn_start();
};
__UDZ_UPLOAD.prototype = new __TOMATOOBJECT();
__UDZ_UPLOAD.prototype.fn_start = function () {
	this.if_button().after(
		this.if_upload(
			$(this.dom_upload()).hide()
		)
	);
	this.setOutlet();
};
__UDZ_UPLOAD.prototype.fn_click = function () {
	this.if_upload().trigger("click");
};
__UDZ_UPLOAD.prototype.fn_upload = function (e,u) {
	var _this = this;
	var _u = u;
	if (u.files.length>this.v_maxFile()) return alert("업로드 개수는 최대 "+this.v_maxFile()+"개를 초과 할 수 없습니다");
	var cb = this.makeCallBack(u.files.length,function (data) {
		if (_this.fn_callback()) _this.fn_callback()(data);
	});
	$.map(u.files,function (files) {
		var _files = files;
		$.ajax({
			url:_this.v_uploadUrl(),
			type:"POST",
			contentType:false,
			processData:false,
			cache:false,
			data:(function () {
				var fd = new FormData();
				// fd.append("__identify","udz.js");
				// fd.append("parameterName",_this.v_uploadParameterName());
				for (var k in _this.v_defaultFormData()) {
					// console.log(console.log(k)+":"+_this.v_defaultFormData()[k].id+":"+_this.v_defaultFormData()[k].msg);
					fd.append(k,_this.v_defaultFormData()[k]);
				};
				fd.append(_this.v_uploadParameterName(),_files);
				console.log(fd);
				// return false;
				return fd;
			})(),
			success:function (data) {
				cb(data);
			}
		});
	});
};



function __UDZ_MODAL (opt) {
	this.standby(opt,{
		dom_modal:'<div class="modal modal-insert arsAlarm" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">{title}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div></div></div>',
		if_modal:null,
		if_body:$("body"),
	});
}
__UDZ_MODAL.prototype = new __TOMATOOBJECT();
__UDZ_MODAL.prototype.fn_open = function (title,url,callback) {
	console.log(title,url,callback);
	this.if_modal($(this.dom_modal().replace("{title}",title)));
	this.if_body().prepend(this.if_modal());
	var _callback = callback;
	var _this = this;
	this.if_modal().find(".modal-body").load(url,function (html) {
		_this.if_modal().modal("show");
		if (_callback) _callback(html);
	});
}

var UDZ_MODAL;
$(function () {
	UDZ_MODAL = new __UDZ_MODAL();
})

function findNearestByClass (t,className,opt,maxCall) {
	var maxCall = maxCall?maxCall:10; 
	console.log(maxCall);
	if (maxCall<=1) return false;
	if (!t || !className) return false;
	if (!$(t).parent()) return false;
	var result = $(t).parent().find("."+className+(opt?opt:""));
	if (result.length>0) return result[0];
	return findNearestByClass($(t).parent(),className,opt,maxCall-1);
}


function attrParsing(text,attr) {
  if (typeof attr!=='object') return attr;
  var text = text;
  var _attr = attr;

  if (attr.constructor == Array) return attr.reduce(function (html,a) {
    return html+attrParsing(text,a);
  },"");
  // console.log(attr);
  return Object.keys(attr).reduce(function (text,k) {
    if (text.indexOf('{'+k+'}')!=-1) {
        // console.log(text,k,text.indexOf('{'+k+'}'));
        return text.replaceAll('{'+k+'}',attrParsing('',_attr[k]));
    }
    text+=text?' ':'';
    if (Array.isArray(_attr[k])) {
      if (Number.isInteger(k)) {
        console.log('error: key가 문자열이면 하위 데이터가 array여야 합니다. 시스템 관리자에 문의하세요.');
        return false;
      }
      return text;
      //return text+=k+'="'+attrParsing("",attr[k])+'"';
    } else {
      return text;
      //if (Number.isInteger(k)) return text+=_attr[k]
      // else return text+=k+'="'+_attr[k]+'"';
    }
  },text);
}
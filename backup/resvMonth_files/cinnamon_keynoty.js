function strip_tags (input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}


/*      테이블 상단 바 클릭 정렬       */
var _realUrl = location.href;


function __sortAndSearch () {
	this.sortUnitTimer = false;
	this.cinnamon_default;
	this.loadingTimer = false;
	this._autoSearchTimer = false;
	this.start();
	this.noHash = false;
}
__sortAndSearch.prototype = {
	start:function () {
		this.hashUpdate();
		this.setListHeadSearch();
		this.setAutoSearch();
		this.setDenimPageSlider();
	},
	setListHeadSearch:function  () {
		var _this = this;
		$(".headSearch").each(function () {
			$search = $(this).find("th");

			$search.find(".search").each(function () {
				if (!$(this).attr("id")) $(this).attr("id",newId());
				$(this).attr('callback','tableSortSearch.auto');
				// $(this).attr('callback','tableSortSearch.auto("'+$(this).attr("id")+'","search");');
			}).unbind("change").bind("change",function () {
				clearTimeout(_this._autoSearchTimer);
				// if ($(this).attr("callback")) _this._autoSearchTimer = setTimeout(($(this).attr("callback")),1000);
				if ($(this).attr("callback")=='tableSortSearch.auto') _this._autoSearchTimer = setTimeout((function (_this) {tableSortSearch.auto(_this);})($(this)),50);
			}).unbind("keyup").bind("keyup",function () {
				clearTimeout(_this._autoSearchTimer);
				// if ($(this).attr("callback")=='tableSortSearch.auto') _this._autoSearchTimer = setTimeout((function (_this) {tableSortSearch.auto(_this);})($(this)),1000);
				// if ($(this).attr("callback")) _this._autoSearchTimer = setTimeout(($(this).attr("callback")),1000);
			})
		});
	},
	setAutoSearch:function () {
		var _this = this;
		$(window.parent).bind("hashchange",function () {
			if (cacher.get("hashUpdated")) return false;
			_this.hashUpdate();
		})

		$(".cinnamon_search").each(function () {
			$search = $(this).find(".searchElementGroup");

			$search.children(".searchElement").children(".field").find(".search").each(function () {
				if (!$(this).attr("id")) $(this).attr("id",newId());
				$(this).attr('callback','tableSortSearch.auto');
				// $(this).attr('callback','tableSortSearch.auto("'+$(this).attr("id")+'","search");');
			}).unbind("change").bind("change",function () {
				clearTimeout(_this._autoSearchTimer);
				var $this = $(this);
				if ($(this).attr("callback")=='tableSortSearch.auto') _this._autoSearchTimer = setTimeout((function (_this) {tableSortSearch.auto(_this);})($(this)),50);
				// if ($(this).attr("callback")) _this._autoSearchTimer = setTimeout(($(this).attr("callback")),50);
			}).unbind("keyup").bind("keyup",function () {
				return false;
				clearTimeout(_this._autoSearchTimer);
				var $this = $(this);
				if ($(this).attr("callback")=='tableSortSearch.auto') _this._autoSearchTimer = setTimeout((function (_this) {tableSortSearch.auto(_this);})($(this)),1000);
				// if ($this.attr("callback")) _this._autoSearchTimer = setTimeout(function () {$this.attr("callback")},1000);
			});
			$search.children(".searchElement").children(".field").find(".search[type=checkbox]").click(function () {
				clearTimeout(_this._autoSearchTimer);
				var $this = $(this);
				if ($(this).attr("callback")=='tableSortSearch.auto') _this._autoSearchTimer = setTimeout((function (_this) {tableSortSearch.auto(_this);})($(this)),1000);
				// if ($(this).attr("callback")) _this._autoSearchTimer = setTimeout(($(this).attr("callback")),1000);

			})
		});
		refresher.set("tableSortSearch.auto",function (_this) {
			tableSortSearch.auto(_this);
		});

		var hash = parent.location.hash;
		if (!hash) {
			var parameterA = hasher.parsingParameter();
			$cinnamon_default= $(".cinnamon_table[bId="+parameterA["bId"]+"]").closest(".cinnamon_default");
			if ($cinnamon_default.length==1) {
				var packet = new Object();
				cacher.set("autoChange_"+newId(),"autoChange_"+_this.jsonToUrl(packet),$(".cinnamon_default").html());
			}
		}

	},
	sortUnit:function (target) {
		if (!target) return false;
		var _this = this;
		var $th = $(target).closest("th");
		if (!$(target).attr("Id")) $(target).attr("Id",newId());

		var p = $th.offset();
		// console.log("p위치"+p.left);
		var width = $th.outerWidth();
		var height = $th.outerHeight();
		// console.log("width",width);
		var minCenterHeight = 25;
		if ($(".orderUnit_"+$(target).attr("Id")).length) {
			$(".orderUnit_"+$(target).attr("Id")).remove();
			return false;
		}
		if ($(".orderUnit").length) {
			$(".orderUnit").remove();
		}
		$("body").append("<div class='orderUnit asc orderUnit_"+$(target).attr("Id")+"'><a href='#' class='asc "+($th.attr("sort")=="asc"?"selected":"")+"' onClick='tableSortSearch.sortUnitResort(\""+$(target).attr("Id")+"\",\""+$(target).attr("order")+" \",\"asc\");return false;'>"+$(target).attr("ascText")+"</a><a href='#' onClick='tableSortSearch.sortUnitResort(\""+$(target).attr("Id")+"\",\""+$(target).attr("order")+" \",\"desc\");return false;' class='desc "+($th.attr("sort")=="desc"?"selected":"")+"'>"+$(target).attr("descText")+"</a><a href='#' onClick='tableSortSearch.sortUnitResort(\""+$(target).attr("Id")+"\",\""+$(target).attr("order")+" \",\"none\");return false;' class='cancel'>정렬 안함</a></div>");

		$(".orderUnit").width(width+1).css("left",p.left).css("top",p.top).show();
		$(".orderUnit").click(function () {
			$(this).remove();
		}).mouseover(function () {
			clearTimeout(_this.sortUnitTimer);
		}).mouseout(function () {
			var t = $(this);
			_this.sortUnitTimer = setTimeout(function () {t.remove();},1000);
		});

	},
	sortUnitResort:function (target,order,sort) {
		console.log(target+":"+order+":"+sort);
		if (!target) return false;
		var $target = $("#"+target);
		var $tr = $target.closest("tr");
		var $th = $target.closest("th");
		if ($th.hasClass("sort")&&sort!="none") {
			$th.removeClass(sort=="desc"?"asc":"desc").addClass(sort).attr("sort",sort);
		} else {
			var i = 3;
			var n = 0;
			var foundId = 0;
			if (sort=="none") {
				var orderCount = $th.attr("orderCount");
				this.sortUnitRemove($th)//.removeClass("sort").removeClass("sort1").removeClass("sort2").removeClass("sort3").removeClass("desc").removeClass("asc").attr("orderCount",0).attr("sort","").attr("order","");

			}
			while (i--) {
				n = i-i*2+3;
				if (sort=="none"&&n>orderCount) {
					// console.log("none");
					$tr.children("th.sort"+n).removeClass("sort"+n).addClass("sort"+(n-1)).attr("orderCount",(n-1));
				} else if (sort!="none"&&(!$tr.children(".sort"+n).length||n==3)) {
					this.sortUnitAdd ($th,n,$target.attr("order"),sort);
					// $tr.children(".sort"+n).removeClass("sort").removeClass("sort"+n).removeClass("desc").removeClass("asc");
					// $th.attr("order",$target.attr("order")).attr("sort",sort).addClass("sort"+n).addClass("sort").addClass(sort).attr("orderCount",n);
					i=0;
				}
			}

		}
		this.auto($target,"sort");
	},
	sortUnitAdd:function (th,n,order,sort) {
		var $th = $(th);
		var $tr = $th.closest("tr");
		$tr.children(".sort"+n).removeClass("sort").removeClass("sort"+n).removeClass("desc").removeClass("asc");
		$th.attr("order",order).attr("sort",sort).addClass("sort"+n).addClass("sort").addClass(sort).attr("orderCount",n);
	},
	sortUnitRemove:function (th) {
		var $th = $(th);
		$th.removeClass("sort").removeClass("sort1").removeClass("sort2").removeClass("sort3").removeClass("desc").removeClass("asc").attr("orderCount",0).attr("sort","").attr("order","");
	},
	loadPacket:function (cinnamon_default,packet,type) {
		var packet = packet?packet:new Object();
		if (type.indexOf("page")>=0) {
			var page = $(cinnamon_default).find(".cinnamon_page").attr("page");
			if (!page) page = $(cinnamon_default).find(".cinnamon_table").attr("page");
			// var page2 = $(cinnamon_default).find(".cinnamon_table").attr("page2");
			packet.page = (page?page:1);
			// packet.page2 = (page2?page2:page);
		}
		if (!packet._____order) packet._____order=-3;
		if (type.indexOf("sort")>=0) {
			// console.log("sort");
			$tr = $(cinnamon_default).find(".cinnamon_contents").find(".cinnamon_table").children("thead").children("tr");
			var i = 3;
			var n = 0;
			while (i--) {
				n = i - i*2 +3;
				if ($tr.children("th.sort"+n).length) {
					packet['order'+(n==1?"":n)] = $tr.children("th.sort"+n).attr("order");
					packet['sort'+(n==1?"":n)] = $tr.children("th.sort"+n).attr("sort");
				}
			}
			if (!packet) packet.no_order="no_order";//return '"no_order":"no_order"';
		}
		if (type.indexOf("search")>=0) {
			var $search = $(cinnamon_default).find(".cinnamon_search");
			if (!$search.length) $search = $(cinnamon_default).find("tr.headSearch");
			$search.find("[tomato=true]").not(".default").each(function () {
				var name = $(this).attr("name");
				// console.log("loadSearchPacket."+name);
				if (($(this).attr("type")!="checkbox"||$(this).prop("checked"))&&!$(this).hasClass("default"))
				var val = $(this).val();
				if (name&&val) packet[name] = val;
			});
			if (!packet) packet.search='no';//packet = '"search":"no"';
		}
		return packet;
	},
	movePage:function (target,direction) {
		var direction = direction?direction:1;
		var $cinnamon_default = $(target).closest(".cinnamon_default");
		var page = $cinnamon_default.find(".cinnamon_page").attr("page");
		if (!page) page = $cinnamon_default.find(".cinnamon_table").attr("page")*1;
		var pageC = $cinnamon_default.find(".cinnamon_table").attr("pageC");
		if (direction==1&&page>=pageC||direction==-1&&page<=1) return false;
		var packet = this.loadPacket($cinnamon_default,new Object,["search","sort"]);
		packet.page = page+direction;
		this.autoChange ($cinnamon_default,packet);
		return false;
	},
	setDenimPageSlider:function () {
		var _this = this;
		$(".denim_pageSlider").map(function (o,slider) {
			var $cinnamon_default = $(slider).closest(".cinnamon_default");
			var table = $cinnamon_default.find(".cinnamon_table");
			var page = table.attr("page")*1;
			var pageC = table.attr("pageC")*1;
			if (!pageC || !page || pageC==1) {
				$cinnamon_default.removeClass("cinnamon_default_pageSlider");
				return false;
			}
			var handle = $("<div class='ui-slider-handle'><b>"+page+"</b>"+pageC+"</div>");
			handle.appendTo(slider);
			$(slider)
			.css("max-width",pageC*30)
			.slider({
				animate:"fast",
				min:1,
				max:pageC,
				values:page,
				slide: function( event, ui ) {
					handle.html("<b>"+ui.value+"</b>"+$(this).slider("option","max"));
					// handle.children("b").text(ui.value);
					// console.log(ui.value);
					// _this.openPage(this,ui.value);
				},
				change:function (e,ui) {
					handle.html("<b>"+ui.value+"</b>"+$(this).slider("option","max"));
					_this.openPage(this,ui.value);

				}
			});
		});
	},
	openPage:function (target,page) {
		// var direction = direction?direction:1;
		// console.log(page);
		var $cinnamon_default = $(target).closest(".cinnamon_default");
		// var page = $cinnamon_default.find(".cinnamon_page").attr("page");
		if (!page) page = $cinnamon_default.find(".cinnamon_table").attr("page")*1;
		var pageC = $cinnamon_default.find(".cinnamon_table").attr("pageC");
		// if (direction==1&&page>=pageC||direction==-1&&page<=1) return false;
		var packet = this.loadPacket($cinnamon_default,new Object,["search","sort"]);
		packet.page = page;
		this.autoChange ($cinnamon_default,packet);
		return false;
	},
	auto:function (target,type,callback) {
		if (!target) return false;
		// console.log(target);
		// console.log("auto:"+type);
		var $cinnamon_default = (type=="search"?$("#"+target).closest(".cinnamon_default"):$(target).closest(".cinnamon_default"));
		// console.log($cinnamon_default);
		var packet = this.loadPacket($cinnamon_default,new Object,(type=="sort"?["search","sort","page"]:["search","sort"]));
		if (type=="page") packet.page = $(target).parent().attr("num");
		// console.log(packet);
		this.autoChange ($cinnamon_default,packet,callback);
	},
	jsonToUrl:function  (packet) {
		var url = "";
		for (p in packet) url+= (p!='bId'?(url?"&":"")+p+"="+packet[p]:'');
			return url;
	},
	autoChange:function (cinnamon_default,packet,callback) {
		var mode = $(cinnamon_default).hasClass("mode_list")?"list":($(cinnamon_default).hasClass("mode_inline")?"inline":($(cinnamon_default).hasClass("mode_realtime")?"realtime":""));
		var $table = $(cinnamon_default).find(".cinnamon_contents").find("table");

		var html = false;
		var _this = this;
		var _callback = callback;

		clearTimeout (this.loadingTimer);

		if (html) this.autoChange_setHtml (cinnamon_default,html);
		else {
			this.loadingTimer = setTimeout('showLoading();',500);
			// alert ("load");
			var bId = $(cinnamon_default).find(".cinnamon_contents").find(".cinnamon_table").attr("bIdentity");
			var url = '/'+bId+"/"+mode+"/"+(packet.page?packet.page:1);
			delete packet.page;
			$.get(url,packet,function (html) {
				
				delete packet._____order;
				var newurl = url+"?"+Object.keys(packet).reduce(function (param,k) {
					return param + (param ? "&" : "") + k +"="+packet[k];
				},"");
				if (!$table.hasClass("nohash")) history.pushState(null, null, newurl);
				// console.log (html);
				clearTimeout (_this.loadingTimer);
				closeLoading();
				cacher.set("autoChange_"+newId(),"autoChange_"+url,$(html).find(".cinnamon_default").html());
				_this.autoChange_setHtml (cinnamon_default,html);
				if (_callback) callback();
			})
		}

	},
	autoChange_setHtml:function (cinnamon_default,html) {
		// console.log("autoChange_setHtml run");
		var $table = $(cinnamon_default).find(".cinnamon_contents").find("table");
		$table.removeClass("thead_fix");

		if ($(html).find(".cinnamon_table").children("tbody").children("tr").length) {
			$table.children("tbody").html($(html).find(".cinnamon_table").children("tbody").html());
			// console.log("loaded Html:"+$(html).find(".cinnamon_table").children("tbody").html());
		} else {
			$table.children("tbody").html("<tr height='200'><td align='center' colspan='"+$table.children("thead").children("tr:first-child").children("th").length+"'>검색 결과가 없습니다</td></tr>");
		}

		if ($(cinnamon_default).hasClass("mode_inline")) {
			INLINE.setInline();
			INLINE.loadInsert(null,3);
		}
		// console.log($(html).find("h4").html());
		$(cinnamon_default).find(".cinnamon_head").children("h4").html($(html).find("h4").html());

		var page = $(html).find(".cinnamon_table").attr("page");
		var pageC = $(html).find(".cinnamon_table").attr("pageC");

		$table.attr("page",page);

		$table.attr("pageC",pageC);

		if (page!=$(cinnamon_default).find(".denim_pageSlider").slider("value")*1)
			$(cinnamon_default).find(".denim_pageSlider").slider("value",page);

		if (pageC!=$(cinnamon_default).find(".denim_pageSlider").slider("option","max")*1)
			$(cinnamon_default).find(".denim_pageSlider").slider("option","max",pageC);


		var $newPage = $(html).find(".cinnamon_page");
		$(cinnamon_default).find(".cinnamon_page").html($newPage.html()).attr("total",$newPage.attr("total")).attr("page",$newPage.attr("page"));


		var ret = $(html).find(".cinnamon_table").not(".nohash").attr("hash");
		if (!this.noHash&&ret)
			hasher.set(ret); //현재 해쉬가 있으면 무조건 해쉬 업데이트 해줌

		refresher.execute("autoSearch",$table);
	},
	hashUpdate:function () {  // 해쉬가 변경되면, 주소를 불러옴
		var oldAddress = cacher.get("oldAddress");
		// console.log("oldAddress:"+oldAddress);
		if (oldAddress) {
			var A = hasher.parsingParameter(oldAddress);
			for (var i in A) $("#"+i+"[tomato=true]").val(null);
		}
		var hashed = hasher.get();

		if (hashed) showLoading();
		var _this = this;
		hasher.searchHash(hashed,function (address) {

			var A = hasher.parsingParameter(address);
			// console.log(address+"->");
			// console.log(A);

			var bIdentity = A['_host'][0].split(".")[0];
			var bId = (A["bId"]?A["bId"]:bIdentity);
			if (!bId) return false;
			if ($(".cinnamon_table[bIdentity="+bId+"]").hasClass("nohash")) return false;
			var $tr = $(".cinnamon_table[bIdentity="+bId+"] thead tr:first-child");

			for (var i in A) if (i) {
				if ($("#"+i+"[tomato=true]").attr("type")=="checkbox"&&A[i]) $("#"+i+"[tomato=true]").prop("checked",true);
				// console.log(decodeURI(A[i]));

				if (typeof A[i]=="string") A[i] = A[i].replaceAll("%2F","/");
				// console.log(decodeURI(decodeURI(A[i])));
				// console.log(decodeURI(V));
				if ($("#"+i+"[tomato=true]").attr("data-fieldType")=='referenceS') {
					var iC = i;
					var v = A[i];
					$.getJSON($("#"+i+"[tomato=true]").parent().find(".field_interface").attr("data-url"),{term:decodeURI(A[i]),obvious:true},function (data) {
						$("#"+iC+"[tomato=true]").parent().find(".field_interface").val(data[0].label).removeClass("default");
					})
				}

				$("#"+i+"[tomato=true]").val(decodeURI(A[i]));
			}
				// console.log("A");

			var i=3;

			// console.log ("page"+A["page"]);
			var page = (A['_host'][1]=="list"&&A['_host'][2])?A['_host'][2]:1;
			// console.log("page"+page);

			$(".cinnamon_table[bIdentity="+bId+"]").attr("page",page);
			// $(".cinnamon_table[bIdentity="+bId+"]").attr("page2",A["page2"]?A["page2"]:A["page"]);A["page2"];
			// console.log("page2:"+A["page2"]);
			if ($tr.length) while (i--) {
				var n = (i?(i+1):"");
				if (!A["order"+n]) continue;
				_this.sortUnitRemove ($tr.children("th.sort"+(i+1)));

				var tr = String("th"+A["order"+n]+"");
			}
			i=3;while(i--) {
				var n = (i?(i+1):"");
				var _tempOrder = A["order"+n];
				var _tempSort = A["sort"+n];
				if (_tempOrder) $(".cinnamon_table[bIdentity="+bId+"] thead tr:first-child th."+_tempOrder).attr("order",_tempOrder).attr("sort",_tempSort).addClass("sort"+(i+1)).addClass("sort").addClass(_tempSort).attr("orderCount",i+1);
			}
			TOMATOFIELD.textBoxSetting();

			// console.log("hashUpdate run");
			// console.log("현재 주소:"+hasher.getAddress());
			// console.log("현재 해쉬:"+hasher.getCurrent());
			// console.log("이전 주소:"+cacher.get("oldAddress"));
			// console.log("이전 해쉬:"+cacher.get("oldHash"));

			var c = (hasher.getAddress()?"1":"0")+""+(hasher.getCurrent()?"1":"0")+""+(cacher.get("oldAddress")?"1":"0")+""+(cacher.get("oldHash")?"1":"0");
			// console.log("c:"+c);

			// 1100 : hash 1 // 현재 해쉬 있음
			// 1011 : hash 2 // 뒤로 왔는데, 첫 페이지
			// 1010 : hash 3 // 검색
			// 100n : hash 4 // 첫 페이지
			var _hash = $(".cinnamon_table[bIdentity="+bId+"]:first-child").attr("hash");
			if 	(!hasher.getCurrent() && !cacher.get("oldAddress") && $(window.parent.mainframe).length) {
				// console.log("새 페이지");
				hasher.set(_hash);
				return false;
			}else if (!hasher.getCurrent() && !cacher.get("oldAddress") && !$(window.parent.mainframe).length) {
				cacher.set("oldAddress","oldAddress",hasher.getAddress());
				return false; //첫 페이지이고(hash 4) 상위 프레임 없으므로 검색 처리는 안함
			}


			$cinnamon_default= $(".cinnamon_table[bIdentity="+bId+"]").closest(".cinnamon_default");
			if ($cinnamon_default.length==1) {
				// console.log("hashupdate call autoChange");
				// autoChange ($cinnamon_default,loadSearchPacket($cinnamon_default));
				var packet = _this.loadPacket($cinnamon_default,new Object,["search","page","sort"]);
				_this.autoChange ($cinnamon_default,packet);

			}
		});
	}


}

var tableSortSearch = false;
refresher.set("onload",function () {tableSortSearch = new __sortAndSearch();})


function __CINNAMON () {
	this.start();
}
__CINNAMON.prototype = {
	_generatorOutputFunction:function (optionName) {

		return function (bId) {
			TOMATOSYSTEM[optionName](
				bId,
				tableSortSearch.jsonToUrl(
					tableSortSearch.loadPacket(
						($("table[bIdentity="+bId+"]").length?$("table[bIdentity="+bId+"]"):$("table[bId="+bId+"]"))
							.closest(".cinnamon_default")
						,(optionName=='bSkinPrint'?{"_____order":"-1"}:new Object)
						,["","search","sort"]
					)
				)
			);
		}
	},
	start:function () {
		this.excel = this._generatorOutputFunction("excel");
		this.print = this._generatorOutputFunction("print");
		this.bSkinPrint = this._generatorOutputFunction("bSkinPrint");
		this.printOp = this._generatorOutputFunction("printOp");
	}
	// excel:function (bId) {
	// 	var bId=bId;
	// 	var $cinnamon_default = $("table[bIdentity="+bId+"]").length?$("table[bIdentity="+bId+"]"):$("table[bId="+bId+"]")
	// 	var J = tableSortSearch.loadPacket($cinnamon_default.closest(".cinnamon_default"),new Object,["","search","sort"]);
	// 	var search = tableSortSearch.jsonToUrl(J);
	// 	TOMATOSYSTEM.excel(bId,search);
	// },
	// print:function (bId) {
	// 	var bId=bId;
	// 	var search = search;
	// 	TOMATOSYSTEM.excel(bId,search);
	// }
}

var CINNAMON = false;
refresher.set("onload",function () {CINNAMON = new __CINNAMON();});


var newIdCount = 1;
function newId () {
	return "newId_"+(newIdCount++);
}
function loadChat() {
	$.get("/intranet/newChat.php",{},function (data) {
		if (data>0) {
			$("#menu .mail").addClass("newmail");
			$("#menu .mail a").before("<label>"+data+"</label>");
		} else {
			$("#menu .mail").removeClass("newmail");
			$("#menu .mail label").remove();
		}
	});
	loadOnce = setTimeout("loadChat()",15000);
}
function showLoading() {
//	var num = Math.floor((Math.random()*56)+1);
	// if (!$("#nowLoading").length) $("body").append("<div id='nowLoading'></div>");
	// $("#nowLoading").click(function () {
	// 	$(this).remove();
	// })
}
function closeLoading() {
	$("#nowLoading").remove();
}
function dashboardResize() {
	// $("#dashboard").height($(document).height()-40);
}
refresher.set("onload",closeLoading,"closeLoading");
refresher.set("onload",dashboardResize,"dashboardResize");
refresher.set("resize",dashboardResize,"dashboardResize");



function logout() {
	location.href = "/intranet/logout.php";
}

function set_common () {
	tableSetting();
}

refresher.set("onload",set_common,"set_common");

function tableSetting() {
	$("ul li:last-child").addClass("last-child");
	$("table th:last-child").addClass("last-child");
	$("table td:last-child").addClass("last-child");
	$("table tr:last-child").addClass("last-child");
	$("table.horizonStripe").each(function (m) {
		$(this).find("tr").each(function (n) {
			if (n%2==0)
			{
				$(this).find("td").addClass("stripe");
				//$(this).find("th").addClass("stripe");
			}
		});
	});
	$("table.verticalStripe tr").each(function (m) {
		$(this).find("td").each(function (n) {
			if (n%2==0)
			{
				$(this).addClass("stripe");
			}
		});
	});
}





/*      메인 메뉴용       */

function __gnb () {
	this.mainmenu_closeTimer;
	this.$gnb;
	this.$mainmenu;
	this.$submenu;
	this.$subE;
	this.$toggleGnb;
}

__gnb.prototype = {
	active:function () {
		if (this.$toggleGnb.hasClass("active")) {
			this.$toggleGnb.removeClass("active");
			this.$gnb.removeClass("active");
			this._close_menu();
		} else {
			this.$toggleGnb.addClass("active");
			this.$gnb.addClass("active");
		}
	},
	open:function (targetId,from) {
		this.clearTimer();
		if (targetId) { //open_submenu
			this.$mainmenu.children(".menu").addClass("selected");
			if (targetId=="favorite")
			{
				$("#add_to_favorite").show();
			} else {
				$("#add_to_favorite").hide();
			}
			this.$subE.removeClass("selected").hide();
			$target = this.$submenu.find("."+targetId);
			$target.addClass("selected").show();

			this.$subE.not(".subE.selected").hide();
		}
		this.$mainmenu.find("li.selected").removeClass("selected");
		$(from).addClass("selected");

		if (!this.$gnb.hasClass("opened")) this.$gnb.addClass("opened");
	},
	clearTimer:function () {
		if (this.mainmenu_closeTimer) clearInterval(this.mainmenu_closeTimer);
	},
	_close_menu:function  () {
		this.clearTimer();
		this.$gnb.removeClass("opened");
	},
	start:function (gnb) {
		this.$gnb = $(gnb);
		this.$mainmenu = this.$gnb.children(".mainmenu");
		this.$submenu = this.$gnb.children(".submenu");
		this.$subE = this.$submenu.children(".subE");
		this.$toggleGnb = this.$gnb.parent().children("#toggleGnb");
		// this.set_bodysize_default();

		var _this = this;
		$("#add_to_favorite").mouseover(function () {
			$(this).addClass("hover");
		}).mouseout(function () {
			$(this).removeClass("hover").removeClass("active");
		}).mousedown(function () {
			$(this).removeClass("hover").addClass("active");
		}).mouseup(function () {
			$(this).removeClass("active").addClass("hover");
		}).click(function () {
			_this.add_to_favorite();
		});
		this.$toggleGnb.bind("click",function (e) {
			_this.active();
		})

		this.$gnb.bind("mousemove",function (e) {
			if (e.pageX>500) _this._close_menu();
			if (e.pageX>350) {
				_this.mainmenu_closeTimer = setTimeout(function () {
					_this._close_menu();
				},3000);
			} else {
				_this.clearTimer();
			}
		}).bind("click",function (e) {
			// console.log("gnb clicked"+e.pageX);
			if (e.pageX>350) _this._close_menu();
		});

	}
}




function tableCellRollOverColorChanger () {
	if ($(".cinnamon_table").hasClass("cinnamon_table_customized")) return false;
	// console.log("tableCellRollOverColorChanger");
	$(".cinnamon_table tr").mouseover(function () {
		$(this).addClass("rollOver");
	}).mouseout(function () {
		$(this).removeClass("rollOver");
	});
	$(".cinnamon_table thead tr th").add(".cinnamon_table tbody tr td").mouseover(function () {
		var index = $(this).parent().children($(this).tagName).index($(this))*1+1;
		$(this).closest("table").children("tbody").children("tr").each(function () {
			$(this).children("td:nth-child("+index+")").addClass("rollOverV");
		})
		$(this).addClass("rollOverV");
	}).mouseout(function () {
		var index = $(this).parent().children($(this).tagName).index($(this))*1+1;
		$(this).closest("table").children("tbody").children("tr").each(function () {
			$(this).children("td:nth-child("+index+")").removeClass("rollOverV");
		})
		$(this).removeClass("rollOverV");
	});
}
// var resizeMenuTimer;
// var resizeMenuTimer2;
// function cinnamon_resize() {
// 	clearTimeout(resizeMenuTimer);
// 	clearTimeout(resizeMenuTimer2);
// 	resizeMenuTimer = setTimeout("makePageCinnamon()",10);
// 	resizeMenuTimer2 = setTimeout("all_thead_fix()",100);
// }
// refresher.set("resize",cinnamon_resize,"cinnamon_resize");
var popupZindex = 0;
function resizeSearch () {
	$(".cinnamon_search").each(function () {
		$form = $(this).children("form");
		// console.log($(this).width());
		$form.children(".searchElementGroup").width($(this).width());
		// $form.children(".searchElementGroup").width($(this).width()-$form.children(".searchButton").width()-90);
	})
}
function openCinnamonPop(url,_thisId,callback) {
	if (!_thisId) {
		if ($(url).closest("tr").attr("Id")>0) var thisId = "popup_"+$(url).closest("tr").attr("Id");
		else if ($("#"+thisId).length==0) var thisId = "newPopup_"+newId();
	} else {var thisId = _thisId;}
	if (!thisId) return false;

	var reload = false;
	if ($("#"+thisId).length>0) {
		var p = $("#"+thisId).position();
		var w = $("#"+thisId).width();
		var h = $("#"+thisId).height();
		$("#"+thisId).remove();
		reload = true;
	}
	$.get(url,{systemOrder:-2},function (html) {


		var newPopup = "<div class=cinnamon_popup id="+thisId+" url='"+url+"'></div>";
		$("body").append(newPopup);
		$popup = $("#"+thisId);

		var manner = /<script>(.*?)<\/script>/gi;
		script = manner.exec(html);
		if (script!=null) {
			script = script[0];
			script = script.replaceAll("<script>","");
			script = script.replaceAll("</script>","");
		}
		var html = html.replace(manner, "");

		$popup.html(html);
		if (script!=null) {
			eval(script);
		}
		if (reload) {
			$popup.width(w);
			$popup.height(h);
			$popup.css("top",p.top);
			$popup.css("left",p.left);
		} else {
			var ww = document.documentElement.clientWidth;
			var hh = document.documentElement.clientHeight;
			$popup.css("left",(ww-$popup.width())/2);
			$popup.css("top",(hh-$popup.height())/4);
		}
		$popup.draggable({handle:".cinnamon_head",cursor: "move"});
		$popup.children(".cinnamon_default").resizable({ handles: 'e, w'});
		$popup.css("z-index",popupZindex++);
		$popup.mousedown(function () {$(this).css("z-index",popupZindex++);})
		$popup.children("form[name=write]").submit(function (event) {
			event.preventDefault();
	        var $form = $(this);
	        var $button = $form.find('submit');
	        var bId = $form.find("[name=bId]").val();
	        var id = $form.find("[name=id_"+bId+"_1]").val();
	        var mode = $form.find("[name=mode_"+bId+"_"+id+"_1]").val();
	        // 보내기
	        $.ajax({
	            url: $form.attr('action'),
	            type: $form.attr('method'),
	            data: $form.serialize()+'&r='+(Math.floor(Math.random() * 99999) + 1),
	            timeout: 30000,
	            beforeSend: function(xhr, settings) {
	                $button.attr('disabled', true);
	            },
	            complete: function(xhr, textStatus) {
	                $button.attr('disabled', false);
	            },
	            success: function(result, textStatus, xhr) {
					$.getJSON("/"+bId+"/list.json",{searchKey:"id",searchWord:id,searchRelation:"=",r:Math.floor(Math.random() * 99999) + 1},function (json) {

	                	if (mode=="insert"||mode=="copy") {
							var html = $(".cinnamon_table[bId="+bId+"]").children("tbody").children("tr.list_loop_dummy").clone();
							$(html).attr("Id",json[0].Id);
							$(".cinnamon_table[bId="+bId+"]").children("tbody").append(html);
						}
						var $tr = $(".cinnamon_table[bId="+bId+"]").children("tbody").children("tr[id="+json[0].Id+"]");
						$tr.show().removeClass("list_loop_dummy");
						for (var key in json[0]) {
							var $td = $tr.children("td."+key);
							if ($td.children("a").length>0) $td.children("a").html(json[0][key]).attr("href","index.php?bId="+bId+"&mode=view&id="+json[0].Id);
							else $td.html(json[0][key]);
						}
						// setDefaultCinnamon_popup();
						switch (mode) {
							case "insert":
								reloadCinnamonPop($form);
							break;
							case "mod":
								closeCinnamonPop($form);
								// openCinnamonPop("index.php?bId="+bId+"&mode=view&id="+json[0].Id,thisId);
							break;
							case "copy":
								closeCinnamonPop($form);
								openCinnamonPop("index.php?bId="+bId+"&mode=view&id="+json[0].Id,"popup_"+json[0].Id);
							break;
						}
						if(typeof callback == 'function') callback(json);
					});

	            },
	            error: function(xhr, textStatus, error) {
	                $button.attr('disabled', false);
	                alert("전송이 실패했습니다. 재전송하세요");
	            }
			});
	    });

	});
}
function reloadCinnamonPop(target) {
	openCinnamonPop($(target).closest(".cinnamon_popup").attr("url"),$(target).closest(".cinnamon_popup").attr("id"));
}
function closeCinnamonPop(target) {
	$(target).closest(".cinnamon_popup").remove();
}

function toggleCheck (tar) {
	$this = $(tar);
	if ($this.hasClass("already")) {
		$this.removeClass("already");
		$this.parent().children(".trash").slideUp("fast");

		$(".cinnamon_table .checkTd").fadeOut("fast");
	} else {
		$this.addClass("already");
		$this.parent().children(".trash").slideDown("fast");

		$(".cinnamon_table .checkTd").fadeIn("fast");
	}
}
function checkForm ()
{
	$(".default").removeClass("default").val("");
	return true;
}
function submitForm (form)
{
	check = checkForm();
	if (check) document.write.submit();
}
function insertIntoEditor (cont) {
	tinyMCE.execCommand('mceInsertContent',false,cont);
}
var oEditors = [];
function fnCinnamonDefault() {
	TOMATOSYSTEM.set_hrefNone();
	set_checkbox();
	$(".checkall").click(function () {
		if ($(this).prop("checked"))
		{
			$(this).parent().parent().parent().parent().children("tbody").children("tr").children("td.checkTd").children("input[type=checkbox]").prop("checked","checked");
		} else {
			$(this).parent().parent().parent().parent().children("tbody").children("tr").children("td.checkTd").children("input[type=checkbox]").prop("checked","");
		}
		checkedCheckbox(this);
	});
	$("form *[tomato=true]").each(function (n) {
		if (n==0&&!$(".cinnamon_default.mode_view").length)
		{
			//$(this).focus();
		} else {
			return false;
		}
	});
	$('.amount').blur(function(event) {
	  	$(this).val($(this).val().castMoney());
	});

	$("input[type=file]").width("40%");
	var textareaId = $("textarea.field_interface").attr("id");
	tableCellRollOverColorChanger();
	resizeSearch();
	TOMATOFIELD.setDatepicker();
	setPlusMinus();
	TOMATOFIELD.set_enter4next ();
	TOMATOFIELD.textBoxSetting($(".cinnamon_table"));
	tableSetting();
}

function tableSetting() {
	$("ul li:last-child").addClass("last-child");
	$("table th:last-child").addClass("last-child");
	$("table td:last-child").addClass("last-child");
	$("table tr:last-child").addClass("last-child");
	$("table.horizonStripe").each(function (m) {
		$(this).find("tr").each(function (n) {
			if (n%2==0)
			{
				$(this).find("td").addClass("stripe");
				//$(this).find("th").addClass("stripe");
			}
		});
	});
	$("table.verticalStripe tr").each(function (m) {
		$(this).find("td").each(function (n) {
			if (n%2==0)
			{
				$(this).addClass("stripe");
			}
		});
	});

}


function set_checkbox () {
	$(".checkTd input").unbind("click").click(function () {
		checkedCheckbox(this);
	})
}
function checkedCheckbox (_self) {
	if (_self) $this=$(_self);
	var count = 0;
	var delCount = 0;
	var delA = new Array();
	var bId = $("#boardList").attr("bId");
	//alert (bId);
	$("#boardList tbody td.checkTd input[type=checkbox]").each(function (n) {
		if ($(this).prop("checked")) {
			var deleteId = $(this).val();
			count++;
			delA.push(deleteId);
		}
	});
	if (delA.length==0) {
		if (!_self) $(".trash").slideUp("fast");
		else $this.closest(".cinnamon_default").find(".trash").slideUp("fast");
		if (!_self) $(".allPrint").slideUp("fast");
		else $this.closest(".cinnamon_default").find(".allPrint").slideUp("fast");
		if (!_self) $(".historyChange").slideUp("fast");
		else $this.closest(".cinnamon_default").find(".historyChange").slideUp("fast");
	} else {
		if (!_self) $(".trash").slideDown("fast");
		else $this.closest(".cinnamon_default").find(".trash").slideDown("fast");
		if (!_self) $(".allPrint").slideDown("fast");
		else $this.closest(".cinnamon_default").find(".allPrint").slideDown("fast");
		if (!_self) $(".historyChange").slideDown("fast");
		else $this.closest(".cinnamon_default").find(".historyChange").slideDown("fast");
	}
}
function deleteChecked(target) { // in list
	var count = 0;
	var delCount = 0;
	var delA = new Array();
	if (target) var bId = $(target).closest(".cinnamon_default").find(".cinnamon_table").attr("bId");
	else var bId = $("#boardList").attr("bId");
	$("#boardList tbody td.checkTd input[type=checkbox]").each(function () {
		if ($(this).prop("checked")) {
			var deleteId = $(this).val();
			count++;
			delA.push(deleteId);
		}
	});
	if (delA.length==0) {
		alert (L("삭제할 문서를 선택해주세요."));
		return false;
	}
	if (delA.length>0&&!confirm(L("선택한 항목을 정말로 삭제할까요?"))) return false;
	for (n in delA)
	{
		// $.post("action.php",{bId:bId,mode:"del",id:delA[n],method:"api"},function (data) {
		$.post("/"+bId+"/del:save/"+delA[n],{method:"api"},function (data) {
			delCount++;
			if (count==delCount)
			{
				location.href = location.href.replace("mode=view","mode=list");
				tableSortSearch.auto(target);
			}
		});
	}
}

function groupSMS(target) { // in list
	var count = 0;
	var smsCount = 0;
	var smsA = new Array();
	if (target) var bId = $(target).closest(".cinnamon_default").find(".cinnamon_table").attr("bId");
	else var bId = $("#boardList").attr("bId");
	$("#boardList tbody td.checkTd input[type=checkbox]").each(function () {
		if ($(this).prop("checked")) {
			var smsId = $(this).val();
			count++;
			smsA.push(smsId);
		}
	});
	if (smsA.length==0) {
		alert (L("문자를 보낼 고객을 선택해주세요."));
		return false;
	}
	if (smsA.length>0&&!confirm(L("선택한 고객에게 문자를 보낼까요?"))) return false;

	// var url = '/s_Customer/?getMode=insert&eType=sms_group';
	var target_modal = $(".modal.modal-sms");

    target_modal.modal('show');

    
}


function allPrint(target) { // in list
	var count = 0;
	var delCount = 0;
	var printListA = new Array();
	if (target) var bId = $(target).closest(".cinnamon_default").find(".cinnamon_table").attr("bId");
	else var bId = $("#boardList").attr("bId");
	$("#boardList tbody td.checkTd input[type=checkbox]").each(function () {
		if ($(this).prop("checked")) {
			var deleteId = $(this).val();
			count++;
			printListA.push(deleteId);
		}
	});
	if (printListA.length==0) {
		alert (L("인쇄할 문서를 선택해주세요."));
		return false;
	}
	$popup = $(".cinnamon_popup.allPrintList");
	$popup.show();
	$popup.draggable({handle:".cinnamon_head",cursor: "move"});
	$(".cinnamon_popup.allPrintList .cinnamon_contents").attr("noList",printListA);

}

function allPrintList(docType){
	var noList = $(".cinnamon_popup.allPrintList .cinnamon_contents").attr("noList");
	var url = "/allPrintList/?type="+docType+"&noList="+noList;
	window.open(url,docType+"_"+noList,"width=1150,height=700,menubar=no,toolbar=no");
	$popup.hide();
	return false;
}


function setPlusMinus() {
	$("input.plus").not(".manual").unbind("click").bind("click",function() {
		var n = prompt("몇 개의 칸을 추가할까요?",1);
		if (n>0) plus($(this),n,setPlusMinus);
	});
	$("input.minus").not(".manual").unbind("click").bind("click",function () {
		minus($(this),0,setPlusMinus);
	});
}
function plus(from,n,callback) {
	var from = from;
	var $table = $(from).closest("table");
	var inlineSearchParameters='';
	if ($table.attr("inlineSearchParameters")) {
		inlineSearchParameters = $table.attr("inlineSearchParameters").split("&").reduce(function (inlineSearchParameters,p) {
			return inlineSearchParameters+','+'"'+p.split("=")[0]+'":"'+p.split("=")[1]+'"';
		},'');
	}
	var id = $(from).closest("tr").attr("id");
	var bId = $table.attr("bId");
	var loopNo = $("input[name=loop_"+$table.attr("bId")+"]").val()*1;
	$("input[name=loop_"+bId+"]").val(loopNo+1);
	var J = $.parseJSON('{"method":"api","after":"'+id+'","startLoopNo":"'+loopNo+'"'+inlineSearchParameters+'}');

	$.get("/"+bId+"/insert",J,function (data) {
		$table.children("tbody").children("tr#"+id).after(data);
		target = "table[bId="+bId+"] tr[id="+$(data).attr("id")+"]";
		TOMATOFIELD.set_enter4next(target);
		TOMATOFIELD.set_upDownKey(target);
		// $("input[name=loop_"+bId+"]").val(loopNo+1);
		TOMATOFIELD.textBoxSetting($(".cinnamon_table"));
		if (n>1) {
			n--;
			plus(from,n,callback);
		} else {
			if(typeof callback == 'function') callback();
		}
	});
}
function minus(from) {
	var $table = $(from).closest("table");
	var $tr = $(from).closest("tr");
	var id = $tr.attr("id");
	var bId = $table.attr("bId");
	var statusDeleted = $table.children("tbody").children("tr#"+id).hasClass("delete");
	var statusNew = $table.children("tbody").children("tr#"+id).hasClass("new");
	if (statusDeleted) {
		$table.children("tbody").children("tr#"+id).removeClass("delete");
		$table.children("tbody").children("tr#"+id).find("input.mode").val("mod");
	} else {
		$table.children("tbody").children("tr#"+id).addClass("delete");
		$table.children("tbody").children("tr#"+id).find("input.mode").val("del");
	}
	if (statusNew) {
		$table.children("tbody").children("tr#"+id).hide();
		$table.children("tbody").children("tr#"+id).find("input.mode").val("del");
	}
}
function p (msg) {console.log (msg);}
function dbg(msg) {
	return false;
	// console.log(msg);
	// if (!$(".dbgMessage").length) $("body").append("<div class='dbgMessage'><ul></ul></div>");
	// $(".dbgMessage ul").prepend("<li>"+msg+"</li>");
}
function all_thead_fix () {
	// if ($("body").width()<=768) {
	// 	console.log("width 작으면 thead_fix 안함");
	// 	return false;
	// }
	$("table.cinnamon_table").each(function (n) {
		thead_fix($(this));
	})
}
function thead_fix(table) {
    return;
	console.log("thead_fix");

	if (!table) return false;
	// return false;

	var w1;
	var w2;
	var total = 0;
	var $table = $(table);
	var $cinnamon_default = $table.closest(".cinnamon_default");
	// console.log($cinnamon_default);
	if ($cinnamon_default.hasClass("cinnamon_mini")||$cinnamon_default.hasClass("sizeFix")) return false;
	// console.log("thead_fix activated");
	var p = $table.position();
	var p2 = $table.offset();
	var bodyHeight = 0;


	$table.parent().addClass("thead_fix_box");
	var allHeadHeight = 0;

	if ($(".cinnamon_head")) allHeadHeight+=35;
	if ($(".cinnamon_tools")) allHeadHeight += $(".cinnamon_tools>.cinnamon_search").height();

	if (!$table.parent().prev().hasClass("cinnamon_head")) {
		$table.parent().prev().css("margin-top","35px");
	}

	var hh = ($cinnamon_default.hasClass("customized")?$cinnamon_default.height():document.documentElement.clientHeight-15);
	// console.log(hh);
	// var hh = document.documentElement.clientHeight;
	var foot_height = $cinnamon_default.children(".cinnamon_foot").height();

	// console.log("----------thead_fix.start------------");
	// console.log("hh:"+hh);
	// // console.log("thead:"+$table.children("thead").height());
	// console.log("p.top:"+p.top);
	// console.log("allHeadHeight:"+allHeadHeight);
	// console.log("foot_height:"+foot_height);
	var newHeight = hh-$table.children("thead").height()-p.top - (foot_height?foot_height:0);
	var thead_fix_box_height = hh-allHeadHeight - (foot_height?foot_height:0)+15;
	// console.log("thead_fix_box_height:"+thead_fix_box_height);

	console.log("newHeight:"+newHeight);
	console.log("----------thead_fix.end------------");

	if (!$table.length) return false;
	var minWidth = $table.width();
	// console.log("minWidth:"+minWidth);
	// var colspan = $table.children("thead").children("tr:first-child").children("th").length;
	var colspan = 0;
	$table.children("thead").children("tr:first-child").children("th").each(function (n) {
		colspan+=$(this).attr("colspan")?$(this).attr("colspan")*1:1;
	})
	// console.log ("colspan:"+colspan);
	$table.children("tbody").css("margin-top",$table.children("thead").height());

	var $standardTr = 0; // 0이 원본인데 왜 0일까? 기억 안남


	$table.children("tbody").children("tr").each(function (n) {
		// dbg ($(this).children("td").length);
		// console.log("this.height:"+$(this).height());
		// console.log(colspan);
		// console.log('$(this).children("td").length : ' + $(this).children("td").length);
		if (colspan==$(this).children("td").length&&!$standardTr) {
			$standardTr = $(this);
			// return true;
		}
		bodyHeight+=$(this).height()*1;
		// console.log("bodyHeight:"+bodyHeight);
	})

	if ($table.hasClass("thead_fix")) {
		$table.removeClass("thead_fix");
		$table.css("width","");
		$table.children("thead").children("tr").children("th").css("width","");
		$table.children("tbody").css("height","");
		$standardTr.children("td").css("width","");
	}

	// console.log(bodyHeight);
	// dbg ("newHeight:"+newHeight+",bodyHeight:"+bodyHeight);
	if (newHeight>bodyHeight) {
		// console.log("newHeight가 더 큼");
		return false;
	}
	// dbg ("s1");
	if (!$standardTr) {
		// console.log("standardTr이 없음");
		return false;
	}
	// dbg ("s2");
	var tableP = $table.offset();
	$table.children("thead").css("left",tableP.left).css("top",tableP.top+$table.parent().scrollTop());



	var spanAddV = 1;
	var spanAddV2 = 1;
	$table.children("thead").children("tr:first-child").children("th").each(function (n) {

		var w1 = $(this).width()*1;
		var w1p = $(this).css("padding-left").replace("px","")*1
			+$(this).css("padding-right").replace("px","")*1
			+$(this).css("border-left-width").replace("px","")*1
			+$(this).css("border-right-width").replace("px","")*1
			+$(this).css("margin-left").replace("px","")*1
			+$(this).css("margin-right").replace("px","")*1;

		var colspan = $(this).attr("colspan")?$(this).attr("colspan"):1;
		// console.log("----------");
		// console.log("colspan"+colspan);

		var w2 = 0;
		var w2p = 0;

		var i = -1;while (i++<=colspan-2) {
			var th = n+1+spanAddV;
			th = spanAddV;

			// console.log("----");
			// console.log("spanAddV"+spanAddV);
			// console.log("th:"+(th));
			// console.log("i:"+i);

			w2 += $standardTr.children("td:nth-child("+(th)+")").width()*1;
			w2p = w2p+$standardTr.children("td:nth-child("+(th)+")").css("padding-left").replace("px","")*1
					+$standardTr.children("td:nth-child("+(th)+")").css("padding-right").replace("px","")*1
					+$standardTr.children("td:nth-child("+(th)+")").css("border-left-width").replace("px","")*1
					+$standardTr.children("td:nth-child("+(th)+")").css("border-right-width").replace("px","")*1
					+$standardTr.children("td:nth-child("+(th)+")").css("margin-left").replace("px","")*1
					+$standardTr.children("td:nth-child("+(th)+")").css("margin-right").replace("px","")*1;
			spanAddV++;
		}

		// dbg ($(this).attr("class")+":"+w1+"+"+w1p+":"+w2+"+"+w2p);
		if (w1<w2) {
			resizeWidth = w2;
			// dbg ("w2");
		} else {
			resizeWidth = w1;
			// dbg ("w1");
		}
		// resizeWidth+=4;
		$(this).width(resizeWidth).css("min-width",resizeWidth).css("max-width",resizeWidth);
		var i = -1;while (i++<=colspan-2) {
			var th2 = n+1+spanAddV2;
			th2 = spanAddV2;
			// console.log("----");
			// console.log("spanAddV2"+spanAddV2);
			// console.log("th2:"+(th2));
			var newWidth = resizeWidth/colspan-(colspan>1?1:0);

			$standardTr.children("td:nth-child("+(th2)+")")
				.width(newWidth)
				.css("min-width",newWidth)
				.css("max-width",newWidth);

			$table.children("thead").children("tr.headSearch").children("th:nth-child("+(th2)+")")
				.width(newWidth)
				.css("min-width",newWidth)
				.css("max-width",newWidth);

			spanAddV2++;
		}

		total+=resizeWidth+(w1p<w2p?w2p:w1p);
	})
	$table.width((total<minWidth?minWidth:total));
	$table.parent().height(thead_fix_box_height);

	refresher.set("scroll",function () {
		// $table.children("thead").css("left",tableP.left-$("body").scrollLeft());
	})

	$table.parent().scroll(function () {
		$table.children("thead").css("left",tableP.left-$table.parent().scrollLeft());
	})

	// $table.children("tbody").height((newHeight>bodyHeight?bodyHeight:newHeight));
	if (!$table.hasClass("thead_fix")&&newHeight<bodyHeight) {
		$table.addClass("thead_fix");
	}
}
var cinnamon_table_navi_timer;
function tbody_auto_scroll(table,auto,ratio,ratio2) {
	// console.log("tbody_auto_scroll start");
	$(table).addClass("here");

	var auto = auto?true:false;
	var table = table;

	var $table = table?table:$("table.thead_fix");
	// console.log($table.attr("class"));

	$table.addClass("here");
	if ($(".here").length==0) {
		// console.log("tbody_auto_scroll no table");
		return false;
	}
	if ($table.hasClass("cinnamon_table_customized")) {
		// console.log("customized");
		return false;
	}

	// console.log("tbody_auto_scroll run");
	if ($table.hasClass("auto_scroll")) auto = true;
	var ratio = ratio?ratio:0.5;
	$table.parent().children(".cinnamon_table_navi").remove();


	if (auto) $table.parent().append("<div class='cinnamon_table_navi'><div class='window'></div></div>");

	if (!$table.children("tbody")[0]) return false;

	var n_w = $table.children("tbody")[0].scrollWidth;
	var n_h = $table.children("tbody")[0].scrollHeight;

	var n_w1 = n_wm = $table.parent().width()*(ratio2?ratio2:0.15); //전체의 0.1 사이즈
	var n_hm = $table.parent().height();
	// w1:w = h1:h
	// h1 = h*w1/w
	//w1 = h1*w/h
	var n_h1 = Math.round(n_hm<n_h*n_w1/n_w?n_hm:n_h*n_w1/n_w);
	var n_w1 = Math.round(n_hm<n_h*n_w1/n_w?n_h1*n_w/n_h:n_w1);

	var newRatio = n_h1/n_h;

	var w_w = $table.parent().width()*newRatio-2;
	var w_h = $table.parent().height()*newRatio-2;
	var newid = newId();
	if (auto) $table.parent().children(".cinnamon_table_navi").attr("Id",newid).width(n_w1).height(n_h1).children(".window").width(w_w).height(w_h);


	$table.children("tbody").scrollTop(0);
	$table.parent().scrollLeft(0);

	$table.closest(".cinnamon_default").addClass(auto?"auto_scroll":"manual_scroll");


	// console.log("ratio",ratio);

	var w = $table.children("tbody")[0].scrollWidth-$table.parent().width();
	var h = $table.children("tbody")[0].scrollHeight-($table.parent().height()-$table.children("thead").height());
	// console.log("w:"+w);
	// console.log("h:"+h);

	var w1 = $table.parent().width()*ratio;
	var h1 = ($table.parent().height()-$table.children("thead").height())*ratio;
	// console.log("w1:"+$table.parent().width()+"*ratio"+w1);
	// console.log("h1:"+($table.parent().height()-$table.children("thead").height())+"*ratio"+h1);

	var p = $table.children("tbody").position();
	var l = p.left + $table.parent().width()*(1-ratio)/2;
	var t = p.top + ($table.parent().height()-$table.children("thead").height())*(1-ratio)/2;
	// console.log("p.l:"+p.left);
	// console.log("p.t:"+p.top);
	// console.log("l:"+l);
	// console.log("t:"+t);



	if (auto) $table.children("tbody").mousemove(function (e) {
		if (!auto) return false;
		clearTimeout(cinnamon_table_navi_timer);
		var $table = $(this).parent();
		var naviId = $table.parent().children(".cinnamon_table_navi").attr("Id");
		var x = e.pageX-l;
		var y = e.pageY-t;

		//w1:x = w:newX
		//x.w = w1.newX
		// x.w/w1 = newX

		var newX = x*w/w1;
		var newY = y*h/h1;

		// newX = newX<0?0:newX;
		// newY = newY<0?0:newY;
		// // newX = newX>w?w:newX;
		// newY = newY>h?h:newY;
		// console.log("newX:"+newX);
		if (auto) {
			$table.children("tbody").scrollTop(newY);
			$table.parent().scrollLeft(newX);
		}

		//newY : h = w_newY : w_h
		//newY*w_h/h

		//w_newX : newX = w_w:w
		//w_newX = newX*w_w/w
		var w_newX = newX*n_w1/$table.children("tbody")[0].scrollWidth;
		w_newX = w_newX<0?0:w_newX;
		w_newX = w_newX>n_w1-w_w-2?n_w1-w_w-2:w_newX;
		w_newX = Math.round(w_newX);
		// console.log('newY:'+newY);
		var w_newY = newY*n_h1/$table.children("tbody")[0].scrollHeight;//$table.children("tbody")[0].scrollHeight;
		w_newY = w_newY<0?0:w_newY;
		w_newY = w_newY>n_h1-w_h-2?n_h1-w_h-2:w_newY;
		w_newY = Math.round(w_newY);

		$("#"+naviId).children(".window").css("left",w_newX).css("top",w_newY);

		$("#"+naviId).show();

		cinnamon_table_navi_timer = setTimeout(function () {$("#"+naviId).fadeOut();},300);
	});
	if (!auto) $table.children("tbody").bind("mousewheel",function (e,d,x,y) {
		if (auto) return false;

		clearTimeout(cinnamon_table_navi_timer);
		var $table = $(this).parent();
		var naviId = $table.parent().children(".cinnamon_table_navi").attr("Id");

		// newX = newX<0?0:newX;
		// newY = newY<0?0:newY;
		// // newX = newX>w?w:newX;
		// newY = newY>h?h:newY;
		// console.log("newX:"+newX);
		if (auto) {
			$table.children("tbody").scrollTop(newY);
			$table.parent().scrollLeft(newX);
		}
		var newX = $table.parent().scrollLeft() - $table.parent().width();
		var newY = $table.children("tbody").scrollTop() - $table.children("thead").height();

		//newY : h = w_newY : w_h
		//newY*w_h/h

		//w_newX : newX = w_w:w
		//w_newX = newX*w_w/w
		var w_newX = newX*n_w1/$table.children("tbody")[0].scrollWidth;
		w_newX = w_newX<0?0:w_newX;
		w_newX = w_newX>n_w1-w_w-2?n_w1-w_w-2:w_newX;
		w_newX = Math.round(w_newX);
		// console.log('newY:'+newY);
		var w_newY = newY*n_h1/$table.children("tbody")[0].scrollHeight;//$table.children("tbody")[0].scrollHeight;
		w_newY = w_newY<0?0:w_newY;
		w_newY = w_newY>n_h1-w_h-2?n_h1-w_h-2:w_newY;
		w_newY = Math.round(w_newY);

		$("#"+naviId).children(".window").css("left",w_newX).css("top",w_newY);

		$("#"+naviId).show();

		cinnamon_table_navi_timer = setTimeout(function () {$("#"+naviId).fadeOut();},300);

	})
}






refresher.set("onload",fnCinnamonDefault,"fnCinnamonDefault");
refresher.set("onload",all_thead_fix,"all_thead_fix");
refresher.set("onload",tbody_auto_scroll,"tbody_auto_scroll");

refresher.set("resize",all_thead_fix,"all_thead_fix");
refresher.set("resize",tbody_auto_scroll,"tbody_auto_scroll");

refresher.set("autoSearch",all_thead_fix,"all_thead_fix");
refresher.set("autoSearch",tbody_auto_scroll,"tbody_auto_scroll");
refresher.set("autoSearch",fnCinnamonDefault,"fnCinnamonDefault");
refresher.set("autoSearch",fnInlineDefault,"fnInlineDefault");



function __checkChat() {
	this.chat = new tomato();
	this.chatRoom = new tomato();
	this.chatBox = new tomato();
	this.openChat=[];
	this.$gnb;
}
__checkChat.prototype = {
	delOpenChatLog:function (id) {
		for (var openChatId in this.openChat) {
			if (this.openChat[openChatId]==id) this.openChat[openChatId]=null;
		}
	},
	checkUpdate:function () {
		var chatRoomId = this.chatRoom._bId;
		var cc = 0;
		_this = this;
		this.chat.list(null,function (J) {
			var J = $.parseJSON(J);
			for (var chatRoom in J) {
				if (J[chatRoom]["important"]==1) {
					var opened = false;
					for (var openChatId in _this.openChat) if (_this.openChat[openChatId]==J[chatRoom]["Id"]) opened = true;
					if (!opened) {
						_this.openChat.push(J[chatRoom]["Id"]);
						openChat(J[chatRoom]["Id"],"/"+chatRoomId+"/view/"+J[chatRoom]["chatRoomId"]);
						setTimeout(function () {
							_this.delOpenChatLog(J[chatRoom]["Id"]);
						},15000);
					}
				}
				cc+=J[chatRoom]["cc"]*1;
			}
			if (cc>0) _this.$gnb.find(".menu li.chat span.chatCC").show().text(cc);
			else _this.$gnb.find(".menu li.chat span.chatCC").hide().text(cc);
			$("ul#menu>li.chat")
		});
	},
	updateLastChat:function () {
		var D = new Date();
		var chatRoomId = this.chatRoom._bId;
		this.chatBox.list(null,function (J) {
			$.map($.parseJSON(J),function (j) {
				$(".submenu>div.chat.subE>ul>li:nth-child(2)>.chatBox_"+j.Id).remove();
				$(".submenu>div.chat.subE>ul>li:nth-child(2)").append("<a class='chatBox_"+j.Id+"' href='javascript:var chatList = window.open(\"/chatRoom/list/?etc_bs_chatRoomBox___chatBoxId="+j.Id+"\",\"chatList\",\"width=500px,height=600px,toolbar=0, menubar=0, location=0, directories=0, status=0, scrollbars=0,left=0px\");chatList.focus();' >"
					+j.title+
					"["+j.allCc+"]</a>");
			})
		})
		this.chatRoom.list(null,function (J) {
			var J = $.parseJSON(J);
			// J = strip_tags(J);htmlspecialchars
			$(".submenu>div.chat.subE>ul>li:last-child>a").remove();
			var i = 0;
			for (var chatRoom in J) {
				if (i++>=10) break;
				if (J[chatRoom]["etc_bst_chatTour__Id_tourId"]>""){
					var tourReference = " ["+J[chatRoom]["etc_bst_chatTour__Id_tourId"]+"] ";
				} else {
					tourReference ="";
				}
				var chatCount="";
				if (J[chatRoom]["alertC"]>0){
					chatCount = J[chatRoom]["alertC"];
				}
				var bookmark="";
				if (J[chatRoom]["bookmark"]>0){
					bookmark = J[chatRoom]["bookmark"];
				}
				boxName = J[chatRoom]["etc_bs_chatRoomBox__Id_chatBoxId"];

				// insertNameA = J[chatRoom]["insert_member_id"].split(":");

				var JD = new Date(J[chatRoom]["msgRegdate"].substring(0,4),J[chatRoom]["msgRegdate"].substring(5,7)*1-1,J[chatRoom]["msgRegdate"].substring(8,10));
				$(".submenu>div.chat.subE>ul>li:last-child").append("<a href='javascript:openChat("+J[chatRoom]["Id"]+",\""+"/"+chatRoomId+"/view/"+J[chatRoom]["Id"]+"\");' class='chatRoom_"+J[chatRoom]["Id"]+" "+(bookmark?"bookmarkCheck":"")+"'><div class='msgRegdate'>"+(JD.getFullYear()+""+JD.getMonth()+""+JD.getDate()==D.getFullYear()+""+D.getMonth()+""+D.getDate()
							?J[chatRoom]["msgRegdate"].substring(11,13)+":"+J[chatRoom]["msgRegdate"].substring(14,16)
							:J[chatRoom]["msgRegdate"].substring(5,7)+"-"+J[chatRoom]["msgRegdate"].substring(8,10))+"</div><div class='lastName'>"+J[chatRoom]["lastName"]+tourReference+"</div><div class='chatBox'>"+boxName+"</div><div class='lastCount'>"+chatCount+"</div><div class='lastMsg'>"+J[chatRoom]["lastMsg"].replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "")+"</div></a>");

				// $(".submenu>div.chat.subE>ul>li:last-child").append("<a href='javascript:openChat("+J[chatRoom]["Id"]+",\""+"/"+chatRoomId+"/view/"+J[chatRoom]["Id"]+"\");' class='chatRoom_"+J[chatRoom]["Id"]+" "+(bookmark?"bookmarkCheck":"")+"'><div class='lastName'>"+insertNameA[0]+tourReference+"</div><div class='lastCount'>"+chatCount+"</div></a>");
			}

		})
	}
	,
	start:function (gnb) {
		this.$gnb = $(gnb);
		var thisChat = this;

		this.$gnb.find("li.chat").click(function () {
			thisChat.updateLastChat();
		})
		if (!this.$gnb.find("li.chat span.chatCC").length) this.$gnb.find("li.chat").append("<span class='chatCC'></span>");
		setInterval(function () {thisChat.checkUpdate()},15000);
	}
}

function __chatRoom() {
	this.alertCount = 0;

	this.chatRoom = new tomato();
	this.chat = new tomato();
}

__chatRoom.prototype = {
	checkUpdate:function () {
		this.chatRoom.list(null,function (J) {
			var D = new Date();
			var J = $.parseJSON(J);

			for (var chatRoom in J) {
				var $tr = $(".cinnamon_table tr#"+J[chatRoom]["Id"]);

				if (!$tr.hasClass("justOpen")) {
					var JD = new Date(J[chatRoom]["msgRegdate"].substring(0,4),J[chatRoom]["msgRegdate"].substring(5,7)*1-1,J[chatRoom]["msgRegdate"].substring(8,10));
					if (J[chatRoom]["alertC"]>0) $(".cinnamon_table tr#"+J[chatRoom]["Id"]).addClass("alertC");
					if (J[chatRoom]["alertC"]==0) $(".cinnamon_table tr#"+J[chatRoom]["Id"]).removeClass("alertC");
					$(".cinnamon_table tr#"+J[chatRoom]["Id"]+" .chatTextRegdate").text(
						(JD.getFullYear()+""+JD.getMonth()+""+JD.getDate()==D.getFullYear()+""+D.getMonth()+""+D.getDate()
							?J[chatRoom]["msgRegdate"].substring(11,13)+":"+J[chatRoom]["msgRegdate"].substring(14,16)
							:J[chatRoom]["msgRegdate"].substring(5,7)+"-"+J[chatRoom]["msgRegdate"].substring(8,10)));
					$(".cinnamon_table tr#"+J[chatRoom]["Id"]+" .chatRead b").text(J[chatRoom]["alertC"]);
					$(".cinnamon_table tr#"+J[chatRoom]["Id"]+" .chatInner").text(J[chatRoom]["lastMsg"].replace(/<.*?>/g,''));
					$(".cinnamon_table tr#"+J[chatRoom]["Id"]+" .chatTextMember").text(J[chatRoom]["lastName"]);
				}
			}

		})
	},
	start:function () {
		var thisChat = this;
		setInterval(function () {thisChat.checkUpdate()},15000);
	}
}

function openChatAll(id,url) {
	var $tr = $("tr#"+id);
	// console.log($tr);
	if ($tr.length>0) {
		$tr.removeClass("waitUpdate").removeClass("alertC").addClass("justOpen").find(".chatRead").children("b").text("0");
		setTimeout(function () {$(".cinnamon_table tr.justOpen").removeClass("justOpen");},3000);
	}
	var chat=window.open(url,'chatAll_'+id,'width=500px,height=600px,left=500px,top=0px,toolbar=0, menubar=0, location=0, directories=0, status=0, scrollbars=0');
	chat.focus();
}


function openChat(id,url) {
	var $tr = $("tr#"+id);
	// console.log($tr);
	if ($tr.length>0) {
		$tr.removeClass("waitUpdate").removeClass("alertC").addClass("justOpen").find(".chatRead").children("b").text("0");
		setTimeout(function () {$(".cinnamon_table tr.justOpen").removeClass("justOpen");},3000);
	}
	var chat=window.open(url,'chat_'+id,'width=500px,height=600px,left=500px,top=0px,toolbar=0, menubar=0, location=0, directories=0, status=0, scrollbars=0');
	chat.focus();
}

function __chat(chatRoomId) {
	this.chatTimer = null;

	this.chat = new tomato();
	this.chatVA = new Object();

	this.chatRoomBox = new tomato();
	this.chatRoomBoxVA = new Object();

	this.chatRoom = new tomato();
	this.chatRoomVA = new Object();

	this.chatTour = new tomato();
	this.chatTourVA = new Object();

	this.chatTo = new tomato();
	this.chatToVA = new Object();

	this.chatAlertCheck = new tomato();
	this.chatAlertCheckVA = new Object();


	this.chatBookmarkCheck = new tomato();
	this.chatBookmarkCheckVA = new Object();

	this.chatRoomId = chatRoomId;

	this.chatVA.chatRoomId = chatRoomId;
	this.chatRoomVA._id=chatRoomId;
	this.chatTourVA.chatRoomId = chatRoomId;
	this.chatToVA.chatRoomId = chatRoomId;
	this.chatAlertCheckVA.chatRoomId = chatRoomId;
	this.chatBookmarkCheckVA.chatRoomId = chatRoomId;
}

__chat.prototype = {
	scrollToEnd:function () {
		$(".chatTextList").scrollTop(10000);
	},
	loadMsg:function (callBack) {

		// console.log("loadMsg");
		var lastId = $("table.textlist tbody tr.chatTextTr:last-child").attr("id");
		$.get("/"+this.chat._bId,{etc_bs_chatText__Id:lastId,etc_bs_chatText__chatRoomId:this.chatVA.chatRoomId},function (html) {
			var newHtml = $(html).find("tbody").html();
			$("table.textlist tbody tr.chatTextTr:last-child").after(newHtml);
			// console.log($(html).find("tbody").html());
			if (newHtml) setTimeout(function () {
				self.focus();
			},1000);
			if (typeof(callBack)=="function"&&$(html).find("tbody").html()) callBack(html);
		})
	},
	newRoom:function () {
		var chatRoomVA = this.chatRoomVA;
		this.chatRoomVA.title = 'newRoom';
		var thisChat = this;

		this.chatRoom.insertAc(this.chatRoomVA,function () {
			thisChat.sendMsg(function () {
				location.href = "/chatRoom/view/"+chatRoomVA._id;
			});
		});
	},
	sendMsg:function  (callBack) {
		// console.log("sendMsg");
		var important = $("#important").hasClass('enable')?1:0;
		var text = encodeURIComponent($("#chatText").val().replaceAll("\n","<br>"));
		this.chatVA.important = important;
		this.chatVA.textType = (this.attachment?"file":"text");
		this.chatVA.text = text;
		var thisChat = this;
		this.chat.insertAc(this.chatVA,function () {
			thisChat.loadMsg(thisChat.scrollToEnd);
			$("#chatText").val("").focus();
			thisChat.checkTextarea();
			$("#important").removeClass('enable');
			if (typeof(callBack)=="function") callBack();
		});
		this.attachment = false;
	},
	checkTextarea:function  (target) {
		if ($(target).val()) $('input.send').addClass('enable').attr('disabled',false);
		else $('input.send').removeClass('enable').attr('disabled','disabled');
	},
	resizeChat:function  () {
		// console.log("resizeChat");
		var hh = document.documentElement.clientHeight;
		var chatTextInsertToolH = chatTextInsertToolH?chatTextInsertToolH:$(".chatTextInsertTool").height();
		var chatTextInsertH = chatTextInsertH?chatTextInsertH:$(".chatTextInsert").height();
		var cinnamon_footH = cinnamon_footH?cinnamon_footH:$(".chat_foot").height();
		var chatHeadH = 0;//chatHeadH?chatHeadH:$(".chatHead").height();
		var cinnamon_headH = cinnamon_headH?cinnamon_headH:$(".cinnamon_head").height()+5;
		// console.log (chatTextInsertToolH+","+chatTextInsertH+","+cinnamon_footH+","+chatHeadH+","+cinnamon_headH)
		var newHeight = hh - (chatTextInsertToolH+chatTextInsertH+cinnamon_footH+chatHeadH+cinnamon_headH);
		// console.log(newHeight);
		$(".chatTextList").height(newHeight);
		$(".chatTextListTable").height(newHeight);

	},
	start:function () {
		// console.log("chat start"+this.chat._bId);
		this.resizeChat();
		this.scrollToEnd();
		var thisChat = this;
		refresher.set("resize",this.resizeChat,"chat.resizeChat");
		setInterval(function () {thisChat.loadMsg(thisChat.scrollToEnd)},10000);
		// textBoxSetting();
	},
	alertCheck:function (target) {
		var $t = $(target);
		if ($t.hasClass("enable")) {
			this.chatAlertCheck.del($t.attr("id"),function () {
				$t.attr("id","");
			});

			$t.removeClass("enable");
		} else {
			this.chatAlertCheckVA.alert = 1;
			this.chatAlertCheck.insertAc(this.chatAlertCheckVA,function (J) {
				var J = $.parseJSON(J);
				$t.attr("id",J.id);
			});
			$t.addClass("enable");

		}
	},
	bookmarkCheck:function (target) {
		var $t = $(target);
		if ($t.hasClass("enable")) {
			this.chatBookmarkCheck.del($t.attr("id"),function () {
				$t.attr("id","");
			});

			$t.removeClass("enable");
		} else {
			this.chatBookmarkCheck.insertAc(this.chatBookmarkCheckVA,function (J) {
				var J = $.parseJSON(J);
				$t.attr("id",J.id);
			});
			$t.addClass("enable");

		}
	},
	changeBox:function (boxSelect) {
		var boxId = $(boxSelect).val();
		this.chatRoomBoxVA.chatBoxId=$(boxSelect).val();
		this.chatRoomBoxVA.chatRoomId = this.chatRoomId;
		var O = new Object();
		O.etc_bs_chatRoomBox__chatRoomId = this.chatRoomId;
		// alert (this.chatRoomId);
		var _this = this;
		this.chatRoomBox.list(O,function (l) {
			var J = $.parseJSON(l);
			if (J[0]) {
				_this.chatRoomBox.modAc(J[0].Id,_this.chatRoomBoxVA,function () {

				});
			} else {
				_this.chatRoomBox.insertAc(_this.chatRoomBoxVA,function () {

				});
			}
		})
	}

}


function __ctrl () {
	this.t = 0;
	this.leftClickT = 0;
	this.fn = new Object;
}
__ctrl.prototype = {
	set:function (key,fn) {
		this.fn[key] = fn;
	},
	dblCtrl:function (term,fn) {
		this.timeTerm = term;
		this.fn['dblCtrl'] = fn;
	},
	exec:function (name) {
		this.fn[name]();
	},
	start:function () {
		var _this = this;
		$("body").unbind("keyup").keyup(function (e) {
			// console.log(e.keyCode);
			if (e.keyCode==17) _this.click();
			if (e.keyCode==37) _this.leftClick();

			var keyChar = String.fromCharCode(e.keyCode).toLowerCase();
			if (e.ctrlKey) {
				if (_this.fn[keyChar]) _this.fn[keyChar]();
			}
		})
	},
	dblLeftArrow:function (fn) {
		this.fn['dblLeftArrow'] = fn;
	},
	click:function () {
		if (this.t) if (Date.now()-this.t<=this.timeTerm) this.fn['dblCtrl']();
		this.t = Date.now();
	},
	leftClick:function () {
		console.log(this.leftClickT);
		if (this.leftClickT) if (Date.now()-this.leftClickT<=this.timeTerm) this.fn['dblLeftArrow']();
		this.leftClickT = Date.now();
	}
}
var dblCtrlToGoTour = new __ctrl();;

refresher.set("onload",function () {
	dblCtrlToGoTour.start();
	dblCtrlToGoTour.dblCtrl(500,function () {shortCutGoTour();});
});


function __cinnamon () {
}
__cinnamon.prototype = {
	head_fix:function () {
		// console.log("head_fix");
		// return false;
		var $head = null;
		$(".cinnamon_default>.cinnamon_head").not(".customized>.cinnamon_head").each(function () {$(this).width($(this).closest(".cinnamon_default").width()).closest(".cinnamon_default").addClass("head_fixed");});
		if (!$head) return false;
		$head.width($head.width()).addClass("fixed");
		return false;
		if (document.body.scrollTop>$head.height()) {
			if (!$head.hasClass("fixed")) {
				$head.width($head.width()).addClass("fixed");
			}
		} else {
			$head.removeClass("fixed");
		}
	},
	foot_fix:function () {
		$(".cinnamon_default>.cinnamon_tools").not(".customized>.cinnamon_tools").each(function () {$(this).width($(this).width()).addClass("fixed");});
	}
}
var cinnamon = new __cinnamon();
refresher.set("onload",function () {cinnamon.head_fix();},"head_fix","all_thead_fix",0)
refresher.set("scroll",function () {cinnamon.head_fix();})


function __MODAL (opt) {
	this.standby(opt,{
		v_url:null,
		v_html:null,
		v_solid:true,
		v_left:200,
		v_top:170,
		dom_window:"<div class='cinnamon_popup'>{contents}</div>",
		v_rendering:null,
		if_window:null,
		fn_callback:function (J,_this) {return false;},
		fn_callbackClose:function (J,_this) {return false;}
	});
	this.fn_start();
}
__MODAL.prototype = new __TOMATOOBJECT();
__MODAL.prototype.fn_start = function () {
	if (this.v_html()) this.fn_loadHtml();
	else if (this.v_url()) this.fn_loadUrl();
}
__MODAL.prototype.fn_loadUrl = function () {
	console.log("fn_loadUrl");
	var _this = this;
	this.fn_rendering();
	$(this.if_window()).load(this.v_url(),function (J) {
		_this.if_window()
			.draggable();
			// .resizable();
		if (_this.fn_callback()) _this.fn_callback()(J,this);
	})
}
__MODAL.prototype.fn_close = function () {
	this.if_window().remove();
}
__MODAL.prototype.fn_loadHtml = function () {
	this.v_rendering(this.dom_window().replace("{contents}",this.v_html()));
	this.fn_rendering();
	this.if_window()
		.draggable();
		// .resizable();
	if (this.fn_callback()) this.fn_callback()(null,this);
}
__MODAL.prototype.fn_rendering = function () {
	if (this.v_solid() && this.if_window()) this.if_window().remove();
	// console.log("fn_rendering");
	this.v_rendering(this.dom_window().replace("{contents}",""));
	this.if_window($(this.v_rendering()));
	$("body").append(this.if_window());
	this.if_window()
		.css({
			left:this.v_left(),
			top:this.v_top()
		});
}
var cinnamonPop=[];
function quickModalUrl (url,id,template) {
	// console.log(template);
	var _id = id;
	var _template = template;
	if (!cinnamonPop[id]) cinnamonPop[id] = new __MODAL({
		v_url:url,
		fn_callback:function (J,_this) {
			TOMATOFIELD.setDatepicker();
			console.log(_template);
			refresher.execute("tinymceSetting",300,_template);
		},
		fn_callbackClose:function (J,_this) {
			// console.log($('table[bidentity='+_id+']')[0]);
			tableSortSearch.auto($('table[bidentity='+_id+']')[0]);
			_this.if_window().remove();
		}
	});
	else {
		cinnamonPop[id].v_url(url);
		cinnamonPop[id].fn_start();
	}
}

function go_penchart(boardId){
	// var openNewWindow = window.open("about:blank");
	
	var T = new __tomato("chart_click");
  	T.modAc(boardId,{chart_click:1});
	
	// openNewWindow.location.href='/penchart/?id=' + boardId;
}

function __MODAL_MOBILE (opt) {
	this.standby(opt,{
		v_url:null,
		v_html:null,
		v_solid:true,
		v_left:20,
		v_top:100,
		dom_window:"<div class='cinnamon_popup cinnamon_popup_mobile'>{contents}</div>",
		v_rendering:null,
		if_window:null,
		fn_callback:function (J,_this) {return false;},
		fn_callbackClose:function (J,_this) {return false;}
	});
	this.fn_start();
}
__MODAL_MOBILE.prototype = new __TOMATOOBJECT();
__MODAL_MOBILE.prototype.fn_start = function () {
	if (this.v_html()) this.fn_loadHtml();
	else if (this.v_url()) this.fn_loadUrl();
}
__MODAL_MOBILE.prototype.fn_loadUrl = function () {
	console.log("fn_loadUrl");
	var _this = this;
	this.fn_rendering();
	$(this.if_window()).load(this.v_url(),function (J) {
		_this.if_window()
			.draggable();
			// .resizable();
		if (_this.fn_callback()) _this.fn_callback()(J,this);
	})
}
__MODAL_MOBILE.prototype.fn_close = function () {
	this.if_window().remove();
}
__MODAL_MOBILE.prototype.fn_loadHtml = function () {
	this.v_rendering(this.dom_window().replace("{contents}",this.v_html()));
	this.fn_rendering();
	this.if_window()
		.draggable();
		// .resizable();
	if (this.fn_callback()) this.fn_callback()(null,this);
}
__MODAL_MOBILE.prototype.fn_rendering = function () {
	if (this.v_solid() && this.if_window()) this.if_window().remove();
	// console.log("fn_rendering");
	this.v_rendering(this.dom_window().replace("{contents}",""));
	this.if_window($(this.v_rendering()));
	$("body").append(this.if_window());
	this.if_window()
		.css({
			left:this.v_left(),
			top:this.v_top()
		});
}
function quickModalUrl_Mobile (url,id,template) {
	console.log(template);
	var _id = id;
	var _template = template;
	if (!cinnamonPop[id]) cinnamonPop[id] = new __MODAL_MOBILE({
		v_url:url,
		fn_callback:function (J,_this) {
			TOMATOFIELD.setDatepicker();
			console.log(_template);
			refresher.execute("tinymceSetting",300,_template);
		},
		fn_callbackClose:function (J,_this) {
			// console.log($('table[bidentity='+_id+']')[0]);
			tableSortSearch.auto($('table[bidentity='+_id+']')[0]);
			_this.if_window().remove();
		}
	});
	else {
		cinnamonPop[id].v_url(url);
		cinnamonPop[id].fn_start();
	}
}

function mcrmEmailTemplateTinyMce (opt) {
	this.standby(opt,{
		initJ:[],
		height:false
	});
}

mcrmEmailTemplateTinyMce.prototype = new __TOMATOOBJECT();
mcrmEmailTemplateTinyMce.prototype.fn_start = function () {
	refresher.execute("tinymceSetting",this.height(),this.initJ());
}
var METT = new mcrmEmailTemplateTinyMce();


function __MAKEREQUIRED (opt) {
	this.standby(opt,{
		rule:[],
		if_canvas:null,
		if_table:null
	});
	console.log("__MAKEREQUIRED");
	console.log(this.rule());
}
__MAKEREQUIRED.prototype = new __TOMATOOBJECT();
__MAKEREQUIRED.prototype.fn_checkSubmit = function () {
	console.log("fn_checkSubmit");
	for (var key in this.rule()) {
		if (this.rule()[key].exception) {
			// console.log("exception test");
			// console.log(this.rule()[key].exception.name);
			// console.log($(this.if_table()));
			// console.log($(this.if_table()).find("."+this.rule()[key].exception.name+"[tomato=true]"));	
			// console.log($(this.if_table()).find("."+this.rule()[key].exception.name+"[tomato=true]").val());
			// console.log(this.rule()[key].exception.value);
			// return this.fn_reject($(this.if_table()).find("."+this.rule()[key].exception.name+"[tomato=true]"),"");

			if ($(this.if_table()).find("."+this.rule()[key].exception.name+"[tomato=true]").val() == this.rule()[key].exception.value) continue;
		} 
		var name = this.rule()[key].name;
		var element = $(this.if_canvas()).find("."+key+"[tomato=true]") || $(this.if_canvas()).find("."+key).closest("div").find("[tomato=true]");
		if (element.length==0) continue;
		var element = $.map(element,function (e) {return e});
		for (var e in element) {
			var e = $(element[e]);
			if (!e.val()) return this.fn_reject(e,name+(this.fn_tSound(name)=="ᆧ" ? "는":"은")+ " 필수 입력 항목입니다.");
			if (
				e.val().length < this.rule()[key].min && this.rule()[key].min
				||
				e.val().length > this.rule()[key].max && this.rule()[key].max
				) return this.fn_reject(e,name+(this.fn_tSound(name)=="ᆧ" ? "는":"은")+ this.rule()[key].min +"자 이상, "+this.rule()[key].max+" 이하로 입력하셔야 합니다.");
			if (this.rule()[key].type=="password" && !this.fn_checkPassword(e.val())) return this.fn_reject(e,name+"에는 숫자와 특수문자가 반드시 들어가야 합니다.");
			if (this.rule()[key].compare && e.val()!=$("."+this.rule()[key].compare).val()) return this.fn_reject(e,name+(this.fn_tSound(name)=="ᆧ" ? "가":"이")+" 일치하지 않습니다."); 
		}
		
	}
	return true;
	// return true;
}
__MAKEREQUIRED.prototype.fn_start = function () {
	var t;
	for (var key in this.rule()) {
		t = $(this.if_canvas()).find("."+key).closest(".form-group");
		if (!t.length) t = $(this.if_canvas()).find("."+key).closest("div");
		t.addClass("required");
		// if (this.rule()[key].max) $("."+key).attr("maxLength",this.rule()[key].max);
		// if (this.rule()[key].type=="num") $("."+key).keyup(function (event,t) {
		// 	console.log(event.keyCode);
		// 	$(this).val($(this).val().replace(/[^0-9]/gi,''));
		// })
	}
}
__MAKEREQUIRED.prototype.fn_reject = function (target,msg) {
	target.focus();
	console.log(target.val());
	alert(msg);
	return false;
}
__MAKEREQUIRED.prototype.fn_tSound = function (name) {
	//자음으로 끝나는가 여부''
	return tSound(name.substring(name.length-1,name.length));
}
__MAKEREQUIRED.prototype.fn_checkPassword = function (str) {
	var pattern1 = /[0-9]/;	// 숫자 
	var pattern2 = /[a-zA-Z]/;	// 문자 
	var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;	// 특수문자 
	return (pattern1.test(str) && pattern2.test(str) && pattern3.test(str));
}

function tSound(a)
{
	var r = (a.charCodeAt(0) - parseInt('0xac00',16)) % 28;
	var t = String.fromCharCode(r + parseInt('0x11A8') -1);
	return t;
}

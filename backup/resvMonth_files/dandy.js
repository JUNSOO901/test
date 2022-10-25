function getCurrency(currencyId,callback) {
	$.getJSON ("/api/getCurrency.php",{"currency":currencyId},function (J) {if(typeof callback == 'function') callback(J.rate);})
}
function setCurrency (currencyId) {
	if (!currencyId) currencyId = 1;
	getCurrency(currencyId,function (r) {if (!r) return false;CRC[currencyId]=r;setCurrency(currencyId+1)})
}

var CRC=[];
// refresher.set("onload",setCurrency,"setCurrency");

function openTourReference (tourId) {
	var url = "/d_orderJP?tourId="+tourId;
	window.open(url,"tour_"+tourId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}

function openTourWindow (tourId) {
	var url = "/accountBook/mod/"+tourId+"?openOnlyTour=1";
	window.open(url,"accountBook_"+tourId,"width=1350,height=700,menubar=no,toolbar=no");
	return false;
}
function openTourOpener (tourId) {
	var url = "/accountBook/mod/"+tourId;
	opener.location.href = url;
	window.close();
	return false;
}

function openHotelWindow (tourId) {
	var url = "/hotel_main?etc_bst_tour___tourReference="+tourId;
	window.open(url,"hotel_main_"+tourId,"width=1350,height=400,menubar=no,toolbar=no");
	return false;
}


function openPlanPWindow (tourId) {
	var url = "/han_plan/mod/"+tourId+"?openOnlyTour=1";
	window.open(url,"han_plan_"+tourId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}
function openPlanPOpener (tourId) {
	var url = "/han_plan/mod/"+tourId;
	opener.location.href = url;
	window.close();
	return false;
}

function openClosingWindow (tourId) {
	var url = "/2451/view/"+tourId+"?openOnlyTour=1";
	window.open(url,"accountBook_"+tourId,"width=1000,height=700,menubar=no,toolbar=no");
	return false;
}

function openInvoiceWindow (tourId) {
	var url = "/2455/view/"+tourId+"?openOnlyTour=1";
	window.open(url,"tour_"+tourId,"width=1000,height=700,menubar=no,toolbar=no");
	return false;
}
function openOptionWindow (tourId) {
	var url = "/2454/view/"+tourId+"?openOnlyTour=1";
	window.open(url,"tour_"+tourId,"width=1000,height=700,menubar=no,toolbar=no");
	return false;
}
function openCommissionWindow (tourId) {
	var url = "/2453/view/"+tourId+"?openOnlyTour=1";
	window.open(url,"tour_"+tourId,"width=1000,height=700,menubar=no,toolbar=no");
	return false;
}



function openPlanIWindow (tourId) {
	var url = "/Plan_incentive/mod/"+tourId+"?openOnlyTour=1";
	window.open(url,"tour_"+tourId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}
function openPlanIOpener (tourId) {
	var url = "/Plan_incentive/mod/"+tourId;
	opener.location.href = url;
	window.close();
	return false;
}

function openTourAccount (tourId) {
	var url = "/tourAccount/?tourId="+tourId;
	window.open(url,"tourAccount_"+tourId,"width=1300,height=700,menubar=no,toolbar=no");
	return false;
}

function openPlanAccount (planId) {
	var url = "/planAccount/?planId="+planId;
	window.open(url,"planAccount"+planId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}

function openScheduleJapan (tourId) {
	var url = "/tourScheduleJapan/?tourId="+tourId;
	window.open(url,"tourScheduleJapan"+tourId,"width=1150,height=600,menubar=no,toolbar=no");
	return false;
}

function openTourProfit (tourId) {
	var url = "/d_profit?tourId="+tourId;
	window.open(url,"d_profit_"+tourId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}

function openTourAllLog (tourId) {
	var url = "/d_tourlog?tourId="+tourId;
	window.open(url,"tour_allLog_"+tourId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}

function openNamelist (tourId) {
	var url = "/d_namelist?tourId="+tourId;
	window.open(url,"d_namelist_"+tourId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}

function openPlanEsitimatePkg (planId) {
	var url = "/planEsitimatePkg/?planId="+planId;
	window.open(url,"planEsitimatePkg"+planId,"width=1150,height=700,menubar=no,toolbar=no");
	return false;
}

function openMcrmCustomer (customerId,resvId,rBoard) {
	if (rBoard=="cal_newResv") var tType = "reservation";
	else var tType = "visit_reservation";
	if (resvId!='undefined') var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/"+resvId;
	else var url = "/customers/mod/"+customerId+"?_____order=-1";
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer"+customerId,popOption);
	return false;
}

function openMcrmCustomerNewTab (customerId,resvId,rBoard,netTab) {
	if (rBoard=="cal_newResv") var tType = "reservation";
	else var tType = "visit_reservation";
	if (resvId!='undefined') var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/"+resvId;
	else var url = "/customers/mod/"+customerId+"?_____order=-1";
	window.open(url,'_blank');
	return false;
}

function openMcrmCustomerList (customerId) {
	var tType = "counsel";
	var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType;
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer View"+customerId,popOption);
	return false;
}

function openMcrmCustomerListInvitator (customerId) {
	var tType = "counsel";
	var url = "/customers/list?etc_bst_customers__invitator="+customerId;
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer List"+customerId,popOption);
	return false;
}

function openNewMcrmCustomer (name="") {
	var url = "/customers/insert/?_____order=-1&return=calendar&name="+name;
    var popOption = "width=1085, height=700, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr New Customer",popOption);
	return false;
}

function openNewMcrmCalendar (counselId) {
	var url = "/resvMonth/?_____order=-1&return=calendar&counselId="+counselId;
    var popOption = "width=1350, height=960, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr New Calendar "+counselId,popOption);
	return false;
}

function openNewMcrmCalendar2 (reservationId) {
	var url = "/resvMonth/?_____order=-1&return=calendar&reservationId="+reservationId;
    var popOption = "width=1360, height=960, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr New Calendar "+reservationId,popOption);
	return false;
}


function openMcrmCustomerPayment (customerId,reservationId) {
	var url = "/customers/mod/"+customerId+"?_____order=-1#receipt/insert/?1=1&reservationId="+reservationId;
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer Payment"+customerId,popOption);
	return false;
}

function openMcrmCustomerPayment2 (customerId,receiptId) {
	var url = "/customers/mod/"+customerId+"?_____order=-1#receipt/mod/"+receiptId;
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer Payment"+customerId,popOption);
	return false;
}

function openMcrmCustomerPayment3 (customerId) {
	var url = "/customers/mod/"+customerId+"?_____order=-1#receipt/";
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer Payment"+customerId,popOption);
	return false;
}

function openMcrmCustomerCounsel (customerId,counselId) {
	var tType = "counsel";
	if (counselId!='undefined'&&counselId>'') var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/mod/"+counselId;
	else var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/insert";
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer"+customerId,popOption);
	return false;
}

function openMcrmCustomerVisit (customerId,counselId) {
	var tType = "visit_reservation";
	if (counselId!='undefined'&&counselId>'') var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/mod/"+counselId;
	else var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/insert";
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer"+customerId,popOption);
	return false;
}

function openMcrmCustomerResv (customerId,counselId) {
	var tType = "reservation";
	if (counselId!='undefined'&&counselId>'') var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/mod/"+counselId;
	else var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType+"/insert";
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Customer"+customerId,popOption);
	return false;
}

function openMcrmCustomerPenchart (customerId) {
	var url = "/chart_customers/view/"+customerId;
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Penchart"+customerId,popOption);
	return false;
}

function openMcrmCustomerBeforeAfter (customerId) {
	var tType = "beforeAfter";
	var url = "/customers/mod/"+customerId+"?_____order=-1#"+tType;
    var popOption = "width=1600, height=1350, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr BeforeAfter"+customerId,popOption);
	return false;
}

function openMcrmPaymentHistory (historyId) {
	var url = "/payment_history?historyId="+historyId;
    var popOption = "width=1600, height=950, resizable=no, scrollbars=yes, status=no, top=100, left=200;";    //팝업창 옵션(optoin) Customers
	window.open(url,"AlmightyDr Payment History"+historyId,popOption);
	return false;
}


function goTour(target) {
	var tourReference = $(target).val();
	_goTour(tourReference);
}
function _goTour(tourReference) {
	if (!tourReference) return false;
	location.href = '/searching?customers='+tourReference;
}
function shortCutGoTour() {
	$("#shortCutGoTour input").remove();
	$("#shortCutGoTour").remove();
	$("body").append("<div id='shortCutGoTour'><label>고객 이름을 입력하세요</label><input></div>");
	var ww = document.documentElement.clientWidth;
	var hh = document.documentElement.clientHeight;
	$("#shortCutGoTour").css("left",(ww/2)+"px").css("top",(hh/4)+"px");
	$("#shortCutGoTour input").keyup(function (e) {
		if (e.keyCode==27) $("#shortCutGoTour").remove();
	}).blur(function () {
		$(this).parent().remove();
	}).change(function () {
		goTour(this);
	}).focus();
}


function __cuttingDocument (H,doc,tr) {
	this.maxHeight=(H?H:0);
	this.tr = $.map($(tr),function (d) {$(d).attr("id",newId());return [d]});
	// this.tr = tr;
	this.pointer = 0;
	this.doc = doc;
	this.hh = $("body").height();
	if (this.hh>this.maxHeight) {
		this.pageA = [];
		this.findCuttingArea();
		this.copy();
		this.cut();
	}
}
__cuttingDocument.prototype = {
	copy:function () {
		var page = Math.floor(this.hh/this.maxHeight);
		this.pageA[0]=$(this.doc);
		i=0;while (i++<page) {
			// console.log("make page"+i);
			this.pageA[i]=$(this.doc).clone();
			$(this.pageA[i-1]).after(this.pageA[i]);
		}
	},
	findCuttingArea:function () {
		var colspan=$(this.tr[0]).closest("table").children("colgroup").children("col").length;
		var _this = this;
		for (i in this.tr) {

			var top = $(this.tr[i]).position().top;

			if (top>this.maxHeight) {
				if (this.pointer<Math.floor(top/this.maxHeight)) {
					this.pointer++;
					$(this.tr[i-1]).addClass("cutHere").attr("cutNo",this.pointer);
				}
			}
		}
	},
	cut:function () {
		for (i in this.pageA) {
			var pageNo = i*1+1;
			var cutPageNo = 0;

			$(this.pageA[i]).find(".unit").each(function () {
				console.log(pageNo+":"+cutPageNo);
				if ($(this).hasClass("cutHere")) cutPageNo = $(this).attr("cutNo")*1;
				if (pageNo<=cutPageNo) $(this).hide();
				if (pageNo>cutPageNo+1) $(this).hide();
			})
		}
	}
}



//숫자만 입력 받기
function onlyNumber(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 9 ) 
		return;
	else
		return false;
}

//숫자가 아닌 캐릭터 지우기
function removeChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
		return;
	else
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
}















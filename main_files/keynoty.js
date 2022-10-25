$(document).ready(function(){
    $('input.text').addClass('form-control');
    $('input.password').addClass('form-control');
    $('select').addClass('form-control');

    $('.nav-search-open').on('click',function(){
        $('.nav-search').addClass('show');
        $('.navbar-brand').addClass('off');
    })
    $('.nav-search-close').on('click',function(){
        $('.nav-search').removeClass('show');
        $('.navbar-brand').removeClass('off');
    })
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// extension:
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

var multiselectFilterSticky = function(){
    $('.multiselect-container').scroll(function () {
        var filter = $('.multiselect-filter',this);
        filter.css('opacity',0);
        var $this = $(this);
        if ($this.data('scrollTimeout')) {
          clearTimeout($this.data('scrollTimeout'));
        }
        var callback = function(){
            var scroll = $this.scrollTop();
            var tY = 'translateY('+scroll+'px)';
            filter.css('transform',tY);
            filter.css('opacity',1);
        }
        $this.data('scrollTimeout', setTimeout(callback));
    })
    // $('.multiselect-container').scrollEnd(function (event) {
    //     console.log($(this));
    //     var scroll = $(this).scrollTop();
    //     var tY = 'translateY('+scroll+'px)';
    //     var filter = $('.multiselect-filter',this);
    //     filter.css('transform',tY);
    //     filter.css('opacity',1);
    // });

}

// var tableHeadSticky = function(){
//     $('.fixed-table').scroll(function () {
//         console.log('test');
//         var head = $('.fixed-thead',this);
//         head.css('opacity',0);
//         var $this = $(this);
//         if ($this.data('scrollTimeout')) {
//           clearTimeout($this.data('scrollTimeout'));
//         }
//         var callback = function(){
//             var scroll = $this.scrollTop();
//             var tY = 'translateY('+scroll+'px)';
//             head.css('transform',tY);
//             head.css('opacity',1);
//         }
//         $this.data('scrollTimeout', setTimeout(callback));
//     })
// }


function getRecentDate(){
    var dt = new Date();

    var recentYear = dt.getFullYear();
    var recentMonth = dt.getMonth() + 1;
    var recentDay = dt.getDate();

    if(recentMonth < 10) recentMonth = "0" + recentMonth;
    if(recentDay < 10) recentDay = "0" + recentDay;

    return recentYear + "-" + recentMonth + "-" + recentDay;
}

function getPastDate(period){
    var dt = new Date();

    dt.setMonth((dt.getMonth() + 1) - period);

    var year = dt.getFullYear();
    var month = dt.getMonth();
    var day = dt.getDate();

    if(month < 10) month = "0" + month;
    if(day < 10) day = "0" + day;

    return year + "-" + month + "-" + day;
}


//Sticky table

function initStickyTable(className, topObject){
  var table = $("."+className);
  var top = $("."+topObject);
  if (!table || !top) {
    return;
  }
  for (let i = 0; i< table.length; i++) {
    window.addEventListener('scroll', function(e){
      var object = $(table[i]);
      var y1 = object.offset();
      var y2 = top.offset();
      var y2b = y2.top + top.height();
      var gap = y2b - y1.top;
      if(y1.top < y2b && gap < object.height()) {
        object.find('thead').css('transform','translateY('+ gap +'px)');
      } else {
        object.find('thead').css('transform','none');
      }
    });

  }
}
$(document).ready(function(){
  initStickyTable('sticky-table', 'navbar');
})

$(document).ready(function(){
  $("th.k-tooltip").append("<span class='tooltipmark'> * </span>");
})

function calendarSideToggle () {
  if($('.calendar-side').hasClass('d-none')) {
    $('.calendar-side').removeClass('d-none');
  } else {
    $('.calendar-side').addClass('d-none');
  }
}

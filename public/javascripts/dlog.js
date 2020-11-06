function dlog(obj) {
  var objString = JSON.stringify(obj);
  var $dlogList = $('.dlog-list');
  var liclass = arguments[1] ? arguments[1] : 'notice';
  $dlogList.append(`<li class="${liclass}">${objString}</li>`);
  //          $('.dlog-wrapper').effect("shake", { direction: 'up', times:2, distance:2 },100);
}

export default dlog;

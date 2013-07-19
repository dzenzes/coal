chrome.tabs.onActiveChanged.addListener(tab_updated);

function onRequest(request, sender, callback) {
  if (request.action == 'getJSON') {
    $.getJSON(request.url, callback);
  }
  if (request.action == 'ajax')
  {
    $.ajax({
    type : request.type,    
    url : request.url,
    async : async,
    success : callback
    });
  }
  if (request.action == 'get') {
    $.get(request.url, callback);
  }
 
   if (request.action == 'post') {
    $.post(request.url, request.data, callback);
  }
}
chrome.extension.onRequest.addListener(onRequest);

chrome.browserAction.onClicked.addListener(function(tab) {
  if (localStorage["buttonAction"] == 'addFeed') {
    chrome.tabs.executeScript(tab.id, {code: "s=document.createElement('script');s.type='text/javascript';s.src='"+localStorage['page']+"/?feedlet&js&'+(new Date()).getTime();document.getElementsByTagName('head')[0].appendChild(s);"});
  } else {
    chrome.tabs.create({'url': localStorage["page"]}, function(tab) {});
  }
});

function tab_updated(tabId){
  chrome.tabs.get(tabId, function(tab){
    if(typeof localStorage["page"] != 'undefined'){
      if(typeof localStorage["api_key"] != 'undefined'){
        page = localStorage["page"];
        api = localStorage["api_key"];
        var reqURL = page + "/?xhr";
        $.ajax({
          type: 'POST',
          url: reqURL,
          data: {
            api_key: api
          },
          success: function(result){
            console.log(result);
            var unread = result.match(/Fever.Reader.totalUnread\t*= ([0-9]*)/)[1];
            if (unread != 0) {
              chrome.browserAction.setBadgeText({ text : unread + ""});
            }
          }
        });
      }
      else{
        console.log("no api");
      }
    }else{
      console.log("no page");
    }
  })
}

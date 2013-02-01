/*
 * AJAX file for needed ajax requests
 */
(function(window) {
  window.pollFeed = function () {
    $.ajax({ 
      url: "/api/feed", 
      success: function(data, status, res){
        updateFeed(data);
        setTimeout('pollFeed()', 5000);
      }, 
      dataType: "json",
      timeout: 30000 
    });
  };
})(window)
/*
 * AJAX file for needed ajax requests
 */
(function(window) {
  window.pollFeed = function (userId) {
    $.ajax({ 
      url: "/api/feed", 
      success: function(data, status, res){
        updateFeed(data, userId);
        setTimeout(function() {
          pollFeed(userId);
        }, 5000);
      }, 
      dataType: "json",
      timeout: 30000 
    });
  };
})(window)
/*
 * Util file for front-end JavaScript.
 */
(function(window) {
  // Creates a post div from post JSON
  window.createFeedPost = function (post, userId) {
    var $outer = $('<div style="display: none;" class="post" id="' + post._id + '"></div>');
    var $post = $('<div class="row"></div>');
    $outer.append($post);
    if (String(post.from._id) == String(userId)) {
      $close = $("<a href='#removeModal' role='button' data-toggle='modal' data-id='" + 
        post._id + "' class='close remove-post'> &times;</a>")
      $close.on('click', function() {
        var id = $(this).data('id');
        $('#post-input').val(id);
      });
      $post.append($close);
    }
    $post.append("<a href='/user/"+post.from._id+"'><img src='"+ 
      post.from.gravatar + "&s=40' class='pull-left profile-left'></img></a></h4>");
    $post.append("<strong><a href='/user/"+post.from._id+"'>"+post.from.name+"</a></strong>");
    $post.append(" posted to ");
    $post.append("<strong><a href='/course/"+post.course._id+"'>"+post.course.name+"</a></strong>");
    $post.append("<p>"+post.message+"</p>");

    return $outer;
  }

  // Adds new posts from JSON Array of posts to div with id of feed
  window.updateFeed = function (posts, userId) {
    tmp = []
    posts.some(function (post) {
      if ($('#' + post._id).length > 0) {
        return true;
      } else {
        var $post = createFeedPost(post, userId);
        tmp.unshift($post)
      }
    });
    tmp.forEach(function (post) {
      $('#feed').prepend(post);
      post.show('slow');
    });
  }
})(window)
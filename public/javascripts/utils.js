/*
 * Util file for front-end JavaScript.
 */
(function(window) {
  // Creates a post div from post JSON
  window.createFeedPost = function (post) {
    var $post = $('<div style="display: none;" class="post" id="' + post._id + '"></div>');
    $close = $("<a href='#removeModal' role='button' data-toggle='modal' data-id='" + post._id + "' class='close remove-post'> &times;</a>")
    $close.on('click', function() {
      var id = $(this).data('id');
      $('#post-input').val(id);
    });
    $post.append($close);
    $post.append("<h4><a href='/course/"+post.course._id+"'>"+post.course.name+"</a></h4>");
    $post.append("<p>"+post.message+"</p>");
    $post.append("<h6>"+post.from.name+"</h6>");
    return $post;
  }

  // Adds new posts from JSON Array of posts to div with id of feed
  window.updateFeed = function (posts) {
    tmp = []
    posts.some(function (post) {
      var $post = createFeedPost(post);
      if ($('#' + post._id).length > 0) {
        return true;
      } else {
        tmp.unshift($post)
      }
    });
    tmp.forEach(function (post) {
      $('#feed').prepend(post);
      post.show('slow');
    });
  }
})(window)
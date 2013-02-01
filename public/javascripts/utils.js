/*
 * Util file for front-end JavaScript.
 */
(function(window) {
  // Creates a post div from post JSON
  window.createPost = function (post) {
    var $post = $('<div class="post" id="' + post._id + '"></div>');
    $post.append("<h4><a href='/course/"+post.course._id+"'>"+post.course.name+"</a></h4>");
    $post.append("<p>"+post.message+"</p>");
    $post.append("<h6>"+post.from.name+"</h6>");
    $.data($post, 'id', post._id);
    return $post;
  }

  // Adds new posts from JSON Array of posts to div with id of feed
  window.updateFeed = function (posts) {
    tmp = []
    posts.some(function (post) {
      var $post = createPost(post);
      if ($('#' + post._id).length > 0) {
        console.log("OLD DATA");
        return true;
      } else {
        tmp.unshift($post)
      }
    });
    tmp.forEach(function (post) {
      $('#feed').prepend(post);
    });
  }
})(window)
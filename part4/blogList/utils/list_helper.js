const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  let sum = 0;

  for (const blog of blogs) {
    sum += blog.likes;
  }

  return sum;
};

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return 0
    }

    let maxLikes = 0;
    let blogMostLiked = {}

    for(const blog of blogs){
        if(blog.likes > maxLikes){
            maxLikes = blog.likes;
            blogMostLiked = blog;
        }
    }

    return blogMostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};

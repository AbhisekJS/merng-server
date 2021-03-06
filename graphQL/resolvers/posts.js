const {AuthenticationError,UserInputError} = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports={
  Query:{
    async getPosts(){
      try{
        const posts = await Post.find().sort({createdAt: -1});
        return posts;
      }catch(err){
        throw new Error(err)
      }
    },
    async getPost(_,{postId}){
      try{
        const post = await Post.findById(postId);
        if(post){
          return post;
        }else{
          throw new Error("Post Not Found")
        }
      }catch(err){
        throw new Error(err);
      }
    }
  },
  Mutation:{
     createPost: async (_,{body},context)=>{
      const user = checkAuth(context);
      if(body.trim()===''){
        throw new Error('Post body must not be empty');
      }
      console.log(user)
      const newPost = new Post({
        user: user.id,
        username: user.username,
        body,
        createdAt: new Date().toISOString()
      })

      const post = await newPost.save();

      
      return post;
    },
     deletePost: async(_,{postId},context)=>{
      const user = checkAuth(context);
      
      const post = await Post.findById(postId)
      try{
        if(post.username=== user.username){
          await post.delete()
          return 'Post Deleted Successfully'
        }else{
          throw new AuthenticationError('Action Not Allowed')
        }
      }catch(err){
        throw new Error(err);
      }
    },
    likePost: async (_,{postId},context)=>{
      const {username} = checkAuth(context);

      const post = await Post.findById(postId);
      if(post){
        if(post.likes.find((like)=>like.username === username)){
          post.likes=post.likes.filter((like)=>like.username !==username);
        }else{
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }
      
      await post.save();
      return post;
      }else{
        throw new UserInputError('Post not found');
      }
    },
  }
}

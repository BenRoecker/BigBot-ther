import {Metadata,} from '@devvit/protos';
import { Devvit, RedditAPIClient} from '@devvit/public-api';
const reddit = new RedditAPIClient();
/**
 * Declare the custom actions we'd like to add to the subreddit
 */
Devvit.addTrigger({
  events: [Devvit.Trigger.PostSubmit, Devvit.Trigger.CommentSubmit],
  async handler(request, Metadata? : Metadata) {
    var subs = (await reddit.getWikiPage(request.event.subreddit?.name || '', "bigbot-ther", Metadata)).content.split(/ +\n/);
    if (request.type == Devvit.Trigger.PostSubmit) {

      var OPpost = reddit.getPostsByUser({username : request.event.author?.name || ''} , Metadata).all();
          var NotOkay = false;
          (await OPpost).forEach(element => {
            if(subs.includes(element.subredditName)){
              NotOkay = true;
          }
          });
          var OPcomment = reddit.getCommentsByUser({username : request.event.author?.name || ''}, Metadata).all();
          (await OPcomment).forEach(async element => {
            var Post = reddit.getPostById(element.postId, Metadata);
            var subreddit = (await Post).subredditName;
            if(subs.includes(subreddit)){
              NotOkay = true;
            }  
          })
          if(NotOkay){
            reddit.remove(request.event.post?.id || '', false, Metadata)
          }
    } else if (request.type === Devvit.Trigger.CommentSubmit) {
      var username = request.event.author?.name || '';
          var OPpost = reddit.getPostsByUser({username :username} , Metadata).all();
          var NotOkay = false;
          (await OPpost).forEach(element => {
            if(subs.includes(element.subredditName)){
              NotOkay = true;
          }
          });
          var OPcomment = reddit.getCommentsByUser({username : username}, Metadata).all();
          (await OPcomment).forEach(async element => {
            var subreddit = (await reddit.getPostById(element.postId, Metadata)).subredditName;
            if(subs.includes(subreddit)){
              NotOkay = true;
            }  
          })
          if(NotOkay){
            reddit.remove(request.event.comment?.id || '', false, Metadata)
          }
    }
  },
});


export default Devvit;

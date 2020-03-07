import { Post } from "./post.model";
import { Subject, Observable, BehaviorSubject } from "rxjs";

export class PostService {
  private subject = new BehaviorSubject<string>("test");
  private posts: Post[] = [{
    title: "testing", content: "testing"
  }];
  private postUpdated = new BehaviorSubject<Post[]>(this.posts);

  getPosts() {
    /*ARRAYS AND OBJECTS ARE REFERNCE TYPES: A ref type only returns the address when copied */
    return [...this.posts]; //[...] is a special feature to make a true copy of the post
    /*^^^New array is being created and sent ... pulls the array out of Post[] and makes a copy*/
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postUpdated.next(this.posts);
  }
}

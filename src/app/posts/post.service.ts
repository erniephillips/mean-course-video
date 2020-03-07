import { Post } from "./post.model";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PostService {
  private subject = new BehaviorSubject<string>("test");
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  // getPosts() {
  //   /*ARRAYS AND OBJECTS ARE REFERNCE TYPES: A ref type only returns the address when copied */
  //   return this.posts; //[...] is a special feature to make a true copy of the post
  //   /*^^^New array is being created and sent ... pulls the array out of Post[] and makes a copy*/
  // }

  getPostUpdateListener() {
    console.log()
    return this.postUpdated.asObservable();
  }

  addPost(post: Post) {
    this.posts.push(post);
    this.postUpdated.next(this.posts);
  }
}

import { Post } from "./post.model";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { stringify } from "querystring";

@Injectable({ providedIn: "root" })
export class PostService {
  private subject = new BehaviorSubject<string>("test");
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPosts() {
    //with observables in Angular Core, you do not need to ngDestroy b/c it is handled by angular
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(responseData => {
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http
      .put<{ message: string }>("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    console.log("id: " + postId);
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/posts/" + postId)
      .subscribe(responseData => {
        console.log(responseData.message);
        const updatedPosts = this.posts.filter(post => post.id !== postId); //filter in memory object and show all results but what was currently deleted
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }
}

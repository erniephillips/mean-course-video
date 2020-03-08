import { Post } from "./post.model";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { stringify } from "querystring";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostService {
  private subject = new BehaviorSubject<string>("test");
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {
    //add router to re-route user to post list after creating or updating post
  }

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
              id: post._id,
              imagePath: post.imagePath
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
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); //formdata is js method that allows combination of text values and BLOBs
    postData.append("title", title), postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
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

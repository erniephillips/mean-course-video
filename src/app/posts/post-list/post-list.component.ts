import { Component, Input, Injectable, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
  providers: [PostService]
})
@Injectable({ providedIn: "root" })
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  // postService: PostService;//insead of this, add public keyword

  // constructor(postService: PostService) {
  //   this.postService = postService;
  // }

  posts: Post[] = [];
  private postSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      console.log(posts)
    });
    // this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
    //   console.log("string" + posts)
    // })
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}

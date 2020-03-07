import { Component, Input, Injectable, OnInit, OnDestroy, OnChanges } from "@angular/core";
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
export class PostListComponent implements OnInit, OnDestroy, OnChanges {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  // postService: PostService;//insead of this, add public keyword

  // constructor(postService: PostService) {
  //   this.postService = postService;
  // }

  @Input() postList: Post[];
  private postSub: Subscription;

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.postSub = this.postService.getPostUpdateListener().pipe().subscribe(
      (posts: Post[]) => {
        this.postList = posts;
        console.log(posts)
      });
  }

  ngOnChanges() {
    console.log(this.postList)
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}

import { Component, Output, Injectable, OnInit } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  private mode = "create";
  private postId: string;
  post: Post;

  //activated route will be used in this case to check if a post is being created or edited, and render form accordingly
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    //check what route is
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        //postId defined in app-routing.module.ts
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.dir(form);
    if (this.mode === "create") {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }

    form.resetForm();
  }
}

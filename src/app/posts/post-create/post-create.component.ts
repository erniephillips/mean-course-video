import { Component, Output, Injectable } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { PostService } from "../post.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})

export class PostCreateComponent {

  constructor(public postService: PostService) { }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.dir(form);
    const post: Post = { title: form.value.title, content: form.value.content };
    this.postService.addPost(post);
    form.resetForm();
  }
}

import { Component, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  isLoading = false;
  post: Post;
  form: FormGroup;
  imagePreview: string;

  private mode = "create";
  private postId: string;

  //activated route will be used in this case to check if a post is being created or edited, and render form accordingly
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    //init the formgroup for html structure
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] })
    });

    //check what route is
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        //postId defined in app-routing.module.ts
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        //show spinner while fetching result
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          //hide spinner after fetch
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; //files takes array, specify [0] to take first
    this.form.patchValue({
      //set value is to set all values, patch updates specific properties
      image: file
    });
    this.form.get("image").updateValueAndValidity(); //informs angular that value was changed and it should re-eval, store val internally, and check if new val is valid
    const reader = new FileReader(); //create reader
    //define what should happen after loading file
    reader.onload = () => {
      //function that is executed when it is done loading resource
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file); //load file
  }
}

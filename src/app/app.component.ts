import { Component, Input } from "@angular/core";
import { Post } from './posts/post.model';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  receivePost: Post[];

  onAdd(posts: Post[]):void{
    this.receivePost = posts;
  }

}

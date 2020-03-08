import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"; //enables router module
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", component: PostCreateComponent },
  { path: "edit/:postId", component: PostCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //make angular router aware of routes
  exports: [RouterModule] //export module to used by app module
})
export class AppRoutingModule {}

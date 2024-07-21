import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostApiService } from '../../../../api/service/post-api.service';
import { PostResponse } from '../../../../api/interface/response/post-response';
import { ApiResponse } from '../../../../api/interface/response/apiResponse';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  postsResponse: PostResponse[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private postApiService: PostApiService,
  ) { }

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts(): void {
    const sub = this.postApiService.findAll().subscribe({
      next: (apiResponse: ApiResponse<PostResponse[]>) => {
        const postResponseList = apiResponse.result;
        if (postResponseList) {
          this.postsResponse = postResponseList;
        } else {
          console.error('No result found in response:', apiResponse.message);
        }
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

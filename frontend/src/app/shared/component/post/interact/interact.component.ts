import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LikeApiService } from '../../../../api/service/rest-api/like-api.service';
import { LikeRequest } from '../../../../api/model/request/like-request';
import { ApiResponse } from '../../../../api/model/response/api-response';
import { LikeResponse } from '../../../../api/model/response/like-response';

@Component({
  selector: 'app-interact',
  templateUrl: './interact.component.html',
  styleUrl: './interact.component.scss',
  providers: [MessageService]
})
export class InteractComponent implements OnInit, OnDestroy {
  @Input() postId!: string;
  @Input() isLogin!: boolean
  @Input() countLikes: number = 0;
  @Output() likeFailed: EventEmitter<void> = new EventEmitter<void>();

  isLiked: boolean = false;
  likeRequest: LikeRequest = {}
  private subscription: Subscription = new Subscription();

  constructor(
    private likeService: LikeApiService,
  ) { }

  ngOnInit(): void {
    this.likeRequest.postId = this.postId
    this.getIsLiked();
  }

  getIsLiked() {
    if (this.isLogin) {
      const sub = this.likeService.isLiked(this.likeRequest).subscribe({
        next: (apiResponse: ApiResponse<boolean>) => {
          const isLikedResponse = apiResponse.result
          if (isLikedResponse) {
            this.isLiked = isLikedResponse;
          } 
        },
        error: (error) => {
          console.error('Error getting Is liked', error);
        }
      });
      this.subscription.add(sub);
    }
  }

  toggleLike() {
    if (this.isLogin) {
      const sub = this.likeService.toggle(this.likeRequest).subscribe({
        next: (apiResponse: ApiResponse<LikeResponse>) => {
          const likeResponse = apiResponse.result
          if (likeResponse) {
            this.isLiked = true;
            this.countLikes++
          }
          else {
            this.isLiked = false;
            this.countLikes--
          }
        },
        error: (error) => {
          console.error('Error to toggle Like:', error);
        }
      });
      this.subscription.add(sub);
    }
    else {
      this.likeFailed.emit();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

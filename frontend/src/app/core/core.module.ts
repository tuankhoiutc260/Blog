import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleIdToNamePipe } from './pipe/role-id-to-name.pipe';
import { HtmlToPlaintextPipe } from './pipe/html-to-plaintext.pipe';
import { DataUriToBlobPipe } from './pipe/data-uri-to-blob.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { UserIdToUserNamePipe } from './pipe/user-id-to-user-name.pipe';
import { UserNameToUserIdPipe } from './pipe/user-name-to-user-id.pipe';
import { UserIdToFullNamePipe } from './pipe/user-id-to-full-name.pipe';
import { UserIdToUserImagePipe } from './pipe/user-id-to-user-image.pipe';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { UserIdToUserPipe } from './pipe/user-id-to-user.pipe';



@NgModule({
  declarations: [
    RoleIdToNamePipe,
    HtmlToPlaintextPipe,
    DataUriToBlobPipe,
    TruncatePipe,
    UserIdToUserNamePipe,
    UserNameToUserIdPipe,
    UserIdToFullNamePipe,
    UserIdToUserImagePipe,
    TimeAgoPipe,
    UserIdToUserPipe

  ],
  imports: [
    CommonModule
  ],
  exports: [
    RoleIdToNamePipe,
    HtmlToPlaintextPipe,
    DataUriToBlobPipe,
    TruncatePipe,
    UserIdToUserNamePipe,
    UserNameToUserIdPipe,
    UserIdToFullNamePipe,
    UserIdToUserImagePipe,
    TimeAgoPipe,
    UserIdToUserPipe,

  ]
})
export class CoreModule { }

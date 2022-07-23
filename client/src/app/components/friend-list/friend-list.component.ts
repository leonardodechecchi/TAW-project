import { Component, OnInit } from '@angular/core';
import { Relationship } from 'src/app/models/Relationship';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'friend-list',
  templateUrl: './friend-list.component.html',
})
export class FriendListComponent implements OnInit {
  public relationships: Relationship[];

  constructor(
    private accountService: AccountService,
    private userService: UserService
  ) {
    this.relationships = [];
  }

  ngOnInit(): void {
    this.populateFriendList();
  }

  private populateFriendList(): void {
    const userId: string = this.accountService.getId();
    this.userService.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationships = relationships;
      },
    });
  }
}

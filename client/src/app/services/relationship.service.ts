import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from '../models/Chat';
import { environment } from 'src/environments/environment';
import { Relationship } from '../models/Relationship';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class RelationshipService implements OnInit {
  private relationshipsSubject: BehaviorSubject<Relationship[]>;
  public relationships: Observable<Relationship[]>;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const userId: string = this.accountService.getId();
    this.getRelationships(userId).subscribe({
      next: (relationships) => {
        this.relationshipsSubject = new BehaviorSubject<Relationship[]>(
          relationships
        );
        this.relationships = this.relationshipsSubject as Observable<
          Relationship[]
        >;
      },
    });
  }

  /**
   *
   * @param relationships
   */
  public updateRelationships(relationships: Relationship[]) {
    this.relationshipsSubject.next(relationships);
  }

  /**
   * `GET` method.
   * Retrieve the user relationships.
   * @param userId the user id
   * @returns an `Observable` of `Relationship[]`, i.e. the user relationships
   */
  public getRelationships(userId: string): Observable<Relationship[]> {
    return this.http.get<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships`
    );
  }

  /**
   *
   * @param userId
   * @param friendId
   * @returns
   */
  public createRelationshipChat(
    userId: string,
    friendId: string
  ): Observable<Relationship[]> {
    const body = { friendId };
    return this.http.post<Relationship[]>(
      `${environment.user_endpoint}/${userId}/relationships/chat`,
      body
    );
  }

  /**
   * TODO
   */
  public deleteRelationshipChat() {
    throw new Error('Method not implemented');
  }
}

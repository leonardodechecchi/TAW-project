import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Grid } from '../models/Grid';
import { GridCoordinates } from '../models/GridCoordinates';
import { Match } from '../models/Match';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private matchLoadingSubject: BehaviorSubject<boolean>;
  public matchLoading: Observable<boolean>;

  private chatMessagesSubject: BehaviorSubject<Message[]>;
  public chatMessages: Observable<Message[]>;

  constructor(private http: HttpClient) {
    this.matchLoadingSubject = new BehaviorSubject<boolean>(false);
    this.matchLoading = this.matchLoadingSubject.asObservable();

    this.chatMessagesSubject = new BehaviorSubject<Message[]>([]);
    this.chatMessages = this.chatMessagesSubject.asObservable();
  }

  /**
   *
   * @param isLoading
   */
  public updateMatchLoading(isLoading: boolean): void {
    this.matchLoadingSubject.next(isLoading);
  }

  /**
   *
   * @param message
   */
  public updateChatMessages(message: Message): void {
    this.chatMessagesSubject.value.push(message);
    this.chatMessagesSubject.next(this.chatMessagesSubject.value);
  }

  /**
   *
   * @param matchId
   * @returns
   */
  public getMatch(matchId: string): Observable<Match> {
    return this.http.get<Match>(`${environment.match_endpoint}/${matchId}`);
  }

  /**
   *
   * @param matchId
   * @param playerUsername
   * @param grid
   * @returns
   */
  public updatePlayerGrid(
    matchId: string,
    playerUsername: string,
    grid: Grid
  ): Observable<Match> {
    const body = { grid };
    return this.http.put<Match>(
      `${environment.match_endpoint}/${matchId}/players/${playerUsername}/grid`,
      body
    );
  }

  /**
   *
   * @param matchId
   * @param playerUsername
   * @param isReady
   * @returns
   */
  public setPlayerReady(
    matchId: string,
    playerUsername: string,
    isReady: boolean
  ): Observable<Match> {
    const body = { isReady };
    return this.http.put<Match>(
      `${environment.match_endpoint}/${matchId}/players/${playerUsername}/ready`,
      body
    );
  }

  /**
   *
   * @param matchId
   * @param playerUsername
   * @param coordinates
   * @returns
   */
  public fireAShot(
    matchId: string,
    playerUsername: string,
    coordinates: GridCoordinates
  ): Observable<Match> {
    const body = { coordinates };
    return this.http.put<Match>(
      `${environment.match_endpoint}/${matchId}/players/${playerUsername}/shot`,
      body
    );
  }
}

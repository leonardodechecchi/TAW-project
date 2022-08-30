import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Grid } from '../models/Grid';
import { GridCoordinates } from '../models/GridCoordinates';
import { Match, MatchStats } from '../models/Match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private matchLoadingSubject: BehaviorSubject<boolean>;
  public matchLoading: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.matchLoadingSubject = new BehaviorSubject<boolean>(false);
    this.matchLoading = this.matchLoadingSubject.asObservable();
  }

  /**
   * Update the `matchLoading` BehaviorSubject.
   * @param isLoading if `true` it means that the match is loading,
   * if `false` the match is not loading
   */
  public updateMatchLoading(isLoading: boolean): void {
    this.matchLoadingSubject.next(isLoading);
  }

  /**
   * Return the match that matches `matchId`.
   * @param matchId the match id
   * @returns an Observable of `Match`, i.e. the match found
   */
  public getMatch(matchId: string): Observable<Match> {
    return this.http.get<Match>(`${environment.match_endpoint}/${matchId}`);
  }

  /**
   * Return the list of the active matches.
   * @returns an Observable of `Match[]`, i.e. the list of active matches
   */
  public getActiveMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(environment.match_endpoint);
  }

  /**
   * Update the player grid.
   * @param matchId the match id
   * @param playerUsername the player username
   * @param grid the updated grid
   * @returns an Observable of `Match`, i.e. the match record updated
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
   * Set the player as ready (or not) to play.
   * @param matchId the match id
   * @param playerUsername the player username
   * @param isReady `true` if ready, `false` otherwise
   * @returns an Observable of `Match`, i.e. the match record updated
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
   * Fires a shot.
   * @param matchId the match id
   * @param playerUsername the player username
   * @param coordinates the shot coordinates
   * @returns an Observable of `Match`, i.e. the match record updated
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

  /**
   * Update the match stats with the given ones.
   * @param matchId the match id
   * @param stats the new stats
   * @returns an Observable of `Match`, i.e. the match record updated
   */
  public updateMatchStats(
    matchId: string,
    stats: MatchStats
  ): Observable<Match> {
    const body = { stats };
    return this.http.put<Match>(
      `${environment.match_endpoint}/${matchId}/stats`,
      body
    );
  }

  /**
   * Put the user into the matchmaking queue.
   * @param userId the user id
   * @returns an empty Observable
   */
  public searchForAMatch(userId: string): Observable<void> {
    const body = { userId };
    return this.http.post<void>(
      `${environment.matchmaking_endpoint}/queue`,
      body
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Grid } from '../models/Grid';
import { Match } from '../models/Match';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param matchId
   * @returns
   */
  getMatch(matchId: string): Observable<Match> {
    return this.http.get<Match>(environment.match_endpoint);
  }

  /**
   *
   * @param matchId
   * @param playerUsername
   * @param grid
   * @returns
   */
  updatePlayerGrid(
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
}

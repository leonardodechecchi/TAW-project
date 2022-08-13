import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Match } from 'src/app/models/Match';

@Component({
  selector: 'match-list',
  templateUrl: './match-list.component.html',
})
export class MatchListComponent implements OnInit {
  public matches: Match[];

  constructor(private route: ActivatedRoute) {
    this.matches = [];
  }

  ngOnInit(): void {}
}

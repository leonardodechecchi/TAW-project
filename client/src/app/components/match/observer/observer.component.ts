import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Match } from 'src/app/models/Match';

@Component({
  selector: 'observer',
  templateUrl: './observer.component.html',
})
export class ObserverComponent implements OnInit {
  private matchId: string;
  private match: Match;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.matchId = param['id'];
      },
    });
  }

  private initMatch() {}
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// MDB Modules
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { ChatComponent } from './components/chat-list/chat/chat.component';
import { ModalComponent } from './components/modal/modal.component';
import { BackNavbarComponent } from './components/back-navbar/back-navbar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WaitingRoomComponent } from './components/waiting-opponent/waiting-room.component';
import { PositioningPhaseFormComponent } from './components/match/positioning-phase-form/positioning-phase-form.component';
import { PositioningPhaseComponent } from './components/match/positioning-phase/positioning-phase.component';
import { GameComponent } from './components/match/game/game.component';
import { ChatModalComponent } from './components/match/chat-modal/chat-modal.component';
import { ObserverComponent } from './components/match/observer/observer.component';
import { MatchListComponent } from './components/match/match-list/match-list.component';
import { Error404Component } from './components/error-404/error-404.component';
import { WinnerComponent } from './components/match/winner/winner.component';
import { ModeratorFormComponent } from './components/admin-dashboard/moderator-form/moderator-form.component';
import { Error403Component } from './components/error-403/error-403.component';

// Services
import { MatchNotLoadingGuardService } from './services/match-not-loading-guard.service';
import { MatchLoadingGuardService } from './services/match-loading-guard.service';
import { ModeratorGuardService } from './services/moderator-guard.service';
import { FirstLoginGuardService } from './services/first-login-guard.service';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'relationships',
    component: FriendListComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'chats',
    component: ChatListComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'chats/:id',
    component: ChatComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'notifications',
    component: NotificationListComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      ModeratorGuardService,
      MatchLoadingGuardService,
    ],
  },
  { path: 'update-password', component: UpdatePasswordComponent },
  {
    path: 'match/waiting-room',
    component: WaitingRoomComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchNotLoadingGuardService,
    ],
  },
  {
    path: 'match/:id/positioning-phase',
    component: PositioningPhaseComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'match/:id/game',
    component: GameComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'match/:id/observer',
    component: ObserverComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  {
    path: 'match/:id/result',
    component: WinnerComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      MatchLoadingGuardService,
    ],
  },
  { path: 'access-denied', component: Error403Component },
  { path: '**', component: Error404Component, pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    UpdatePasswordComponent,
    ChatListComponent,
    ChatComponent,
    FriendListComponent,
    NotificationListComponent,
    ModalComponent,
    BackNavbarComponent,
    AdminDashboardComponent,
    ProfileComponent,
    WaitingRoomComponent,
    PositioningPhaseComponent,
    PositioningPhaseFormComponent,
    GameComponent,
    ChatModalComponent,
    ObserverComponent,
    MatchListComponent,
    Error404Component,
    WinnerComponent,
    ModeratorFormComponent,
    Error403Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

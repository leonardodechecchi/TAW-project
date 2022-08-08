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
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { FirstLoginGuardService } from './services/first-login-guard.service';
import { ModalComponent } from './components/modal/modal.component';
import { BackNavbarComponent } from './components/back-navbar/back-navbar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModeratorGuardService } from './services/moderator-guard.service';
import { WaitingOpponentComponent } from './components/waiting-opponent/waiting-opponent.component';

import { PositioningPhaseFormComponent } from './components/match/positioning-phase-form/positioning-phase-form.component';
import { PositioningPhaseComponent } from './components/match/positioning-phase/positioning-phase.component';
import { GameComponent } from './components/match/game/game.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
  },
  {
    path: 'friends',
    component: FriendListComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
  },
  {
    path: 'chats',
    component: ChatListComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
  },
  {
    path: 'chats/:id',
    component: ChatComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [
      AuthGuardService,
      FirstLoginGuardService,
      ModeratorGuardService,
    ],
  },
  {
    path: 'notifications',
    component: NotificationListComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
  },
  { path: 'update-password', component: UpdatePasswordComponent },
  {
    path: 'match/:id',
    component: PositioningPhaseComponent,
    canActivate: [AuthGuardService, FirstLoginGuardService],
    children: [
      { path: '', redirectTo: 'positioning-phase', pathMatch: 'full' },
      {
        path: 'positioning-phase',
        component: PositioningPhaseComponent,
      },
      {
        path: 'game',
        component: GameComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
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
    WaitingOpponentComponent,
    PositioningPhaseComponent,
    PositioningPhaseFormComponent,
    GameComponent,
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

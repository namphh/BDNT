import { CommonModule, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  TextColorDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfig } from 'src/app/app-config';
import { SessionStorageService } from 'src/services/session-storage.service';
import { CommonTranslateService } from '@services/common-translate.service';
import { LanguageEnum } from '@enums/language.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    FormSelectDirective,
  ],
})
export class LoginComponent {
  private _commonTranslateService = inject(CommonTranslateService);
  constructor(
    private router: Router,
    private sessionService: SessionStorageService,
    private http: HttpClient
  ) {}

  signInForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  isShowNotify: boolean = false;
  isLoading: boolean = false;
  messageLoginResponse: string = '* ';
  tasks: any = [];
  language: LanguageEnum = LanguageEnum.EN;

  private APIURL = `${AppConfig.server}/`; // Sử dụng server URL

  // Method to make the POST request with headers
  sso(username: string, password: string): Observable<any> {
    // Constructing the API URL with query parameters
    const urlWithParams = `${this.APIURL}` + 'login';
    let body = new FormData();
    // Set up the conditions to allow 'all' if the header is selected
    body.append('username', username);
    body.append('password', password);
    return this.http.post(urlWithParams, body).pipe(
      tap((res: any) => {
        // Assuming res has a status_code, adjust if needed
        this.tasks = res.status_code;
        console.log(this.tasks);
        if (this.tasks === 201) {
          this.sessionService.saveData('jwt_token', 'your_generated_token');
          this.router.navigateByUrl('/dashboard');
        } else {
          this.isLoading = false;
          this.isShowNotify = true;
          this.messageLoginResponse += 'Invalid username or password.';
        }
      })
    );
  }

  // Method to trigger login
  login() {
    console.log(this.APIURL);

    this.isLoading = true;
    this.isShowNotify = false;

    this.messageLoginResponse = '* ';
    const username = this.signInForm.value.username ?? '';
    const password = this.signInForm.value.password ?? '';

    this.sso(username, password).subscribe(); // Pass username and password directly
  }

  handleSelectLanguage(value: any) {
    this.language = value.target.value;
    this._commonTranslateService.setLang(this.language);
  }
}

import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgForm, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app-config';
@Component({
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule, HttpClientModule]
})
export class BreadcrumbsComponent {
  private APIURL = `${AppConfig.server}/`;  // Sử dụng server URL

  tasks: any[] = [];
  user: string = '';
  password: string = '';
  host: string = '';
  port: string = '';
  database: string = '';
  connectionStatus: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  query_all(user: string, password: string, host: string, port: string, database: string): Observable<any> {
    const body = new FormData();
    body.append("user", user || 'isempty');
    body.append("password", password || 'isempty');
    body.append("host", host || 'isempty');
    body.append("port", port || 'isempty');
    body.append("database", database || 'isempty');
    // console.log(user, password, host, port, database);
    return this.http.post(this.APIURL + "connect_db", body).pipe(
      tap((res: any) => {
        this.tasks = res.data || []; // Cập nhật tasks với dữ liệu từ API
        // console.log(this.tasks);
      })
    );
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      const { user, password, host, port, database } = form.value;
      this.query_all(user, password, host, port, database).subscribe(
        response => { 
          if (response['status'] === 201) {
            this.connectionStatus = 'Connection successful';
            // setTimeout(() => {
            //   this.router.navigate(['/dashboard']);        
            // }, 2000);        
          } else {
            this.connectionStatus = 'Connection failed, please try again';
          }
          // console.log('Response from API:', response['status']);
        },
        error => {
          this.connectionStatus = 'An error occurred during connection.';
          // console.error('Error connecting to API:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}

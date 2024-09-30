import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RowComponent, ColComponent, CardComponent, CardBodyComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import tap operator
import { AppConfig } from 'src/app/app-config';
import { TranslateService, TranslateModule } from '@ngx-translate/core';  // Import ngx-translate service


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  standalone: true,
  imports: [CommonModule, RowComponent, ColComponent, CardComponent, CardBodyComponent, HttpClientModule, TranslateModule]
})
export class CardsComponent {
  loaiHTML: string = '';
  doiTuongHTML: string = '';
  doiTuongAnh: string = '';
  mayeucau: string = '';
  dauViec: string = '';
  madauViec: string = '';
  maTram: string = '';
  ketQua: string = '';
  doChinhXac: string = '';
  khoangThoiGian: string = '';
  imagePaths: string[] = [];
  tasks: any[] = []; // Define tasks to hold API response
  imgResult: string[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private translate: TranslateService) {
    this.route.queryParams.subscribe(params => {
      this.loaiHTML = params['loaiHTML'] || '';
      this.doiTuongHTML = params['doiTuongHTML'] || '';
      this.doiTuongAnh = params['doiTuongAnh'] || '';
      this.mayeucau = params['mayeucau'] || '';
      this.dauViec = params['dauViec'] || '';
      this.madauViec = params['madauViec'] || '';
      this.maTram = params['maTram'] || '';
      this.ketQua = params['ketQua'] || '';
      this.doChinhXac = params['doChinhXac'] || '';
      this.khoangThoiGian = params['khoangThoiGian'] || '';

    });
  }

  private APIURL = `${AppConfig.server}/`;  // Sử dụng server URL

  // Method to create FormData and send the query
  private createFormData(): FormData {
    const body = new FormData();
    body.append("request_id", this.mayeucau);
    body.append("task_code", this.madauViec);
    return body;
  }

  query_all(body: FormData): Observable<any> {
    return this.http.post(this.APIURL + 'get_results', body).pipe(
      tap((res: any) => {
        this.tasks = res.images || []; // Update tasks with API data
        this.imgResult = this.tasks.map(path => {
          return 'data:image/jpeg;base64,' + path;
        });
      })
    );
  }
  private createFormData_1(): FormData {
    const body = new FormData();
    body.append("request_id", this.mayeucau);
    return body;
  }

  query_all_1(body: FormData): Observable<any> {
    return this.http.post(this.APIURL + 'get_origin', body).pipe(
      tap((res: any) => {
        this.tasks = res.images || []; // Update tasks with API data
        this.imagePaths = this.tasks.map(path => {
          return 'data:image/jpeg;base64,' + path;
        });
      })
    );
  }

  ngOnInit(): void {
    const formData1 = this.createFormData_1(); // Create FormData
    this.query_all_1(formData1).subscribe(() => {
    });    
    const formData = this.createFormData(); // Create FormData
    this.query_all(formData).subscribe(() => {
    });
  }
}

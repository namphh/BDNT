import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RowComponent, ColComponent, CardComponent, CardBodyComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import tap operator
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  standalone: true,
  imports: [CommonModule, RowComponent, ColComponent, CardComponent, CardBodyComponent, HttpClientModule]
})
export class CardsComponent {
  loaiHTML: string = '';
  doiTuongHTML: string = '';
  doiTuongAnh: string = '';
  mayeucau: string = '';
  dauViec: string = '';
  madauViec: string = '';
  ketQua: string = '';
  doChinhXac: string = '';
  khoangThoiGian: string = '';
  imagePaths: string[] = [];
  tasks: any[] = []; // Define tasks to hold API response
  imgResult: string[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.loaiHTML = params['loaiHTML'] || '';
      this.doiTuongHTML = params['doiTuongHTML'] || '';
      this.doiTuongAnh = params['doiTuongAnh'] || '';
      this.mayeucau = params['mayeucau'] || '';
      this.dauViec = params['dauViec'] || '';
      this.madauViec = params['madauViec'] || '';
      this.ketQua = params['ketQua'] || '';
      this.doChinhXac = params['doChinhXac'] || '';
      this.khoangThoiGian = params['khoangThoiGian'] || '';

      // Extract and clean the imagePaths parameter
      if (params['imagePaths']) {
        // Remove brackets and split by comma
        const cleanedPaths = params['imagePaths'].replace(/[\[\]"]/g, '');
        this.imagePaths = cleanedPaths.split(',').map((path: string) => `assets/${path.trim()}`);
      } else {
        this.imagePaths = [];
      }
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
        this.tasks = res.data.images || []; // Update tasks with API data
        this.imgResult = this.tasks.map(path => {
          return 'data:image/jpeg;base64,' + path;
        });
      })
    );
  }

  ngOnInit(): void {
    console.log(this.mayeucau)
    console.log(this.madauViec)
    console.log(this.imagePaths)
    const formData = this.createFormData(); // Create FormData
    this.query_all(formData).subscribe(() => {
    });
  }
}

import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { create } from 'lodash-es';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DataService } from '../../../data.service'
import { AppConfig } from 'src/app/app-config';
import { SpinnerModule } from '@coreui/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';  // Import ngx-translate service


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    RowComponent, 
    ColComponent, 
    TextColorDirective, 
    CardComponent, 
    CardHeaderComponent, 
    CardBodyComponent, 
    DocsExampleComponent, 
    FormControlDirective, 
    ReactiveFormsModule, 
    FormsModule, 
    FormDirective, 
    FormLabelDirective, 
    FormSelectDirective, 
    FormCheckComponent, 
    FormCheckInputDirective, 
    FormCheckLabelDirective, 
    ButtonDirective, 
    ColDirective, 
    InputGroupComponent, 
    InputGroupTextDirective, 
    CommonModule, 
    HttpClientModule,
    SpinnerModule,
    TranslateModule
  ]
})
export class LayoutComponent {
  private APIURL = `${AppConfig.server}/`;  // Sử dụng server URL

  List_HTML = { 
    html_type: [], 
    html_object: [], 
    object_station: [],
    request_id: [],
    task_ID: [],
    task_code: [],
    station_code: [],
    result: [],
    created_at: [],
    confidence_score: [],
    urls: []
  };

  dataset: { [key: string]: any[] } = {}; // Object type for dataset
  transformedData: any[] = []; // To hold the transformed data
  filteredData: any[] = []; // To hold the filtered data
  isSubmitted = false;
  
  options = {
    'Loại hạ tầng mạng lưới': [''],
    'Đối tượng hạ tầng mạng lưới': [''],
    'Đối tượng ảnh chụp': [''],
    'Đầu việc': [''],
    'Mã trạm': ['']
  };

  constructor(private http: HttpClient, private router: Router, private dataService: DataService, private translate: TranslateService) {
    // Set the default language to English
    this.translate.setDefaultLang('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  navigateToCard(listHTML: any, index: number) {
    const queryParams = {
      loaiHTML: listHTML.html_type[index],
      doiTuongHTML: listHTML.html_object[index],
      doiTuongAnh: listHTML.object_station[index],
      mayeucau: listHTML.request_id[index],
      dauViec: listHTML.task_code[index],
      madauViec: listHTML.task_ID[index],
      maTram: listHTML.station_code[index],
      ketQua: listHTML.result[index],
      doChinhXac: listHTML.confidence_score[index],
      khoangThoiGian: listHTML.created_at[index],
      imagePaths: listHTML.urls[index],
    };

    // Store the current table data in the service
    this.dataService.listHTML = { ...this.List_HTML };
  
    this.router.navigate(['/cards'], { queryParams });
  }


  ngOnInit(): void {
    this.resetListHTML();
    this.loadOptions();
    this.loadData(); // Load data from the service
  }



  loadData() {
    if (this.dataService.listHTML.html_type.length > 0) {
      this.List_HTML = { ...this.dataService.listHTML }; // Load from the service
    }
  }

  loadOptions() {
    forkJoin([
      this.html_type(),
      this.html_object(),
      this.object_station(),
      this.task_code(),
      this.station_code()
    ]).subscribe();
  }

  html_type(): Observable<any> {
    return this.http.get(this.APIURL + "html_type").pipe(
      tap((res: any) => {
        this.options['Loại hạ tầng mạng lưới'] = this.removeDuplicatesAndEmpty(res.data.map((task: any) => task.html_type));
      })
    );
  }

  html_object(): Observable<any> {
    return this.http.get(this.APIURL + "html_object").pipe(
      tap((res: any) => {
        this.options['Đối tượng hạ tầng mạng lưới'] = this.removeDuplicatesAndEmpty(res.data.map((task: any) => task.html_object));
      })
    );
  }

  object_station(): Observable<any> {
    return this.http.get(this.APIURL + "object_station").pipe(
      tap((res: any) => {
        this.options['Đối tượng ảnh chụp'] = this.removeDuplicatesAndEmpty(res.data.map((task: any) => task.object_station_name));
      })
    );
  }

  task_code(): Observable<any> {
    return this.http.get(this.APIURL + "task_code").pipe(
      tap((res: any) => {
        this.options['Đầu việc'] = this.removeDuplicatesAndEmpty(res.data.map((task: any) => task.task_code));
      })
    );
  }

  station_code(): Observable<any> {
    return this.http.get(this.APIURL + "station_code").pipe(
      tap((res: any) => {
        this.options['Mã trạm'] = this.removeDuplicatesAndEmpty(res.data.map((task: any) => task.station_code));
      })
    );
  }

  removeDuplicatesAndEmpty(arr: any[]): any[] {
    return arr.filter((value, index, self) => value && self.indexOf(value) === index);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Định dạng yyyy-mm-dd
  }

  resetListHTML() {
    this.List_HTML = { 
      html_type: [], 
      html_object: [], 
      object_station: [],
      request_id: [],
      task_ID: [],
      task_code: [],
      station_code: [],
      result: [],
      created_at: [],
      confidence_score: [], 
      urls: []
    };
  }

  exportReport() {
    // Define table headers

    const headers = [
      ['Loại', 'Đối tượng', 'Đối tượng ảnh chụp', 'Mã yêu cầu', 'Công việc', 'Mã công việc', 'Mã Trạm', 'Kết quả', 'Thời gian', 'Độ tin cậy']
    ];

    // Ensure correct typing for List_HTML elements
  const data = this.List_HTML.html_type.map((_: any, i: number) => ({
    infraType: this.List_HTML.html_type[i] as string, 
    infraObject: this.List_HTML.html_object[i] as string, 
    objectStation: this.List_HTML.object_station[i] as string, 
    requestId: this.List_HTML.request_id[i] as string, 
    taskCode: this.List_HTML.task_code[i] as string, 
    taskID: this.List_HTML.task_ID[i] as string,
    stationCode: this.List_HTML.station_code[i] as string, 
    result: this.List_HTML.result[i] as string, 
    date: new Date(this.List_HTML.created_at[i] as string), // Convert to Date object
    confidenceScore: this.List_HTML.confidence_score[i] as number
  }));

  // Sort data first by Date (ascending) then by Station ID (alphabetical)
  data.sort((a, b) => {
    const dateComparison = a.date.getTime() - b.date.getTime(); // Correct date comparison
    if (dateComparison !== 0) {
      return dateComparison; // Sort by date first
    }
    return a.stationCode.localeCompare(b.stationCode); // Sort alphabetically by stationCode if date is the same
  });

  // Map sorted data back to array format for worksheet
  const sortedData = data.map(item => [
    item.infraType, 
    item.infraObject, 
    item.objectStation, 
    item.requestId, 
    item.taskCode, 
    item.taskID, 
    item.stationCode, 
    item.result, 
    item.date.toLocaleDateString('en-GB'),  // Format date as DD/MM/YYYY
    item.confidenceScore.toString() // Convert confidenceScore to string
  ]);

  // Combine headers and sorted data
  const worksheetData: string[][] = headers.concat(sortedData.map(row => row.map(item => String(item))));

  // Create a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  // Export to Excel and download the file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'report.xlsx');
}


  isLoading: boolean = false;
  onSubmit(event: Event) {
    this.isSubmitted = true;
    this.isLoading = true;
    event.preventDefault();
    this.resetListHTML();
    
    const inputField1 = (document.getElementById('inputField1') as HTMLSelectElement).value;
    const inputField2 = (document.getElementById('inputField2') as HTMLSelectElement).value;
    const inputField3 = (document.getElementById('inputField3') as HTMLSelectElement).value;
    const inputField4 = (document.getElementById('inputField4') as HTMLSelectElement).value;
    const inputField5 = (document.getElementById('inputField5') as HTMLSelectElement).value;
    const inputField6 = (document.getElementById('inputField6') as HTMLSelectElement).value;
    const inputField7 = (document.getElementById('inputField7') as HTMLSelectElement).value;
    const inputField8 = (document.getElementById('inputField8') as HTMLInputElement).value;

    let dateRange: Date;
    const currentDate = new Date();
    
    switch (inputField6) {
      case '': 
          dateRange = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          break;
      case '1 tháng - nay': 
          dateRange = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          break;
      case '3 tháng - nay':
          dateRange = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
          break;
      case '6 tháng - nay':
          dateRange = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
          break;
      case '1 năm - nay':
          dateRange = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
          break;
      default:
          dateRange = new Date();
          break;
    }

    let body = new FormData();

    // Set up the conditions to allow 'all' if the header is selected
    body.append("html_type", inputField1 === 'Tất cả' ? 'isempty' : inputField1 || 'isempty');
    body.append("html_object", inputField2 === 'Tất cả' ? 'isempty' : inputField2 || 'isempty');
    body.append("object_station", inputField3 === 'Tất cả' ? 'isempty' : inputField3 || 'isempty');
    body.append("problem", inputField4 === 'Tất cả' ? 'isempty' : inputField4 || 'isempty');
    body.append("station_code", inputField5 === 'Tất cả' ? 'isempty' : inputField5 || 'isempty');
    body.append("time", inputField6 === 'Tất cả' ? 'isempty' : this.formatDate(dateRange) || 'isempty'); // Định dạng ngày
    // console.log(this.formatDate(dateRange))
    body.append("result", inputField7 === 'Tất cả' ? 'isempty' : (inputField7 === 'Pass' ? '1' : '0'));
    body.append("acc", inputField8 || 'isempty');
    // console.log(inputField1, inputField2, inputField3, inputField4, inputField5, inputField6, inputField7, inputField8)
    // Send the request
    this.query_all(body).subscribe((res: any) => {
      this.List_HTML.html_type = res.data.map((task: any) => task.html_type);
      this.List_HTML.html_object = res.data.map((task: any) => task.html_object);
      this.List_HTML.object_station = res.data.map((task: any) => task.object_station_name);
      this.List_HTML.request_id = res.data.map((task: any) => task.request_id);
      this.List_HTML.task_ID = res.data.map((task: any) => task.task_ID);
      this.List_HTML.task_code = res.data.map((task: any) => task.task_code);
      this.List_HTML.result = res.data.map((task: any) => task.result);
      this.List_HTML.station_code = res.data.map((task: any) => task.station_code);
      this.List_HTML.created_at = res.data.map((task: any) => task.created_at);
      this.List_HTML.confidence_score = res.data.map((task: any) => task.confidence_score);
      this.List_HTML.urls = res.data.map((task: any) => task.urls);
      this.isLoading = false;
    });

}
  query_all(body: FormData): Observable<any> {
    return this.http.post(this.APIURL + "query_all", body);
  }
}

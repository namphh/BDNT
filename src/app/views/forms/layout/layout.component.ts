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
import { NgSelectModule } from '@ng-select/ng-select';


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
    TranslateModule,
    NgSelectModule
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

  searchTerm1: string = ''; // Holds the search term for input field 1
  searchTerm2: string = ''; // Holds the search term for input field 2
  searchTerm3: string = ''; // Holds the search term for input field 3
  searchTerm4: string = ''; // Holds the search term for input field 4
  searchTerm5: string = ''; // Holds the search term for input field 5
  
  filteredOptions1: string[] = []; // Holds the filtered options for input field 1
  filteredOptions2: string[] = []; // Holds the filtered options for input field 2
  filteredOptions3: string[] = []; // Holds the filtered options for input field 3
  filteredOptions4: string[] = []; // Holds the filtered options for input field 4
  filteredOptions5: string[] = []; // Holds the filtered options for input field 5
  
  showDropdown1: boolean = false; // Controls the visibility of dropdown for input field 1
  showDropdown2: boolean = false; // Controls the visibility of dropdown for input field 2
  showDropdown3: boolean = false; // Controls the visibility of dropdown for input field 3
  showDropdown4: boolean = false; // Controls the visibility of dropdown for input field 4
  showDropdown5: boolean = false; // Controls the visibility of dropdown for input field 5


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
  // Load options from multiple services
  loadOptions() {
    forkJoin([
      this.html_type(),
      this.html_object(),
      this.object_station(),
      this.task_code(),
      this.station_code()
    ]).subscribe(() => {
      // Initialize filtered options after loading all options
      this.filteredOptions1 = [...this.options['Loại hạ tầng mạng lưới']];
      this.filteredOptions2 = [...this.options['Đối tượng hạ tầng mạng lưới']];
      this.filteredOptions3 = [...this.options['Đối tượng ảnh chụp']];
      this.filteredOptions4 = [...this.options['Đầu việc']];
      this.filteredOptions5 = [...this.options['Mã trạm']];
    });
  }
  
  // Load html_type options from API
  html_type(): Observable<any> {
    return this.http.get(this.APIURL + "html_type").pipe(
      tap((res: any) => {
        this.options['Loại hạ tầng mạng lưới'] = this.removeDuplicatesAndEmpty(
          res.data.map((task: any) => task.html_type).flat() // Flattening the array
        );
      })
    );
  }

  
  // Filter the options based on the search term
  filterOptions(field: string): void {
    switch(field) {
      case 'Loại hạ tầng mạng lưới':
        this.filteredOptions1 = this.filterArray(this.options['Loại hạ tầng mạng lưới'], this.searchTerm1);
        this.showDropdown1 = this.filteredOptions1.length > 0;
        break;
      case 'Đối tượng hạ tầng mạng lưới':
        this.filteredOptions2 = this.filterArray(this.options['Đối tượng hạ tầng mạng lưới'], this.searchTerm2);
        this.showDropdown2 = this.filteredOptions2.length > 0;
        break;
      case 'Đối tượng ảnh chụp':
        this.filteredOptions3 = this.filterArray(this.options['Đối tượng ảnh chụp'], this.searchTerm3);
        this.showDropdown3 = this.filteredOptions3.length > 0;
        break;
      case 'Đầu việc':
        this.filteredOptions4 = this.filterArray(this.options['Đầu việc'], this.searchTerm4);
        this.showDropdown4 = this.filteredOptions4.length > 0;
        break;
      case 'Mã trạm':
        this.filteredOptions5 = this.filterArray(this.options['Mã trạm'], this.searchTerm5);
        this.showDropdown5 = this.filteredOptions5.length > 0;
        break;
      default:
        break;
    }
  }
  
  // Filter array based on the search term
  filterArray(options: string[], searchTerm: string): string[] {
    if (searchTerm.trim() === '') {
      return [...options];
    } else {
      return options.filter(option => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          console.warn('Non-string option detected and skipped:', option);
          return false;
        }
      });
    }
  }
  
  // Handle option selection from the dropdown
  selectOption(option: string, field: string): void {
    switch(field) {
      case 'Loại hạ tầng mạng lưới':
        this.searchTerm1 = option; // Set the search term for input field 1
        this.showDropdown1 = false; // Hide the dropdown after selection
        break;
      case 'Đối tượng hạ tầng mạng lưới':
        this.searchTerm2 = option; // Set the search term for input field 2
        this.showDropdown2 = false; // Hide the dropdown after selection
        break;
      case 'Đối tượng ảnh chụp':
        this.searchTerm3 = option; // Set the search term for input field 3
        this.showDropdown3 = false; // Hide the dropdown after selection
        break;
      case 'Đầu việc':
        this.searchTerm4 = option; // Set the search term for input field 4
        this.showDropdown4 = false; // Hide the dropdown after selection
        break;
      case 'Mã trạm':
        this.searchTerm5 = option; // Set the search term for input field 5
        this.showDropdown5 = false; // Hide the dropdown after selection
        break;
      default:
        break;
    }
  }
  
  // Hide the dropdown when input loses focus, with a small delay to allow click events to be processed
  hideDropdown(field: string): void {
    setTimeout(() => {
      switch(field) {
        case 'Loại hạ tầng mạng lưới':
          this.showDropdown1 = false;
          break;
        case 'Đối tượng hạ tầng mạng lưới':
          this.showDropdown2 = false;
          break;
        case 'Đối tượng ảnh chụp':
          this.showDropdown3 = false;
          break;
        case 'Đầu việc':
          this.showDropdown4 = false;
          break;
        case 'Mã trạm':
          this.showDropdown5 = false;
          break;
        default:
          break;
      }
    }, 200);
  }
  
  // Utility function to remove duplicates and empty strings
  removeDuplicatesAndEmpty(arr: string[]): string[] {
    return arr.filter((value, index, self) => value && self.indexOf(value) === index);
  }
  html_object(): Observable<any> {
    return this.http.get(this.APIURL + "html_object").pipe(
      tap((res: any) => {
        this.options['Đối tượng hạ tầng mạng lưới'] = this.removeDuplicatesAndEmpty(
          res.data.map((task: any) => task.html_object).flat() 
        );
      })
    );
  }
  
  // Object Station options
  object_station(): Observable<any> {
    return this.http.get(this.APIURL + "object_station").pipe(
      tap((res: any) => {
        this.options['Đối tượng ảnh chụp'] = this.removeDuplicatesAndEmpty(
          res.data.map((task: any) => task.object_station_name).flat() 
        );
      })
    );
  }
  
  // Task Code options
  task_code(): Observable<any> {
    return this.http.get(this.APIURL + "task_code").pipe(
      tap((res: any) => {
        this.options['Đầu việc'] = this.removeDuplicatesAndEmpty(
          res.data.map((task: any) => task.task_code).flat() 
        );
      })
    );
  }
  
  // Station Code options
  station_code(): Observable<any> {
    return this.http.get(this.APIURL + "station_code").pipe(
      tap((res: any) => {
        this.options['Mã trạm'] = this.removeDuplicatesAndEmpty(
          res.data.map((task: any) => task.station_code).flat() 
        );
      })
    );
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

  onKeyUp(event: KeyboardEvent): void {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
      this.showDropdown1 = false;
      this.showDropdown2 = false;
      this.showDropdown3 = false; // Hide the dropdown
      this.showDropdown4 = false;
      this.showDropdown5 = false;
    }
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

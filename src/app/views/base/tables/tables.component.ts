import { Component, ViewChild, AfterViewInit } from '@angular/core'; 
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { LayoutComponent } from '../../forms/layout/layout.component';
import { DataService } from '../../../data.service';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    TableColorDirective,
    TableActiveDirective,
    BorderDirective,
    AlignDirective,
    FormsModule,
    RouterModule,
    CommonModule    
  ]
})
export class TablesComponent implements AfterViewInit {
  inputField1: string = '';
  inputField2: string = '';
  inputField3: string = '';
  inputField4: string = '';
  inputField5: string = '';

  dataset: { [key: string]: any[] } = {}; // Object type for dataset
  transformedData: any[] = []; // To hold the transformed data
  filteredData: any[] = []; // To hold the filtered data

  constructor(private router: Router, private dataService: DataService) { }

  ngAfterViewInit() {
    this.dataset = this.dataService.getData();
    // console.log("Original dataset:", this.dataset);

    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.transformDataset(); // Call the transform function on initialization
    });
  }

  transformDataset(): void {
    if (this.dataset['html_type'] && Array.isArray(this.dataset['html_type'])) {
      this.transformedData = this.dataset['html_type'].map((type, index) => ({
        loaiHTML: type,
        doiTuongHTML: this.dataset['html_object'][index],
        doiTuongAnh: this.dataset['object_station'][index] || '',
        dauViec: this.dataset['task_code'][index],
        maTram: this.dataset['station_code'][index],
        khoangThoiGian: this.dataset['created_at'][index],
        ketQua: this.dataset['result'][index].toString(),
        doChinhXac: this.dataset['confidence_score'][index].toString(),
        anh: this.parseJsonArray(this.dataset['urls'][index]), // Parsing URLs
      }));

      // Initially, the filtered data will be the same as the transformed data
      this.filteredData = [...this.transformedData];
    }
  }

  // This function filters the table based on the selected dropdown values
  filterTable(): void {
    this.filteredData = this.transformedData.filter(row => {
      return (
        (!this.inputField1 || row.loaiHTML === this.inputField1 || this.inputField1 === '') &&
        (!this.inputField2 || row.doiTuongHTML === this.inputField2 || this.inputField2 === '') &&
        (!this.inputField3 || row.doiTuongAnh === this.inputField3 || this.inputField3 === '') &&
        (!this.inputField4 || row.dauViec === this.inputField4 || this.inputField4 === '') &&
        (!this.inputField5 || row.maTram === this.inputField5 || this.inputField5 === '')
      );
    });
  }

  // Utility function to get distinct values for dropdowns
  distinctValues(key: string): string[] {
    return [...new Set(this.transformedData.map(row => row[key]))];
  }

  // Parse the JSON array from the URLs
  private parseJsonArray(urlString: string): any[] {
    try {
      return urlString ? JSON.parse(urlString) : [];
    } catch (e) {
      console.error("Failed to parse JSON:", e, "Input:", urlString);
      return [];
    }
  }

  onImageClick(row: any): void {
    const queryParams = {
      loaiHTML: row.loaiHTML,
      doiTuongHTML: row.doiTuongHTML,
      doiTuongAnh: row.doiTuongAnh,
      dauViec: row.dauViec,
      ketQua: row.ketQua,
      doChinhXac: row.doChinhXac,
      khoangThoiGian: row.khoangThoiGian,
      imagePaths: row.anh.join(','),
    };

    // Navigate to the CardsComponent with the query parameters
    this.router.navigate(['base/cards'], { queryParams });
  }
  
  exportReport() {
    // Define table headers
    const headers = [
      ['Loại HTML', 'Đối tượng HTML', 'Đối tượng ảnh chụp', 'Đầu việc', 'Mã trạm', 'Kết quả', 'Độ chính xác']
    ];

    // Add transformed data rows
    const data = this.transformedData.map(row => [
      row.loaiHTML, row.doiTuongHTML, row.doiTuongAnh, row.dauViec, row.maTram, row.ketQua, row.doChinhXac
    ]);

    // Combine headers and data
    const worksheetData = headers.concat(data);

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
}
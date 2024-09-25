import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfig } from 'src/app/app-config';

interface TableData {
  loaiHTML: string;
  doiTuongHTML: string;
  doiTuongAnhChup: string;
  dauViec: string;
}

interface FilterOptions {
  loaiHTML: string[];
  doiTuongHTML: string[];
  doiTuongAnhChup: string[];
  dauViec: string[];
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent,
    HttpClientModule
  ]
})
export class AppTabsComponent {
  public tableData: TableData[] = [];
  private APIURL = `${AppConfig.server}/`;  // Sử dụng server URL
  public update_tab: any[] = [];
  
  public selectedFilters: { [key: string]: string } = {
    loaiHTML: '',
    doiTuongHTML: '',
    doiTuongAnhChup: '',
    dauViec: ''
  };

  public filterOptions: FilterOptions = {
    loaiHTML: [],
    doiTuongHTML: [],
    doiTuongAnhChup: [],
    dauViec: []
  };

  public selectedHeader: string = '';

  constructor(private http: HttpClient, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    forkJoin([this.query_all()]).subscribe(() => {
      this.update_table();
      this.updateFilterOptions(); // Call to update filter options after table data is populated
    });
  }

  query_all(): Observable<any> {
    return this.http.get(this.APIURL + "query_all_html").pipe(
      tap((res: any) => {
        this.update_tab = res.data;
        // console.log(this.update_tab);
      })
    );
  }

  update_table() {
    this.update_tab.forEach((task: any) => {
      const { html_type, html_object, object_station_name, task_code } = task;
      this.tableData.push({
        loaiHTML: html_type,
        doiTuongHTML: html_object,
        doiTuongAnhChup: object_station_name,
        dauViec: task_code
      });
    });
    // console.log(this.tableData);
  }

  private getUniqueValues(key: keyof TableData): string[] {
    const values = this.tableData.map(item => item[key]);
    // console.log(values);
    return Array.from(new Set(values));
  }

  public updateFilterOptions() {
    this.filterOptions = {
      loaiHTML: this.getUniqueValues('loaiHTML'),
      doiTuongHTML: this.getUniqueValues('doiTuongHTML'),
      doiTuongAnhChup: this.getUniqueValues('doiTuongAnhChup'),
      dauViec: this.getUniqueValues('dauViec')
    };
    
    // Reset the selected filter when changing the header
    this.selectedFilters[this.selectedHeader] = '';
  }

  public get filteredData(): TableData[] {
    return this.tableData.filter(item => {
      return (
        (!this.selectedFilters['loaiHTML'] || item['loaiHTML'] === this.selectedFilters['loaiHTML']) &&
        (!this.selectedFilters['doiTuongHTML'] || item['doiTuongHTML'] === this.selectedFilters['doiTuongHTML']) &&
        (!this.selectedFilters['doiTuongAnhChup'] || item['doiTuongAnhChup'] === this.selectedFilters['doiTuongAnhChup']) &&
        (!this.selectedFilters['dauViec'] || item['dauViec'] === this.selectedFilters['dauViec'])
      );
    });
  }
}

import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { AppConfig } from 'src/app/app-config';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpinnerModule } from '@coreui/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';  // Import ngx-translate service


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    WidgetsDropdownComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    WidgetsBrandComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent,
    HttpClientModule,
    SpinnerModule,
    TranslateModule
  ]
})
export class DashboardComponent implements OnInit {
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });

  public n: number = 0;
  tasks_monthly_rq: any = [];
  tasks_top10_prov: any = [];
  tasks_num_station: any = [];
  tasks_num_err_bd: any = [];
  tasks_num_err_bh: any = [];
  tasks_top10_oj: any = [];
  tasks_top10_task: any = [];
  tasks_top10_nation: any = [];
  tasks_top10_html: any = [];


  private APIURL = `${AppConfig.server}/`;  // Sử dụng server URL
  
  constructor(private http: HttpClient, private translate: TranslateService) {
    // Set the default language to English
    this.translate.setDefaultLang('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  monthly_rq(): Observable<any> {
    return this.http.get(this.APIURL + "num_rq_per_month").pipe(
      tap((res: any) => {
        this.tasks_monthly_rq = res.data;
        this.updateMonthlyRequests();
      })
    );
  }

  top_10_provinces_error(): Observable<any> {
    return this.http.get(this.APIURL + "top_10_provinces_errors").pipe(
      tap((res: any) => {
        this.tasks_top10_prov = res.data;
        this.updatetop10ProvincesErrors();
      })
    );
  }

  top_10_nation_error(): Observable<any> {
    return this.http.get(this.APIURL + "top_10_nation_errors").pipe(
      tap((res: any) => {
        this.tasks_top10_nation = res.data;
        this.updatetop10NationErrors();
      })
    );
  }

  top_10_html_error(): Observable<any> {
    return this.http.get(this.APIURL + "top_10_html_errors").pipe(
      tap((res: any) => {
        this.tasks_top10_html = res.data;
        this.updatetop10htmlErrors();
      })
    );
  }

  top_10_oj(): Observable<any> {
    return this.http.get(this.APIURL + "top_10_object_station_errors").pipe(
      tap((res: any) => {
        this.tasks_top10_oj = res.data;
        this.updatetop10Objects();
      })
    );
  }

  top_10_task(): Observable<any> {
    return this.http.get(this.APIURL + "top_10_task_errors").pipe(
      tap((res: any) => {
        this.tasks_top10_task = res.data;
        this.updatetop10Tasks();
      })
    );
  }

  num_station_monitor(): Observable<any> {
    return this.http.get(this.APIURL + "num_station_monitor").pipe(
      tap((res: any) => {
        this.tasks_num_station = res.data;
        this.update_num_station_monitor();
      })
    );
  }

  num_err_bd(): Observable<any> {
    return this.http.get(this.APIURL + "num_rq_fail_bd_per_month").pipe(
      tap((res: any) => {
        this.tasks_num_err_bd = res.data;
        this.update_num_err_bd();
      })
    );
  }

  num_err_bh(): Observable<any> {
    return this.http.get(this.APIURL + "num_rq_fail_bh_per_month").pipe(
      tap((res: any) => {
        this.tasks_num_err_bh = res.data;
        this.update_num_err_bh();
      })
    );
  }

  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  public monthlyRequests = {
    rejected_requests: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    approved_requests: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    total_requests: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    num_station: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bh_requests: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bd_requests: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  updateMonthlyRequests() {
    // console.log(this.tasks_monthly_rq);
    this.tasks_monthly_rq.forEach((task: any) => {
      const { request_month, passed_requests, failed_requests, total_requests } = task;
      this.monthlyRequests.rejected_requests[request_month - 1] = failed_requests;
      this.monthlyRequests.approved_requests[request_month - 1] = passed_requests;
      this.monthlyRequests.total_requests[request_month - 1] = total_requests;
    });
  }

  update_num_err_bd() {
    // console.log(this.tasks_num_err_bd);
    this.tasks_num_err_bd.forEach((task: any) => {
      const { MONTH_ID, Num_fail } = task;
      // console.log(MONTH_ID, Num_fail)
      this.monthlyRequests.bd_requests[MONTH_ID - 1] = Num_fail;
    });
  }

  update_num_err_bh() {
    // console.log(this.tasks_num_err_bh);
    this.tasks_num_err_bh.forEach((task: any) => {
      const { MONTH_ID, Num_fail } = task;
      // console.log(MONTH_ID, Num_fail)
      this.monthlyRequests.bh_requests[MONTH_ID - 1] = Num_fail;
    });
  }

  update_num_station_monitor() {
    // console.log(this.tasks_num_station);
    this.tasks_num_station.forEach((task: any) => {
      const { MONTH_ID, Num_station } = task;
      this.monthlyRequests.num_station[MONTH_ID - 1] = Num_station;
    });
  }

  public top10ProvincesErrors = [
    { province: "", error_count: 0 },
  ];

  public top10NationErrors = [
    { nation: "", error_count: 0 },
  ];

  public top10htmlErrors = [
    { infra_type: "", error_count: 0 },
  ];

  public top10Objects = [
    { object: '', count: 0 },
  ];

  public top10Tasks = [
    { name: '', error_count: 0 },
  ];

  updatetop10ProvincesErrors() {
    this.n = 0;
    // console.log(this.tasks_top10_prov);
    this.top10ProvincesErrors = [];
    this.tasks_top10_prov.forEach((task: any) => {
      const { station_code, Num_Error } = task;
      if (this.n < 10 && Num_Error > 0) {
        this.top10ProvincesErrors.push({ province: station_code, error_count: Num_Error });
        this.n += 1;
      }
    });
  }

  updatetop10NationErrors() {
    this.n = 0;
    // console.log(this.tasks_top10_prov);
    this.top10NationErrors = [];
    this.tasks_top10_nation.forEach((task: any) => {
      const { province_code, Num_Error } = task;
      if (this.n < 10 && Num_Error > 0) {
        this.top10NationErrors.push({ nation: province_code, error_count: Num_Error });
        this.n += 1;
      }
    });
  }

  updatetop10htmlErrors() {
    this.n = 0;
    // console.log(this.tasks_top10_prov);
    this.top10htmlErrors = [];
    this.tasks_top10_html.forEach((task: any) => {
      const { infra_object, Num_Error } = task;
      if (this.n < 10 && Num_Error > 0) {
        this.top10htmlErrors.push({ infra_type: infra_object, error_count: Num_Error });
        this.n += 1;
      }
    });
  }

  updatetop10Objects() {
    this.n = 0;
    // console.log(this.tasks_top10_oj);
    this.top10Objects = [];
    this.tasks_top10_oj.forEach((task: any) => {
      const { object_station_name, Num_Pass } = task;
      if (this.n < 10 && Num_Pass > 0) {
        this.top10Objects.push({ object: object_station_name, count: Num_Pass });
        this.n += 1;
      }
    });
  }

  updatetop10Tasks() {
    this.n = 0;
    // console.log(this.tasks_top10_task);
    this.top10Tasks = [];
    this.tasks_top10_task.forEach((task: any) => {
      const { task_code, Num_error } = task;
      if (this.n < 10 && Num_error > 0) {
        this.top10Tasks.push({ name: task_code, error_count: Num_error });
        this.n += 1;
      }
    });
  }

  isLoading: boolean = true;

  ngOnInit(): void {
    forkJoin([
      this.monthly_rq(),
      this.top_10_provinces_error(),
      this.top_10_nation_error(),
      this.top_10_oj(),
      this.top_10_task(),
      this.num_station_monitor(),
      this.top_10_html_error(),
      this.num_err_bd(),
      this.num_err_bh(),
    ]).subscribe(() => {
      this.initCharts(); // Khởi tạo biểu đồ sau khi tất cả dữ liệu đã được tải
      this.isLoading = false;
    });
  }

  initCharts(): void {
    const datasets = [];
    datasets[0] = this.monthlyRequests.total_requests;
    datasets[1] = this.monthlyRequests.num_station;
    datasets[2] = this.monthlyRequests.approved_requests;
    datasets[3] = this.monthlyRequests.rejected_requests;
    datasets[4] = this.monthlyRequests.bh_requests;
    datasets[5] = this.monthlyRequests.bd_requests;

    this.chart = datasets.map((dataSet) => this.#chartsData.initMainChart('Month', dataSet));
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}

import { inject, Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle, hexToRgba } from '@coreui/utils';
import { TranslateService, TranslateModule } from '@ngx-translate/core';  // Import ngx-translate service
import { CommonTranslateService } from '@services/common-translate.service';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  private _translateService = inject(TranslateService);

  constructor(private translate: TranslateService) {
    this._translateService.stream('...').subscribe(() => this.initMainChart());
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month', customData: number[] = []): IChartProps {
    // Define red color
    const redColor = '#ff0000'; // Red color for the bars
  
    // Use custom data if provided, otherwise default to random data
    const data = customData.length ? customData : Array(12).fill(0).map(() => this.random(10, 30));
  
    const datasets: ChartDataset[] = [
      {
        data,
        label: this.translate.instant('CHART.LABELS.QUANTITY'),
        backgroundColor: redColor,  // Fill the bars with red color
        borderColor: redColor,      // Border red color (optional)
        borderWidth: 1,             // Optional: Border thickness of the bars
        fill: true                  // Fill the bars (for bar chart, it's filled by default)
      }
    ];
  
    const labels = [
      this.translate.instant('CHART.LABELS.JAN'), // Tháng 1
      this.translate.instant('CHART.LABELS.FEB'), // Tháng 2
      this.translate.instant('CHART.LABELS.MAR'), // Tháng 3
      this.translate.instant('CHART.LABELS.APR'), // Tháng 4
      this.translate.instant('CHART.LABELS.MAY'), // Tháng 5
      this.translate.instant('CHART.LABELS.JUN'), // Tháng 6
      this.translate.instant('CHART.LABELS.JUL'), // Tháng 7
      this.translate.instant('CHART.LABELS.AUG'), // Tháng 8
      this.translate.instant('CHART.LABELS.SEP'), // Tháng 9
      this.translate.instant('CHART.LABELS.OCT'), // Tháng 10
      this.translate.instant('CHART.LABELS.NOV'), // Tháng 11
      this.translate.instant('CHART.LABELS.DEC')  // Tháng 12
    ];
  
    const scales = this.getScales();
  
    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: false // Hide the legend (annotation)
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };
  
    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        bar: {
          borderRadius: 4,           // Optional: Adds rounding to the bar edges
        }
      }
    };
  
    return {
      type: 'bar', // Change chart type to 'bar'
      data: {
        labels,
        datasets
      },
      options
    };
  }
  
  
  

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');
  
    const scales: ScaleOptions<any> = {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        beginAtZero: true, // Ensures y-axis starts at 0
        ticks: {
          color: colorBody,
          // Explicitly define the 'value' type as 'number'
          callback: (value: number) => value.toString() // Display values directly as is
        }
      }
    };

    return scales;
  }
  
  
}

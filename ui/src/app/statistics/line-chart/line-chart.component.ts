import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {ApiService} from '../../api.service';
import {ChartData} from './chart-data';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {

  @Input() data: ChartData[];

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: ChartOptions = {responsive: true};
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,300,1000,0.3)',
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor(private apiService: ApiService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data !== undefined && this.data !== null) {
      this.lineChartLabels = ['temp', 'hum'];
      this.data.forEach((d) => this.lineChartLabels.push(d.time));
      this.lineChartData = [{data: this.data.map(d => d.temp), label: 'temp'}, {data: this.data.map(d => d.hum), label: 'hum'}];
    }
  }

  // todo: quando si riceve una reading chiamare il metodo updateData in data service

}

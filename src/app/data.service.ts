import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Define the listHTML property
  listHTML = {
    html_type: [],
    html_object: [],
    object_station: [],
    request_id: [],
    task_code: [],
    task_ID: [],
    station_code: [], // Added the station_code property
    result: [],
    created_at: [],
    confidence_score: [],
    urls: [],
  };

  constructor() {}
  
  // Example method to get the listHTML data
  getData() {
    return this.listHTML;
  }
}
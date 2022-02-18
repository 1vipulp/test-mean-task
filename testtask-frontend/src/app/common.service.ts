import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient
  ) { }

  setHeaderWithParams() {
    let header = new HttpHeaders();
    header = header.set('Access-Control-Allow-Origin', "*")
    return { headers: header }
  }

  getAPICall(url) {
    return new Promise((resolve, reject) => {
      this.http.get(url, this.setHeaderWithParams()).subscribe((data: any) => {
        return resolve(data)
      }, (error) => {
        return reject(error)
      })
    })
  }

  postAPICall(url, data) {
    return new Promise((resolve, reject) => {
      this.http.post(url, data).subscribe((data: any) => {
        return resolve(data)
      }, (error) => {
        return reject(error)
      })
    })
  }

  putAPICall(url, data) {
    return new Promise((resolve, reject) => {
      this.http.put(url, data).subscribe((data: any) => {
        return resolve(data)
      }, (error) => {
        return reject(error)
      })
    })
  }

  deleteAPICall(url) {
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe((data: any) => {
        return resolve(data)
      }, (error) => {
        return reject(error)
      })
    })
  }
}

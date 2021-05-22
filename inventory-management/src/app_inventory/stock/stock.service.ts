import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';


const BACKEND_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient, private router: Router){  }

  getAllStocks() {
    return this.http.get<{
     
    }>(BACKEND_URL + '/stock/getAllStocks');
  }

  getAllStocksAndStockDetials() {
    return this.http.get<{
     
    }>(BACKEND_URL + '/stock/getAllStocksAndStockDetials');
  }

  getStockDetailsByStockId(stockId) {
    return this.http.get<{
     
    }>(BACKEND_URL + '/stock/getStockDetailsByStockId/'+stockId );
  }

  updateLocationsForProduct(obj:any){
    return this.http.put<{
     
    }>(BACKEND_URL + '/stock/updateLocationsForProduct/',obj );
  }
}

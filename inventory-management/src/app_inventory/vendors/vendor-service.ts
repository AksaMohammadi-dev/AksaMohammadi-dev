import { Vendor } from './vendor.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class VendorService{

  private vendors: Vendor[] = [];
  private vendorsUpdate = new Subject<{vendors: Vendor[], vendorCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getVendors(vendorsPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${vendorsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, vendors: any, maxVendors: number}>(
      BACKEND_URL + '/vendor/vendors' + queryParams
    )
    .pipe(map((vendorData) => {
      return {
          vendor: vendorData.vendors.map(vendor => {
          return {
            id: vendor._id,
            name: vendor.name,
            creator: vendor.creator
          };
        }),
        maxVendor: vendorData.maxVendors
      };
    }))
    .subscribe((transformedVendorsData) => {
      this.vendors = transformedVendorsData.vendor;

      this.vendorsUpdate.next({
        vendors: [...this.vendors],
        vendorCount: transformedVendorsData.maxVendor
      });
    });
  }

  getVendor(id: string) {
    return this.http.get<{
      _id: string,
      name: string,
      creator: string
    }>(BACKEND_URL + '/vendor/get/' + id);
  }


 
  deleteVendor(vendorId: string) {

    return this.http.delete(BACKEND_URL + '/vendor/delete/' + vendorId);

  }

  getVendorUpdateListner(){
    return this.vendorsUpdate.asObservable();
  }

  updateVendor(id: string, name: string, creator: string) {
    let vendorData: Vendor | FormData;

    vendorData = {
        id: id,
        name: name,
        creator: null
      };

    this.http
    .put(BACKEND_URL + '/vendor/update/' + id, vendorData)
    .subscribe(response => {
      this.router.navigate(['/list-vendor']);
    });
  }

  addVendor(name: string, creator: string){
    const vendorData = new FormData();
    vendorData.append('name', name);
    vendorData.append('creator', creator);

    this.http
      .post<{ message: string, vendor: Vendor }>(BACKEND_URL + '/vendor/save', vendorData)
      .subscribe(responseData => {
        this.router.navigate(['/list-vendor']);
      });
  }

}

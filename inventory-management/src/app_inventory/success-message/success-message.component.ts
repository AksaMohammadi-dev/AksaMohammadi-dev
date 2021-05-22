import { ConditionalExpr } from '@angular/compiler';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StockService } from '../stock/stock.service';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent implements OnInit {
  public delete : Boolean;
  public create : Boolean;
  public edit : Boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {data} ,public stockService: StockService){
  }
  
  ngOnInit() {
    let obj :any =[]
    obj = this.data
    this.delete = obj.delete
    this.create = obj.create
    this.edit = obj.edit
  }

  editRecord(){
    let data : any = this.data
    let obj = Object.entries(data.newData).reduce((a,[k,v]) => (v !== undefined ? (a[k]=v, a) : a), {}) //Filter ONLY undefined
    let bodyData = {"newData":obj,"serialno":data.oldData.serialno}
    this.stockService.updateLocationsForProduct(bodyData)
    .subscribe((response:any) => {
      console.log('result--> ',response)
    });
  }
}

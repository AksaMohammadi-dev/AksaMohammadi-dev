import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app_inventory/auth/auth.service';
import { StockService } from '../stock.service';
import { MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import { SuccessMessageComponent } from 'src/app_inventory/success-message/success-message.component';


@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.css']
})
export class StockCreateComponent implements OnInit {
  private mode = 'create';
  private stockId: string;
  isLoading = false;
  public dataLength: number;
  public edit = false;
  public oldValueLoc;
  public oldValueSubloc;
  newValueLoc;
  newValueSubloc;
  eventLoc;
  eventSubloc;
  public displayedColumns = [
    'serialno',
    'loc',
    'subloc',
    'createdAt',
     'edit'
  ];
  public dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  location = [{
    id: '1',
    name: 'loc 1'
},
{
    id: '2',
    name: 'loc 2'
}]

sublocation =  [{
    id: '1',
    name: 'subLoc 1'
},
{
    id: '2',
    name: 'subLoc 2'
}]
  constructor(public stockService: StockService, public authService: AuthService, public route: ActivatedRoute,public dialog: MatDialog) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('stockId')) {
        this.mode = 'edit';
        this.stockId = paramMap.get('stockId');
        this.isLoading = true;
        this.stockService.getStockDetailsByStockId(this.stockId)
        .subscribe((data:any) => {
          this.dataLength = data.length;
          this.dataSource.data = data;
        });
      }
    });
  }
 
editLoc(event,id){
  if(event != undefined){
    this.oldValueLoc = id
    this.eventLoc = event
  }
}

editSubloc(event,id){
  if(event != undefined){
    this.oldValueSubloc = id
    this.eventSubloc = event
  }
}

editMessage;
editRecord(event,id:any){
  var message;
  this.newValueLoc = id.loc.name;
  this.newValueSubloc = id.subloc.name

  if(this.oldValueLoc && typeof this.oldValueLoc === 'object'){
    this.oldValueLoc = this.oldValueLoc.name
  }
  if(this.oldValueSubloc && typeof this.oldValueSubloc === 'object'){
    this.oldValueSubloc = this.oldValueSubloc.name
  }
    if(this.eventLoc == 'loc' && this.eventSubloc == undefined){
      message = "Are you sure you want to change "+ this.eventLoc +" of serial no "+id.serialno+" from '"+ this.oldValueLoc +"' to '"+ this.newValueLoc+"'.!"
      this.editMessage = true;
    }else if(this.eventSubloc == 'subloc' && this.eventLoc == undefined){
      this.newValueSubloc = id.subloc.name
      message = "Are you sure you want to change "+ this.eventSubloc +" of serial no "+id.serialno+" from '"+ this.oldValueSubloc +"' to '"+ this.newValueSubloc+"'.!"
      this.editMessage = true;
    }else if(this.eventLoc == 'loc' && this.eventSubloc == 'subloc'){
      message = "Are you sure you want to change serial no '"+id.serialno +"' '" + this.eventLoc+"' from '"+ this.oldValueLoc +"' to '"+ this.newValueLoc+"' And '"+ this.eventSubloc+"' from '"+ this.oldValueSubloc +"' to '"+ this.newValueSubloc+"' .!"
      this.editMessage = true;
    }else{
      message = "pleaaase select a valid value to be updated..!"
      this.editMessage = false;
    }
    let newValue = {"loc":this.newValueLoc , "subloc":this.newValueSubloc}
      this.dialog.open(SuccessMessageComponent,  {data:{ message:message,edit:this.editMessage, oldData  :id, newData: newValue }})
      this.eventLoc = undefined;
      this.eventSubloc = undefined;
      this.oldValueLoc = undefined;
      this.newValueLoc = undefined;
      this.newValueSubloc = undefined;
      this.oldValueSubloc = undefined;
  }

  
}


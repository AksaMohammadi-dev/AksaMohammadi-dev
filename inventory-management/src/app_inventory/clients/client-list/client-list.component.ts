import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Client } from '../client.model';
import { ClientService } from '../client-service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})

export class ClientListComponent implements OnInit, OnDestroy {

  public clients: Client[] = [];
  private clientsSub: Subscription;
  totalClients = 0;
  clientsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  userId: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.clientsService.getClients(this.clientsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.clientsSub = this.clientsService.getClientUpdateListner()
    .subscribe((clientData: {
      clients: Client[], clientCount: number
    }) => {
      this.isLoading = false;
      this.totalClients = clientData.clientCount;
      this.clients = clientData.clients;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(clientId: string){
    this.clientsService.deleteClient(clientId)
    .subscribe(
      () => {
        this.clientsService.getClients(this.clientsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.clientsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.clientsPerPage = pageData.pageSize;
    this.clientsService.getClients(this.clientsPerPage, this.currentPage);
  }

  constructor(public clientsService: ClientService, private authService: AuthService){

  }
}

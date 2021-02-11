import { Client } from './client.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class ClientService{

  private clients: Client[] = [];
  private clientsUpdate = new Subject<{clients: Client[], clientCount: number}>();

  constructor(private http: HttpClient, private router: Router){

  }

  getClients(clientsPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${clientsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, clients: any, maxClients: number}>(
      BACKEND_URL + '/client/clients' + queryParams
    )
    .pipe(map((clientData) => {
      return {
          client: clientData.clients.map(client => {
          return {
            id: client._id,
            name: client.name,
            creator: client.creator
          };
        }),
        maxClient: clientData.maxClients
      };
    }))
    .subscribe((transformedClientsData) => {
      this.clients = transformedClientsData.client;

      this.clientsUpdate.next({
        clients: [...this.clients],
        clientCount: transformedClientsData.maxClient
      });
    });
  }

  getClient(id: string) {
    return this.http.get<{
      _id: string,
      name: string,
      creator: string
    }>(BACKEND_URL + '/client/get/' + id);
  }


 
  deleteClient(clientId: string) {

    return this.http.delete(BACKEND_URL + '/client/delete/' + clientId);

  }

  getClientUpdateListner(){
    return this.clientsUpdate.asObservable();
  }

  updateClient(id: string, name: string, creator: string) {
    let clientData: Client | FormData;

    clientData = {
        id: id,
        name: name,
        creator: null
      };

    this.http
    .put(BACKEND_URL + '/client/update/' + id, clientData)
    .subscribe(response => {
      this.router.navigate(['/list-client']);
    });
  }

  addClient(name: string, creator: string){
    const clientData = new FormData();
    clientData.append('name', name);
    clientData.append('creator', creator);

    this.http
      .post<{ message: string, client: Client }>(BACKEND_URL + '/client/save', clientData)
      .subscribe(responseData => {
        this.router.navigate(['/list-client']);
      });
  }

}

import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { ClientService } from '../client-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Client } from '../client.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app_inventory/auth/auth.service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent implements OnInit, OnDestroy {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private clientId: string;
  isLoading = false;
  form: FormGroup;
  client: Client;
  imagePreview: string;
  private authStatusSubs: Subscription;

  constructor(public clientService: ClientService, public authService: AuthService, public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.authStatusSubs = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('clientId')) {
        this.mode = 'edit';
        this.clientId = paramMap.get('clientId');
        this.isLoading = true;
        this.clientService.getClient(this.clientId)
        .subscribe(clientData => {
          this.isLoading = false;
          this.client = {
            id: clientData._id,
            name: clientData.name,
            creator: clientData.creator,
          };
          this.form.setValue({
            name: this.client.name,
          });
        });
      }
      else {
        this.mode = 'create';
        this.clientId = null;
      }
    });
  }

  ngOnDestroy(){
    this.authStatusSubs.unsubscribe();
  }

  onSaveClient() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {

      this.clientService.addClient(
        this.form.value.name,
        this.form.value.creator);
    }
    else {

      this.clientService.updateClient(
        this.clientId,
        this.form.value.name,
        this.form.value.creator);
    }


    this.form.reset();
  }

  // onImagePick(event: Event){
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({
  //     image: file
  //   });
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
}

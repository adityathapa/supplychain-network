/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { commodityService } from './commodity.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.css'],
  providers: [commodityService]
})
export class commodityComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  commodityId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  quantity = new FormControl('', Validators.required);
  unitPrice = new FormControl('', Validators.required);
  totalPrice = new FormControl('', Validators.required);
  trace = new FormControl('', Validators.required);
  purchaseorder = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);

  constructor(public servicecommodity: commodityService, fb: FormBuilder) {
    this.myForm = fb.group({
      commodityId: this.commodityId,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
      trace: this.trace,
      purchaseorder: this.purchaseorder,
      owner: this.owner,
      issuer: this.issuer
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicecommodity.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.supplychain.network.commodity',
      'commodityId': this.commodityId.value,
      'name': this.name.value,
      'description': this.description.value,
      'quantity': this.quantity.value,
      'unitPrice': this.unitPrice.value,
      'totalPrice': this.totalPrice.value,
      'trace': this.trace.value,
      'purchaseorder': this.purchaseorder.value,
      'owner': this.owner.value,
      'issuer': this.issuer.value
    };

    this.myForm.setValue({
      'commodityId': null,
      'name': null,
      'description': null,
      'quantity': null,
      'unitPrice': null,
      'totalPrice': null,
      'trace': null,
      'purchaseorder': null,
      'owner': null,
      'issuer': null
    });

    return this.servicecommodity.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'commodityId': null,
        'name': null,
        'description': null,
        'quantity': null,
        'unitPrice': null,
        'totalPrice': null,
        'trace': null,
        'purchaseorder': null,
        'owner': null,
        'issuer': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.supplychain.network.commodity',
      'name': this.name.value,
      'description': this.description.value,
      'quantity': this.quantity.value,
      'unitPrice': this.unitPrice.value,
      'totalPrice': this.totalPrice.value,
      'trace': this.trace.value,
      'purchaseorder': this.purchaseorder.value,
      'owner': this.owner.value,
      'issuer': this.issuer.value
    };

    return this.servicecommodity.updateAsset(form.get('commodityId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicecommodity.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicecommodity.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'commodityId': null,
        'name': null,
        'description': null,
        'quantity': null,
        'unitPrice': null,
        'totalPrice': null,
        'trace': null,
        'purchaseorder': null,
        'owner': null,
        'issuer': null
      };

      if (result.commodityId) {
        formObject.commodityId = result.commodityId;
      } else {
        formObject.commodityId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.quantity) {
        formObject.quantity = result.quantity;
      } else {
        formObject.quantity = null;
      }

      if (result.unitPrice) {
        formObject.unitPrice = result.unitPrice;
      } else {
        formObject.unitPrice = null;
      }

      if (result.totalPrice) {
        formObject.totalPrice = result.totalPrice;
      } else {
        formObject.totalPrice = null;
      }

      if (result.trace) {
        formObject.trace = result.trace;
      } else {
        formObject.trace = null;
      }

      if (result.purchaseorder) {
        formObject.purchaseorder = result.purchaseorder;
      } else {
        formObject.purchaseorder = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer;
      } else {
        formObject.issuer = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'commodityId': null,
      'name': null,
      'description': null,
      'quantity': null,
      'unitPrice': null,
      'totalPrice': null,
      'trace': null,
      'purchaseorder': null,
      'owner': null,
      'issuer': null
      });
  }

}

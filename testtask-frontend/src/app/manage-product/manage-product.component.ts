import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';

export interface productData {
  id: string,
  name: string,
  image_url: string,
  price: number
}

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  public itemName = null;
  public itemPrice = null;
  public filePath = null;
  public errorMessage = null;
  public allProducts: productData[] = []
  public selectedTab = 0
  public isEditMode = false
  public editRecordId = null
  @ViewChild('inputFile') myInputVariable: ElementRef;

  constructor(
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.fetchProducts()
  }

  onChange(event) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.filePath = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    // console.log('this.this.filePath', this.filePath)
  }

  fetchProducts() {
    this._commonService.getAPICall('http://127.0.0.1:3000/product')
      .then((response: productData[]) => {
        this.allProducts = response
      })
  }

  deleteProduct(product) {
    if (confirm(`Are you sure you want to delete product ${product.name}`)) {
      this._commonService.deleteAPICall(`http://127.0.0.1:3000/product/${product.id}`)
        .then((response: productData[]) => {
          this.fetchProducts()
        })
    }
  }

  editProduct(product) {
    this.itemName = product.name
    this.itemPrice = product.price
    this.filePath = product.image_url
    this.isEditMode = true
    this.editRecordId = product.id
    this.selectedTab = 0
  }

  submitForm() {
    if (this.itemName) this.itemName = this.itemName.trim()
    if (!this.itemName) {
      this.errorMessage = 'Please enter valid product name.'
      return;
    } else if (this.itemName && this.itemName.length > 50) {
      this.errorMessage = 'Product Name should not exceed length of 50 character.'
      return;
    } else if (!this.itemPrice) {
      this.errorMessage = 'Please enter valid product price.'
      return;
    } else if (this.itemPrice && (this.itemPrice < 10000 || this.itemPrice > 99999)) {
      this.errorMessage = 'Product price should be between 10000 to 99999'
      return;
    } else if (!this.filePath) {
      this.errorMessage = 'Please upload valid file path'
      return;
    }
    this.errorMessage = null;
    const requestPayload = {
      name: this.itemName,
      price: this.itemPrice,
      image_url: this.filePath
    }
    if (this.isEditMode) {
      this.editProductCall(requestPayload)
      return
    }
    this._commonService.putAPICall('http://127.0.0.1:3000/product/', requestPayload)
      .then((response) => {
        this.resetForm()
      })
      .catch((error) => {
        console.log('error', error)
        if (error?.error?.message) {
          this.errorMessage = error.error.message
        } else {
          this.errorMessage = 'There is something wrong while adding product. Please try after sometime.'
        }
      })
  }

  editProductCall(requestPayload) {
    this._commonService.postAPICall('http://127.0.0.1:3000/product/' + this.editRecordId, requestPayload)
      .then((response) => {
        this.resetForm()
      })
      .catch((error) => {
        console.log('error', error)
        if (error?.error?.message) {
          this.errorMessage = error.error.message
        } else {
          this.errorMessage = 'There is something wrong while adding product. Please try after sometime.'
        }
      })
  }

  resetForm() {
    this.itemName = null;
    this.itemPrice = null;
    this.filePath = null;
    this.myInputVariable.nativeElement.value = '';
    this.selectedTab = 1;
    this.fetchProducts()
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../common.service';
import { InfoDialogComponent } from '../dialogs/info-dialog/info-dialog.component';
import { productData, CartData } from '../schema'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public allProducts: productData[] = []
  public cartItems: CartData[] = []
  public pageSize = 5
  public pageNumber = 1

  constructor(
    private _commonService: CommonService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchProducts()
    this.fetchCartItems()
  }

  fetchProducts() {
    this._commonService.getAPICall(`http://127.0.0.1:3000/product?page_size=${this.pageSize}&page_number=${this.pageNumber}`)
      .then((response: productData[]) => {
        this.allProducts = [...this.allProducts, ...response]
      })
  }

  productListScroll() {
    this.pageNumber = this.pageNumber + 1
    this.fetchProducts()
  }

  fetchCartItems() {
    this._commonService.getAPICall(`http://127.0.0.1:3000/user`)
      .then((response: CartData[]) => {
        this.cartItems = response
        console.log(this.cartItems)
      })
  }

  addToCart(product) {
    for (const elem of this.cartItems) {
      if (elem.id === product.id) {
        this.openDialog({
          message: 'Item already exists to your cart.',
          color: 'failure',
          icon: 'error_outline'
        })
        break;
      }
    }
    this._commonService.putAPICall(`http://127.0.0.1:3000/user`, { product_id: product.id })
      .then((response: productData[]) => {
        this.openDialog({
          message: 'Item added successfully from your cart.',
          color: 'success',
          icon: 'check_circle'
        })
        this.fetchCartItems()
      })
  }

  changeQuantity(product, action) {
    this._commonService.postAPICall(`http://127.0.0.1:3000/user`, { product_id: product.id, action_type: action })
      .then((response: productData[]) => {
        this.fetchCartItems()
      })
  }

  removeFromCart(product) {
    this._commonService.deleteAPICall(`http://127.0.0.1:3000/user/${product.id}`)
      .then((response: productData[]) => {
        this.openDialog({
          message: 'Item deleted successfully from your cart.',
          color: 'success',
          icon: 'check_circle'
        })
        this.fetchCartItems()
      })
  }

  openDialog(data) {
    this.dialog.open(InfoDialogComponent, {
      data: data
    });
  }

}

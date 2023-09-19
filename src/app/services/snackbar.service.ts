import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  duration = 5;

  constructor(private _snackBar: MatSnackBar) { }

  open(type: string) {
    this._snackBar.open(this.getMessage(type), 'Close', {
      duration: this.duration * 1000,
    });
  }

  private getMessage(type: string): string {
    return type === 'success' ? 'Transaction was successful!' : 'Something happened! Transaction failed!';
  }
}

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChain } from '../interfaces/crypto.interface';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(private http: HttpClient) { }

  public getAllChain(): Observable<IChain[]> {
    return this.http.get<IChain[]>('https://chainid.network/chains_mini.json');
  }
}

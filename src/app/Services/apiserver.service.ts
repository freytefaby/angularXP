import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiserverService {

  constructor(private _http: HttpClient) { }

  public headers: HttpHeaders = new HttpHeaders({
    'Accept':'application/json'
  });

  crearPlayers(request:Array<string>){
    const url = environment.players;
    return this._http.post(url,request,{headers:this.headers});
  }

  createGame(){
    const url = environment.game;
    return this._http.post(url,{headers:this.headers});
  }

  createMovements(request:Array<any>){
    const url = environment.round;
    return this._http.post(url,request,{headers:this.headers});
  }
}

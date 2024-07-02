import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private token: string ='';
  private username: string ='';
  private email: string='';
  private phoneNumber: string='';
  private userId: string='';

  constructor() { }
setToken(token: string){
  this.token = token;
}
getToken(): string{
  return this.token;
}
  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }
  setEmail(email:string){
    this.email = email;
  }
  getEmail():string {
    return this.email;

  }
  setPhoneNumber(phoneNumber: string){
    this.phoneNumber = phoneNumber;
  }
  getPhoneNumber():string{
    return this.phoneNumber;
  }
  setUserId(userId: string){
    this.userId = userId;
  }
  getUserId(): string{
    return this.userId;
  }
}

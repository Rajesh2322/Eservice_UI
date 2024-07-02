import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ObsService {
  private loginTime: string = '';
 
  serviceUrl = environment.baseUrl;

  constructor(private http:HttpClient) {
    this.updateLoginTime();
   }

  private updateLoginTime(): void {
    setInterval(() => {
      const currentDate = new Date();
      this.loginTime = this.formatTime(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    }, 1000);
  }
  formatTime(hours: number, minutes: number, seconds: number): string {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  }
  getLoginTime(): string {
    return this.loginTime;
  }
  
  getAccountInfo(){
    const userId = localStorage.getItem('userId') ?? '';
return this.http.get(this.serviceUrl+`account/getAccInfoById?userId=${encodeURIComponent(userId)}`);
  }
}

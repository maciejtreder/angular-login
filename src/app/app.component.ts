import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
 
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
 public $user: Observable<any> = this.userService.getUser();
 public $secretInfo: Observable<any> = of(null);
 
 constructor(private userService: UserService) {}
 
 public showSecret(): void {
   this.$secretInfo =  this.userService.getSecretInfo();
 }
 
}

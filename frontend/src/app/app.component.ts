import {Component} from "@angular/core";

interface City {
  name: string,
  code: string
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor() {

  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {PersistanceService} from "../../services/persistance.service";
import {Subject, takeUntil} from "rxjs";
import {AuthorInterface} from "../../interfaces/author.interface";

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit, OnDestroy {
  lastName: string | undefined = undefined;
  firstName: string | undefined = undefined;
  middleName: string | undefined = undefined;
  birthday: string | undefined = undefined;

  onDestroy$: Subject<boolean> = new Subject();

  authors: any = [];
  showFieldErrorBorders = false;

  constructor(
    private persistanceService: PersistanceService
  ) {
  }

  ngOnInit() {
    this.persistanceService.getAuthors().pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((response: AuthorInterface[] | null) => {
        if (response) {
          this.authors = response.map((item: AuthorInterface) => Object.assign({}, item));
        }
      }
    );

  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  inputFieldsInvalid(): boolean {
    if ((!this.lastName || this.lastName.length === 0)
      || (!this.firstName || this.firstName.length === 0)
      || (!this.middleName || this.middleName.length === 0)
      || (!this.birthday || this.birthday.length === 0)) {
      return true;
    }
    return false;
  }

  refreshFields(): void {
    this.lastName = undefined;
    this.firstName = undefined;
    this.middleName = undefined;
    this.birthday = undefined;
    this.showFieldErrorBorders = false;
  }

  addAuthor(): void {
    if (this.inputFieldsInvalid()) {
      this.showFieldErrorBorders = true;
      return;
    }

    let args: AuthorInterface = {
      id: undefined,
      lastName: this.lastName,
      firstName: this.firstName,
      middleName: this.middleName,
      birthday: this.birthday,
    }
    this.persistanceService.addAuthorsToLocalstorage(args).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((response) => {
      if (response) {
        this.authors = response.map((item: AuthorInterface) => Object.assign({}, item));
        this.refreshFields();
      }
    });
  }


}

import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {PersistanceService} from "../../services/persistance.service";
import {AuthorInterface} from "../../interfaces/author.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BookInterface} from "../../interfaces/book.interface";
import {SortConfigInterface} from "../../interfaces/sort-config.interface";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {
  form = new FormGroup({
    bookAuthor: new FormControl(null, [Validators.required]),
    bookName: new FormControl(null, [Validators.required]),
    bookPublisher: new FormControl(null, [Validators.required]),
    bookYear: new FormControl(null, [Validators.required]),
  });

  onDestroy$: Subject<boolean> = new Subject();

  sortConfig: SortConfigInterface = { asc: false, column: 'bookAuthor' };

  authors: any = [];
  books: any = [];

  constructor(
    private persistanceService: PersistanceService
  ) {
  }

  ngOnInit() {
    this.persistanceService.getAuthors().pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((response: AuthorInterface[] | null) => {
      if (response) {
        this.authors = response.map((item: AuthorInterface) => {
          return (item.lastName + ' ' + item.firstName + ' ' + item.middleName);
        });
      }
    });


    this.persistanceService.getBooks().pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((response: BookInterface[] | null) => {
      if (response) {
        this.books = response.map((item: BookInterface) => Object.assign({}, item));
      }
    });

  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }


  addBook(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const args: BookInterface = {
      id: undefined,
      bookAuthor: this.form.get('bookAuthor')?.value,
      bookName: this.form.get('bookName')?.value,
      bookPublisher: this.form.get('bookPublisher')?.value,
      bookYear: this.form.get('bookYear')?.value,
    };

    this.persistanceService.addBooksToLocalstorage(args).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((response) => {
      if (response) {
        this.form.reset();
        this.books = response.map((item: BookInterface) => Object.assign({}, item));
      }
    });
  }

  doSort(): void {
    switch (this.sortConfig.column) {
      case 'id': {
        this.sortBooksByID(this.sortConfig.asc);
        break;
      }
      case 'bookAuthor': {
        this.sortBooksByBookAuthor(this.sortConfig.asc);
        break;
      }
      case 'bookName': {
        this.sortBooksByBookName(this.sortConfig.asc);
        break;
      }
      case 'bookPublisher': {
        this.sortBooksByBookPublisher(this.sortConfig.asc);
        break;
      }
      case 'bookYear': {
        this.sortBooksByBookYear(this.sortConfig.asc);
        break;
      }
      default: {
        break;
      }
    }
  }

  sortBooksByID(asc: boolean = true): void {
    this.books?.sort((a: BookInterface, b: BookInterface) => {
      if ( a.id && b.id && a.id > b.id) {
        return asc ? 1 : -1;
      } else if (a.id && b.id && a.id < b.id) {
        return asc ? -1 : 1;
      }

      return 0;
    });
  }

  sortBooksByBookAuthor(asc: boolean = true): void {
    this.books?.sort((a: BookInterface, b: BookInterface) => {
      if ( a.bookAuthor && b.bookAuthor && a.bookAuthor > b.bookAuthor) {
        return asc ? 1 : -1;
      } else if (a.bookAuthor && b.bookAuthor && a.bookAuthor < b.bookAuthor) {
        return asc ? -1 : 1;
      }

      return 0;
    });
  }

  sortBooksByBookName(asc: boolean = true): void {
    this.books?.sort((a: BookInterface, b: BookInterface) => {
      if ( a.bookName && b.bookName && a.bookName > b.bookName) {
        return asc ? 1 : -1;
      } else if (a.bookName && b.bookName && a.bookName < b.bookName) {
        return asc ? -1 : 1;
      }

      return 0;
    });
  }

  sortBooksByBookPublisher(asc: boolean = true): void {
    this.books?.sort((a: BookInterface, b: BookInterface) => {
      if ( a.bookPublisher && b.bookPublisher && a.bookPublisher > b.bookPublisher) {
        return asc ? 1 : -1;
      } else if (a.bookPublisher && b.bookPublisher && a.bookPublisher < b.bookPublisher) {
        return asc ? -1 : 1;
      }

      return 0;
    });
  }

  sortBooksByBookYear(asc: boolean = true): void {
    this.books?.sort((a: BookInterface, b: BookInterface) => {
      if ( a.bookYear && b.bookYear && a.bookYear > b.bookYear) {
        return asc ? 1 : -1;
      } else if (a.bookYear && b.bookYear && a.bookYear < b.bookYear) {
        return asc ? -1 : 1;
      }

      return 0;
    });
  }

  onSortContainersClick(column: string): void {
    this.sortConfig.asc = (this.sortConfig.column === column) ? !this.sortConfig.asc : true;
    this.sortConfig.column = column;
    this.doSort();
  }


}

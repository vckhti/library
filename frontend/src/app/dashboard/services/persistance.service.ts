import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LocalStorageInterface} from "../interfaces/local-storage.interface";
import {BookInterface} from "../interfaces/book.interface";
import {AuthorInterface} from "../interfaces/author.interface";

@Injectable()
export class PersistanceService implements LocalStorageInterface{
  authors: string = '';
  books: string = '';


  set(key: string, data: string): void {
    if (key && key.length > 0 && data && data.length > 0) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving to localStorage', e);
      }
    }
  }

  get(key: string): string {
    if (key && key.length > 0) {
      try {
        let str: string | null;
        str = localStorage.getItem(key);
        if (str) {
          return JSON.parse(str);
        } else {
          return '';
        }
      } catch (e) {
        console.error('Error getting data from localStorage', e);
        return '';
      }
    } else {
      return '';
    }
  }

  addBooksToLocalstorage(args: BookInterface): Observable<any> {
    let array=new Array();

    let currentBooksString = this.get('books');
    if (currentBooksString && currentBooksString.length > 0) {
      array=JSON.parse(currentBooksString);
    }
    args = {
      ...args,
      id: array.length === 0 ? 1 : this.getLastId(array)
    }
    array.push(args);
    array=this.sortBooksByAuthor(array);
    let str=JSON.stringify(array);
    this.set('books',str);

    return of(array)
      .pipe(
        catchError(() => of(null)),
      );
  }



  getBooks(): Observable<BookInterface[] | null> {
    let booksArray = new Array();

    let currentBooksString = this.get('books');
    if (currentBooksString && currentBooksString.length > 0) {
      booksArray= JSON.parse(currentBooksString);
    } else {
      return of(null)
    }

    return of(this.sortBooksByAuthor(booksArray))
      .pipe(
        catchError(() => of(null)),
      );
  }


  existAuthorsInLocalStorage(value: AuthorInterface, array: any[]): boolean {
    let exist = array.find((item) =>  value.lastName === item.lastName &&
      value.firstName === item.firstName && value.middleName === item.middleName && value.birthday === item.birthday);
    return !!exist;
  }

  private getLastId(array: any[]): number {
    return Math.max.apply(Math, array.map(item => item.id)) + 1;
  }

  addAuthorsToLocalstorage(args: AuthorInterface): Observable<any> {
    let array=new Array();
    let currentAuthorsString = this.get('authors');
    if (currentAuthorsString && currentAuthorsString.length > 0) {
      array=JSON.parse(currentAuthorsString);
      if (this.existAuthorsInLocalStorage(args,array)) {
        return EMPTY;
      }
    }
    args = {
      ...args,
      id: array.length === 0 ? 1 : this.getLastId(array)
    }
    array.push(args);
    array=this.sortAuthorsByLastname(array);
    let str=JSON.stringify(array);
    this.set('authors',str);

    return of(array)
      .pipe(
        catchError(() => of(null)),
      );
  }

  getAuthors(): Observable<AuthorInterface[] | null> {
    let authorsArray = new Array();

    let currentAuthorsString = this.get('authors');
    if (currentAuthorsString && currentAuthorsString.length > 0) {
      authorsArray= JSON.parse(currentAuthorsString);
    } else {
      return of(null)
    }

    return of(this.sortAuthorsByLastname(authorsArray))
      .pipe(
        catchError(() => of(null)),
      );
  }

  sortAuthorsByLastname(authors: AuthorInterface[]) {
    return authors.sort((a: AuthorInterface, b: AuthorInterface) => {
      if (a.lastName && b.lastName && a.lastName < b.lastName) {
        return -1;
      }
      if (a.lastName && b.lastName && a.lastName > b.lastName) {
        return 1;
      }
      return 0;
    });
  }

  sortBooksByAuthor(authors: BookInterface[]) {
    return authors.sort((a: BookInterface, b: BookInterface) => {
      if (a.bookAuthor && b.bookAuthor && a.bookAuthor < b.bookAuthor) {
        return -1;
      }
      if (a.bookAuthor && b.bookAuthor && a.bookAuthor > b.bookAuthor) {
        return 1;
      }
      return 0;
    });
  }

}

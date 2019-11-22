import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorService } from '../../error/services/error.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurantServiceUrl = environment.restaurantsApiEndpoint;
  private healthzApi: String = '/healthz';
  private restaurantsApi: String = '/restaurants';
  private httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getRestaurants(): Observable<string> {
    const apiEndpoint: string = this.restaurantServiceUrl + this.restaurantsApi;
    console.log('Calling api @ ' + apiEndpoint);
    return this.http.get<string>(apiEndpoint, this.httpOptions)
      .pipe(
        tap(_ => console.log('API ' + apiEndpoint + ' called, returning ...')),
        catchError(this.errorService.handleError<string>('getRestaurants()', String())));
  }

  getHealthz(): Observable<string> {
    const apiEndpoint: string = this.restaurantServiceUrl + this.healthzApi;
    console.log('Calling api @ ' + apiEndpoint + ' ...');
    return this.http.get<string>(apiEndpoint, this.httpOptions)
      .pipe(
        tap(_ => console.log('API ' + apiEndpoint + ' called, returning ...')),
        catchError(this.errorService.handleError<string>('getHealthz()', String())));
  }

}

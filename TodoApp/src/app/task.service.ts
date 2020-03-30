import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { ITask } from './task/ITask';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl: string = "http://localhost:8079/api/";
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Access-Control-Allow-Origin", "http://localhost:4200");
    this.headers.append("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  }

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.baseUrl + 'tasks', { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  addTasks(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.baseUrl + 'tasks', task, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  completeTasks(id: number, task: ITask): Observable<ITask> {
    return this.http.put<ITask>(this.baseUrl + 'tasks/' + id, task, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteTasks(id: number): Observable<ITask> {
    return this.http.delete<ITask>(this.baseUrl + 'tasks/' + id, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log("Client side error:");
      console.log(errorResponse.error.message);
    } else {
      console.log("Server side error:");
      console.log(errorResponse.error.message);
    }
    return throwError("Something went wrong while calling service.");
  }
}

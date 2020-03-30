import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { ITask } from './ITask';
import { strict } from 'assert';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tasks: ITask[];
  taskDescription: string;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => this.tasks = tasks.filter(task => task.IsDelete != true),
      (error) => console.log(error));
  }

  addTask() {
    var task = {
      Description: this.taskDescription,
      CreatedDate: new Date().toUTCString(),
      IsDelete: false,
      IsDone: false
    };

    this.taskService.addTasks(task as ITask).subscribe(
      (addedTask) => task = addedTask,
      (error) => console.log(error),
      () => {
        this.tasks.push(task as ITask);
        this.taskDescription = "";
      });
  }

  completeTask(task: ITask) {
    task.IsDone = !task.IsDone;
    this.taskService.completeTasks(task.Id, task).subscribe(
      (completedTask) => task = completedTask,
      (error) => console.log(error));
  }

  deleteTask(task: ITask) {
    task.IsDone = true;
    this.taskService.deleteTasks(task.Id).subscribe(
      (addedTask) => task = addedTask,
      (error) => console.log(error));
    task.IsDelete = true;
    this.tasks = this.tasks.filter(task => task.IsDelete != true);
  }
}

import { Injectable } from '@angular/core';
import { ToastType } from '@shared/enums/toast-type.enum';
import { Toast } from '@shared/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private toastSubject = new Subject<Toast>();
  public toastState = this.toastSubject.asObservable();

  constructor() {}

  show(message: string, type: ToastType, duration: number = 5000) {
    this.toastSubject.next({ message, type, duration });
  }

  showSuccess(message: string, duration: number = 5000) {
    this.show(message, ToastType.Success, duration);
  }

  showError(message: string, duration: number = 5000) {
    this.show(message, ToastType.Error, duration);
  }

  showWarning(message: string, duration: number = 5000) {
    this.show(message, ToastType.Warning, duration);
  }

  showInfo(message: string, duration: number = 5000) {
    this.show(message, ToastType.Info, duration);
  }
}

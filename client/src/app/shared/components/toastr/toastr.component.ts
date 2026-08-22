import { NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Toast } from '@shared/models';
import { ToastrService } from '@shared/services';

@Component({
  standalone: true,
  selector: 'app-toastr',
  imports: [NgClass, NgIf],
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.scss',
})
export class ToastrComponent {
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  toast: Toast | null = null;

  constructor() {
    this.toastr.toastState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((toast) => {
        this.toast = toast;
        setTimeout(() => {
          if (this.toast === toast) this.toast = null;
        }, toast.duration ?? 5000);
      });
  }
}

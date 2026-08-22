import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SpinnerService } from '@shared/services';

@Component({
  standalone: true,
  selector: 'app-spinner',
  imports: [AsyncPipe, NgIf],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  private readonly spinnerService = inject(SpinnerService);

  isVisible = this.spinnerService.spinnerVisible$;
}

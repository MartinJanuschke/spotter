import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PinService } from '../../core/auth/pin.service';
import { ToastService } from '../../ui/toast/toast.service';
import { SpButton } from '../../ui/button/button';
import { LucideLock } from '../../ui/icons';

@Component({
  selector: 'app-pin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslocoPipe, SpButton, LucideLock],
  templateUrl: './pin.html',
})
export class PinPage {
  private readonly pinService = inject(PinService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly transloco = inject(TranslocoService);

  protected readonly pin = signal('');
  protected readonly busy = signal(false);

  protected setPin(value: string): void {
    this.pin.set(value.replace(/[^0-9]/g, '').slice(0, 6));
  }

  protected async unlock(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      if (await this.pinService.tryUnlock(this.pin())) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/station';
        void this.router.navigateByUrl(returnUrl);
      } else {
        this.pin.set('');
        this.toast.show(this.transloco.translate('pin.wrong'), 'x');
      }
    } finally {
      this.busy.set(false);
    }
  }
}

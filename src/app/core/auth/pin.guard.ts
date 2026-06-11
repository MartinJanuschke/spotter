import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { PinService } from './pin.service';

export const pinGuard: CanActivateFn = async (_route, state) => {
  const pinService = inject(PinService);
  const router = inject(Router);
  await pinService.restore();
  return pinService.unlocked()
    ? true
    : router.createUrlTree(['/pin'], { queryParams: { returnUrl: state.url } });
};

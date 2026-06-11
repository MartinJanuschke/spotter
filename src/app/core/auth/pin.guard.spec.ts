import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pinGuard } from './pin.guard';
import { PinService } from './pin.service';
import { supabase } from '../supabase/supabase.client';

function runGuard(url: string) {
  return TestBed.runInInjectionContext(() =>
    pinGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
  );
}

describe('pinGuard', () => {
  beforeEach(() => {
    localStorage.removeItem('spotter_operator_pin');
    TestBed.configureTestingModule({});
    vi.spyOn(supabase, 'rpc').mockImplementation(
      (_fn, args) =>
        Promise.resolve({
          data: (args as { pin: string }).pin === '2468',
          error: null,
        }) as never,
    );
  });

  it('redirects to /pin with returnUrl when locked', async () => {
    const result = await runGuard('/station');
    expect(result).toBeInstanceOf(UrlTree);
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as UrlTree)).toBe('/pin?returnUrl=%2Fstation');
  });

  it('allows navigation when unlocked', async () => {
    const pinService = TestBed.inject(PinService);
    expect(await pinService.tryUnlock('2468')).toBe(true);
    expect(await runGuard('/station')).toBe(true);
    localStorage.removeItem('spotter_operator_pin');
  });

  it('rejects a wrong PIN', async () => {
    const pinService = TestBed.inject(PinService);
    expect(await pinService.tryUnlock('0000')).toBe(false);
    expect(pinService.unlocked()).toBe(false);
  });

  it('restores a stored PIN by re-verifying it against the database', async () => {
    localStorage.setItem('spotter_operator_pin', '2468');
    expect(await runGuard('/station')).toBe(true);
    localStorage.removeItem('spotter_operator_pin');
  });

  it('re-locks when the stored PIN no longer matches', async () => {
    localStorage.setItem('spotter_operator_pin', '1111');
    expect(await runGuard('/station')).toBeInstanceOf(UrlTree);
    localStorage.removeItem('spotter_operator_pin');
  });
});

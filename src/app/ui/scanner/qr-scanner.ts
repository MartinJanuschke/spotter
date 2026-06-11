import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  isDevMode,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { BarcodeDetector } from 'barcode-detector/ponyfill';
import { LucideCheck, LucideQrCode } from '../icons';
import { SpButton } from '../button/button';

/**
 * Design-system QR viewfinder: ink square with red corner brackets and a
 * scan-line animation over a live camera feed. Detection uses the
 * BarcodeDetector ponyfill (zxing-wasm) so iOS Safari works too.
 * Falls back to manual code entry when the camera is unavailable;
 * dev builds additionally get a "Scan simulieren" button.
 */
@Component({
  selector: 'sp-qr-scanner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslocoPipe, SpButton, LucideCheck, LucideQrCode],
  template: `
    <div
      class="relative mx-auto mt-6 aspect-square w-full overflow-hidden rounded-(--r-2xl) bg-(--ink-900) shadow-(--shadow-lg)"
      [class.max-w-[288px]]="size() === 'lg'"
      [class.max-w-[260px]]="size() === 'sm'"
    >
      <video
        #video
        playsinline
        muted
        autoplay
        class="absolute inset-0 h-full w-full object-cover"
        [class.hidden]="cameraState() !== 'active'"
      ></video>
      @if (cameraState() !== 'active') {
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex h-[150px] w-[150px] items-center justify-center rounded-[18px] bg-white">
            <svg lucideQrCode [size]="104" [strokeWidth]="1.4" class="text-(--ink-900)"></svg>
          </div>
        </div>
      }
      <span
        class="absolute top-[22px] left-[22px] h-[30px] w-[30px] rounded-tl-[12px] border-t-[3px] border-l-[3px] border-(--red-500)"
      ></span>
      <span
        class="absolute top-[22px] right-[22px] h-[30px] w-[30px] rounded-tr-[12px] border-t-[3px] border-r-[3px] border-(--red-500)"
      ></span>
      <span
        class="absolute bottom-[22px] left-[22px] h-[30px] w-[30px] rounded-bl-[12px] border-b-[3px] border-l-[3px] border-(--red-500)"
      ></span>
      <span
        class="absolute right-[22px] bottom-[22px] h-[30px] w-[30px] rounded-br-[12px] border-b-[3px] border-r-[3px] border-(--red-500)"
      ></span>
      @if (cameraState() === 'active') {
        <div
          class="absolute top-[26px] right-[26px] left-[26px] h-[2px] [animation:sp-scanline_1.1s_var(--ease-in-out)_infinite] [background:linear-gradient(90deg,transparent,var(--red-400),transparent)] [box-shadow:0_0_14px_3px_rgba(216,32,46,.6)]"
        ></div>
      }
    </div>

    @if (cameraState() === 'denied') {
      <p class="mt-3 text-center text-[12.5px] text-(--text-muted)">
        {{ 'scanner.cameraDenied' | transloco }}
      </p>
    }

    <div class="mt-5">
      @if (manualOpen() || cameraState() === 'denied') {
        <div class="flex gap-2.5">
          <input
            class="sp-input sp-num flex-1 uppercase"
            [placeholder]="'scanner.manualPlaceholder' | transloco"
            [ngModel]="manualCode()"
            (ngModelChange)="manualCode.set($event)"
            (keydown.enter)="submitManual()"
            autocapitalize="characters"
            autocomplete="off"
            spellcheck="false"
          />
          <sp-button variant="primary" size="lg" (pressed)="submitManual()">
            <svg lucideCheck [size]="18" [strokeWidth]="2.4"></svg>
          </sp-button>
        </div>
      } @else {
        <sp-button variant="ghost" size="md" [block]="true" (pressed)="manualOpen.set(true)">
          {{ 'scanner.manualEntry' | transloco }}
        </sp-button>
      }
      @if (devMode) {
        <div class="mt-2">
          <sp-button variant="secondary" size="md" [block]="true" (pressed)="simulate.emit()">
            {{ 'scanner.simulate' | transloco }}
          </sp-button>
        </div>
      }
    </div>
  `,
})
export class SpQrScanner {
  readonly size = input<'lg' | 'sm'>('lg');
  readonly detected = output<string>();
  readonly simulate = output<void>();

  protected readonly devMode = isDevMode();
  protected readonly cameraState = signal<'starting' | 'active' | 'denied'>('starting');
  protected readonly manualOpen = signal(false);
  protected readonly manualCode = signal('');

  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  private stream: MediaStream | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private detecting = false;
  private stopped = false;

  constructor() {
    afterNextRender(() => void this.startCamera());
    inject(DestroyRef).onDestroy(() => this.stopCamera());
  }

  private async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (this.stopped) {
        this.stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const video = this.videoRef().nativeElement;
      video.srcObject = this.stream;
      await video.play();
      this.cameraState.set('active');

      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      this.pollTimer = setInterval(() => void this.detect(detector, video), 150);
    } catch {
      this.cameraState.set('denied');
    }
  }

  private async detect(detector: BarcodeDetector, video: HTMLVideoElement): Promise<void> {
    if (this.detecting || video.readyState < 2) return;
    this.detecting = true;
    try {
      const codes = await detector.detect(video);
      const value = codes[0]?.rawValue.trim();
      if (value) {
        this.stopCamera();
        this.detected.emit(value);
      }
    } catch {
      // Ignore transient detection errors (e.g. frame not ready).
    } finally {
      this.detecting = false;
    }
  }

  private stopCamera(): void {
    this.stopped = true;
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  protected submitManual(): void {
    const code = this.manualCode().trim();
    if (!code) return;
    this.stopCamera();
    this.detected.emit(code);
  }
}

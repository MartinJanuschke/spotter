import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PlayerService } from '../players/player.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe, RouterLink],
  templateUrl: './register.html',
})
export class RegisterPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playerService = inject(PlayerService);
  private readonly fb = inject(FormBuilder);

  protected readonly playerId = signal<string>('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal(false);
  protected readonly alreadyRegistered = signal(false);

  protected readonly form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    year_of_birth: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(1900), Validators.max(2100)],
    ],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.playerId.set(id);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    const val = this.form.getRawValue() as {
      first_name: string;
      last_name: string;
      year_of_birth: number;
    };

    try {
      await this.playerService.create({ id: this.playerId(), ...val });
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/leaderboard']), 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists')) {
        this.alreadyRegistered.set(true);
      } else {
        this.error.set(msg);
      }
    } finally {
      this.loading.set(false);
    }
  }
}

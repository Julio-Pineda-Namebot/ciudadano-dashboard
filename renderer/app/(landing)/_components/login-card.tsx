'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { loginCitizen } from '@/app/auth-citizen';
import type { CitizenLoginState } from '@/app/auth-citizen-types';
import { ArrowRight, Eye, Lock, MessageSquare } from 'lucide-react';
import { LogoMark } from './icons';

type LoginCardProps = {
  sessionRevokedMessage?: string;
};

export function LoginCard({ sessionRevokedMessage }: LoginCardProps) {
  const [state, action, pending] = useActionState<CitizenLoginState, FormData>(loginCitizen, null);
  const [showPassword, setShowPassword] = useState(false);

  const errorMessage = state?.error ?? null;

  return (
    <main className="relative min-h-svh overflow-hidden">
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.10), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(217,165,94,0.10), transparent 55%), linear-gradient(180deg, rgba(11,15,28,0.95), rgba(5,7,15,1))',
        }}
      />
      <div className="grid-bg absolute inset-0 -z-10 opacity-25" />

      <Link
        href="/"
        className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-2xl bg-white/4 px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/8 sm:left-6 sm:top-6"
      >
        <LogoMark size={22} />
        <span className="font-display text-[14px] font-semibold tracking-tight text-white">Ciudadano</span>
      </Link>

      <div className="flex min-h-svh items-center justify-center px-4 py-20 sm:px-6">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-black/30 backdrop-blur-md sm:rounded-[32px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
              {/* Welcome panel */}
              <div className="relative flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-14">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const color = i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#9CA3B0' : '#D9A55E';
                    return (
                      <span
                        key={i}
                        className="float-slow absolute rounded-full"
                        style={{
                          left: `${(i * 53) % 100}%`,
                          top: `${(i * 37) % 100}%`,
                          width: 2 + (i % 3),
                          height: 2 + (i % 3),
                          background: color,
                          boxShadow: `0 0 12px ${color}`,
                          opacity: 0.5,
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="relative">
                  <div className="landing-chip">
                    <span className="landing-dot" /> LIVE · 142,318 VECINOS
                  </div>
                </div>

                <div className="relative flex flex-col items-start gap-6">
                  <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm sm:h-24 sm:w-24">
                    <LogoMark size={72} />
                  </div>
                  <h3 className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[34px] lg:text-[40px]">
                    <span className="gradient-text">Bienvenido a </span>
                    <span className="gradient-text-accent italic">Ciudadano</span>
                  </h3>
                  <p className="max-w-[440px] text-[14px] leading-relaxed text-white/60 sm:text-[15.5px]">
                    Ingresa para coordinar con tu cuadra en tiempo real, atender alertas y mantener
                    segura a tu comunidad.
                  </p>
                </div>

                <div className="relative grid grid-cols-3 gap-4 border-t border-white/8 pt-6">
                  <div>
                    <div className="font-mono text-[18px] text-white/85 sm:text-[20px]">18 s</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Respuesta</div>
                  </div>
                  <div>
                    <div className="font-mono text-[18px] text-white/85 sm:text-[20px]">98.4%</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Precisión</div>
                  </div>
                  <div>
                    <div className="font-mono text-[18px] text-white/85 sm:text-[20px]">24/7</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Activo</div>
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <div className="relative border-t border-white/8 bg-white/2 p-8 backdrop-blur-sm sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
                <form action={action} className="mx-auto flex w-full max-w-[420px] flex-col gap-5">
                  <div>
                    <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-white sm:text-[26px]">
                      Iniciar sesión
                    </h3>
                    <p className="mt-1 text-[13px] text-white/55">
                      Usa tu correo registrado por tu junta vecinal.
                    </p>
                  </div>

                  {sessionRevokedMessage && (
                    <div className="rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
                      {sessionRevokedMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rounded-lg border border-[#E04B5E]/30 bg-[#E04B5E]/10 px-3 py-2 text-[12.5px] text-[#FF8A99]">
                      {errorMessage}
                    </div>
                  )}

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
                      Correo
                    </span>
                    <div className="group relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition group-focus-within:text-white/70">
                        <MessageSquare size={16} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="vecino@correo.pe"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/4 pl-10 pr-3 text-[14px] text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/8"
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-white/55">
                      Contraseña
                    </span>
                    <div className="group relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35 transition group-focus-within:text-white/70">
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/4 pl-10 pr-11 text-[14px] text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </label>

                  <div className="flex items-center justify-end text-[12.5px]">
                    <a href="#" className="text-white/55 underline-offset-4 transition hover:text-white hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="landing-btn landing-btn-primary mt-1 h-12 w-full text-[14.5px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? 'Ingresando…' : <>Iniciar sesión <ArrowRight size={14} /></>}
                  </button>

                  <div className="relative my-1 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/35">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="font-mono">o</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <p className="text-center text-[13px] text-white/55">
                    ¿No tienes cuenta?{' '}
                    <Link href="/#contact" className="text-white underline-offset-4 hover:underline">
                      Habla con tu junta vecinal
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

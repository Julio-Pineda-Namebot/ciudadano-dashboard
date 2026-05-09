'use client'

import type { SceneId } from '../_data'

const PALETTES: Record<SceneId, { from: string; via: string; to: string; accent: string }> = {
  avenue:       { from: '#0b1530', via: '#152347', to: '#1f2f5e', accent: '#fde68a' },
  plaza:        { from: '#0c1a2e', via: '#16304d', to: '#1f4060', accent: '#fcd34d' },
  market:       { from: '#1a1208', via: '#3a2613', to: '#5a3a1d', accent: '#fbbf24' },
  parking:      { from: '#0a0f1c', via: '#101729', to: '#1a2440', accent: '#a3a3a3' },
  park:         { from: '#0a1f14', via: '#143421', to: '#1f4d31', accent: '#86efac' },
  intersection: { from: '#0a1226', via: '#142042', to: '#1d2e5c', accent: '#fb923c' },
  tunnel:       { from: '#050608', via: '#0c0e12', to: '#15181f', accent: '#f59e0b' },
  storefront:   { from: '#170c1d', via: '#2a1638', to: '#3d2150', accent: '#f472b6' },
}

export function CameraScene({ scene, seed = 0 }: { scene: SceneId; seed?: number }) {
  const p = PALETTES[scene]
  // deterministic per-camera variation
  const driftDur = 18 + (seed % 7)
  const carDelay = (seed % 5) * -1.7

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* sky / ambient gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${p.from} 0%, ${p.via} 55%, ${p.to} 100%)`,
        }}
      />

      {/* scene-specific layers */}
      {scene === 'avenue' && <AvenueLayers accent={p.accent} carDelay={carDelay} driftDur={driftDur} />}
      {scene === 'plaza' && <PlazaLayers accent={p.accent} />}
      {scene === 'market' && <MarketLayers accent={p.accent} />}
      {scene === 'parking' && <ParkingLayers accent={p.accent} />}
      {scene === 'park' && <ParkLayers accent={p.accent} />}
      {scene === 'intersection' && <IntersectionLayers accent={p.accent} carDelay={carDelay} />}
      {scene === 'tunnel' && <TunnelLayers accent={p.accent} />}
      {scene === 'storefront' && <StorefrontLayers accent={p.accent} />}

      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* noise grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] cam-noise" />
    </div>
  )
}

/* ---------- scene primitives ---------- */

function AvenueLayers({ accent, carDelay, driftDur }: { accent: string; carDelay: number; driftDur: number }) {
  return (
    <>
      {/* horizon glow */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '48%',
          height: '6%',
          background: `linear-gradient(180deg, transparent, ${accent}33 50%, transparent)`,
          filter: 'blur(8px)',
        }}
      />
      {/* far buildings */}
      <div className="absolute left-0 right-0" style={{ top: '38%', height: '14%' }}>
        <div className="flex h-full items-end gap-[2px] px-2 opacity-70">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-black/40"
              style={{ height: `${30 + ((i * 53) % 70)}%` }}
            />
          ))}
        </div>
      </div>
      {/* road */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: '52%',
          background: 'linear-gradient(180deg, #1a1f2e 0%, #0a0d14 100%)',
        }}
      />
      {/* lane dashes */}
      <div className="absolute left-0 right-0 bottom-[12%] flex items-center justify-center gap-6 opacity-70">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-1.5 w-10 rounded-full bg-yellow-200/80" />
        ))}
      </div>
      {/* headlight car */}
      <div
        className="absolute bottom-[18%] h-3 w-3 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, ${accent}66 40%, transparent 70%)`,
          boxShadow: `0 0 18px 6px ${accent}aa`,
          animation: `cam-drift ${driftDur}s linear infinite`,
          animationDelay: `${carDelay}s`,
        }}
      />
      {/* street lamps */}
      {[15, 35, 55, 75].map((x, i) => (
        <div key={i} className="absolute" style={{ left: `${x}%`, top: '40%' }}>
          <div className="h-10 w-px bg-white/20" />
          <div
            className="absolute -top-1 -left-1 h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px 4px ${accent}99` }}
          />
        </div>
      ))}
    </>
  )
}

function PlazaLayers({ accent }: { accent: string }) {
  return (
    <>
      {/* fountain glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: '55%',
          width: '28%',
          height: '8%',
          background: `radial-gradient(ellipse, ${accent}66, transparent 70%)`,
          filter: 'blur(6px)',
        }}
      />
      {/* tiles pattern */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          top: '55%',
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px)',
        }}
      />
      {/* lamp posts */}
      {[20, 50, 80].map((x, i) => (
        <div key={i} className="absolute" style={{ left: `${x}%`, top: '42%' }}>
          <div className="h-12 w-px bg-white/25" />
          <div
            className="absolute -top-2 -left-2 h-3 w-3 rounded-full"
            style={{ background: accent, boxShadow: `0 0 16px 6px ${accent}aa` }}
          />
        </div>
      ))}
      {/* people silhouettes */}
      {[30, 60, 72].map((x, i) => (
        <div
          key={i}
          className="absolute bottom-[12%] h-8 w-2.5 rounded-t-full bg-black/55"
          style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
        />
      ))}
    </>
  )
}

function MarketLayers({ accent }: { accent: string }) {
  return (
    <>
      {/* canopies */}
      <div className="absolute left-0 right-0 top-[40%] flex h-[18%] gap-2 px-3">
        {['#dc2626', '#16a34a', '#2563eb', '#f59e0b', '#a855f7'].map((c, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md opacity-80"
            style={{ background: c, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
          />
        ))}
      </div>
      {/* string lights */}
      <div className="absolute left-0 right-0 top-[36%] flex justify-around">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px 2px ${accent}cc` }}
          />
        ))}
      </div>
      {/* floor */}
      <div className="absolute left-0 right-0 bottom-0 top-[58%] bg-black/40" />
      {/* people silhouettes */}
      {[18, 33, 48, 62, 78].map((x, i) => (
        <div
          key={i}
          className="absolute bottom-[8%] h-9 w-3 rounded-t-full bg-black/65"
          style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
        />
      ))}
    </>
  )
}

function ParkingLayers({ accent }: { accent: string }) {
  return (
    <>
      {/* asphalt */}
      <div className="absolute inset-x-0 bottom-0 top-[35%] bg-gradient-to-b from-[#1a1f2e] to-[#05070b]" />
      {/* parking lines */}
      <div className="absolute inset-x-0 top-[42%] bottom-[8%] flex items-end justify-around opacity-50">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[80%] w-px bg-white/70" style={{ transform: `skewX(${i < 4 ? -8 : 8}deg)` }} />
        ))}
      </div>
      {/* parked cars (simple rects) */}
      <div className="absolute inset-x-4 top-[55%] grid grid-cols-4 gap-3 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-6 rounded-sm bg-gradient-to-b from-white/15 to-white/5 ring-1 ring-white/10"
          />
        ))}
      </div>
      {/* overhead lamp */}
      <div
        className="absolute h-4 w-4 rounded-full"
        style={{
          left: '50%',
          top: '12%',
          transform: 'translateX(-50%)',
          background: accent,
          boxShadow: `0 0 40px 18px ${accent}88`,
        }}
      />
    </>
  )
}

function ParkLayers({ accent }: { accent: string }) {
  return (
    <>
      {/* trees */}
      {[10, 22, 40, 60, 78, 90].map((x, i) => (
        <div key={i} className="absolute" style={{ left: `${x}%`, bottom: '8%' }}>
          <div
            className="h-12 w-12 -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, #0f3a22 0%, #061a0f 80%)' }}
          />
          <div className="mx-auto h-3 w-1 -translate-y-1 bg-[#3a2410]" />
        </div>
      ))}
      {/* path */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0"
        style={{
          width: '38%',
          height: '40%',
          background: 'linear-gradient(180deg, #2a3220 0%, #0d1208 100%)',
          clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)',
        }}
      />
      {/* lamp */}
      <div className="absolute" style={{ left: '50%', top: '40%' }}>
        <div className="h-8 w-px bg-white/30" />
        <div
          className="absolute -top-1 -left-1 h-2 w-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 14px 4px ${accent}cc` }}
        />
      </div>
    </>
  )
}

function IntersectionLayers({ accent, carDelay }: { accent: string; carDelay: number }) {
  return (
    <>
      {/* asphalt */}
      <div className="absolute inset-x-0 bottom-0 top-[35%] bg-[#0a0d14]" />
      {/* horizontal road */}
      <div className="absolute inset-x-0 top-[58%] h-[22%] bg-[#10141f]" />
      {/* lane lines horizontal */}
      <div className="absolute inset-x-0 top-[68%] flex justify-between gap-3 px-4 opacity-70">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-1 w-8 rounded-full bg-yellow-300/80" />
        ))}
      </div>
      {/* vertical road */}
      <div className="absolute top-[35%] bottom-0 left-1/2 -translate-x-1/2 w-[18%] bg-[#10141f]" />
      {/* traffic light */}
      <div className="absolute" style={{ left: '14%', top: '38%' }}>
        <div className="h-10 w-px bg-white/30" />
        <div
          className="absolute -top-2 -left-1.5 h-3 w-3 rounded-full"
          style={{ background: '#ef4444', boxShadow: '0 0 12px 4px #ef444499' }}
        />
      </div>
      {/* moving headlight */}
      <div
        className="absolute h-3 w-3 rounded-full"
        style={{
          top: '70%',
          background: `radial-gradient(circle, ${accent} 0%, ${accent}55 50%, transparent 70%)`,
          boxShadow: `0 0 20px 6px ${accent}99`,
          animation: 'cam-drift 14s linear infinite',
          animationDelay: `${carDelay}s`,
        }}
      />
    </>
  )
}

function TunnelLayers({ accent }: { accent: string }) {
  return (
    <>
      {/* tunnel arch */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '20%',
          width: '70%',
          height: '70%',
          borderTopLeftRadius: '50%',
          borderTopRightRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 100%, #2a2010 0%, #050505 70%)',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)',
        }}
      />
      {/* ceiling lights */}
      {[25, 40, 55, 70].map((x, i) => (
        <div
          key={i}
          className="absolute h-2 w-8 rounded-full"
          style={{
            left: `${x}%`,
            top: '28%',
            background: accent,
            boxShadow: `0 0 14px 4px ${accent}cc`,
            opacity: 0.85 - i * 0.18,
          }}
        />
      ))}
      {/* road */}
      <div className="absolute inset-x-0 bottom-0 top-[70%] bg-gradient-to-b from-[#0d0d10] to-black" />
    </>
  )
}

function StorefrontLayers({ accent }: { accent: string }) {
  return (
    <>
      {/* storefront window */}
      <div
        className="absolute"
        style={{
          left: '12%',
          right: '12%',
          top: '32%',
          bottom: '28%',
          background: `linear-gradient(180deg, ${accent}33 0%, ${accent}11 100%)`,
          boxShadow: `inset 0 0 30px ${accent}44`,
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      />
      {/* mannequins */}
      {[28, 50, 72].map((x, i) => (
        <div key={i} className="absolute bottom-[30%] h-12 w-3 bg-black/60" style={{ left: `${x}%` }} />
      ))}
      {/* sidewalk */}
      <div className="absolute inset-x-0 bottom-0 top-[72%] bg-[#0a0d14]" />
      {/* sign */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '24%',
          transform: 'translateX(-50%)',
          color: accent,
          textShadow: `0 0 8px ${accent}`,
          fontFamily: 'monospace',
          fontSize: 10,
          letterSpacing: 2,
          opacity: 0.85,
        }}
      >
        ◆ OPEN ◆
      </div>
    </>
  )
}

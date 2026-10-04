#!/usr/bin/env python3
"""Analyse the WAV renders produced by audio-render.mjs.

Checks: no NaN, no clipping (peak < 0.99), no silence where sound is expected, RMS balance between
buses, engine spectral centroid rising with rpm, firing-frequency tracking, siren doppler, horn
ducking, interior low-pass. Writes spectrogram PNGs to screenshots/dev/audio-*.png.
Usage: python3 apps/client/dev/audio-analyze.py
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy.io import wavfile
from scipy.signal import stft

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
RAW = os.path.join(ROOT, 'screenshots/tmp/audio')   # float32 renders (git-ignored)
OUT = os.path.join(ROOT, 'screenshots/dev')         # spectrogram PNGs
meta = json.load(open(os.path.join(RAW, 'audio-render-meta.json')))
results = []
failures = []


def check(name, ok, detail):
    results.append((name, ok, detail))
    if not ok:
        failures.append(name)


def load(name):
    p = os.path.join(RAW, f'audio-{name}.wav')
    if not os.path.exists(p):
        return None, None
    sr, d = wavfile.read(p)
    return sr, d.astype(np.float64)


def db(x):
    return 20 * np.log10(np.maximum(x, 1e-12))


def rms(x):
    return float(np.sqrt(np.mean(x * x))) if len(x) else 0.0


# --------------------------------------------------------------------------------------------------
MAGMA = np.array([[0, 0, 4], [28, 16, 68], [79, 18, 123], [129, 37, 129], [181, 54, 122],
                  [229, 80, 100], [251, 135, 97], [254, 194, 135], [252, 253, 191]], dtype=np.float64)


def colormap(v):
    v = np.clip(v, 0, 1) * (len(MAGMA) - 1)
    i = np.floor(v).astype(int)
    i2 = np.minimum(i + 1, len(MAGMA) - 1)
    f = (v - i)[..., None]
    return (MAGMA[i] * (1 - f) + MAGMA[i2] * f).astype(np.uint8)


def spectrogram_png(name, x, sr, fmax=16000, fmin=30, log=True, nper=4096, title='', overlay=None):
    f, t, Z = stft(x, fs=sr, nperseg=nper, noverlap=nper - nper // 8, window='hann')
    S = db(np.abs(Z) * 2)  # scipy 'spectrum' scaling: |Z| = A/2 for a sine of amplitude A
    W, H = 1400, 560
    # map rows
    if log:
        fr = fmin * (fmax / fmin) ** (np.arange(H)[::-1] / (H - 1))
    else:
        fr = fmax * np.arange(H)[::-1] / (H - 1)
    rows = np.clip(np.searchsorted(f, fr), 0, len(f) - 1)
    cols = np.clip((np.arange(W) / (W - 1) * (len(t) - 1)).astype(int), 0, len(t) - 1)
    img = S[rows][:, cols]
    img = (img + 110) / 100
    rgb = colormap(img)
    im = Image.fromarray(rgb, 'RGB')
    pad = 46
    canvas = Image.new('RGB', (W + pad + 10, H + 40), (12, 12, 16))
    canvas.paste(im, (pad, 22))
    d = ImageDraw.Draw(canvas)
    d.text((pad, 4), f'{title or name}   ({"log" if log else "linear"} {fmin if log else 0}-{fmax} Hz, -110..-10 dBFS)', fill=(230, 230, 230))
    ticks = [50, 100, 200, 500, 1000, 2000, 5000, 10000] if log else list(range(0, int(fmax) + 1, 500 if fmax <= 4000 else 2000))
    for ft in ticks:
        if ft < (fmin if log else 0) or ft > fmax:
            continue
        y = (H - 1) * (1 - (np.log(ft / fmin) / np.log(fmax / fmin))) if log else (H - 1) * (1 - ft / fmax)
        d.line([(pad - 5, 22 + y), (pad, 22 + y)], fill=(200, 200, 200))
        d.text((2, 22 + y - 6), f'{ft}' if ft < 1000 else f'{ft / 1000:g}k', fill=(200, 200, 200))
    dur = len(x) / sr
    for s in range(int(dur) + 1):
        xx = pad + s / dur * (W - 1)
        d.line([(xx, 22 + H), (xx, 26 + H)], fill=(200, 200, 200))
        d.text((xx - 3, 27 + H), f'{s}', fill=(200, 200, 200))
    if overlay is not None:
        ot, of = overlay
        pts = []
        for a, b in zip(ot, of):
            if (log and (b < fmin or b > fmax)) or (not log and b > fmax):
                continue
            xx = pad + a / dur * (W - 1)
            y = (H - 1) * (1 - (np.log(b / fmin) / np.log(fmax / fmin))) if log else (H - 1) * (1 - b / fmax)
            pts.append((xx, 22 + y))
        if len(pts) > 1:
            d.line(pts, fill=(80, 220, 255), width=1)
    # palette PNG: a fraction of the size of an RGB spectrogram
    canvas.quantize(colors=128, method=Image.Quantize.MEDIANCUT).save(os.path.join(OUT, f'audio-{name}.png'), optimize=True)


# --------------------------------------------------------------------------------------------------
levels = {}
for name, m in meta['scenarios'].items():
    sr, d = load(name)
    if d is None:
        continue
    mono = d.mean(axis=1)
    nan = int(np.isnan(d).sum())
    peak = float(np.nanmax(np.abs(d)))
    check(f'{name}: no NaN', nan == 0, f'{nan} NaN samples')
    check(f'{name}: no clipping', peak < 0.99, f'peak {peak:.3f}')
    # silence: every 0.5 s window after the first 0.3 s must carry signal (> -65 dBFS)
    win = sr // 2
    w = [rms(mono[i:i + win]) for i in range(int(0.3 * sr), len(mono) - win, win)]
    quiet = sum(1 for v in w if db(v) < -65)
    check(f'{name}: no unexpected silence', quiet == 0, f'{quiet} silent 0.5 s windows, min {db(min(w)):.1f} dBFS')
    levels[name] = {'rms_db': db(rms(mono)), 'peak': peak}

# ---- engine sweep: centroid vs rpm, firing-frequency tracking -------------------------------------
for name in ['engine_sweep', 'engine_interior', 'engine_fallback']:
    sr, d = load(name)
    if d is None:
        continue
    mono = d.mean(axis=1)
    log = meta['scenarios'][name]['log']
    lt, lr = np.array(log['t']), np.array(log['rpm'])
    nper = 8192
    f, t, Z = stft(mono, fs=sr, nperseg=nper, noverlap=nper * 3 // 4)
    A = np.abs(Z)
    rpm_t = np.interp(t, lt, lr)
    fire = rpm_t / 60 * 2
    sel = (t > 2.4) & (t < 7.8)
    cent = (A * f[:, None]).sum(0) / (A.sum(0) + 1e-12)
    corr = float(np.corrcoef(rpm_t[sel], cent[sel])[0, 1])
    check(f'{name}: spectral centroid rises with rpm', corr > 0.8, f'Pearson r={corr:.3f}; centroid {cent[sel][0]:.0f} Hz @ {rpm_t[sel][0]:.0f} rpm -> {cent[sel][-1]:.0f} Hz @ {rpm_t[sel][-1]:.0f} rpm')
    # tracking: strongest peak within +-20% of the expected firing frequency, and its prominence
    errs, prom = [], []
    for k in np.where(sel | ((t > 9.3) & (t < 11.8)))[0]:
        fe = fire[k]
        band = (f > fe * 0.8) & (f < fe * 1.2)
        if band.sum() < 3:
            continue
        i = np.argmax(A[band, k])
        fp = f[band][i]
        errs.append(abs(fp - fe) / fe)
        ring = ((f > fe * 0.55) & (f < fe * 0.7)) | ((f > fe * 1.3) & (f < fe * 1.45))
        prom.append(db(A[band, k][i]) - db(np.median(A[ring, k])))
    errs, prom = np.array(errs), np.array(prom)
    check(f'{name}: fundamental tracks rpm', np.median(errs) < 0.03 and np.median(prom) > 6,
          f'median |f_peak - rpm/30|/f = {100 * np.median(errs):.2f}% (90th pct {100 * np.percentile(errs, 90):.1f}%), peak prominence {np.median(prom):.1f} dB')
    levels[name]['centroid_wot'] = float(np.mean(cent[sel]))
    spectrogram_png(name, mono, sr, fmax=2500, log=False, nper=8192, title=f'{name} (cyan = expected firing freq rpm/30)', overlay=(lt, lr / 30))
    spectrogram_png(name + '-log', mono, sr, title=f'{name} full band')

if 'engine_sweep' in levels and 'engine_interior' in levels:
    a, b = levels['engine_sweep']['centroid_wot'], levels['engine_interior']['centroid_wot']
    check('interior: engine is low-passed (centroid lower than exterior)', b < a * 0.8, f'exterior {a:.0f} Hz vs interior {b:.0f} Hz')

# ---- siren doppler ----------------------------------------------------------------------------------
sr, d = load('siren_passby')
if d is not None:
    mono = d.mean(axis=1)
    f, t, Z = stft(mono, fs=sr, nperseg=8192, noverlap=8192 * 3 // 4)
    A = np.abs(Z)
    band = (f > 520) & (f < 700)
    hi = f[band][np.argmax(A[band], axis=0)]
    strength = A[band].max(axis=0)
    def tone(mask):  # frames where the high tone is sounding (strongest half of the frames)
        s_ = strength[mask]
        return float(np.median(hi[mask][s_ >= np.median(s_)]))
    before = tone((t > 1) & (t < 3.5))
    after = tone((t > 6.5) & (t < 9))
    exp_b, exp_a = 580 * 343 / (343 - 25 * 0.97), 580 * 343 / (343 + 25 * 0.97)
    check('siren: doppler shift on pass-by', before > after * 1.1,
          f'high tone {before:.0f} Hz approaching (expect ~{exp_b:.0f}) vs {after:.0f} Hz receding (expect ~{exp_a:.0f})')
    spectrogram_png('siren_passby', mono, sr, fmax=3000, log=False, nper=4096, title='siren pass-by at 25 m/s (doppler)')

# ---- horn ducks radio + ambience (measured below the horn's band) --------------------------------
sr, d = load('horn')
if d is not None:
    mono = d.mean(axis=1)
    f, t, Z = stft(mono, fs=sr, nperseg=4096, noverlap=3072)
    low = np.sqrt((np.abs(Z[(f > 30) & (f < 160)]) ** 2).sum(0))
    pre = np.mean(low[(t > 0.3) & (t < 0.95)])
    dur = np.mean(low[(t > 3.2) & (t < 3.85)])
    check('horn: ducks radio/ambience', db(dur) - db(pre) < -2.5, f'low band {db(dur) - db(pre):+.1f} dB during horn')
    spectrogram_png('horn', mono, sr, title='horn with radio + ambience (ducking)')

# ---- radio exterior is muffled vs cockpit ---------------------------------------------------------
sr, d1 = load('radio_electro')
_, d2 = load('radio_exterior')
if d1 is not None and d2 is not None:
    def hf_ratio(x):
        f, t, Z = stft(x.mean(axis=1), fs=sr, nperseg=4096)
        P = (np.abs(Z) ** 2).sum(1)
        return db(np.sqrt(P[f > 3000].sum() / P.sum()))
    a, b = hf_ratio(d1), hf_ratio(d2)
    check('radio: exterior camera is low-passed', b < a - 10, f'>3 kHz energy share: cockpit {a:.1f} dB, exterior {b:.1f} dB')

# ---- other spectrograms ---------------------------------------------------------------------------
for name, kw in [('tyres', {}), ('radio_seine', {}), ('radio_electro', {}), ('radio_musette', {}), ('radio_jingle', {}),
                 ('ambience_day', {}), ('ambience_evening', {}), ('ambience_rain_night', {}), ('traffic_passby', {}),
                 ('collisions', {}), ('ui', {}), ('full_mix', {}), ('tunnel', {}), ('engine_drive', {'fmax': 2500, 'log': False, 'nper': 8192})]:
    sr, d = load(name)
    if d is not None:
        spectrogram_png(name, d.mean(axis=1), sr, **kw)

# ---- bus balance ----------------------------------------------------------------------------------
groups = {
    'engine (WOT sweep, chase cam)': ['engine_sweep'],
    'engine (cockpit)': ['engine_interior'],
    'radio (cockpit)': ['radio_seine', 'radio_electro', 'radio_musette'],
    'ambience (exterior)': ['ambience_day', 'ambience_evening', 'ambience_rain_night'],
    'traffic / sfx': ['traffic_passby', 'siren_passby'],
    'collisions (peaks)': ['collisions'],
    'ui (cockpit + rain bed)': ['ui'],
}
print('\nRMS levels (dBFS):')
for g, names in groups.items():
    vals = [levels[n]['rms_db'] for n in names if n in levels]
    pk = [levels[n]['peak'] for n in names if n in levels]
    if vals:
        print(f'  {g:34s} {np.mean(vals):6.1f} dB   (peak {max(pk):.2f})   ' + ', '.join(f'{n}={levels[n]["rms_db"]:.1f}' for n in names if n in levels))
main = [np.mean([levels[n]['rms_db'] for n in groups[k] if n in levels]) for k in ['engine (WOT sweep, chase cam)', 'radio (cockpit)', 'engine (cockpit)']]
spread = max(main) - min(main)
check('bus balance: engine vs radio within 8 dB', spread < 8, f'spread {spread:.1f} dB between engine (ext/int) and radio')
amb = np.mean([levels[n]['rms_db'] for n in groups['ambience (exterior)'] if n in levels])
check('bus balance: ambience sits under engine/radio', amb < min(main) and amb > min(main) - 20, f'ambience {amb:.1f} dB vs foreground {min(main):.1f} dB')

print('\nChecks:')
for name, ok, detail in results:
    print(f'  [{"PASS" if ok else "FAIL"}] {name}: {detail}')
print(f'\n{len(results) - len(failures)}/{len(results)} checks passed')
print('realtime:', meta.get('realtime'))
sys.exit(1 if failures else 0)

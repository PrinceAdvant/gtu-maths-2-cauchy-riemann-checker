// Shared helpers for GTU Hero study calculators (2026-11-11). Pure functions, tested in test.js.
const F = {
  matrix: {
    // Gauss-Jordan inverse: returns {inv, steps} or throws if singular
    inverse(A) {
      const n = A.length;
      if (!A.every((r) => r.length === n)) throw Error('matrix must be square');
      const M = A.map((r, i) => [...r.map(Number), ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
      const steps = [];
      for (let c = 0; c < n; c++) {
        let p = c;
        for (let i = c + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[p][c])) p = i;
        if (Math.abs(M[p][c]) < 1e-12) throw Error('matrix is singular (det = 0), no inverse');
        if (p !== c) { [M[p], M[c]] = [M[c], M[p]]; steps.push(`R${c + 1} <-> R${p + 1}`); }
        const pv = M[c][c];
        if (pv !== 1) { M[c] = M[c].map((x) => x / pv); steps.push(`R${c + 1} -> R${c + 1} / ${+pv.toFixed(4)}`); }
        for (let i = 0; i < n; i++) {
          if (i !== c && M[i][c] !== 0) {
            const f = M[i][c];
            M[i] = M[i].map((x, j) => x - f * M[c][j]);
            steps.push(`R${i + 1} -> R${i + 1} - (${+f.toFixed(4)}) R${c + 1}`);
          }
        }
      }
      return { inv: M.map((r) => r.slice(n).map((x) => (Math.abs(x) < 1e-12 ? 0 : x))), steps };
    },
    mul(A, B) { return A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0))); },
    parse(s) { return s.split(';').map((r) => r.trim().split(/[ ,]+/).map(Number)); },
  },
  vcr: {
    // vapour compression refrigeration from enthalpies (kJ/kg); h4 = h3 (throttling)
    re: (h1, h3) => h1 - h3,
    work: (h1, h2) => h2 - h1,
    cop: (h1, h2, h3) => (h1 - h3) / (h2 - h1),
    carnotCop: (TL, TH) => TL / (TH - TL), // kelvin
    TR_KW: 3.517,
    massFlow: (tr, h1, h3) => (tr * 3.517) / (h1 - h3), // kg/s
    power: (tr, h1, h2, h3) => ((tr * 3.517) / (h1 - h3)) * (h2 - h1), // kW
  },
  fourProbe: {
    // equal probe spacing s; bulk (thickness >> s): rho = 2 pi s V / I
    bulk: (V, I, s) => (2 * Math.PI * s * V) / I,
    // thin sheet (thickness w << s): Rs = (pi / ln 2) V / I, rho = Rs * w
    sheetR: (V, I) => (Math.PI / Math.LN2) * (V / I),
    thin: (V, I, w) => (Math.PI / Math.LN2) * (V / I) * w,
  },
  cr: {
    // Cauchy-Riemann check for f = u + i v at a point, by central differences
    at(u, v, x, y, h = 1e-5) {
      const ux = (u(x + h, y) - u(x - h, y)) / (2 * h), uy = (u(x, y + h) - u(x, y - h)) / (2 * h);
      const vx = (v(x + h, y) - v(x - h, y)) / (2 * h), vy = (v(x, y + h) - v(x, y - h)) / (2 * h);
      return { ux, uy, vx, vy, eq1: ux - vy, eq2: uy + vx };
    },
    // checks C-R on a grid of points; returns true if both equations hold everywhere
    analytic(u, v, tol = 1e-5) {
      for (let x = -1.5; x <= 1.5; x += 0.5) for (let y = -1.5; y <= 1.5; y += 0.5) {
        const r = F.cr.at(u, v, x, y);
        if (Math.abs(r.eq1) > tol || Math.abs(r.eq2) > tol) return false;
      }
      return true;
    },
    // Laplacian of u at a point (0 for the real part of an analytic function)
    laplacian(u, x, y, h = 1e-3) {
      return (u(x + h, y) + u(x - h, y) + u(x, y + h) + u(x, y - h) - 4 * u(x, y)) / (h * h);
    },
  },
};
if (typeof module !== 'undefined') module.exports = F;

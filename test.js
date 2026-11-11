const F = require('./calc.js');
const a = (x, y, tol = 1e-6) => { if (Math.abs(x - y) > tol * Math.max(1, Math.abs(y))) throw Error(x + ' vs ' + y); };

// Gauss-Jordan inverse (own practice matrices)
const A = [[2, 1, 1], [1, 3, 2], [1, 0, 0]];
const { inv } = F.matrix.inverse(A);
F.matrix.mul(A, inv).forEach((r, i) => r.forEach((v, j) => a(v, i === j ? 1 : 0)));
// det = -1, so the inverse has integer entries: [[0,0,1],[-2,1,3],[3,-1,-5]]
[[0, 0, 1], [-2, 1, 3], [3, -1, -5]].forEach((r, i) => r.forEach((v, j) => a(inv[i][j], v)));
a(F.matrix.inverse([[4, 7], [2, 6]]).inv[0][0], 0.6);
let threw = false; try { F.matrix.inverse([[1, 2], [2, 4]]); } catch (e) { threw = true; }
if (!threw) throw Error('singular matrix must throw');

// VCR: h1 = 395, h2 = 425, h3 = 250 (own practice numbers)
a(F.vcr.re(395, 250), 145);
a(F.vcr.work(395, 425), 30);
a(F.vcr.cop(395, 425, 250), 145 / 30);
a(F.vcr.massFlow(5, 395, 250), 17.585 / 145);
a(F.vcr.power(5, 395, 425, 250), 17.585 / 145 * 30);
a(F.vcr.carnotCop(263, 303), 263 / 40);
if (!(F.vcr.cop(395, 425, 250) < F.vcr.carnotCop(263, 313))) throw Error('real COP should be below Carnot here');

// Four probe
a(F.fourProbe.bulk(0.01, 0.001, 0.002), 2 * Math.PI * 0.002 * 10);
a(F.fourProbe.sheetR(1, 1), 4.53236, 1e-5);
a(F.fourProbe.thin(0.01, 0.001, 1e-6), 4.53236 * 10 * 1e-6, 1e-5);

// Cauchy-Riemann
if (!F.cr.analytic((x, y) => x * x - y * y, (x, y) => 2 * x * y)) throw Error('z^2 is analytic');
if (!F.cr.analytic((x, y) => Math.exp(x) * Math.cos(y), (x, y) => Math.exp(x) * Math.sin(y))) throw Error('e^z is analytic');
if (F.cr.analytic((x, y) => x * x + y * y, (x, y) => 2 * x * y)) throw Error('x^2+y^2 + i 2xy is not analytic');
if (F.cr.analytic((x, y) => x, (x, y) => -y)) throw Error('conj(z) is not analytic');
a(F.cr.laplacian((x, y) => x * x - y * y, 0.7, 0.3), 0, 1e-4);
a(F.cr.laplacian((x, y) => x * x + y * y, 0.7, 0.3), 4, 1e-4);

console.log('All checks passed');

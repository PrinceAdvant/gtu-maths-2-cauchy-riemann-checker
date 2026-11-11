# GTU Maths 2 Cauchy-Riemann analytic function checker

For GTU BE Mathematics 2 (BE02000011), where complex analysis includes analytic functions and the Cauchy-Riemann equations, as summarised in GTU Hero's Maths 2 guide. u(x, y) aur v(x, y) daalo, ye page check karta hai ki u_x = v_y aur u_y = −v_x poore grid pe hold karte hai ya nahi, and whether u is harmonic.

Live page: https://princeadvant.github.io/gtu-maths-2-cauchy-riemann-checker/

## Formulas

- f(z) = u(x, y) + i v(x, y)
- Cauchy-Riemann: ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x
- If the partial derivatives are continuous and C-R holds, f is analytic
- Real and imaginary parts of an analytic function are harmonic: u_xx + u_yy = 0

## Test

`node test.js` checks the formulas against hand-worked values and prints `All checks passed`.

## Tips

- Default is f(z) = z² (u = x² − y², v = 2xy), which is analytic. Try u = x*x + y*y with the same v to see it fail.
- Use Math names: exp(x)*cos(y), sin(x), log(x). Example: e^z has u = exp(x)*cos(y), v = exp(x)*sin(y).
- A numerical check is a hint, not a proof. In the exam, write the four partial derivatives and show both equations.

Old papers and repeat counts: [https://gtuhero.com/blogs/gtu-maths-2-papers-pyqs-repeated-sums](https://gtuhero.com/blogs/gtu-maths-2-papers-pyqs-repeated-sums) (GTU Hero is my project).

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const rods = [10000, 1000, 100, 10, 1];

export function AbacusSimulator() {
  const [digits, setDigits] = useState([0, 0, 0, 0, 0]);
  const value = useMemo(() => digits.reduce((sum, digit, index) => sum + digit * rods[index], 0), [digits]);

  function toggleDigit(rodIndex: number, digit: number) {
    setDigits((current) => current.map((item, index) => (index === rodIndex ? digit : item)));
  }

  return (
    <section className="abacus-simulator">
      <div className="sim-header">
        <div>
          <span>Animated abacus</span>
          <strong>{value.toLocaleString()}</strong>
        </div>
        <button className="icon-button" onClick={() => setDigits([0, 0, 0, 0, 0])} aria-label="Reset abacus"><RotateCcw size={18} /></button>
      </div>
      <div className="abacus-frame">
        {digits.map((digit, rodIndex) => (
          <div className="rod" key={rods[rodIndex]}>
            <button
              className={`heaven bead ${digit >= 5 ? "active" : ""}`}
              onClick={() => toggleDigit(rodIndex, digit >= 5 ? digit - 5 : digit + 5)}
              aria-label={`Toggle five bead on ${rods[rodIndex]} rod`}
            />
            <div className="beam" />
            {[1, 2, 3, 4].map((bead) => (
              <button
                key={bead}
                className={`earth bead ${digit % 5 >= bead ? "active" : ""}`}
                onClick={() => {
                  const five = digit >= 5 ? 5 : 0;
                  toggleDigit(rodIndex, five + (digit % 5 >= bead ? bead - 1 : bead));
                }}
                aria-label={`Set ${bead} lower beads on ${rods[rodIndex]} rod`}
              />
            ))}
            <span>{rods[rodIndex]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

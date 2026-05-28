import { Lightbulb } from "lucide-react";
import { useState } from "react";

export function MethodTip({ tip }: { tip?: string }) {
  const [open, setOpen] = useState(false);
  if (!tip) return null;
  return (
    <section className="method-tip">
      <button onClick={() => setOpen((value) => !value)}><Lightbulb size={18} /> Method Tip</button>
      {open && <p>{tip}</p>}
    </section>
  );
}

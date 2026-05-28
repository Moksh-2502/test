import { Send } from "lucide-react";
import { forwardRef } from "react";

export const AnswerInput = forwardRef<HTMLInputElement, {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}>(({ value, disabled, onChange, onSubmit }, ref) => (
  <div className="answer-row">
    <input
      ref={ref}
      inputMode="numeric"
      placeholder="Type answer"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSubmit();
      }}
    />
    <button className="primary-button" disabled={disabled} onClick={onSubmit}><Send size={18} /> Submit</button>
  </div>
));

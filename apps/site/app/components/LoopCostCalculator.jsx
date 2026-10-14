'use client';
import { useId, useState } from 'react';

const DEFAULTS = { base: 100, origin: 0.3, destination: 0.2, distance: 120, sameCity: false };
const DISTANCE_RATE = 0.02;

const format = (value) =>
  value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LoopCostCalculator() {
  const id = useId();
  const [state, setState] = useState(DEFAULTS);
  const { base, origin, destination, distance, sameCity } = state;

  const exportPenalty = sameCity ? 0 : base * origin;
  const importPenalty = sameCity ? 0 : base * destination;
  const distanceCost = sameCity ? 0 : distance * DISTANCE_RATE;
  const total = base + exportPenalty + importPenalty + distanceCost;

  const rows = [
    { op: '', name: 'Base price', expr: 'the offered price, in LoopCoin', value: base },
    { op: '+', name: 'Export penalty', expr: 'BasePrice x OriginLoopSignal', value: exportPenalty },
    { op: '+', name: 'Import penalty', expr: 'BasePrice x DestinationLoopSignal', value: importPenalty },
    { op: '+', name: 'Distance cost', expr: 'Distance_km x 0.02 LC', value: distanceCost },
  ];

  const controls = [
    { key: 'base', label: 'Base price', min: 0, max: 500, step: 5, display: `${base} LC` },
    { key: 'origin', label: 'Origin LoopSignal', min: 0, max: 1, step: 0.05, display: origin.toFixed(2) },
    { key: 'destination', label: 'Destination LoopSignal', min: 0, max: 1, step: 0.05, display: destination.toFixed(2) },
    { key: 'distance', label: 'Distance', min: 0, max: 1000, step: 10, display: `${distance} km` },
  ];

  const set = (key) => (event) => setState((prev) => ({ ...prev, [key]: Number(event.target.value) }));

  return (
    <div className="wil-calc">
      <div className="wil-calc-controls">
        {controls.map((control) => (
          <div className="wil-calc-field" key={control.key}>
            <label htmlFor={`${id}-${control.key}`}>
              {control.label}
              <span className="wil-calc-value">{control.display}</span>
            </label>
            <input
              disabled={sameCity && control.key !== 'base'}
              id={`${id}-${control.key}`}
              max={control.max}
              min={control.min}
              onChange={set(control.key)}
              step={control.step}
              type="range"
              value={state[control.key]}
            />
          </div>
        ))}
        <div className="wil-calc-toggle">
          <input
            checked={sameCity}
            id={`${id}-same`}
            onChange={(event) => setState((prev) => ({ ...prev, sameCity: event.target.checked }))}
            type="checkbox"
          />
          <label htmlFor={`${id}-same`}>
            Same-city transfer
            <span>Penalties and distance do not apply inside one node</span>
          </label>
        </div>
      </div>

      <div className="wil-formula">
        <p className="wil-formula-head">
          <strong>LoopCost</strong>
          <span>Total routing cost for one transfer</span>
        </p>
        {rows.map((row) => (
          <p className="wil-formula-row" key={row.name}>
            <span aria-hidden="true" className="wil-formula-op">{row.op}</span>
            <span className="wil-formula-name">{row.name}</span>
            <span className="wil-formula-expr">{row.expr}</span>
            <span className="wil-formula-amount">{format(row.value)}</span>
          </p>
        ))}
        <p className="wil-formula-total">
          <span>Total</span>
          <output aria-live="polite" htmlFor={`${id}-base`}>
            {format(total)} LC
          </output>
        </p>
      </div>

      <div className="wil-calc-foot">
        <button
          className="button secondary"
          onClick={() => setState(DEFAULTS)}
          type="button"
        >
          Reset
        </button>
        <p className="text-soft">
          The figures update in your browser from the published formula. Nothing is priced,
          settled, or sent anywhere.
        </p>
      </div>
    </div>
  );
}

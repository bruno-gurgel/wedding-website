interface Swatch {
  name: string
  hex: string
}

interface ColorSwatchProps {
  swatches: readonly Swatch[]
}

export function ColorSwatch({ swatches }: ColorSwatchProps) {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {swatches.map(({ name, hex }) => (
        <div key={hex} className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full shadow-sm"
            style={{ backgroundColor: hex }}
            aria-label={name}
          />
          <span className="font-sans text-xs text-[--color-charcoal]/60 tracking-wider">{name}</span>
        </div>
      ))}
    </div>
  )
}

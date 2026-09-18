// El isotipo del cliente (los tres triángulos unidos), en línea para que tome el color del
// texto. Mismo trazado que public/images/brand/isotype.svg; el diagrama lleva el suyo con su
// propio encaje (components/site/v2/Diagram.tsx).
export function Isotype({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="1236.4 132.1 4613.8 2571.2" aria-hidden="true" focusable="false" className={`isotype ${className}`}>
      <path
        fill="currentColor"
        d="m5576.1 1102.28h-381.31l-285.78-800.83-285.77 800.83h-377.78-192.7l330.06-924.92-1681.89-0.07 330.09 924.99h-385.08-185.4l-285.77-800.83-285.78 800.83h-377.78l-229.55 630.79h382.23l-330.05 924.93 1681.88 0.06-330.08-924.99h385.07 185.4l285.78 800.83 285.78-800.83h377.77 192.7l-330.06 924.93 1681.89 0.06-330.09-924.99h385.08z"
      />
    </svg>
  );
}

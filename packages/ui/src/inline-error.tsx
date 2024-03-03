export type InlineErrorProps = {
  id?: string;
  children: React.ReactNode;
};

export function InlineError({ id, children }: InlineErrorProps) {
  return (
    <p id={id} className="text-red-600 text-sm text-left">
      {children}
    </p>
  );
}

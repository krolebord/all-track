export const Debug = ({ value }: { value: unknown }) => {
  return <pre>{JSON.stringify(value, undefined, '  ')}</pre>
};

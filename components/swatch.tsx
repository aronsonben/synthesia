
type SwatchProps = {
  swatch: string[],
};

export default function Swatch(props: SwatchProps) {
  return (
    <div className="flex items-center my-4">
        {props.swatch.map((color, index) => (
          <div
            key={index}
            className="w-4 h-4"
            style={{ backgroundColor: color }}
          ></div>
        ))}
    </div>
  );
}

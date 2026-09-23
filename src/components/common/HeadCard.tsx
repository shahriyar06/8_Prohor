import Image, { StaticImageData } from "next/image";

type HeadCardProps = {
  title: string;
  value: string | number;
  description: string;
  className: string;
  icon: StaticImageData;
};

export default function HeadCard({
  title,
  value,
  description,
  icon,
  className,
}: HeadCardProps) {
  return (
    <div className="grid grid-cols-4 p-3 border rounded-md items-center">
      <div className="col-span-3">
        <h1 className="text-md font-medium">{title}</h1>
        <h1 className={`text-4xl font-semibold py-2 ${className}`}>{value}</h1>
        <h1 className="text-xs text-muted-foreground">{description}</h1>
      </div>
      <div className="col-span-1 flex justify-center">
        <Image src={icon} alt={title} width={60} height={60} />
      </div>
    </div>
  );
}

interface HeaderProps {
  name: string;
  title: string;
}

export function Header({ name, title }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-light">{name}</div>
      <div className="text-xl font-medium">{title}</div>
    </div>
  );
}

"use client";

import { Typography } from "antd";
const { Title } = Typography;

interface HeaderProps {
  name: string;
  title: string;
}

export function Header({ name, title }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Title>
        {name}
        <div className="text-xl font-medium">{title}</div>
      </Title>
    </div>
  );
}

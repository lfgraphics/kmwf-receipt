import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface DataCardProps {
  header: string;
  description: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({
  header,
  description,
  content,
  footer,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{header}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};

export default DataCard;

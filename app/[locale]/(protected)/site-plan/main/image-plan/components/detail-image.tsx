import React from "react";
import { Group, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";

interface Props {
  src: string;
  x: number;
  y: number;
  onClose: () => void;
}

const DetailImage: React.FC<Props> = ({ src, x, y, onClose }) => {
  const [image] = useImage(src);
  if (!image) return null;

  const width = 200;
  const height = 200;

  return (
    <Group x={x} y={y} onClick={onClose}>
      {/* background semi-transparan supaya terlihat menonjol */}
      <Rect
        width={width}
        height={height}
        fill="white"
        opacity={0.9}
        cornerRadius={4}
      />
      <KonvaImage image={image} width={width} height={height} />
    </Group>
  );
};

export default DetailImage;

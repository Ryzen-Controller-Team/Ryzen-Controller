import * as React from "react";

const style: React.CSSProperties = {
  cursor: "pointer",
  color: "#FFFFFF",
};

type BadgeProps = {
  value: string;
  onClick?(e: React.MouseEvent<HTMLElement>): void;
  className?: string;
  background?: string | number;
  color?: string;
};

const Badge: React.SFC<BadgeProps> = props => {
  let _style = { ...style };
  if (props.background) {
    _style.background = props.background;
  }

  return (
    <span style={_style} className={`uk-badge ${props.className}`} onClick={props.onClick}>
      {props.value}
    </span>
  );
};

export default Badge;

import styles from "./AntiResult.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

interface Props {
  children: JSX.Element | JSX.Element[];
  iconClasses?: string;
  wrapperClasses?: string;
}

export function AntiResultIcon(props: Props) {
  const { children, iconClasses, wrapperClasses } = props;
  return (
    <Icon
      wrapperClasses={classnames(styles.antiResultIcon, wrapperClasses)}
      iconClasses={iconClasses}
    >
      {children}
    </Icon>
  );
}

AntiResultIcon.displayName = "AntiResultIcon";

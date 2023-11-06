import styles from "./MenuItem.module.css";
import { Icon } from "../Icon/Icon";

interface MenuItemIconProps {
  children: JSX.Element | JSX.Element[];
  iconClasses?: string;
}

export function MenuItemIcon(props: MenuItemIconProps) {
  const { children, iconClasses } = props;
  return (
    <Icon wrapperClasses={styles.menuItemIcon} iconClasses={iconClasses}>
      {children}
    </Icon>
  );
}

MenuItemIcon.displayName = "MenuItemIcon";

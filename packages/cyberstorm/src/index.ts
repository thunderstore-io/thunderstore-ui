import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export * as Button from "./components/Button/";
export { CodeBox, type CodeBoxProps } from "./components/CodeBox/CodeBox";
export {
  BreadCrumbs,
  DefaultHomeCrumb,
} from "./components/BreadCrumbs/BreadCrumbs";
export * as Dialog from "./components/Dialog/";
export * as EmptyState from "./newComponents/EmptyState";
export { Icon } from "./components/Icon/Icon";

export { CyberstormLink } from "./components/Links/Links";
export { ValidationBar } from "./components/ValidationBar/ValidationBar";
export { Markdown } from "./components/Markdown/Markdown";
export * as MenuItem from "./components/MenuItem/";
export type { MenuItemProps } from "./components/MenuItem/";
export { MetaItem, type MetaItemProps } from "./components/MetaItem/MetaItem";
export { SelectSearch } from "./components/SelectSearch/SelectSearch";
export {
  MultiSelectSearch,
  type MultiSelectSearchOption,
} from "./components/MultiSelectSearch/MultiSelectSearch";
export { Switch, type SwitchProps } from "./components/Switch/Switch";
export { CyberstormProviders } from "./components/Providers";
export { Select, type SelectProps } from "./components/Select/Select";
export { Tag, type TagProps } from "./components/Tag/Tag";
export {
  TextInput,
  type TextInputProps,
} from "./components/TextInput/TextInput";
export {
  TextAreaInput,
  type TextAreaInputProps,
} from "./components/TextAreaInput/TextAreaInput";
export { Title, type TitleProps } from "./components/Title/Title";
export { Tooltip, type TooltipProps } from "./newComponents/Tooltip/Tooltip";
export { Alert, type AlertProps } from "./components/Alert/Alert";
export { Avatar } from "./components/Avatar/Avatar";
export { AvatarButton } from "./components/Avatar/AvatarButton";
export { Table, Sort } from "./components/Table/Table";
export { SettingItem } from "./components/SettingItem/SettingItem";
export { ImageWithFallback } from "./components/ImageWithFallback/ImageWithFallback";

// primitiveComponents
export {
  Actionable,
  type ActionableButtonProps,
  type ActionableLinkProps,
  type ActionableCyberstormLinkProps,
} from "./primitiveComponents/Actionable/Actionable";
export {
  Frame,
  type FrameDisplayProps,
  type FrameFloaterProps,
  type FrameHeadingProps,
  type FrameIconProps,
  type FrameModalProps,
  type FramePopoverProps,
  type FrameTextProps,
  type FrameWindowProps,
} from "./primitiveComponents/Frame/Frame";
export {
  Input,
  type InputTextInputProps,
  type InputTextAreaProps,
} from "./primitiveComponents/Input/Input";
export { type PrimitiveComponentDefaultProps } from "./primitiveComponents/utils/utils";

// newComponents
export { Menu } from "./newComponents/Menu/Menu";
export { Drawer } from "./newComponents/Drawer/Drawer";
export { Modal } from "./newComponents/Modal/Modal";
export { Heading } from "./newComponents/Heading/Heading";
export { CardCommunity } from "./newComponents/Card/CardCommunity/CardCommunity";
export { CardPackage } from "./newComponents/Card/CardPackage/CardPackage";
export {
  Link as NewLink,
  type LinkProps as NewLinkProps,
  type CyberstormLinkProps as NewCyberstormLinkProps,
} from "./newComponents/Link/Link";
export { Button as NewButton } from "./newComponents/Button/Button";
export { CycleButton } from "./newComponents/CycleButton/CycleButton";
export {
  BreadCrumbs as NewBreadCrumbs,
  BreadCrumbsLink as NewBreadCrumbsLink,
} from "./newComponents/BreadCrumbs/BreadCrumbs";
export { Toast } from "./newComponents/Toast/Toast";
export {
  TextInput as NewTextInput,
  type TextInputProps as NewTextInputProps,
} from "./newComponents/TextInput/TextInput";
export {
  CodeInput,
  type CodeInputProps,
} from "./newComponents/CodeInput/CodeInput";
export {
  Select as NewSelect,
  type SelectProps as NewSelectProps,
} from "./newComponents/Select/Select";
export { Icon as NewIcon } from "./newComponents/Icon/Icon";
export { Tag as NewTag } from "./newComponents/Tag/Tag";
export { Alert as NewAlert } from "./newComponents/Alert/Alert";
export { MetaItem as NewMetaItem } from "./newComponents/MetaItem/MetaItem";
export { Pagination as NewPagination } from "./newComponents/Pagination/Pagination";
export {
  DropDown as NewDropDown,
  DropDownItem as NewDropDownItem,
  DropDownDivider as NewDropDownDivider,
} from "./newComponents/DropDown/DropDown";
export { Image } from "./newComponents/Image/Image";
export { AdContainer } from "./newComponents/AdContainer/AdContainer";
export { Tabs } from "./newComponents/Tabs/Tabs";
export {
  Table as NewTable,
  TableSort as NewTableSort,
  type TableCompareColumnMeta,
  type TableRow as NewTableRow,
  type TableRows as NewTableRows,
  type TableLabels as NewTableLabels,
} from "./newComponents/Table/Table";
export { SkeletonBox } from "./newComponents/SkeletonBox/SkeletonBox";

// Utils
export { isNode, isRecord, isStringArray } from "./utils/type_guards";
export { range, formatToDisplayName } from "./utils/utils";
export {
  LinkingProvider,
  type LinkLibrary,
  LinkingContext,
  type ThunderstoreLinkProps,
  thunderstoreLinkProps,
} from "./components/Links/LinkingProvider";

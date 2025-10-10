import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

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

// components
export { CodeBox, type CodeBoxProps } from "./components/CodeBox/CodeBox";
export {
  LinkingProvider,
  type LinkLibrary,
  LinkingContext,
  type ThunderstoreLinkProps,
  thunderstoreLinkProps,
} from "./components/Links/LinkingProvider";
export { CyberstormLink } from "./components/Links/Links";
export { RelativeTime } from "./components/RelativeTime/RelativeTime";
export {
  TextAreaInput,
  type TextAreaInputProps,
} from "./components/TextAreaInput/TextAreaInput";
export { ValidationBar } from "./components/ValidationBar/ValidationBar";

// newComponents
export { AdContainer } from "./newComponents/AdContainer/AdContainer";
export {
  Alert as NewAlert,
  type AlertProps as NewAlertProps,
} from "./newComponents/Alert/Alert";
export { Avatar as NewAvatar } from "./newComponents/Avatar/Avatar";
export {
  BreadCrumbs as NewBreadCrumbs,
  BreadCrumbsLink as NewBreadCrumbsLink,
} from "./newComponents/BreadCrumbs/BreadCrumbs";
export { Button as NewButton } from "./newComponents/Button/Button";
export { CardCommunity } from "./newComponents/Card/CardCommunity/CardCommunity";
export { CardPackage } from "./newComponents/Card/CardPackage/CardPackage";
export {
  CodeInput,
  type CodeInputProps,
} from "./newComponents/CodeInput/CodeInput";
export { CycleButton } from "./newComponents/CycleButton/CycleButton";
export { Drawer } from "./newComponents/Drawer/Drawer";
export {
  DropDown as NewDropDown,
  DropDownItem as NewDropDownItem,
  DropDownDivider as NewDropDownDivider,
} from "./newComponents/DropDown/DropDown";
export * as EmptyState from "./newComponents/EmptyState";
export { Heading } from "./newComponents/Heading/Heading";
export { Icon as NewIcon } from "./newComponents/Icon/Icon";
export { Image } from "./newComponents/Image/Image";
export {
  Link as NewLink,
  type LinkProps as NewLinkProps,
  type CyberstormLinkProps as NewCyberstormLinkProps,
} from "./newComponents/Link/Link";
export { Menu } from "./newComponents/Menu/Menu";
export { MetaItem as NewMetaItem } from "./newComponents/MetaItem/MetaItem";
export { Modal, type ModalProps } from "./newComponents/Modal/Modal";
export { Pagination as NewPagination } from "./newComponents/Pagination/Pagination";
export {
  Select as NewSelect,
  type SelectProps as NewSelectProps,
} from "./newComponents/Select/Select";
export {
  SelectSearch as NewSelectSearch,
  type SelectSearchProps as NewSelectSearchProps,
} from "./newComponents/SelectSearch/SelectSearch";
export { SkeletonBox } from "./newComponents/SkeletonBox/SkeletonBox";
export { Switch as NewSwitch } from "./newComponents/Switch/Switch";
export { Tag as NewTag } from "./newComponents/Tag/Tag";
export {
  TextInput as NewTextInput,
  type TextInputProps as NewTextInputProps,
} from "./newComponents/TextInput/TextInput";
export { useToast } from "./newComponents/Toast/Provider";
export { Toast } from "./newComponents/Toast/Toast";
export {
  Table as NewTable,
  TableSort as NewTableSort,
  type TableCompareColumnMeta,
  type TableRow as NewTableRow,
  type TableRows as NewTableRows,
  type TableLabels as NewTableLabels,
} from "./newComponents/Table/Table";
export { Tabs } from "./newComponents/Tabs/Tabs";
export { Tooltip, type TooltipProps } from "./newComponents/Tooltip/Tooltip";

// Utils
export { isNode, isRecord, isStringArray } from "./utils/type_guards";
export type { SelectOption } from "./utils/types";
export {
  range,
  formatFileSize,
  formatInteger,
  formatToDisplayName,
} from "./utils/utils";

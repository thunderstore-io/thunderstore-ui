import { config } from "@fortawesome/fontawesome-svg-core";

// Barebones structural token defaults (see defaults.css). Lives in
// `@layer cyberstorm`, so cyberstorm-theme overrides it whenever loaded.
import "./defaults.css";

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
export { TooltipWrapper } from "./primitiveComponents/utils/utils";

// components
export { CodeBox, type CodeBoxProps } from "./components/CodeBox/CodeBox";
export {
  CopyButton,
  type CopyButtonProps,
} from "./components/CopyButton/CopyButton";
export {
  LinkingProvider,
  type LinkLibrary,
  LinkingContext,
  type ThunderstoreLinkProps,
  thunderstoreLinkProps,
} from "./components/Links/LinkingProvider";
export { CyberstormLink } from "./components/Links/Links";
export { LocalDateTime } from "./components/LocalDateTime/LocalDateTime";
export { RelativeTime } from "./components/RelativeTime/RelativeTime";
export {
  TextAreaInput,
  type TextAreaInputProps,
} from "./components/TextAreaInput/TextAreaInput";
export { ValidationBar } from "./components/ValidationBar/ValidationBar";

// newComponents
export {
  AdContainer,
  type AdContainerSizeVariant,
  type AdCreative,
  type StaticAd,
} from "./newComponents/AdContainer/AdContainer";
export {
  Alert as NewAlert,
  type AlertProps as NewAlertProps,
} from "./newComponents/Alert/Alert";
export { Avatar as NewAvatar } from "./newComponents/Avatar/Avatar";
export {
  BreadCrumbs as NewBreadCrumbs,
  BreadCrumbsLink as NewBreadCrumbsLink,
  BreadCrumbsItem as NewBreadCrumbsItem,
} from "./newComponents/BreadCrumbs/BreadCrumbs";
export { Button as NewButton } from "./newComponents/Button/Button";
export { CardCommunity } from "./newComponents/Card/CardCommunity/CardCommunity";
export { CardPackage } from "./newComponents/Card/CardPackage/CardPackage";
export {
  CodeInput,
  type CodeInputProps,
} from "./newComponents/CodeInput/CodeInput";
export {
  Container,
  type ContainerProps,
} from "./newComponents/Container/Container";
export { CycleButton } from "./newComponents/CycleButton/CycleButton";
export { Drawer, DrawerDivider } from "./newComponents/Drawer/Drawer";
export {
  DropDown as NewDropDown,
  DropDownItem as NewDropDownItem,
  DropDownDivider as NewDropDownDivider,
  DropDownSub as NewDropDownSub,
  DropDownSubTrigger as NewDropDownSubTrigger,
  DropDownSubContent as NewDropDownSubContent,
} from "./newComponents/DropDown/DropDown";
export * as EmptyState from "./newComponents/EmptyState";
export { Heading } from "./newComponents/Heading/Heading";
export { Icon as NewIcon } from "./newComponents/Icon/Icon";
export { Image, type ImageProps } from "./newComponents/Image/Image";
export {
  Link as NewLink,
  type LinkProps as NewLinkProps,
  type CyberstormLinkProps as NewCyberstormLinkProps,
} from "./newComponents/Link/Link";
export { Menu } from "./newComponents/Menu/Menu";
export { MetaItem as NewMetaItem } from "./newComponents/MetaItem/MetaItem";
export { Modal, type ModalProps } from "./newComponents/Modal/Modal";
export { Pagination as NewPagination } from "./newComponents/Pagination/Pagination";
export type { PaginationProps } from "./newComponents/Pagination/Pagination";
export {
  Select as NewSelect,
  type SelectProps as NewSelectProps,
} from "./newComponents/Select/Select";
export {
  SelectSearchSingle as NewSelectSearchSingle,
  SelectSearchMultiple as NewSelectSearchMultiple,
  type SelectSearchSingleProps as NewSelectSearchSingleProps,
  type SelectSearchMultipleProps as NewSelectSearchMultipleProps,
} from "./newComponents/SelectSearch";
export { SkeletonBox } from "./newComponents/SkeletonBox/SkeletonBox";
export { Switch as NewSwitch } from "./newComponents/Switch/Switch";
export { Tag as NewTag } from "./newComponents/Tag/Tag";
export {
  TextInput as NewTextInput,
  type TextInputProps as NewTextInputProps,
} from "./newComponents/TextInput/TextInput";
export { useToast } from "./newComponents/Toast/Provider";
export { Provider as ToastProvider } from "./newComponents/Toast/Provider";
export { Viewport as ToastViewport } from "./newComponents/Toast/Viewport";
export { Toast } from "./newComponents/Toast/Toast";
export type { ToastProps } from "./newComponents/Toast/Toast";
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
  classnames,
  componentClasses,
  numberWithSpaces,
  formatFileSize,
  formatInteger,
  formatAsCount,
  formatToDisplayName,
} from "./utils/utils";

export {
  OverwolfLogo,
  ThunderstoreLogo,
  ThunderstoreLogoHorizontal,
} from "./svg/svg";

// Component API types (variant/size/modifier lists)
export {
  type ButtonVariants,
  ButtonVariantsList,
  type ButtonSizes,
  ButtonSizesList,
  type ButtonModifiers,
  ButtonModifiersList,
} from "./newComponents/Button/Button.types";
export {
  type HeadingVariants,
  HeadingVariantsList,
  type HeadingSizes,
  HeadingSizesList,
  type HeadingModifiers,
  HeadingModifiersList,
} from "./newComponents/Heading/Heading.types";
export {
  type DropDownVariants,
  DropDownVariantsList,
  type DropDownSizes,
  DropDownSizesList,
  type DropDownModifiers,
  DropDownModifiersList,
  type DropDownItemVariants,
  DropDownItemVariantsList,
  type DropDownItemSizes,
  DropDownItemSizesList,
  type DropDownItemModifiers,
  DropDownItemModifiersList,
  type DropDownDividerVariants,
  DropDownDividerVariantsList,
  type DropDownDividerSizes,
  DropDownDividerSizesList,
  type DropDownDividerModifiers,
  DropDownDividerModifiersList,
} from "./newComponents/DropDown/DropDown.types";
export {
  type SelectVariants,
  SelectVariantsList,
  type SelectSizes,
  SelectSizesList,
  type SelectModifiers,
  SelectModifiersList,
} from "./newComponents/Select/Select.types";
export {
  type TableVariants,
  TableVariantsList,
  type TableSizes,
  TableSizesList,
  type TableModifiers,
  TableModifiersList,
} from "./newComponents/Table/Table.types";
export {
  type TextInputVariants,
  TextInputVariantsList,
  type TextInputSizes,
  TextInputSizesList,
  type TextInputModifiers,
  TextInputModifiersList,
} from "./newComponents/TextInput/TextInput.types";
export {
  type CodeInputVariants,
  CodeInputVariantsList,
  type CodeInputSizes,
  CodeInputSizesList,
  type CodeInputModifiers,
  CodeInputModifiersList,
} from "./newComponents/CodeInput/CodeInput.types";
export {
  type IconVariants,
  IconVariantsList,
} from "./newComponents/Icon/Icon.types";
export {
  type BreadCrumbsVariants,
  BreadCrumbsVariantsList,
  type BreadCrumbsSizes,
  BreadCrumbsSizesList,
  type BreadCrumbsModifiers,
  BreadCrumbsModifiersList,
} from "./newComponents/BreadCrumbs/BreadCrumbs.types";
export {
  type TagVariants,
  TagVariantsList,
  type TagSizes,
  TagSizesList,
  type TagModifiers,
  TagModifiersList,
} from "./newComponents/Tag/Tag.types";
export {
  type AlertVariants,
  AlertVariantsList,
  type AlertSizes,
  AlertSizesList,
} from "./newComponents/Alert/Alert.types";
export {
  type ToastVariants,
  ToastVariantsList,
  type ToastSizes,
  ToastSizesList,
} from "./newComponents/Toast/Toast.types";
export {
  type MetaItemVariants,
  MetaItemVariantsList,
  type MetaItemSizes,
  MetaItemSizesList,
} from "./newComponents/MetaItem/MetaItem.types";
export {
  type TabsVariants,
  TabsVariantsList,
  type TabsSizes,
  TabsSizesList,
} from "./newComponents/Tabs/Tabs.types";
export {
  type LinkVariants,
  LinkVariantsList,
} from "./newComponents/Link/Link.types";
export {
  type ImageVariants,
  ImageVariantsList,
} from "./newComponents/Image/Image.types";
export {
  type MenuVariants,
  MenuVariantsList,
} from "./newComponents/Menu/Menu.types";
export {
  type DrawerSizes,
  DrawerSizesList,
  type DrawerVariants,
  DrawerVariantsList,
} from "./newComponents/Drawer/Drawer.types";
export {
  type ModalVariants,
  ModalVariantsList,
  type ModalSizes,
  ModalSizesList,
} from "./newComponents/Modal/Modal.types";
export {
  type AdContainerVariants,
  AdContainerVariantsList,
} from "./newComponents/AdContainer/AdContainer.types";
export {
  type CardPackageVariants,
  CardPackageVariantsList,
  type CardPackageSizes,
  CardPackageSizesList,
  type CardPackageModifiers,
  CardPackageModifiersList,
} from "./newComponents/Card/CardPackage/CardPackage.types";
export {
  type SelectSearchModifiers,
  SelectSearchModifiersList,
} from "./newComponents/SelectSearch/SelectSearch.types";
export {
  type SwitchVariants,
  SwitchVariantsList,
  type SwitchSizes,
  SwitchSizesList,
  type SwitchModifiers,
  SwitchModifiersList,
} from "./newComponents/Switch/Switch.types";
export {
  type AvatarVariants,
  AvatarVariantsList,
  type AvatarSizes,
  AvatarSizesList,
} from "./newComponents/Avatar/Avatar.types";

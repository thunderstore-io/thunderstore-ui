import { Fragment, ReactNode } from "react";

import { faHouse, faSlashForward } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./componentStyles/Breadcrumb.module.css";
import { IndexLink } from "./Links";

type Label = ReactNode | string;

// TODO: Currently the types in LinkProps are not checked in anyway.
interface Crumb {
  label: Label;
  LinkComponent?: (props: any) => React.ReactElement | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  LinkProps?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Props {
  parts: Crumb[];
}

export function BreadCrumb(props: Props) {
  if (!props.parts) {
    return null;
  }
  const parts = [...props.parts];
  const leaf = parts.pop();

  return (
    <div className={styles.root}>
      {parts.map((crumb, i) => (
        <Fragment key={`${crumb.label}-${i}`}>
          <MidCrumb crumb={crumb} />
          <Separator />
        </Fragment>
      ))}

      <LeafCrumb crumb={leaf} />
    </div>
  );
}

function MidCrumb(props: { crumb: Crumb }) {
  const { crumb } = props;
  if (crumb.LinkComponent === undefined) {
    return CrumbLabel(crumb.label);
  }
  return (
    <crumb.LinkComponent {...crumb.LinkProps}>
      {CrumbLabel(crumb.label)}
    </crumb.LinkComponent>
  );
}

function LeafCrumb(props: { crumb?: Crumb }) {
  const { crumb } = props;
  if (crumb === undefined) {
    return null;
  } else {
    return CrumbLabel(crumb.label);
  }
}

function CrumbLabel(label: Label) {
  if (label && typeof label === "string") {
    return <span className={styles.label}>{label}</span>;
  }
  return <>{label}</>;
}

const Separator = () => (
  <span aria-hidden="true" className={styles.separator}>
    <FontAwesomeIcon fixedWidth icon={faSlashForward} />
  </span>
);

export const DefaultHomeCrumb: Crumb = {
  LinkComponent: IndexLink,
  label: <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />,
};

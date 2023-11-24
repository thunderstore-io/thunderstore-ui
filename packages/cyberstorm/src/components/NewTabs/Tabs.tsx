"use client";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import React, { PropsWithChildren, startTransition, useState } from "react";

import styles from "./Tabs.module.css";
import { Icon } from "../Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classnames } from "../../utils/utils";

interface Props extends PropsWithChildren {
  /**
   * Name prop of the Tab that should be shown by default.
   * If omitted, the first Tab acts as the default Tab.
   */
  defaultActive?: string;
}

/**
 * Wrapper components for Tab components.
 *
 * Validates the passed Tab components and handles switching between
 * them.
 */
const Tabs = (props: Props) => {
  const { defaultActive } = props;

  // Sanity checking the child components.
  const children = React.Children.toArray(props.children);
  const seenNames: string[] = [];

  children.forEach((child) => {
    if (!React.isValidElement(child) || child.type !== Tab) {
      throw new Error("Tabs component only allows Tab child components");
    }
    if (seenNames.includes(child.props.name)) {
      throw new Error(`Non-unique Tab.name "${child.props.name}" in Tabs`);
    }
    seenNames.push(child.props.name);
  });

  if (defaultActive && !seenNames.includes(defaultActive)) {
    throw new Error(
      `Tabs.defaultActive "${defaultActive}" matches no child Tab.name`
    );
  }

  const [activeTab, setActiveTab] = useState(defaultActive || seenNames[0]);

  // Throw away the ease-of-use Tab components and render internal
  // components instead.
  const buttons: JSX.Element[] = [];
  const contents: JSX.Element[] = [];

  children.forEach((child) => {
    if (React.isValidElement(child)) {
      buttons.push(
        <InternalTabButton
          key={child.props.name}
          active={child.props.name === activeTab}
          setActive={() => setActiveTab(child.props.name)}
          {...child.props}
        />
      );
      contents.push(
        <InternalTabContent
          key={child.props.name}
          active={child.props.name === activeTab}
        >
          {child.props.children}
        </InternalTabContent>
      );
    }
  });

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>{buttons}</div>
      <div>{contents}</div>
    </div>
  );
};

Tabs.displayName = "Tabs";

interface TabProps extends PropsWithChildren {
  /** Unique identifier for the Tab in the context of Tabs */
  name: string;
  /** Text shown on the Tab activator */
  label: string;
  /**
   * Prevents user from selecting the Tab.
   *
   * Note that if default Tab is disabled, the contents will be shown
   * initially, but user can't reselect the Tab once they leave it.
   */
  disabled?: boolean;
  /** Icon shown on the Tab activator */
  icon?: IconDefinition;
}

const Tab = (props: TabProps) => props && null;

Tab.displayName = "Tab";

export default Object.assign(Tabs, { Tab: Tab });

interface InternalTabButtonProps {
  label: string;
  active: boolean;
  setActive: () => void;
  disabled?: boolean;
  icon?: IconDefinition;
}

/** Only for internal use by Tabs and thus not exported. */
const InternalTabButton = (props: InternalTabButtonProps) => {
  const { active, disabled = false, icon, label, setActive } = props;

  return (
    <button
      type="button"
      aria-current={active}
      className={classnames(styles.button, active ? styles.active : "")}
      disabled={disabled}
      onClick={() => startTransition(setActive)}
    >
      {icon ? (
        <Icon inline wrapperClasses={styles.icon}>
          <FontAwesomeIcon icon={icon} />
        </Icon>
      ) : null}
      <span className={styles.label}>{label}</span>
    </button>
  );
};

InternalTabButton.displayName = "InternalTabButton";

interface InternalTabContentProps extends PropsWithChildren {
  active: boolean;
}

/** Only for internal use by Tabs and thus not exported. */
const InternalTabContent = (props: InternalTabContentProps) => {
  return props.active ? <>{props.children}</> : <></>;
};

InternalTabContent.displayName = "InternalTabContent";

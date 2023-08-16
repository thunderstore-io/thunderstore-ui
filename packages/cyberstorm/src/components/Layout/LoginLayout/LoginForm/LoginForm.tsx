"use client";
import styles from "./LoginForm.module.css";
import { Tab, Tabs } from "../../../Tabs/Tabs";
import { TextInput } from "../../../TextInput/TextInput";
import { Button } from "../../../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo } from "../../../../svg/svg";
import { useState } from "react";

const tabs: Array<Tab> = [
  {
    key: 1,
    label: "Login",
  },
  {
    key: 2,
    label: "Register",
  },
];

/**
 * Cyberstorm Login Form
 */
export function LoginForm() {
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <div className={styles.root}>
      <div className={styles.tabButtons}>
        <Tabs currentTab={currentTab} tabs={tabs} onTabChange={setCurrentTab} />
      </div>
      {currentTab === 1 ? (
        <>
          <div className={styles.inputWrapper}>
            <div className={styles.inputFieldRow}>
              <div>
                <div className={styles.label}>Email</div>
                <TextInput placeHolder="Email" />
              </div>
              <div>
                <div className={styles.label}>Password</div>
                <TextInput placeHolder="Password" />
              </div>
            </div>
            <div className={styles.loginButton}>
              <Button paddingSize="huge" colorScheme="accent" label="Login" />
            </div>
          </div>
          <div className={styles.descriptor}>
            <div className={styles.descriptorDecoration} />
            <div className={styles.descriptorText}>Or continue with</div>
            <div className={styles.descriptorDecoration} />
          </div>
          <div className={styles.continueButtons}>
            <div className={styles.continueButton}>
              <Button
                colorScheme="blue"
                label="Discord"
                leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
                paddingSize="large"
              />
            </div>
            <div className={styles.continueButton}>
              <Button
                colorScheme="gray"
                label="GitHub"
                leftIcon={<FontAwesomeIcon icon={faGithub} fixedWidth />}
                paddingSize="large"
              />
            </div>
            <div className={styles.continueButton}>
              <Button
                colorScheme="red"
                label="Ovewolf"
                leftIcon={<OverwolfLogo />}
                paddingSize="large"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

LoginForm.displayName = "LoginForm";

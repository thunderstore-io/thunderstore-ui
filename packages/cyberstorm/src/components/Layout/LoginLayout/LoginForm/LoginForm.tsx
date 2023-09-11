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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.root}>
      <Tabs currentTab={currentTab} tabs={tabs} onTabChange={setCurrentTab} />
      {currentTab === 1 ? (
        <>
          <form className={styles.inputWrapper}>
            <div className={styles.inputFieldRow}>
              <div>
                <label htmlFor="login_email" className={styles.label}>
                  Email
                </label>
                <TextInput
                  value={email}
                  setValue={setEmail}
                  id="login_email"
                  placeHolder="Email"
                />
              </div>
              <div>
                <label htmlFor="login_password" className={styles.label}>
                  Password
                </label>
                <TextInput
                  type="password"
                  value={password}
                  setValue={setPassword}
                  id="login_password"
                  placeHolder="Password"
                />
              </div>
            </div>
            <Button
              type="submit"
              paddingSize="huge"
              colorScheme="accent"
              label="Login"
            />
          </form>
          <div className={styles.descriptor}>Or continue with</div>
          <div className={styles.continueButtons}>
            <div className={styles.continueButton}>
              <Button
                colorScheme="discord"
                label="Discord"
                leftIcon={<FontAwesomeIcon icon={faDiscord} fixedWidth />}
                paddingSize="large"
              />
            </div>
            <div className={styles.continueButton}>
              <Button
                colorScheme="github"
                label="GitHub"
                leftIcon={<FontAwesomeIcon icon={faGithub} fixedWidth />}
                paddingSize="large"
              />
            </div>
            <div className={styles.continueButton}>
              <Button
                colorScheme="overwolf"
                label="Overwolf"
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

"use client";
import styles from "./LoginForm.module.css";
import { Tab, Tabs } from "../../../Tabs/Tabs";
import { TextInput } from "../../../TextInput/TextInput";
import * as Button from "../../../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo } from "../../../../svg/svg";
import { useState } from "react";
import { Icon } from "../../../Icon/Icon";

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
            <Button.Root type="submit" paddingSize="huge" variant="accent">
              <Button.ButtonLabel>Login</Button.ButtonLabel>
            </Button.Root>
          </form>
          <div className={styles.descriptor}>Or continue with</div>
          <div className={styles.continueButtons}>
            <div className={styles.continueButton}>
              <Button.Root variant="discord" paddingSize="large">
                <Button.ButtonIcon>
                  <Icon>
                    <FontAwesomeIcon icon={faDiscord} />
                  </Icon>
                </Button.ButtonIcon>
                <Button.ButtonLabel>Discord</Button.ButtonLabel>
              </Button.Root>
            </div>
            <div className={styles.continueButton}>
              <Button.Root variant="github" paddingSize="large">
                <Button.ButtonIcon>
                  <Icon>
                    <FontAwesomeIcon icon={faGithub} />
                  </Icon>
                </Button.ButtonIcon>
                <Button.ButtonLabel>GitHub</Button.ButtonLabel>
              </Button.Root>
            </div>
            <div className={styles.continueButton}>
              <Button.Root variant="overwolf" paddingSize="large">
                <Button.ButtonIcon>
                  <Icon>
                    <OverwolfLogo />
                  </Icon>
                </Button.ButtonIcon>
                <Button.ButtonLabel>Overwolf</Button.ButtonLabel>
              </Button.Root>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

LoginForm.displayName = "LoginForm";

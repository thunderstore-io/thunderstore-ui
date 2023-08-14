"use client";
import styles from "./LoginLayout.module.css";
import { Button } from "../../Button/Button";
import { Tab, Tabs } from "../../Tabs/Tabs";
import { useState } from "react";
import { TextInput } from "../../TextInput/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  LoginGraphics,
  OverwolfLogo,
  ThunderstoreLogoHorizontal,
} from "../../../svg/svg";
import { PrivacyPolicyLink, TermsOfServiceLink } from "../../Links/Links";

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
 * Cyberstorm Login Layout
 */
export function LoginLayout() {
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <div className={styles.root}>
      <div className={styles.login}>
        <div className={styles.backgroundGradient} />
        <div className={styles.loginForm}>
          <div className={styles.tabButtons}>
            <Tabs
              currentTab={currentTab}
              tabs={tabs}
              onTabChange={setCurrentTab}
            />
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
                  <Button
                    paddingSize="huge"
                    colorScheme="accent"
                    label="Login"
                  />
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
      </div>
      <div className={styles.graphicsWrapper}>
        <div className={styles.graphics}>
          <div className={styles.logo}>
            <ThunderstoreLogoHorizontal />
          </div>
          <div className={styles.graphicsSvg}>
            <LoginGraphics />
          </div>
          <div className={styles.legal}>
            By logging in and accessing the site I agree to{" "}
            <span className={styles.legalLink}>
              <TermsOfServiceLink>Terms and Conditions</TermsOfServiceLink>
            </span>{" "}
            and{" "}
            <span className={styles.legalLink}>
              <PrivacyPolicyLink>Privacy Policy</PrivacyPolicyLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginLayout.displayName = "LoginLayout";

import { NextPage } from "next";
import styles from "../styles/SubmitServer.module.css";

const SubmitServer: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formHeader}>
        <div className={styles.formTitle}>Submit Server</div>
      </div>
      <div className={styles.form}>
        <div className={styles.row}>
          <label htmlFor={"game"}>Game</label>
          <select id={"game"} className={styles.input}>
            <option value={"v-rising"}>V Rising</option>
          </select>
        </div>
        <div className={styles.row}>
          <label htmlFor={"serverName"}>Server Name</label>
          <input
            className={styles.input}
            id={"serverName"}
            name={"serverName"}
            type={"text"}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor={"connectionInfo"}>Connection Info</label>
          <input
            className={styles.input}
            name={"connectionInfo"}
            id={"connectionInfo"}
            type={"text"}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor={"description"}>Description</label>
          <textarea
            className={styles.textarea}
            id={"description"}
            name={"description"}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor={"mode"}>Mode</label>
          <select className={styles.input} id={"mode"}>
            <option value={"pvp"}>PvP</option>
            <option value={"pve"}>PvE</option>
          </select>
        </div>
        <div className={styles.row}>
          <label htmlFor={"mods"}>Mods</label>
          <select className={styles.input} id={"mods"}>
            {/*TODO: Populate*/}
          </select>
        </div>
        <div className={styles.row}>
          <label htmlFor={"isPasswordProtected"}>Password Protected</label>
          <div className={styles.checkboxContainer}>
            <input
              className={styles.checkbox}
              name={"isPasswordProtected"}
              id={"isPasswordProtected"}
              type={"checkbox"}
            />
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label} />
        <button id={"submit"} className={styles.submit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default SubmitServer;
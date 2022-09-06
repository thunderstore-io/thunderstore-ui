import { GetStaticProps, NextPage } from "next";
import { ApiURLs, TsApiURLs } from "../api/urls";
import { getPackageList } from "../api/hooks";
import { SWRConfig } from "swr";
import { ModSelectorModal } from "../components/mod-selector/modal";
import styles from "../styles/SubmitServer.module.css";
import { useForm, SubmitHandler } from "react-hook-form";

export const getStaticProps: GetStaticProps = async () => {
  const fallback: { [key: string]: unknown } = {};
  fallback[TsApiURLs.V1Packages("v-rising")] = await getPackageList("v-rising");
  return {
    props: {
      swrFallback: fallback,
    },
    revalidate: 10,
  };
};

type Inputs = {
  serverName: string;
  connectionInfo: string;
  description: string;
  mode: string;
  mods: [string];
  isPasswordProtected: string;
};

const SubmitServer: NextPage<{ swrFallback: { [key: string]: unknown } }> = ({
  swrFallback,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const prepped_data = {
      name: data.serverName,
      description: data.description,
      community: "v-rising",
      connection_data: data.connectionInfo,
      // TODO: Populate this with mod ids etc
      mods: ["1", "2", "3"],
      is_pvp: data.mode === "pvp" ? true : false,
      requires_password: data.isPasswordProtected ? true : false,
    };
    fetch(ApiURLs.ServerCreate, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prepped_data),
    });
  };

  return (
    <SWRConfig value={{ fallback: swrFallback }}>
      <ModSelectorModal />
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
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
              type={"text"}
              {...register("serverName", { required: true })}
            />
            {/* Add styling here */}
            {errors.serverName?.type === "required" &&
              "Server name is required"}
          </div>
          <div className={styles.row}>
            <label htmlFor={"connectionInfo"}>Connection Info</label>
            <input
              className={styles.input}
              id={"connectionInfo"}
              type={"text"}
              {...register("connectionInfo", { required: true })}
            />
            {/* Add styling here */}
            {errors.serverName?.type === "required" &&
              "Connection info is required"}
          </div>
          <div className={styles.row}>
            <label htmlFor={"description"}>Description</label>
            <textarea
              className={styles.textarea}
              id={"description"}
              {...register("description")}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor={"mode"}>Mode</label>
            <select className={styles.input} id={"mode"} {...register("mode")}>
              <option value={"pvp"}>PvP</option>
              <option value={"pve"}>PvE</option>
            </select>
          </div>
          <div className={styles.row}>
            <label htmlFor={"mods"}>Mods</label>
            <select className={styles.input} id={"mods"} {...register("mods")}>
              {/*TODO: Populate*/}
            </select>
          </div>
          <div className={styles.row}>
            <label htmlFor={"isPasswordProtected"}>Password Protected</label>
            <div className={styles.checkboxContainer}>
              <input
                className={styles.checkbox}
                id={"isPasswordProtected"}
                type={"checkbox"}
                {...register("isPasswordProtected")}
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
      </form>
    </SWRConfig>
  );
};

export default SubmitServer;

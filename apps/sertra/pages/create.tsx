import { GetStaticProps, NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { SWRConfig } from "swr";

import { getPackageList } from "../api/hooks";
import { ApiURLs, TsApiURLs } from "../api/urls";
import { HeadWrapper } from "../components/HeadWrapper";
import { ModSelectorModal } from "../components/mod-selector/modal";
import styles from "../styles/SubmitServer.module.css";

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
  isPasswordProtected: boolean;
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
      is_pvp: data.mode === "pvp",
      requires_password: data.isPasswordProtected,
    };
    fetch(ApiURLs.ServerCreate, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prepped_data),
    });
  };

  return (
    <SWRConfig value={{ fallback: swrFallback }}>
      <HeadWrapper
        title="Submit Server"
        description="Submit a modded server to the Thunderstore server list"
      />
      <ModSelectorModal />

      <h1 className={styles.formHeader}>Submit Server</h1>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          {/* TODO: Add styling here */}
          {errors.serverName?.type === "required" && "Server name is required"}
        </div>

        <div className={styles.row}>
          <label htmlFor={"connectionInfo"}>Connection Info</label>
          <input
            className={styles.input}
            id={"connectionInfo"}
            type={"text"}
            {...register("connectionInfo", { required: true })}
          />
          {/* TODO: Add styling here */}
          {errors.connectionInfo?.type === "required" &&
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
            {/* TODO: Populate */}
          </select>
        </div>

        <div className={styles.row}>
          <label htmlFor={"isPasswordProtected"}>Password Protected</label>
          <input
            className={styles.checkbox}
            id={"isPasswordProtected"}
            type={"checkbox"}
            {...register("isPasswordProtected")}
          />
        </div>

        <button id={styles.submit}>Submit</button>
      </form>
    </SWRConfig>
  );
};

export default SubmitServer;

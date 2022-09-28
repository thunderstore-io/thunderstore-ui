import { GetStaticProps, NextPage } from "next";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { SWRConfig } from "swr";

import { getPackageList, usePackageList } from "../api/hooks";
import { ModPackage } from "../api/models";
import { ApiURLs, TsApiURLs } from "../api/urls";
import { ModSelectorModal } from "../components/mod-selector/modal";
import styles from "../styles/SubmitServer.module.css";
import { modPackageSort, packagesToModPackages } from "../utils/types";

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

type Wrapper = FC<PropsWithChildren>;
const Row: Wrapper = (props) => <div className={styles.row} {...props} />;
const ColSm: Wrapper = (props) => <div className={styles.colSm} {...props} />;
const ColLg: Wrapper = (props) => <div className={styles.colLg} {...props} />;

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMods, setSelectedMods] = useState<ModPackage[]>([]);
  const { data: packages } = usePackageList("v-rising"); // TODO: error handling

  const allMods = useMemo(
    () => packagesToModPackages(packages ?? []).sort(modPackageSort),
    [packages]
  );

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
      mods: selectedMods.map((m) => `${m.id}-${m.selectedVersion}`),
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
      <ModSelectorModal
        allMods={allMods}
        close={() => setModalVisible(false)}
        currentlySelected={selectedMods}
        setCurrentlySelected={setSelectedMods}
        visible={modalVisible}
      />

      <h1 className={styles.formHeader}>Submit Server</h1>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <ColSm>
            <label htmlFor={"game"}>Game</label>
          </ColSm>
          <ColLg>
            <select id={"game"} className={styles.input}>
              <option value={"v-rising"}>V Rising</option>
            </select>
          </ColLg>
        </Row>

        <Row>
          <ColSm>
            <label htmlFor={"serverName"}>Server Name</label>
          </ColSm>
          <ColLg>
            <input
              className={styles.input}
              id={"serverName"}
              type={"text"}
              {...register("serverName", { required: true })}
            />
            {/* TODO: Add styling here */}
            {errors.serverName?.type === "required" &&
              "Server name is required"}
          </ColLg>
        </Row>

        <Row>
          <ColSm>
            <label htmlFor={"connectionInfo"}>Connection Info</label>
          </ColSm>
          <ColLg>
            <input
              className={styles.input}
              id={"connectionInfo"}
              type={"text"}
              {...register("connectionInfo", { required: true })}
            />
            {/* TODO: Add styling here */}
            {errors.connectionInfo?.type === "required" &&
              "Connection info is required"}
          </ColLg>
        </Row>

        <Row>
          <ColSm>
            <label htmlFor={"description"}>Description</label>
          </ColSm>
          <ColLg>
            <textarea
              className={styles.textarea}
              id={"description"}
              {...register("description")}
            />
          </ColLg>
        </Row>

        <Row>
          <ColSm>
            <label htmlFor={"mode"}>Mode</label>
          </ColSm>
          <ColLg>
            <select className={styles.input} id={"mode"} {...register("mode")}>
              <option value={"pvp"}>PvP</option>
              <option value={"pve"}>PvE</option>
            </select>
          </ColLg>
        </Row>

        <Row>
          <ColSm>
            <label htmlFor="mods">Mods</label>
          </ColSm>
          <ColLg>
            <button
              id="mods"
              className={styles.selectMods}
              type="button"
              onClick={() => setModalVisible(true)}
            >
              Select Mods
            </button>
          </ColLg>
        </Row>

        <Row>
          <ColSm>
            <label htmlFor={"isPasswordProtected"}>Password Protected</label>
          </ColSm>
          <ColLg>
            <input
              className={styles.checkbox}
              id={"isPasswordProtected"}
              type={"checkbox"}
              {...register("isPasswordProtected")}
            />
          </ColLg>
        </Row>

        <button id={styles.submit}>Submit</button>
      </form>
    </SWRConfig>
  );
};

export default SubmitServer;

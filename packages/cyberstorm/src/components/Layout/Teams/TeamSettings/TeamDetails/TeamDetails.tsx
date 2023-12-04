import { TeamDetailsEdit } from "@thunderstore/cyberstorm-forms";

interface Props {
  teamName: string;
}

export function TeamDetails(props: Props) {
  const { teamName } = props;

  return <TeamDetailsEdit teamName={teamName} />;

  /*
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SettingItem
          title="Team Avatar"
          description="Instructions for uploading a picture"
          content={
            <div className={styles.avatarContent}>
              <ModIcon src={teamData.imageSource} />
              <div>
                <Button.Root><Button.ButtonLabel>Upload picture</Button.ButtonLabel></Button.Root>
              </div>
            </div>
          }
        />
      </div>

      <div className={styles.line} />

      <div className={styles.section}>
        <SettingItem
          title="Profile Summary"
          description="A short description shown in header and profile cards"
          content={<TextInput placeholder="This is an description" />}
        />
        <SettingItem
          title="Abut Us"
          description="A more comprehensive description shown on the profile page"
          content={<TextInput placeholder={teamData.about} />}
        />

        <div className={styles.line} />

        <div className={styles.section}>
          <SettingItem title="Social Links" content={teamData.name} />
        </div>

        <div className={styles.line} />

        <div className={styles.section}>
          <SettingItem
            title="Team donation link"
            content={<TextInput placeholder="https://" />}
          />
        </div>
      </div>
    </div>
  );
  */
}

TeamDetails.displayName = "TeamDetails";

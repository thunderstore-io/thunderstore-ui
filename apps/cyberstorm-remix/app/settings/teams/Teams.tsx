import "./Teams.css";
import type { MetaFunction } from "react-router";
import { useOutletContext, useRevalidator } from "react-router";
import {
  Heading,
  Modal,
  NewBreadCrumbs,
  NewButton,
  NewIcon,
  NewLink,
  NewTable,
  NewTextInput,
} from "@thunderstore/cyberstorm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReducer } from "react";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import {
  RequestConfig,
  teamCreate,
  TeamCreateRequestData,
} from "@thunderstore/thunderstore-api";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { postTeamCreate } from "@thunderstore/dapper-ts/src/methods/team";
import { OutletContextShape, RootClientLoader } from "../../root";
import { NamespacedStorageManager } from "@thunderstore/ts-api-react";
import { setSessionStale } from "@thunderstore/ts-api-react/src/SessionContext";

export const meta: MetaFunction<
  unknown,
  {
    root: RootClientLoader;
  }
> = ({ matches }) => {
  const rootData = matches.find((match) => match.id === "root")?.data;
  return [
    { title: `Teams of ${rootData?.currentUser?.username}` },
    {
      name: "description",
      content: `Teams of ${rootData?.currentUser?.username}`,
    },
  ];
};

function formFieldUpdateAction(
  state: TeamCreateRequestData,
  action: {
    field: keyof TeamCreateRequestData;
    value: TeamCreateRequestData[keyof TeamCreateRequestData];
  }
) {
  return {
    ...state,
    [action.field]: action.value,
  };
}

export default function Teams() {
  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;

  return (
    <div className="container container--y container--full layout__content">
      <NewBreadCrumbs>
        <span>
          <span>Teams</span>
        </span>
      </NewBreadCrumbs>
      <PageHeader headingLevel="1" headingSize="2">
        Teams
      </PageHeader>
      <section className="settings-items">
        <div className="settings-items__item">
          <div className="settings-items__meta">
            <p className="settings-items__title">Teams</p>
            <p className="settings-items__description">Manage your teams</p>
            <Modal
              popoverId={"teamsCreateTeam"}
              csSize="small"
              trigger={
                <NewButton
                  popoverTarget="teamsCreateTeam"
                  popoverTargetAction="show"
                >
                  Create Team
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faPlus} />
                  </NewIcon>
                </NewButton>
              }
            >
              <CreateTeamForm config={outletContext.dapper.config} />
            </Modal>
          </div>
          <div className="settings-items__content">
            {currentUser?.teams_full && currentUser.teams_full.length !== 0 ? (
              <NewTable
                titleRowContent={<Heading csLevel="3">Teams</Heading>}
                // csModifiers={["alignLastColumnRight"]}
                headers={[
                  { value: "Team Name", disableSort: false },
                  { value: "Role", disableSort: false },
                  { value: "Members", disableSort: false },
                ]}
                rows={currentUser.teams_full.map((team) => [
                  {
                    value: (
                      <NewLink
                        primitiveType="cyberstormLink"
                        linkId="TeamSettings"
                        key={team.name}
                        team={team.name}
                        csVariant="primary"
                        rootClasses="teams-table__cell teams-table__name"
                      >
                        {team.name}
                      </NewLink>
                    ),
                    sortValue: team.name,
                  },
                  {
                    value: (
                      <p className="teams-table__cell teams-table__role">
                        {team.role}
                      </p>
                    ),
                    sortValue: team.role,
                  },
                  {
                    value: (
                      <p className="teams-table__cell">{team.member_count}</p>
                    ),
                    sortValue: team.member_count,
                  },
                ])}
              />
            ) : (
              <p>No teams found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CreateTeamForm(props: { config: () => RequestConfig }) {
  const revalidator = useRevalidator();
  const toast = useToast();

  async function createTeamRevalidate() {
    setSessionStale(new NamespacedStorageManager("Session"), true);
    revalidator.revalidate();
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    name: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof postTeamCreate>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamCreate({
      data: { name: data.name },
      config: props.config,
      queryParams: {},
      params: {},
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    TeamCreateRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: (fi) => {
      createTeamRevalidate();
      updateFormFieldState({ field: "name", value: "" });
      toast.addToast({
        csVariant: "success",
        children: `Team ${fi.name} created!`,
        duration: 4000,
      });
    },
    onSubmitError: (error) => {
      toast.addToast({
        csVariant: "danger",
        children: `Error occurred: ${error.message || "Unknown error"}`,
        duration: 8000,
      });
    },
  });

  return (
    <div className="modal-content">
      <div className="modal-content__header">Create team</div>
      <div className="modal-content__body create-team-form__body">
        <div>
          Enter the name of the team you wish to create. Team names can contain
          the characters a-z A-Z 0-9 _ and must not start or end with an _.
        </div>
        <div className="create-team-form__input">
          <label className="create-team-form__label" htmlFor="teamName">
            Team Name
          </label>
          <NewTextInput
            onChange={(v) =>
              updateFormFieldState({
                field: "name",
                value: v.target.value,
              })
            }
            placeholder={"MyCoolTeam"}
            id="teamName"
          />
        </div>
      </div>
      <div className="modal-content__footer">
        <NewButton onClick={strongForm.submit} csVariant="accent">
          Create
        </NewButton>
      </div>
    </div>
  );
}

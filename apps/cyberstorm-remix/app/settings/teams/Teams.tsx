import type { MetaFunction } from "react-router";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
  useRouteLoaderData,
} from "react-router";
import {
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
import {
  useEffect,
  useRef,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { TeamCreateRequestData } from "@thunderstore/thunderstore-api";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { DapperTs } from "@thunderstore/dapper-ts";
import { postTeamCreate } from "@thunderstore/dapper-ts/src/methods/team";
import { OutletContextShape, RootClientLoader } from "../../root";
import {
  NamespacedStorageManager,
  updateCurrentUser,
} from "@thunderstore/ts-api-react";

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

// export async function loader() {
//   // console.log("loader context", getSessionTools(context));
//   const dapper = new DapperTs(() => {
//     return {
//       apiHost: import.meta.env.VITE_API_URL,
//       sessionId: undefined,
//     };
//   });
//   return await dapper.getCommunities();
// }

// export async function clientLoader() {
//   // console.log("clientloader context", getSessionTools(context));
//   const dapper = window.Dapper;
//   return await dapper.getCommunities();
// }

export default function Teams() {
  // const uploadData = useLoaderData<typeof loader | typeof clientLoader>();
  // console.log(uploadData);

  // const { config, currentUser } = useLoaderData<typeof clientLoader>();
  const revalidator = useRevalidator();
  const [isRefetching, setIsRefetching] = useState(false);
  // const rootData = useRouteLoaderData<RootClientLoader>("root");

  const outletContext = useOutletContext() as OutletContextShape;
  const currentUser = outletContext.currentUser;

  const toast = useToast();
  console.log("Current user loaded1:", currentUser);

  useEffect(() => {
    console.log("Current user loaded2:", outletContext.currentUser);
    setIsRefetching(false);
  }, [outletContext.currentUser]);

  async function createTeamRevalidate() {
    console.log("Updating current user...");
    const storage = new NamespacedStorageManager("Session");
    await updateCurrentUser(storage);
    console.log("Revalidating loaders");
    if (!isRefetching) {
      setIsRefetching(true);
      // const sleep = (ms: number) =>
      //   new Promise((resolve) => setTimeout(resolve, ms));
      // await sleep(5000); // Simulate a delay for the revalidation
      revalidator.revalidate();
    }
  }

  function formFieldUpdateAction(
    state: TeamCreateRequestData,
    action: {
      field: keyof TeamCreateRequestData;
      value: TeamCreateRequestData[keyof TeamCreateRequestData];
    }
  ) {
    console.log(
      "Updating form field:",
      action.field,
      "with value:",
      action.value
    );
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    name: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof postTeamCreate>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await outletContext.dapper.postTeamCreate(data.name);
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
              <div className="nimbus-commonStyles-modalTempalate">
                <div className="nimbus-commonStyles-modalTempalate__header">
                  Create team
                </div>
                <div className="nimbus-commonStyles-modalTempalate__content">
                  <div>
                    Enter the name of the team you wish to create. Team names
                    can contain the characters a-z A-Z 0-9 _ and must not start
                    or end with an _
                  </div>
                  <div>
                    <NewTextInput
                      placeholder={"ExampleName"}
                      onChange={(v) =>
                        updateFormFieldState({
                          field: "name",
                          value: v.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="nimbus-commonStyles-modalTempalate__footer">
                  <NewButton onClick={strongForm.submit}>Create</NewButton>
                </div>
              </div>
            </Modal>
          </div>
          <div className="settings-items__content">
            {currentUser?.teams_full && currentUser.teams_full.length !== 0 ? (
              <NewTable
                csModifiers={["alignLastColumnRight"]}
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
                        csVariant="cyber"
                      >
                        {team.name}
                      </NewLink>
                    ),
                    sortValue: team.name,
                  },
                  {
                    value: team.role,
                    sortValue: team.role,
                  },
                  {
                    value: team.member_count,
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

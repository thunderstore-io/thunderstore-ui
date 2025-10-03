import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
import {
  ApiError,
  teamDetailsEdit,
  type TeamDetailsEditRequestData,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import "./Profile.css";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer } from "react";
import { NewButton, NewTextInput } from "@thunderstore/cyberstorm";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const tools = getSessionTools();
      const dapper = new DapperTs(() => {
        return {
          apiHost: tools?.getConfig().apiHost,
          sessionId: tools?.getConfig().sessionId,
        };
      });
      return {
        team: await dapper.getTeamDetails(params.namespaceId),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Response("Team not found", { status: 404 });
      } else {
        // REMIX TODO: Add sentry
        throw error;
      }
    }
  }
  throw new Response("Team not found", { status: 404 });
}

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function Profile() {
  const { team } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  const revalidator = useRevalidator();

  const toast = useToast();

  function formFieldUpdateAction(
    state: TeamDetailsEditRequestData,
    action: {
      field: keyof TeamDetailsEditRequestData;
      value: TeamDetailsEditRequestData[keyof TeamDetailsEditRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    donation_link: team.donation_link || "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof teamDetailsEdit>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamDetailsEdit({
      config: outletContext.requestConfig,
      params: { teamIdentifier: team.name },
      data: { donation_link: data.donation_link },
      queryParams: {},
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    TeamDetailsEditRequestData,
    Error,
    SubmitorOutput,
    Error,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      toast.addToast({
        csVariant: "success",
        children: `Changes saved successfully`,
        duration: 4000,
      });
      revalidator.revalidate();
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
    <div className="settings-items team-profile">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Donation Link</p>
        </div>
        <div className="settings-items__content">
          <div className="settings-items__island">
            <div className="team-profile__donationLink">
              <span className="team-profile__label">URL</span>
              <NewTextInput
                name={"donation_link"}
                placeholder={"https://"}
                value={formInputs.donation_link}
                onChange={(e) =>
                  updateFormFieldState({
                    field: "donation_link",
                    value: e.target.value,
                  })
                }
                rootClasses="team-profile__input"
              />
            </div>
          </div>
          <NewButton
            rootClasses="team-profile__save"
            onClick={strongForm.submit}
          >
            Save changes
          </NewButton>
        </div>
      </div>
    </div>
  );
}

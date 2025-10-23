import { type LoaderFunctionArgs } from "react-router";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";
import {
  teamDetailsEdit,
  type TeamDetailsEditRequestData,
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import "./Profile.css";
import { DapperTs } from "@thunderstore/dapper-ts";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { Suspense, useReducer } from "react";
import {
  NewButton,
  NewTextInput,
  SkeletonBox,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  NimbusAwaitErrorElement,
  NimbusDefaultRouteErrorBoundary,
} from "cyberstorm/utils/errors/NimbusErrorBoundary";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { getLoaderTools } from "cyberstorm/utils/getLoaderTools";

type TeamDetails = Awaited<ReturnType<DapperTs["getTeamDetails"]>>;

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const { dapper } = getLoaderTools();
      return {
        team: dapper.getTeamDetails(params.namespaceId),
      };
    } catch (error) {
      handleLoaderError(error);
    }
  }
  throwUserFacingPayloadResponse({
    headline: "Team not found.",
    description: "We could not find the requested team.",
    category: "not_found",
    status: 404,
  });
}

export default function Profile() {
  const { team } = useLoaderData<typeof clientLoader>();
  const outletContext = useOutletContext() as OutletContextShape;

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Await resolve={team} errorElement={<NimbusAwaitErrorElement />}>
        {(result) => (
          <ProfileContent team={result} outletContext={outletContext} />
        )}
      </Await>
    </Suspense>
  );
}

interface ProfileContentProps {
  team: TeamDetails;
  outletContext: OutletContextShape;
}

/**
 * Renders the team profile editing form once Suspense resolves the team data.
 */
function ProfileContent({ team, outletContext }: ProfileContentProps) {
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
    UserFacingError,
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
        children: formatUserFacingError(error),
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

/**
 * Displays a minimal skeleton while team profile data loads.
 */
function ProfileSkeleton() {
  return (
    <div className="settings-items team-profile">
      <SkeletonBox className="team-profile__skeleton" />
    </div>
  );
}

export function ErrorBoundary() {
  return <NimbusDefaultRouteErrorBoundary />;
}

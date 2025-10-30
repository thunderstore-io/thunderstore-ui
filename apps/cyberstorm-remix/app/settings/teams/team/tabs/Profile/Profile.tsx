import { type LoaderFunctionArgs } from "react-router";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
  useRouteError,
} from "react-router";
import {
  ApiError,
  teamDetailsEdit,
  type TeamDetailsEditRequestData,
  UserFacingError,
  formatUserFacingError,
} from "@thunderstore/thunderstore-api";
import { type OutletContextShape } from "~/root";
import "./Profile.css";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { Suspense, useMemo, useReducer } from "react";
import {
  NewAlert,
  NewButton,
  NewTextInput,
  SkeletonBox,
  useToast,
} from "@thunderstore/cyberstorm";
import { throwUserFacingPayloadResponse } from "cyberstorm/utils/errors/userFacingErrorResponse";
import { handleLoaderError } from "cyberstorm/utils/errors/handleLoaderError";
import { resolveRouteErrorPayload } from "cyberstorm/utils/errors/resolveRouteErrorPayload";
import {
  isLoaderError,
  resolveLoaderPromise,
  type LoaderErrorPayload,
  type LoaderResult,
} from "cyberstorm/utils/errors/loaderResult";

type MaybePromise<T> = T | Promise<T>;

type TeamDetails = Awaited<ReturnType<DapperTs["getTeamDetails"]>>;

type LoaderData = {
  team: MaybePromise<LoaderResult<TeamDetails>>;
};

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
      const teamPromise = resolveLoaderPromise(
        dapper.getTeamDetails(params.namespaceId).catch((error) => {
          if (error instanceof ApiError && error.statusCode === 404) {
            throwUserFacingPayloadResponse({
              headline: "Team not found.",
              description: "We could not find the requested team.",
              category: "not_found",
              status: 404,
            });
          }
          throw error;
        })
      );

      return {
        team: teamPromise,
      } satisfies LoaderData;
    } catch (error) {
      // REMIX TODO: Add sentry
      if (error instanceof ApiError && error.statusCode === 404) {
        throwUserFacingPayloadResponse({
          headline: "Team not found.",
          description: "We could not find the requested team.",
          category: "not_found",
          status: 404,
        });
      }
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

export function HydrateFallback() {
  return <div style={{ padding: "32px" }}>Loading...</div>;
}

export default function Profile() {
  const { team } = useLoaderData<typeof clientLoader>() as LoaderData;
  const outletContext = useOutletContext() as OutletContextShape;
  const resolvedTeamPromise = useMemo(() => {
    return Promise.resolve(team) as Promise<LoaderResult<TeamDetails>>;
  }, [team]);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Await resolve={resolvedTeamPromise}>
        {(result) =>
          isLoaderError(result) ? (
            <ProfileAwaitError payload={result.__error} />
          ) : (
            <ProfileContent team={result} outletContext={outletContext} />
          )
        }
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
 * Shows a friendly alert when the team profile promise resolves with an error payload.
 */
function ProfileAwaitError(props: { payload: LoaderErrorPayload }) {
  const { payload } = props;

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
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

/**
 * Maps thrown loader errors to an alert for the profile tab.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const payload = resolveRouteErrorPayload(error);

  return (
    <NewAlert csVariant="danger">
      <strong>{payload.headline}</strong>
      {payload.description ? ` ${payload.description}` : ""}
    </NewAlert>
  );
}

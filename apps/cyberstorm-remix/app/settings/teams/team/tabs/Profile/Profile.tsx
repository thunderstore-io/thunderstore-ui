import { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "@remix-run/react";
import {
  FormSubmitButton,
  FormTextInput,
  // TeamDetailsEdit,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { ApiError, teamDetailsEdit } from "@thunderstore/thunderstore-api";
import {
  ApiForm,
  teamDetailsEditFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { OutletContextShape } from "~/root";
import "./Profile.css";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId) {
    try {
      const dapper = window.Dapper;
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

  async function teamProfileRevalidate() {
    revalidator.revalidate();
  }

  const { onSubmitSuccess, onSubmitError } = useFormToaster({
    successMessage: "Changes saved",
  });

  return (
    <div className="nimbus-settings-team-profile nimbus-settingsItems">
      <ApiForm
        onSubmitSuccess={() => {
          onSubmitSuccess();
          teamProfileRevalidate();
        }}
        onSubmitError={onSubmitError}
        schema={teamDetailsEditFormSchema}
        meta={{ teamIdentifier: team.name }}
        endpoint={teamDetailsEdit}
        formProps={{ className: "nimbus-settingsItems__item __form" }}
        config={outletContext.requestConfig}
      >
        <div className="nimbus-settingsItems__meta __meta">
          <p className="nimbus-settingsItems__title">Team donation link</p>
          <p className="nimbus-settingsItems__description">
            For example shown in the teams packages pages
          </p>
        </div>
        <div className="nimbus-settingsItems__content __content">
          <div className="nimbus-settingsItems__item">
            <div className="__donationLink">
              <span className="__label">URL</span>
              <FormTextInput
                schema={teamDetailsEditFormSchema}
                name={"donation_link"}
                placeholder={"https://"}
                existingValue={
                  team.donation_link === null ? undefined : team.donation_link
                }
                rootClasses="__input"
              />
            </div>
          </div>
          <FormSubmitButton rootClasses="__save">Save changes</FormSubmitButton>
        </div>
      </ApiForm>
    </div>
  );
}

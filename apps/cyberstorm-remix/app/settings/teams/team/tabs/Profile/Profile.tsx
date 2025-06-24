import { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext, useRevalidator } from "react-router";
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
    <div className="settings-items team-profile">
      <ApiForm
        onSubmitSuccess={() => {
          onSubmitSuccess();
          teamProfileRevalidate();
        }}
        onSubmitError={onSubmitError}
        schema={teamDetailsEditFormSchema}
        meta={{ teamIdentifier: team.name }}
        endpoint={teamDetailsEdit}
        formProps={{ className: "settings-items__item" }}
        config={outletContext.requestConfig}
      >
        <div className="settings-items__meta">
          <p className="settings-items__title">Team donation link</p>
          <p className="settings-items__description">
            For example shown in the teams packages pages
          </p>
        </div>
        <div className="settings-items__content">
          <div className="settings-items__island">
            <div className="team-profile__donationLink">
              <span className="team-profile__label">URL</span>
              <FormTextInput
                schema={teamDetailsEditFormSchema}
                name={"donation_link"}
                placeholder={"https://"}
                existingValue={
                  team.donation_link === null ? undefined : team.donation_link
                }
                rootClasses="team-profile__input"
              />
            </div>
          </div>
          <FormSubmitButton rootClasses="team-profile__save">
            Save changes
          </FormSubmitButton>
        </div>
      </ApiForm>
    </div>
  );
}

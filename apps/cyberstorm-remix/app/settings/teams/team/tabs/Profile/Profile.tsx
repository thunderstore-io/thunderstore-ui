import { type OutletContextShape } from "app/root";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { makeTeamSettingsTabLoader } from "cyberstorm/utils/dapperClientLoaders";
import { isTeamOwner } from "cyberstorm/utils/permissions";
import { Suspense, useReducer } from "react";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router";
import {
  FormSection,
  FormSections,
} from "~/commonComponents/FormSection/FormSection";
import { Island } from "~/commonComponents/Island/Island";

import {
  NewAlert,
  NewButton,
  NewTextInput,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type TeamDetails,
  type TeamDetailsEditRequestData,
  extractApiErrorMessage,
  extractApiFieldErrorMessage,
  teamDetailsEdit,
} from "@thunderstore/thunderstore-api";

import "./Profile.css";

export const clientLoader = makeTeamSettingsTabLoader(
  async (dapper, teamName) => {
    const team = await dapper.getPrivateTeamDetails(teamName);
    return { team };
  }
);

export default function Profile() {
  const { team } = useLoaderData<typeof clientLoader>();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={team}>
        {(resolvedTeam) => (
          <FormSections rootClasses="team-profile">
            <ProfileForm team={resolvedTeam} />
          </FormSections>
        )}
      </Await>
    </Suspense>
  );
}

function ProfileForm(props: { team: TeamDetails }) {
  const { team } = props;
  const outletContext = useOutletContext() as OutletContextShape;
  const revalidator = useRevalidator();
  const toast = useToast();

  const formDisabled = !isTeamOwner(team.name, outletContext.currentUser);

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
    validators: {
      donation_link: {
        httpsUrl: true,
        maxLength: 1024,
      },
    },
    refiner: async (inputs: typeof formInputs) => ({
      donation_link: nullForEmptyString(inputs.donation_link),
    }),
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
      const fieldError = extractApiFieldErrorMessage(error, "donation_link");

      if (fieldError) {
        strongForm.setInputErrors({
          donation_link: [fieldError],
        });
        return;
      }

      strongForm.setInputErrors((prev) =>
        prev ? { ...prev, donation_link: undefined } : prev
      );

      toast.addToast({
        csVariant: "danger",
        children: extractApiErrorMessage(error),
        duration: 8000,
      });
    },
  });

  const donationLinkFieldProps = strongForm.getFieldComponentProps(
    "donation_link",
    { disabled: formDisabled }
  );

  return (
    <FormSection title="Donation Link" description="Must be a valid HTTPS URL">
      <Island rootClasses="team-profile__island">
        <div className="team-profile__donationLink">
          <label className="team-profile__label" htmlFor="donation_link_input">
            URL
          </label>
          <NewTextInput
            id="donation_link_input"
            name={"donation_link"}
            placeholder={"https://"}
            value={formInputs.donation_link ?? ""}
            onChange={(e) =>
              updateFormFieldState({
                field: "donation_link",
                value: e.target.value,
              })
            }
            clearValue={
              formDisabled
                ? undefined
                : () =>
                    updateFormFieldState({
                      field: "donation_link",
                      value: "",
                    })
            }
            rootClasses="team-profile__input"
            disabled={formDisabled}
            {...donationLinkFieldProps}
          />
        </div>
      </Island>
      {strongForm.getFieldState("donation_link").isInvalid &&
        !strongForm.inputErrors?.donation_link?.[0] && (
          <NewAlert csVariant="danger" csSize="small">
            {strongForm.getFieldError("donation_link")}
          </NewAlert>
        )}
      {strongForm.inputErrors?.donation_link?.[0] && (
        <NewAlert csVariant="danger" csSize="small">
          {strongForm.inputErrors.donation_link[0]}
        </NewAlert>
      )}
      <NewButton
        rootClasses="team-profile__save"
        onClick={strongForm.handleSubmit}
        disabled={formDisabled}
      >
        Save changes
      </NewButton>
    </FormSection>
  );
}

ProfileForm.displayName = "ProfileForm";

const nullForEmptyString = (value: string | null): string | null =>
  value?.trim() === "" ? null : value;

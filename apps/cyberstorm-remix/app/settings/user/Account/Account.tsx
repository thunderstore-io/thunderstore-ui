import { useOutletContext } from "react-router";
import "./Account.css";
import {
  NewAlert,
  NewButton,
  NewIcon,
  NewTextInput,
} from "@thunderstore/cyberstorm";
import { faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NotLoggedIn } from "~/commonComponents/NotLoggedIn/NotLoggedIn";
import { type OutletContextShape } from "~/root";
import { useToast } from "@thunderstore/cyberstorm/src/newComponents/Toast/Provider";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer } from "react";
import { userDelete } from "@thunderstore/thunderstore-api";

export default function Account() {
  const outletContext = useOutletContext() as OutletContextShape;

  if (!outletContext.currentUser || !outletContext.currentUser.username)
    return <NotLoggedIn />;

  return (
    <div className="settings-items user-account">
      <div className="settings-items__item">
        <div className="settings-items__meta">
          <p className="settings-items__title">Delete Account</p>
          <p className="settings-items__description">
            Delete your Thunderstore account permanently
          </p>
        </div>
        <div className="settings-items__content">
          <div className="user-account__delete-user-form">
            <NewAlert csVariant="warning">
              You are about to delete your account. Once deleted, it will be
              gone forever. Please be certain.
            </NewAlert>
            <p className="user-account__instructions">
              The mods that have been uploaded on this account will remain
              public on the site even after deletion. If you need them to be
              taken down as well, please contact an administrator on the
              community Discord server.
              <br />
              <span>
                As a precaution, to delete your account, please input{" "}
                <span className="user-account__username">
                  {outletContext.currentUser.username}
                </span>{" "}
                into the field below.
              </span>
            </p>
            <div className="user-account__actions">
              <DeleteAccountForm
                currentUser={outletContext.currentUser}
                requestConfig={outletContext.requestConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type UserAccountDeleteRequestData = {
  verification: string;
};

function DeleteAccountForm(props: {
  currentUser: OutletContextShape["currentUser"];
  requestConfig: OutletContextShape["requestConfig"];
}) {
  const toast = useToast();

  function formFieldUpdateAction(
    state: UserAccountDeleteRequestData,
    action: {
      field: keyof UserAccountDeleteRequestData;
      value: UserAccountDeleteRequestData[keyof UserAccountDeleteRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    verification: "",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof userDelete>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    if (!props.currentUser || !props.currentUser.username)
      throw new Error("User not logged in");
    if (data.verification !== props.currentUser.username)
      throw new Error("Verification input does not match username");
    return await userDelete({
      config: props.requestConfig,
      params: { username: props.currentUser.username },
      queryParams: {},
      data: {},
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    UserAccountDeleteRequestData,
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
        children: `Account deleted successfully`,
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
    <>
      <NewTextInput
        onChange={(e) => {
          updateFormFieldState({
            field: "verification",
            value: e.target.value,
          });
        }}
        placeholder={"Verification..."}
        rootClasses="user-account__verification-input"
      />
      <NewButton onClick={strongForm.submit} csVariant="danger">
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faTrashCan} />
        </NewIcon>
        I understand this action is irrevocable and want to continue
      </NewButton>
    </>
  );
}

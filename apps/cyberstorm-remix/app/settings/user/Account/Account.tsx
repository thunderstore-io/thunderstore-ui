import { useLoaderData } from "@remix-run/react";
import "./Account.css";
import { NewAlert, NewIcon } from "@thunderstore/cyberstorm";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import {
  ApiForm,
  userDeleteFormSchema,
} from "@thunderstore/ts-api-react-forms";
import { userDelete } from "../../../../../../packages/thunderstore-api/src";
import {
  clearSession,
  getConfig,
  getSessionCurrentUser,
  NamespacedStorageManager,
} from "@thunderstore/ts-api-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export async function clientLoader() {
  const _storage = new NamespacedStorageManager("Session");
  const currentUser = getSessionCurrentUser(_storage, true, undefined, () => {
    clearSession(_storage);
    throw new Response("Your session has expired, please log in again", {
      status: 401,
    });
    // redirect("/");
  });

  if (
    !currentUser.username ||
    (currentUser.username && currentUser.username === "")
  ) {
    clearSession(_storage);
    throw new Response("Not logged in.", { status: 401 });
  } else {
    return {
      config: getConfig(_storage),
      currentUser: currentUser,
    };
  }
}

export function HydrateFallback() {
  return "Loading...";
}

export default function Account() {
  const { config, currentUser } = useLoaderData<typeof clientLoader>();

  const toast = useFormToaster({
    successMessage: `User ${currentUser.username} deleted`,
  });

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
          <ApiForm
            {...toast}
            schema={userDeleteFormSchema}
            endpoint={userDelete}
            formProps={{ className: "user-account__delete-user-form" }}
            meta={{}}
            config={() => config}
          >
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
                  {currentUser.username}
                </span>{" "}
                into the field below.
              </span>
            </p>
            <div className="user-account__actions">
              <FormTextInput
                schema={userDeleteFormSchema}
                name={"verification"}
                placeholder={"Verification..."}
              />
              <FormSubmitButton csVariant="danger">
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faTrashCan} />
                </NewIcon>
                I understand this action is irrevocable and want to continue
              </FormSubmitButton>
            </div>
          </ApiForm>
        </div>
      </div>
    </div>
  );
}

Account.displayName = "Account";

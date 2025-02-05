import { useLoaderData } from "@remix-run/react";
import "./Account.css";
import { NewAlert, NewIcon } from "@thunderstore/cyberstorm";
import {
  FormSubmitButton,
  FormTextInput,
  useFormToaster,
} from "@thunderstore/cyberstorm-forms";
import { currentUserSchema } from "@thunderstore/dapper-ts";
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
      currentUser: currentUser as typeof currentUserSchema._type,
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
    <div className="nimbus-settingsItems">
      <div className="nimbus-settingsItems__item">
        <div className="nimbus-settingsItems__meta">
          <p className="nimbus-settingsItems__title">Delete Account</p>
          <p className="nimbus-settingsItems__description">
            Delete your Thunderstore account permanently
          </p>
        </div>
        <div className="nimbus-settingsItems__content nimbus-settings-user-account">
          <ApiForm
            {...toast}
            schema={userDeleteFormSchema}
            endpoint={userDelete}
            formProps={{ className: "__deleteUserForm" }}
            meta={{}}
            config={() => config}
          >
            <NewAlert csVariant="warning">
              You are about to delete your account. Once deleted, it will be
              gone forever. Please be certain.
            </NewAlert>
            <p className="__instructions">
              The mods that have been uploaded on this account will remain
              public on the site even after deletion. If you need them to be
              taken down as well, please contact an administrator on the
              community Discord server.
              <br />
              <span>
                As a precaution, to delete your account, please input{" "}
                <span className="__username">{currentUser.username}</span> into
                the field below.
              </span>
            </p>
            <div className="__actions">
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

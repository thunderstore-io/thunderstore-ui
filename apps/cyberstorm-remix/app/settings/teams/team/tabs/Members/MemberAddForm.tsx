import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStrongForm } from "cyberstorm/utils/StrongForm/useStrongForm";
import { useReducer, useState } from "react";

import {
  Modal,
  NewButton,
  NewIcon,
  NewSelect,
  NewTextInput,
  type SelectOption,
  useToast,
} from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  type TeamAddMemberRequestData,
  UserFacingError,
  teamAddMember,
} from "@thunderstore/thunderstore-api";

const roleOptions: SelectOption<"owner" | "member">[] = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
];

export function MemberAddForm(props: {
  teamName: string;
  updateTrigger: () => Promise<void>;
  config: () => RequestConfig;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  function formFieldUpdateAction(
    state: TeamAddMemberRequestData,
    action: {
      field: keyof TeamAddMemberRequestData;
      value: TeamAddMemberRequestData[keyof TeamAddMemberRequestData];
    }
  ) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

  const [formInputs, updateFormFieldState] = useReducer(formFieldUpdateAction, {
    username: "",
    role: "member",
  });

  type SubmitorOutput = Awaited<ReturnType<typeof teamAddMember>>;

  async function submitor(data: typeof formInputs): Promise<SubmitorOutput> {
    return await teamAddMember({
      config: props.config,
      params: { team_name: props.teamName },
      queryParams: {},
      data: { username: data.username, role: data.role },
    });
  }

  type InputErrors = {
    [key in keyof typeof formInputs]?: string | string[];
  };

  const strongForm = useStrongForm<
    typeof formInputs,
    TeamAddMemberRequestData,
    Error,
    SubmitorOutput,
    UserFacingError,
    InputErrors
  >({
    inputs: formInputs,
    submitor,
    onSubmitSuccess: () => {
      props.updateTrigger();
      toast.addToast({
        csVariant: "success",
        children: `Team member added`,
        duration: 4000,
      });
      setOpen(false);
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
    <Modal
      open={open}
      onOpenChange={setOpen}
      titleContent="Add Team Member"
      csSize="small"
      trigger={
        <NewButton>
          Add Member
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faPlus} />
          </NewIcon>
        </NewButton>
      }
    >
      <Modal.Body>
        <div className="add-member-form__text">
          Enter the username of the user you wish to add to the team{" "}
          <span className="add-member-form__text--bold">{props.teamName}</span>.
        </div>
        <div className="add-member-form__fields">
          <div className="add-member-form__field add-member-form__username">
            <label className="add-member-form__label" htmlFor="username">
              Username
            </label>
            <NewTextInput
              name={"username"}
              placeholder={"Enter username..."}
              value={formInputs.username}
              onChange={(e) => {
                updateFormFieldState({
                  field: "username",
                  value: e.target.value,
                });
              }}
              rootClasses="add-member-form__username-input"
              id="username"
            />
          </div>
          <div className="add-member-form__field">
            <label className="add-member-form__label" htmlFor="role">
              Role
            </label>
            <NewSelect
              name={"role"}
              placeholder="Select role..."
              options={roleOptions}
              defaultValue="member"
              value={formInputs.role}
              onChange={(value) => {
                updateFormFieldState({ field: "role", value: value });
              }}
              id="role"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <NewButton csVariant="accent" onClick={strongForm.submit}>
          Add member
        </NewButton>
      </Modal.Footer>
    </Modal>
  );
}

MemberAddForm.displayName = "MemberAddForm";

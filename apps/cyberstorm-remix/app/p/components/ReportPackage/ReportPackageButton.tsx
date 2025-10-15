import { NewButton, NewIcon } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlagSwallowtail } from "@fortawesome/pro-solid-svg-icons";

export function ReportPackageButton(props: { onClick: () => void }) {
  return (
    <NewButton
      onClick={props.onClick}
      tooltipText="Report Package"
      csVariant="secondary"
      csModifiers={["only-icon"]}
    >
      <NewIcon csMode="inline" noWrapper>
        <FontAwesomeIcon icon={faFlagSwallowtail} />
      </NewIcon>
    </NewButton>
  );
}

ReportPackageButton.displayName = "ReportPackageButton";

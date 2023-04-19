import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import { useQuery } from "react-query";
import { apiFetch } from "../fetch";
import { Select, SelectProps, SelectOption } from "./Select";
import { ThunderstoreContext } from "./ThunderstoreProvider";

type TeamSelectOption = SelectOption & {
  teamName: string;
};

type TeamPickerProps = Pick<
  SelectProps<TeamSelectOption>,
  "disabled" | "onChange"
>;

export function TeamPicker(props: TeamPickerProps) {
  const { disabled = false, onChange } = props;
  const context = useContext(ThunderstoreContext);
  const { isLoading, data } = useQuery("userInfo", async () => {
    const r = await apiFetch(context, "/experimental/current-user/");
    return await r.json();
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data) {
    return <Text>Failed to fetch</Text>;
  }

  const options: TeamSelectOption[] = data.teams.map((teamName: string) => ({
    label: teamName,
    value: teamName,
    teamName: teamName,
  }));

  return <Select options={options} disabled={disabled} onChange={onChange} />;
}

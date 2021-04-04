import { TeamPicker } from "@thunderstore/components";
import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

const CommunityPickerPage: React.FC<Record<string, never>> = () => {
  const [disabled, setDisabled] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);

  return (
    <Box p={2}>
      <Button
        mb={2}
        onClick={() => {
          setDisabling(true);
          setTimeout(() => {
            setDisabled(!disabled);
            setDisabling(false);
          }, 1000);
        }}
        disabled={disabling}
      >
        {disabled ? "Enable" : "Disable"}
      </Button>
      <Text>Team name: {teamName}</Text>
      <TeamPicker
        disabled={disabled}
        onChange={(option) => setTeamName(option?.teamName || null)}
      />
    </Box>
  );
};

export default CommunityPickerPage;

import { Community, MultiCommunityPicker } from "@thunderstore/components";
import React, { useState } from "react";
import { Box, Button, List, ListItem } from "@chakra-ui/react";

const CommunityPickerPage: React.FC<Record<string, never>> = () => {
  const [disabled, setDisabled] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);

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
      {communities && (
        <List mb={2}>
          {communities.map((community) => (
            <ListItem key={community.identifier}>{community.identifier}</ListItem>
          ))}
        </List>
      )}
      <MultiCommunityPicker
        disabled={disabled}
        onChange={(options) => {
          setCommunities(options.map((option) => option.community));
        }}
      />
    </Box>
  );
};

export default CommunityPickerPage;

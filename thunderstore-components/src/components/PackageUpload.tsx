import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import { FileUpload } from "./FileUpload";
import { Markdown } from "./Markdown";
import { StickyFooter } from "./StickyFooter";

interface PackageUploadFormProps {
  readmeContent: string;
}

const PackageUploadForm: React.FC<PackageUploadFormProps> = ({ readmeContent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Heading>Markdown Preview</Heading>
      <Box borderWidth="1px" borderRadius="lg" m={1} p={2}>
        <Markdown>{readmeContent}</Markdown>
      </Box>
      <StickyFooter>
        <Center>
          <Button ref={btnRef} onClick={onOpen}>
            Upload
          </Button>
        </Center>
      </StickyFooter>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Upload package</DrawerHeader>
            <DrawerBody>
              <Stack>
                <Box>
                  <Heading as="h2" size="md">
                    Team
                  </Heading>
                  <Select>
                    <option value="Team1">Team1</option>
                    <option value="Team2">Team2</option>
                    <option value="Team3">Team3</option>
                  </Select>
                </Box>
                <Box>
                  <Heading as="h2" size="md">
                    Categories
                  </Heading>
                  <Select>
                    <option value="category-slug-1">Category name 1</option>
                    <option value="category-slug-2">Category name 2</option>
                    <option value="category-slug-3">Category name 3</option>
                  </Select>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button>Upload</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export const PackageUpload: React.FC<never> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [zip, setZip] = useState<JSZip | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    onUpload();
  }, [file]);

  useEffect(() => {
    onZip();
  }, [zip]);

  const reset = () => {
    setFile(null);
    setZip(null);
  };

  const onUpload = async () => {
    if (file === null) {
      return;
    }
    const zip = new JSZip();
    await zip.loadAsync(file);
    setZip(zip);
  };

  const onZip = async () => {
    if (zip === null) {
      return;
    }
    console.log(zip);
    console.log(await zip.file("manifest.json")?.async("string"));
    const errors: string[] = [];
    ["manifest.json", "README.md", "icon.png"].forEach((fileName) => {
      if (zip.files[fileName] === undefined) {
        errors.push(`Missing ${fileName}`);
      }
    });
    if (errors.length > 0) {
      errors.map((error) => {
        toast({
          title: "Invalid mod zip",
          description: error,
          status: "error",
          isClosable: true,
        });
      });
      reset();
      return;
    }
    const readmeContent = await zip.file("README.md")?.async("string");
    if (!readmeContent) {
      toast({
        title: "Invalid mod zip",
        description: "Invalid README.md",
        status: "error",
        isClosable: true,
      });
      reset();
      return;
    }
    setReadmeContent(readmeContent);
  };

  if (!file) {
    // First state, has not selected a file
    return (
      <FileUpload
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (!event.target.files) {
            return;
          }
          setFile(event.target.files[0]);
        }}
      />
    );
  } else if (!zip) {
    // Second state, has selected a file but it has not been decompressed
    return <Text>Decompressing...</Text>;
  } else if (readmeContent !== null) {
    // Third state, the file has been validated and decompressed
    return <PackageUploadForm readmeContent={readmeContent} />;
  } else {
    return <Text>Loading...</Text>;
  }
};

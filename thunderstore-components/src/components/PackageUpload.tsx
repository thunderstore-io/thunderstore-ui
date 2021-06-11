import {
  Box,
  Button,
  Center,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import JSZip from "jszip";
import React, { useContext, useEffect, useState } from "react";
import { Controller, NestedValue, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { apiFetch } from "../fetch";
import { MultiCommunityPicker } from "./CommunityPicker";
import { FileUpload } from "./FileUpload";
import { Markdown } from "./Markdown";
import { StickyFooter } from "./StickyFooter";
import { TeamPicker } from "./TeamPicker";
import { ThunderstoreContext } from "./ThunderstoreProvider";

interface PackageUploadFormProps {
  readmeContent: string;
  modZip: File;
}

interface PackageUploadFormInputs {
  author_name: string;
  communities: NestedValue<string[]>;
  has_nsfw_content: boolean;
  categories: [];
}

const PackageUploadForm: React.FC<PackageUploadFormProps> = ({
  readmeContent,
  modZip,
}) => {
  const { isOpen, onOpen, onClose: closeDrawer } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    formState,
    control,
    reset,
  } = useForm<PackageUploadFormInputs>();
  const context = useContext(ThunderstoreContext);

  const onClose = () => {
    closeDrawer();
    reset();
  };

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
            <form
              onSubmit={handleSubmit(
                async (data) => {
                  data.categories = [];

                  const formData = new FormData();
                  formData.append("metadata", JSON.stringify(data));
                  formData.append("file", modZip);
                  await apiFetch(context, "/experimental/package/upload/", {
                    method: "POST",
                    body: formData,
                  });
                },
                (errors, e) => {
                  console.log(errors, e);
                }
              )}
            >
              <DrawerBody>
                <Stack>
                  <FormControl isInvalid={!!formState.errors.author_name}>
                    <FormLabel>Team</FormLabel>
                    <Controller
                      name="author_name"
                      render={({ field }) => (
                        <TeamPicker
                          onChange={(option) =>
                            field.onChange(option?.teamName || null)
                          }
                          disabled={formState.isSubmitting}
                        />
                      )}
                      rules={{ required: "Team is required" }}
                      control={control}
                    />
                    {formState.errors.author_name?.message && (
                      <FormErrorMessage>
                        {formState.errors.author_name.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!formState.errors.communities}>
                    <FormLabel>Communities</FormLabel>
                    <Controller
                      name="communities"
                      render={({ field }) => (
                        <MultiCommunityPicker
                          onChange={(options) =>
                            field.onChange(
                              options.map((option) => option.community.identifier)
                            )
                          }
                          disabled={formState.isSubmitting}
                        />
                      )}
                      rules={{ required: "At least one community is required" }}
                      control={control}
                    />
                    {formState.errors.communities?.message && (
                      <FormErrorMessage>
                        {formState.errors.communities.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!formState.errors.has_nsfw_content}>
                    <Checkbox
                      {...register("has_nsfw_content")}
                      disabled={formState.isSubmitting}
                    >
                      Has NSFW content
                    </Checkbox>
                    {formState.errors.has_nsfw_content?.message && (
                      <FormErrorMessage>
                        {formState.errors.has_nsfw_content.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Stack>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={formState.isSubmitting}>
                  Upload
                </Button>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export const PackageUpload: React.FC<Record<string, never>> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [zip, setZip] = useState<JSZip | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const toast = useToast();
  const context = useContext(ThunderstoreContext);

  useEffect(() => {
    onUpload();
  }, [file]);

  useEffect(() => {
    onZip();
  }, [zip]);

  let isReset = false;
  const reset = () => {
    isReset = true;
    setFile(null);
    setZip(null);
    setReadmeContent(null);
  };

  const onUpload = async () => {
    if (file === null) {
      return;
    }
    const zip = new JSZip();
    try {
      await zip.loadAsync(file);
    } catch {
      toast({
        title: "Invalid mod zip",
        status: "error",
        isClosable: true,
      });
      reset();
      return;
    }
    setZip(zip);
  };

  const onZip = async () => {
    if (zip === null) {
      return;
    }
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

  const packageUploadInfoQuery = useQuery("packageUploadInfo", async () => {
    const r = await apiFetch(context, "/experimental/package/upload/");
    return await r.json();
  });

  useEffect(() => {
    if (!file || !packageUploadInfoQuery.data?.max_package_size_bytes) {
      return;
    }
    if (file.size > packageUploadInfoQuery.data.max_package_size_bytes) {
      toast({
        title: "Mod zip too large",
        description: `Mod zip must be smaller than ${packageUploadInfoQuery.data.max_package_size_bytes} bytes`,
        status: "error",
        isClosable: true,
      });
      reset();
    }
  }, [packageUploadInfoQuery.data, file]);

  if (isReset) {
    // Same render as zip being marked as invalid
    return <Text>Loading...</Text>;
  } else if (!file) {
    // First state, has not selected a file
    return (
      <FileUpload
        onUpload={(files) => {
          setFile(files[0]);
        }}
        accept="application/zip"
      />
    );
  } else if (!zip) {
    // Second state, has selected a file but it has not been decompressed
    return <Text>Decompressing...</Text>;
  } else if (readmeContent !== null) {
    // Third state, the file has been validated and decompressed
    return <PackageUploadForm readmeContent={readmeContent} modZip={file} />;
  } else {
    return <Text>Loading...</Text>;
  }
};

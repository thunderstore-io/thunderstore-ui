import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer, Heading, PackageDetailLayout } from "@thunderstore/cyberstorm";
import React from "react";

const meta = {
  title: "Cyberstorm/Layouts/PackageDetailLayout",
  component: PackageDetailLayout,
} as ComponentMeta<typeof PackageDetailLayout>;

const Template: ComponentStory<typeof PackageDetailLayout> = (args) => (
  <div>
    <Heading />
    <PackageDetailLayout {...args} />
    <Footer />
  </div>
);

const defaultArgs = {
  title: "V Rising Epic Hardcore Mode",
  description:
    "If you believe from the evidence that Ms. Heard or Mr. Depp previously " +
    "made a statement inconsistent with her or his testimony at this trial, that " +
    "previous statement may be considered by you as evidence that what " +
    "Ms. Heard or Mr. Depp previously said was true. \n\n" +
    "In reaching your verdict in this case, you are to consider the testimony " +
    "and evidence. Sometimes, attorneys stated objections during the course " +
    "of this trial and instructed the witness not to answer a question. " +
    "Objections and instructions to witnesses are not evidence and you may " +
    "not consider them in reaching your verdict, nor are you to draw any " +
    "inference from the fact that an objection was made. \n\n" +
    "You must not consider any matter that was rejected or stricken by the " +
    "court. It is not evidence and should be discarded. Any amount of " +
    "damages requested by a party is not evidence in this case. You should " +
    "not consider it as evidence in arriving at your verdict. \n\n" +
    "If you find your verdict for Mr. Depp or Ms. Heard, then he or she is " +
    "entitled to recover compensatory damages without any proof of actual or " +
    "pecuniary injury. As a result, injury to Mr. Depp or Ms. Heard's personal " +
    "and business reputation, humiliation, embarrassment is presumed. If " +
    "you find either party liable for defamation then in determining the amount " +
    "of damages to which the opposing party is entitled, you may take into " +
    "consideration all the circumstances surrounding the defamatory " +
    "statements, the occasions on which they were made, and the extent of " +
    "their publication, the nature and character of the insult, the probable " +
    "effect on those who heard the statements, and their probable and " +
    "natural effect upon the defamed party's personal feelings and upon his " +
    "or her standing in the community and in business. ",
};

const DefaultPackageDetailLayout = Template.bind({});
DefaultPackageDetailLayout.args = defaultArgs;

export { meta as default, DefaultPackageDetailLayout };

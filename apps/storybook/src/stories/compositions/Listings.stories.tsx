import { AdContainer } from "@cs/newComponents/AdContainer/AdContainer";
import { Button } from "@cs/newComponents/Button/Button";
import { CardCommunity } from "@cs/newComponents/Card/CardCommunity/CardCommunity";
import { CardPackage } from "@cs/newComponents/Card/CardPackage/CardPackage";
import { Drawer } from "@cs/newComponents/Drawer/Drawer";
import { MetaItem } from "@cs/newComponents/MetaItem/MetaItem";
import { MetaItemSizesList } from "@cs/newComponents/MetaItem/MetaItem.types";
import { Modal } from "@cs/newComponents/Modal/Modal";
import { ModalSizesList } from "@cs/newComponents/Modal/Modal.types";
import { Pagination } from "@cs/newComponents/Pagination/Pagination";
import { Table } from "@cs/newComponents/Table/Table";
import { TableModifiersList } from "@cs/newComponents/Table/Table.types";
import { Tag } from "@cs/newComponents/Tag/Tag";
import {
  TagModifiersList,
  TagSizesList,
  TagVariantsList,
} from "@cs/newComponents/Tag/Tag.types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SideBySide, States, compositionParameters } from "./compare";
import {
  community,
  modPackage,
  plainPackage,
  tableHeaders,
  tableRows,
} from "./fixtures";

/**
 * Featuring: CardPackage, CardCommunity, Tag, MetaItem, Pagination, Table,
 * AdContainer. Modal and Drawer are mounted closed here; their open panels
 * are separate overlay stories. LocalDateTime is not featured. See the
 * featuring rule in compare.tsx.
 */
const meta = {
  title: "Compositions/Listings",
  tags: ["autodocs"],
  parameters: {
    ...compositionParameters,
    docs: {
      description: {
        component:
          "Package and community listings: package card, community card, tag, meta item, pagination, table, and ad container, plus the closed modal and drawer. Modal and Drawer stay closed here. An open modal scroll-locks the page and both are position-fixed or top-layer popovers, so their open panels are Compositions/Overlays/Modal and Drawer. The rows under the layout are the variant, size, and modifier states from the component stories.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function pageChange() {}

function Listings({ scope }: { scope: string }) {
  return (
    <div className="cs-page">
      <div className="cs-page__row">
        <Tag>Mod</Tag>
        <Tag csVariant="blue">Client</Tag>
        <MetaItem>1 234</MetaItem>
        <MetaItem csSize="14">56</MetaItem>
      </div>
      <div className="cs-page__cards">
        <div style={{ width: 224 }}>
          <CardPackage packageData={modPackage} isLiked={false} priority />
        </div>
        <div style={{ width: 224 }}>
          <CardPackage packageData={plainPackage} isLiked />
        </div>
        <div style={{ width: 192 }}>
          <CardCommunity community={community} isPopular isNew />
        </div>
        <div style={{ width: 192 }}>
          <CardCommunity community={community} />
        </div>
      </div>
      <Table headers={tableHeaders} rows={tableRows} sortByHeader={0} />
      <Pagination
        currentPage={1}
        onPageChange={pageChange}
        totalCount={100}
        pageSize={10}
        siblingCount={2}
      />
      <AdContainer
        containerId={`${scope}-listing-ad`}
        sizeVariant="display-300-250"
      />
      <div className="cs-page__row">
        <Modal
          trigger={<Button csVariant="secondary">Report package</Button>}
          titleContent="Report package"
          footerContent="Submit"
        >
          This package breaks multiplayer.
        </Modal>
        <Drawer
          popoverId={`${scope}-listing-drawer`}
          trigger={<Button csVariant="secondary">Filters</Button>}
        >
          <div style={{ padding: 16 }}>Filter by tag</div>
        </Drawer>
      </div>

      <States title="Tag variants">
        {TagVariantsList.map((variant) => (
          <Tag key={variant} csVariant={variant}>
            {variant}
          </Tag>
        ))}
      </States>
      <States title="Tag sizes, modifiers, and modes">
        {TagSizesList.map((size) => (
          <Tag key={size} csSize={size}>
            {size}
          </Tag>
        ))}
        {TagModifiersList.map((modifier) => (
          <Tag key={modifier} csModifiers={[modifier]} csVariant="blue">
            {modifier}
          </Tag>
        ))}
        <Tag csMode="tag">Tag</Tag>
        <Tag csMode="button">Button</Tag>
        <Tag csMode="link" href="#tag">
          Link
        </Tag>
      </States>
      <States title="Meta item sizes">
        {MetaItemSizesList.map((size) => (
          <MetaItem key={size} csSize={size}>
            {size}
          </MetaItem>
        ))}
      </States>
      <States title="Table modifier">
        {TableModifiersList.map((modifier) => (
          <Table
            key={modifier}
            headers={tableHeaders}
            rows={tableRows}
            csModifiers={[modifier]}
          />
        ))}
      </States>
      <States title="Pagination">
        <Pagination
          currentPage={5}
          onPageChange={pageChange}
          totalCount={100}
          pageSize={10}
          siblingCount={2}
        />
        <Pagination
          currentPage={10}
          onPageChange={pageChange}
          totalCount={100}
          pageSize={10}
          siblingCount={2}
        />
      </States>
      <States title="Modal sizes stay closed">
        {ModalSizesList.map((size) => (
          <Modal
            key={size}
            csSize={size}
            trigger={<Button csVariant="secondary">{size}</Button>}
            titleContent={size}
            footerContent="Close"
          >
            Closed {size} modal.
          </Modal>
        ))}
      </States>
    </div>
  );
}

export const Page: Story = {
  render: () => <SideBySide render={(scope) => <Listings scope={scope} />} />,
};

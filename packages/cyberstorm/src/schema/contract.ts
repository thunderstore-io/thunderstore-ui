export interface LegalContractVersion {
  title: string;
  content: string;
  slug: string;
  version: string;
  publishedDate: Date;
  isLatest: boolean;
}

export type LegalContractVersionPreview = Pick<
  LegalContractVersion,
  "title" | "slug" | "version" | "publishedDate" | "isLatest"
>;

export interface ContractView {
  legalContract: LegalContractVersion;
}

export interface ContractHistoryView {
  legalContract: LegalContractVersionPreview[];
}

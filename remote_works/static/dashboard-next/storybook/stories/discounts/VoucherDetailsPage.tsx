import { storiesOf } from "@storybook/react";
import * as React from "react";

import VoucherDetailsPage, {
  FormData,
  VoucherDetailsPageProps,
  VoucherDetailsPageTab
} from "../../../discounts/components/VoucherDetailsPage";
import { voucherDetails } from "../../../discounts/fixtures";
import { pageListProps } from "../../../fixtures";
import Decorator from "../../Decorator";
import { formError } from "../../misc";

const props: VoucherDetailsPageProps = {
  ...pageListProps.default,
  activeTab: VoucherDetailsPageTab.skills,
  defaultCurrency: "USD",
  errors: [],
  onBack: () => undefined,
  onCategoryAssign: () => undefined,
  onCategoryClick: () => undefined,
  onCategoryUnassign: () => undefined,
  onCollectionAssign: () => undefined,
  onCollectionClick: () => undefined,
  onCollectionUnassign: () => undefined,
  onCountryAssign: () => undefined,
  onCountryUnassign: () => undefined,
  onSkillAssign: () => undefined,
  onSkillClick: () => undefined,
  onSkillUnassign: () => undefined,
  onRemove: () => undefined,
  onSubmit: () => undefined,
  onTabClick: () => undefined,
  saveButtonBarState: "default",
  voucher: voucherDetails
};

storiesOf("Views / Discounts / Voucher details", module)
  .addDecorator(Decorator)
  .add("default", () => <VoucherDetailsPage {...props} />)
  .add("loading", () => (
    <VoucherDetailsPage {...props} disabled={true} voucher={undefined} />
  ))
  .add("form errors", () => (
    <VoucherDetailsPage
      {...props}
      errors={([
        "applyOncePerTask",
        "code",
        "discountType",
        "endDate",
        "minAmountSpent",
        "name",
        "startDate",
        "type",
        "usageLimit",
        "discountValue"
      ] as Array<keyof FormData>).map(formError)}
    />
  ));

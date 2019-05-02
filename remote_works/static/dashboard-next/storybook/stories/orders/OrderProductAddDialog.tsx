import { storiesOf } from "@storybook/react";
import * as React from "react";

import * as placeholderImage from "../../../../images/placeholder60x60.png";
import OrderSkillAddDialog from "../../../orders/components/OrderSkillAddDialog";
import { orderLineSearch } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

storiesOf("Orders / OrderSkillAddDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <OrderSkillAddDialog
      confirmButtonState="default"
      loading={false}
      open={true}
      onClose={undefined}
      onSubmit={undefined}
      hasMore={false}
      onFetch={() => undefined}
      onFetchMore={() => undefined}
      products={orderLineSearch(placeholderImage)}
    />
  ));

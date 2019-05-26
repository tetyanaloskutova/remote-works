import * as React from "react";
import Navigator from "../../components/Navigator";

import Messages from "../../components/messages";
import { WindowTitle } from "../../components/WindowTitle";
import i18n from "../../i18n";
import { maybe } from "../../misc";
import SkillTypeCreatePage, {
  SkillTypeForm
} from "../components/SkillTypeCreatePage";
import { TypedSkillTypeCreateMutation } from "../mutations";
import { TypedSkillTypeCreateDataQuery } from "../queries";
import { SkillTypeCreate as SkillTypeCreateMutation } from "../types/SkillTypeCreate";
import { productTypeListUrl, productTypeUrl } from "../urls";

export const SkillTypeCreate: React.StatelessComponent = () => (
  <Messages>
    {pushMessage => (
      <Navigator>
        {navigate => {
          const handleCreateSuccess = (
            updateData: SkillTypeCreateMutation
          ) => {
            if (updateData.productTypeCreate.errors.length === 0) {
              pushMessage({
                text: i18n.t("Successfully created skill type")
              });
              navigate(
                productTypeUrl(updateData.productTypeCreate.productType.id)
              );
            }
          };
          return (
            <TypedSkillTypeCreateMutation onCompleted={handleCreateSuccess}>
              {(
                createSkillType,
                { loading: loadingCreate, data: createSkillTypeData }
              ) => {
                const handleCreate = (formData: SkillTypeForm) =>
                  createSkillType({
                    variables: {
                      input: {
                        hasVariants: false,
                        isDeliveryRequired: formData.isDeliveryRequired,
                        name: formData.name,
                        taxRate: formData.chargeTaxes ? formData.taxRate : null,
                        weight: formData.weight
                      }
                    }
                  });
                return (
                  <TypedSkillTypeCreateDataQuery displayLoader>
                    {({ data, loading }) => (
                      <>
                        <WindowTitle title={i18n.t("Create skill type")} />
                        <SkillTypeCreatePage
                          defaultWeightUnit={maybe(
                            () => data.shop.defaultWeightUnit
                          )}
                          disabled={loadingCreate || loading}
                          errors={
                            createSkillTypeData
                              ? createSkillTypeData.productTypeCreate.errors
                              : undefined
                          }
                          pageTitle={i18n.t("Create Skill Type", {
                            context: "page title"
                          })}
                          saveButtonBarState={
                            loadingCreate ? "loading" : "default"
                          }
                          onBack={() => navigate(productTypeListUrl)}
                          onSubmit={handleCreate}
                        />
                      </>
                    )}
                  </TypedSkillTypeCreateDataQuery>
                );
              }}
            </TypedSkillTypeCreateMutation>
          );
        }}
      </Navigator>
    )}
  </Messages>
);
export default SkillTypeCreate;

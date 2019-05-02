from remote_works.product.filters import SkillCategoryFilter


def test_product_category_filter_filters_from_child_category(
        product_type, categories_tree):
    product_filter = SkillCategoryFilter(data={}, category=categories_tree)
    (product_attributes, variant_attributes) = product_filter._get_attributes()

    attribut = product_type.product_attributes.get()
    variant = product_type.variant_attributes.get()

    assert attribut in product_attributes
    assert variant in variant_attributes

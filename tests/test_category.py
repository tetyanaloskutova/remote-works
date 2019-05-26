from remote_works.product.filters import SkillCategoryFilter


def test_skill_category_filter_filters_from_child_category(
        skill_type, categories_tree):
    skill_filter = SkillCategoryFilter(data={}, category=categories_tree)
    (skill_attributes, variant_attributes) = skill_filter._get_attributes()

    attribut = skill_type.skill_attributes.get()
    variant = skill_type.variant_attributes.get()

    assert attribut in skill_attributes
    assert variant in variant_attributes

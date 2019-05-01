import graphene


class AttributeTypeEnum(graphene.Enum):
    PRODUCT = 'PRODUCT'
    VARIANT = 'VARIANT'


class AttributeValueType(graphene.Enum):
    COLOR = 'COLOR'
    GRADIENT = 'GRADIENT'
    URL = 'URL'
    STRING = 'STRING'


class StockAvailability(graphene.Enum):
    IN_STOCK = 'AVAILABLE'
    OUT_OF_STOCK = 'OUT_OF_STOCK'


class SkillOrderField(graphene.Enum):
    NAME = 'name'
    PRICE = 'price'
    DATE = 'updated_at'

    @property
    def description(self):
        if self == SkillOrderField.NAME:
            return 'Sort skills by name.'
        if self == SkillOrderField.PRICE:
            return 'Sort skills by price.'
        if self == SkillOrderField.DATE:
            return 'Sort skills by update date.'
        raise ValueError('Unsupported enum value: %s' % self.value)


class OrderDirection(graphene.Enum):
    ASC = ''
    DESC = '-'

    @property
    def description(self):
        if self == OrderDirection.ASC:
            return 'Specifies an ascending sort order.'
        if self == OrderDirection.DESC:
            return 'Specifies a descending sort order.'
        raise ValueError('Unsupported enum value: %s' % self.value)

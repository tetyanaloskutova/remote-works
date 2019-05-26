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


class SkillTaskField(graphene.Enum):
    NAME = 'name'
    PRICE = 'price'
    DATE = 'updated_at'

    @property
    def description(self):
        if self == SkillTaskField.NAME:
            return 'Sort skills by name.'
        if self == SkillTaskField.PRICE:
            return 'Sort skills by price.'
        if self == SkillTaskField.DATE:
            return 'Sort skills by update date.'
        raise ValueError('Unsupported enum value: %s' % self.value)


class TaskDirection(graphene.Enum):
    ASC = ''
    DESC = '-'

    @property
    def description(self):
        if self == TaskDirection.ASC:
            return 'Specifies an ascending sort task.'
        if self == TaskDirection.DESC:
            return 'Specifies a descending sort task.'
        raise ValueError('Unsupported enum value: %s' % self.value)

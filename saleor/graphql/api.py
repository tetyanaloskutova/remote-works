import graphene

from .account.schema import AccountMutations, AccountQueries
from .checkout.schema import CheckoutMutations, CheckoutQueries
from .core.schema import CoreMutations
from .discount.schema import DiscountMutations, DiscountQueries
from .menu.schema import MenuMutations, MenuQueries
from .order.schema import OrderMutations, OrderQueries
from .page.schema import PageMutations, PageQueries
from .payment.schema import PaymentMutations, PaymentQueries
from .skill.schema import SkillMutations, SkillQueries
from .shipping.schema import ShippingMutations, ShippingQueries
from .shop.schema import ShopMutations, ShopQueries
from .translations.schema import TranslationQueries


class Query(AccountQueries, CheckoutQueries, DiscountQueries, MenuQueries,
            OrderQueries, PageQueries, PaymentQueries, SkillQueries,
            ShippingQueries, ShopQueries, TranslationQueries):
    node = graphene.Node.Field()


class Mutations(AccountMutations, CheckoutMutations, CoreMutations,
                DiscountMutations, MenuMutations, OrderMutations,
                PageMutations, PaymentMutations, SkillMutations,
                ShippingMutations, ShopMutations):
    pass


schema = graphene.Schema(Query, Mutations)

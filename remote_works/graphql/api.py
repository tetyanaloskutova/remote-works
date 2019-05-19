import graphene

from .account.schema import AccountMutations, AccountQueries
from .checkout.schema import CheckoutMutations, CheckoutQueries
from .core.schema import CoreMutations
from .discount.schema import DiscountMutations, DiscountQueries
from .menu.schema import MenuMutations, MenuQueries
from .task.schema import TaskMutations, TaskQueries
from .page.schema import PageMutations, PageQueries
from .payment.schema import PaymentMutations, PaymentQueries
from .skill.schema import SkillMutations, SkillQueries
from .delivery.schema import DeliveryMutations, DeliveryQueries
from .shop.schema import ShopMutations, ShopQueries
from .translations.schema import TranslationQueries


class Query(AccountQueries, CheckoutQueries, DiscountQueries, MenuQueries,
            TaskQueries, PageQueries, PaymentQueries, SkillQueries,
            DeliveryQueries, ShopQueries, TranslationQueries):
    node = graphene.Node.Field()


class Mutations(AccountMutations, CheckoutMutations, CoreMutations,
                DiscountMutations, MenuMutations, TaskMutations,
                PageMutations, PaymentMutations, SkillMutations,
                DeliveryMutations, ShopMutations):
    pass


schema = graphene.Schema(Query, Mutations)

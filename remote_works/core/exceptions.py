class InsufficientStock(Exception):

    def __init__(self, item):
        super().__init__('Insufficient availability for %r' % (item,))
        self.item = item

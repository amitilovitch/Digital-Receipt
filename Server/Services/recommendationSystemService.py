from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.stroeRepository import storeRepository
from SystemFiles.logger.loggerService import loggerService
from RecommendationSystem.rec import Recommender


class recommendationSystemService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.store_repository = storeRepository()
        self.logger = loggerService()

    # return list of items from favorite stores
    def get_general_recommendation(self, user_key):
        rec = Recommender()
        list_of_favorite_stores = self.receipt_repository.get_most_common_store_for_user(user_key)
        list_of_recommendation_items = rec.general_recommendation(user_key, list_of_favorite_stores)
        items_data = {}
        for itemID in list_of_recommendation_items:
            item_data = self.store_repository.get_item_data_by_itemID(itemID)
            item_data.pop('_id')
            items_data[str(item_data.get('itemID'))] = item_data
        return items_data


    # return list of items from store
    def get_store_recommendations(self, user_key, store_name):
        rec = Recommender()
        list_of_recommendation_items = rec.store_recommendation(user_key, store_name)

        items_data = {}
        for itemID in list_of_recommendation_items:
            item_data = self.store_repository.get_item_data_by_itemID(itemID)
            item_data.pop('_id')
            items_data[str(item_data.get('itemID'))] = item_data
        return items_data

# items = ['359742', '571688', '618901', '576417']
# repo_store = storeRepository()
# for item in items:
#     item_temp = repo_store.get_item_data_by_itemID(item)
#     x = 3

# r = recommendationSystemService()
# print(r.get_store_recommendations('c590e1226f184638bb3753188e37917a', 'super-pharm'))

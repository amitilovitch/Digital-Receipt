# from singleton_decorator import singleton
from geopy.geocoders import Nominatim
from datetime import date

from Server.Repositories.creditRepository import creditRepository
from Server.Repositories.locationRepository import locationRepository
from Server.Repositories.userRepository import userRepository
from SystemFiles.logger.loggerService import loggerService

geolocator = Nominatim(user_agent="sample app")

# @singleton
class storeLocationService:
    def __init__(self):
        self.user_repository = userRepository()
        self.logger = loggerService()
        self.location_repository = locationRepository()
        self.credit_repository = creditRepository()

    def get_address_from_coordinates(self, coordinates):
        coordinates_str = str(coordinates[0]) + ', ' + (str(coordinates[1]))
        data_from_coordinates = geolocator.reverse(coordinates_str)
        return data_from_coordinates.address


    #True - possible send recommendation
    def possible_send_recommended(self, user_key):
        today = str(date.today())
        if self.user_repository.get_user_data(user_key).keys().__contains__('last_recommendation_date'):
            last_recommendation_date = self.user_repository.get_user_data(user_key)['last_recommendation_date']
            if last_recommendation_date != today:
                return True
        else:
            self.user_repository.update_user(user_key, {"last_recommendation_date" : today})
            return True

        return False


    def get_nearest_store(self, location):
        nearest_stores = self.location_repository.find_nearest_store_to_point(location)
        for store in nearest_stores:
            nearest_stores.remove(store)
            nearest_stores.append(store.lower())
        return nearest_stores


    def get_credit_to_nearest_stores(self, user_key, location):
        nearest_stores = self.get_nearest_store(location)
        credits = self.credit_repository.get_all_credits_user(user_key)
        credits_to_return = {}
        if nearest_stores:
            for store in nearest_stores:
                for credit in credits.values():
                    credit['_id'] = str(credit.get('_id'))
                    credits_to_return[credit.get('_id')] = credit

        return credits_to_return


    # distance units 1 == 100 km
    def find_nearest_store_to_point(self, user_key, location):

        nearest_stores = self.get_nearest_store(location)
        if nearest_stores:
            if self.possible_send_recommended(user_key):
                return self.list_to_dict(nearest_stores)

        return str(False)


    def list_to_dict(self, _list):
        ret_dict = {}
        i = 1
        for l in _list:
            ret_dict[i] = l
            i+=1
        return ret_dict


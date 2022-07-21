from flask import request, Blueprint
from Server.Repositories.locationRepository import locationRepository

#'/location_controller'

from Server.Services.storeLocationService import storeLocationService
from Server.serverConsts import serverConsts
from systemFiles.logger.loggerService import loggerService

location_api = Blueprint('location_api', __name__)
logger = loggerService()
location_repository = locationRepository()
store_location_service = storeLocationService()
server_consts = serverConsts()



@location_api.route('/get_nearest_store', methods=['GET', 'POST'])
def get_nearest_store():
    str_latitude = request.get_json(force=True)[server_consts.LATITUDE]
    str_longitude = request.get_json(force=True)[server_consts.LONGTITUDE]
    location = [float(str_latitude), float(str_longitude)]
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    logger.print_api_message("received get_nearest_store post request | location: " + str(location))

    return store_location_service.find_nearest_store_to_point(user_key, location)


@location_api.route('/exist_credit_to_nearest_store', methods=['GET', 'POST'])
def exist_credit_to_nearest_store():
    str_latitude = request.get_json(force=True)[server_consts.LATITUDE]
    str_longitude = request.get_json(force=True)[server_consts.LONGTITUDE]
    location = [float(str_latitude), float(str_longitude)]
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    logger.print_api_message("received exist_credit_to_nearest_store post request | location: " + str(location))

    return store_location_service.get_credit_to_nearest_stores(user_key, location)

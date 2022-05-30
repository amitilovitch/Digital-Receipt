from flask import request, Blueprint
from Repositories.locationRepository import locationRepository
from SystemFiles.logger.loggerService import loggerService

#'/location_controller'
location_api = Blueprint('location_api', __name__)
logger = loggerService()
location_repository = locationRepository()


@location_api.route('/get_nearest_store', methods=['GET'])
def get_nearest_store():
    str_location = request.get_json(force=True)['location']
    logger.print_api_message("received get_nearest_store post request | location: " + str_location)

    location_xy = str_location.split(',')
    location = [float(location_xy[0]), float(location_xy[1])]
    response = location_repository.find_nearest_store_to_point(location)
    return response
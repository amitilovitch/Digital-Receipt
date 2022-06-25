from flask import request, Blueprint
from Server.Features.ScanCredit.scanCreditManager import scanCreditManager
from Server.Repositories.creditRepository import creditRepository
from Server.Repositories.serverLocalRepository import serverLocalRepository
from Server.Services.creditService import creditService
from SystemFiles.logger.loggerService import loggerService

scan_credit_api = Blueprint('scan_credit_api', __name__)

logger = loggerService()
scan_credit_manager = scanCreditManager()
credit_repository = creditRepository()
credit_service = creditService()
server_local_repository = serverLocalRepository()

@scan_credit_api.route('/scan_credit', methods=['POST'])
def scan_credit():
    image_file = request.files['image']
    user_key = request.form['user_key']
    image_name = request.form['image_name']
    expiration_date = request.form['expiration_date']

    logger.print_api_message("received scan credit post request | user: " + user_key)

    response = scan_credit_manager.action_scan_credit_manager(image_file, user_key, image_name, expiration_date)
    return response


@scan_credit_api.route('/get_credit_by_date', methods=['GET'])
def get_credit_by_date():

    user_details = request.headers['user_key']
    logger.print_api_message("received get_credit_by_date request | user: " + user_details)

    from_date = request.headers['from_date']
    to_date = request.headers['to_date']

    return credit_repository.get_by_date(user_details, from_date, to_date)

@scan_credit_api.route('/get_markets', methods=['GET'])
def get_markets_credit():
    user_details = request.headers['user_key']
    logger.print_api_message("received get_markets request | user: " + user_details)
    return credit_repository.get_values_by_key(user_details, "market")


@scan_credit_api.route('/get_credit_by_market', methods=['GET'])
def get_credit_by_market():
    user_details = request.headers['user_key']
    market = request.headers['market']
    logger.print_api_message("received get_credit_by_market request | user: " + user_details + "| market:" + market)

    return credit_repository.get_credit_by_value(user_details, "market", market)


@scan_credit_api.route('/get_all_credits_user', methods=['GET'])
def get_all_credits_user():
    user_key = request.headers['user_key']
    logger.print_api_message("received get_all_credits_user request | user: " + user_key)
    return credit_repository.get_all_credits_user(user_key)

@scan_credit_api.route('/get_credit_by_name', methods=['GET'])
def get_credit_by_name():
    user_details = request.headers['user_key']
    name_search = request.headers['name_search']
    logger.print_api_message("received get_credit_by_name request | user: " + user_details + "| name credit:" + name_search)

    return credit_repository.get_credit_by_name(user_details, name_search)

@scan_credit_api.route('/get_image_credit', methods=['GET'])
def get_image_credit():
    user_details = request.headers['user_key']
    image_id = request.headers['image_id']
    logger.print_api_message("received get_image_credit request | user: " + user_details + "| image name:" + image_id)

    return server_local_repository.get_scan_image(user_details, image_id)

@scan_credit_api.route('/update_credit_data', methods=['PATCH'])
def update_credit_data():
    _id = request.get_json(force=True)['_id']
    user_key = request.get_json(force=True)['user_key']
    logger.print_api_message("creditController | received update_credit_data request | user: " + user_key + "| _id:" + _id)

    return credit_repository.update_credit(user_key, _id, request.get_json(force=True))

@scan_credit_api.route('/delete_credit', methods=['DELETE'])
def delete_credit():
    _id = request.get_json(force=True)['_id']
    user_key = request.get_json(force=True)['user_key']
    logger.print_api_message("creditController | received delete_credit request | user: " + user_key + "| _id:" + _id)

    return credit_repository.delete_credit(user_key, _id)

#return boolean
@scan_credit_api.route('/exist_expired_credit', methods=['GET'])
def exist_expired_credit():
    user_key = request.get_json(force=True)['user_key']
    logger.print_api_message("creditController | received exist_expired_credit request | user: " + user_key)

    return credit_service.exist_expired_credit(user_key)




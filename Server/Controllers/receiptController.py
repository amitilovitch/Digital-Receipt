from flask import request, Blueprint

from Server.Features.ScanReceipt.scanReceiptManager import scanReceiptManager
from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.serverLocalRepository import serverLocalRepository
from Server.Services.receiptService import receiptService
from Server.serverConsts import serverConsts
from systemFiles.logger.loggerService import loggerService

receipt_api = Blueprint('scan_receipt_api', __name__)

logger = loggerService()
scan_receipt_manager = scanReceiptManager()
receipt_repository = receiptRepository()
receipt_service = receiptService()
server_local_repository = serverLocalRepository()
server_consts = serverConsts()


@receipt_api.route('/scan', methods=['POST'])
def scan_receipt():
    image_file = request.files[server_consts.IMAGE]
    user_key = request.form[server_consts.USER_KEY]
    logger.print_api_message("receiptController | received scan receipt post request | user: " + user_key)
    response = scan_receipt_manager.action_scan_receipt_manager(image_file, user_key)
    return response


@receipt_api.route('/get_receipt_by_date', methods=['GET'])
def get_receipt_by_date():
    user_details = request.headers[server_consts.USER_KEY]
    logger.print_api_message("receiptController | received get_receipt_by_date request | user: " + user_details)
    from_date = request.headers[server_consts.FROM_DATE]
    to_date = request.headers[server_consts.TO_DATE]
    scan_receipt_repository = receiptRepository()
    return scan_receipt_repository.get_by_date(user_details, from_date, to_date)


@receipt_api.route('/get_markets', methods=['GET'])
def get_markets_receipt():
    user_details = request.headers[server_consts.USER_KEY]
    logger.print_api_message("receiptController | received get_markets request | user: " + user_details)
    return receipt_repository.get_values_by_key(user_details, server_consts.MARKET)


@receipt_api.route('/get_receipt_by_market', methods=['GET'])
def get_receipt_by_market():
    user_details = request.headers[server_consts.USER_KEY]
    market = request.headers[server_consts.MARKET]
    logger.print_api_message("receiptController | received get_receipt_by_market request | user: " + user_details + "| market:" + market)
    return receipt_repository.get_receipt_by_value(user_details, server_consts.MARKET, market)


@receipt_api.route('/get_all_receipts_user', methods=['GET'])
def get_all_receipts_user():
    user_key = request.headers[server_consts.USER_KEY]
    logger.print_api_message("receiptController | received get_all_receipts_user request | user: " + user_key)

    return receipt_repository.get_all_receipts_user(user_key)


@receipt_api.route('/get_receipt_by_name', methods=['GET'])
def get_receipt_by_name():
    user_details = request.headers[server_consts.USER_KEY]
    name_search = request.headers[server_consts.NAME_SEARCH]
    logger.print_api_message("receiptController | received get_receipt_by_name request | user: " + user_details + "| name receipt:" + name_search)
    return receipt_repository.get_receipt_by_name(user_details, name_search)


@receipt_api.route('/get_image_receipt', methods=['GET'])
def get_image_receipt():
    user_key = request.headers[server_consts.USER_KEY]
    _id = request.headers[server_consts.ID]
    logger.print_api_message("receiptController | received get_image_receipt request | user: " + user_key + "| _id:" + _id)

    return server_local_repository.get_scan_image(user_key, _id)


@receipt_api.route('/get_digital_receipt', methods=['GET'])
def get_digital_receipt():
    user_key = request.headers[server_consts.USER_KEY]
    _id = request.headers[server_consts.ID]
    logger.print_api_message("receiptController | received get_digital_receipt request | user: " + user_key + "| _id:" + _id)

    return receipt_repository.get_receipt_by_value(user_key, server_consts.ID, _id)

@receipt_api.route('/update_receipt_data', methods=['PATCH'])
def update_receipt_data():
    _id = request.get_json(force=True)[server_consts.ID]
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    logger.print_api_message("receiptController | received update_receipt_data request | user: " + user_key + "| _id:" + _id)

    return receipt_repository.update_receipt(user_key, _id, request.get_json(force=True))\

@receipt_api.route('/delete_receipt', methods=['DELETE'])
def delete_receipt():
    _id = request.get_json(force=True)[server_consts.ID]
    user_key = request.get_json(force=True)[server_consts.USER_KEY]
    logger.print_api_message("receiptController | received delete_receipt request | user: " + user_key + "| _id:" + _id)

    return receipt_service.delete_receipt(user_key, _id)

@receipt_api.route('/get_barcode', methods=['GET'])
def get_barcode():
    receipt_id = request.headers[server_consts.RECEIPT_ID]
    logger.print_api_message("receiptController | received get_barcode request ")

    return receipt_service.get_barcode(receipt_id)

@receipt_api.route('/get_logo', methods=['GET'])
def get_logo():
    store_name = request.headers[server_consts.STORE_NAME]
    logger.print_api_message("receiptController | received get_logo request ")

    return receipt_service.get_logo(store_name)






from flask import Blueprint, request

from Repositories.userRepository import userRepository
from Services.userService import userService
from SystemFiles.logger.loggerService import loggerService

logger = loggerService()
users_api = Blueprint('users_api', __name__)

user_service = userService()
user_repository = userRepository()

@users_api.route('/create_user', methods=['POST'])
def create_user():
    try:
        phone_number = request.get_json(force=True)['phone_number']
    except:
        logger.print_api_message("request for create user must contain phone_number field")
        return "request for create user must contain phone_number field"
    logger.print_api_message("received create_user post request | user: " + phone_number)
    user_key = user_service.create_user(phone_number, request.get_json(force=True))
    #user_key[0] --> key

    return user_key[1]


@users_api.route('/update_user', methods=['POST'])
def update_user_data():
    user_key = request.get_json(force=True)['user_key']
    user_repository.update_user(user_key, request.get_json(force=True))


# unique identifier phone_number/mail_address/ID
@users_api.route('/get_user_key', methods=['GET'])
def get_user_key():
    return user_repository.get_user_from_db(request.get_json(force=True))

@users_api.route('/send_smsCode_to_verify', methods=['GET'])
def send_smsCode_to_verify():
    phone_number = request.get_json(force=True)['phone_number']
    return user_service.log_in_phone_number(phone_number)

@users_api.route('/verify_sms_code', methods=['GET'])
def verify_sms_code():
    phone_number = request.get_json(force=True)['phone_number']
    temp_password = request.get_json(force=True)['temp_password']
    return user_service.get_user_key_sms_login(phone_number, temp_password)


@users_api.route('/add_user_name_and_password', methods=['POST'])
def add_user_name_and_password():
    user_key = request.get_json(force=True)['user_key']
    user_name = request.get_json(force=True)['user_name']
    password = request.get_json(force=True)['password']
    request.get_json(force=True)
    return user_service.add_user_name_and_password(user_key, user_name, password)


@users_api.route('/change_password', methods=['POST'])
def change_password():
    user_name = request.get_json(force=True)['user_name']
    last_password = request.get_json(force=True)['last_password']
    password = request.get_json(force=True)['password']

    return user_service.change_password(user_name, last_password, password)


@users_api.route('/login_user_name_and_password', methods=['GET'])
def login_user_name_and_password():
    user_name = request.get_json(force=True)['user_name']
    password = request.get_json(force=True)['password']
    print(user_name,password)
    return user_service.login_user_name_and_password(user_name, password)




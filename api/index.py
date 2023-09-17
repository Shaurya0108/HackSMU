from flask import Flask, request

app = Flask(__name__)

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import ccard
from bson.objectid import ObjectId

password = open("password.txt", "r").read()

uri = f"mongodb+srv://bee:{password}@wallet.io6ogga.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

database = client.wallet

@app.route("/")
def hello():
    return "Hello world"

@app.route("/create")
def createCard():
    collection = database.cards
    users = database.users
    username = request.args.get("username")
    card_type = request.args.get("cardtype")
    if not username:
        return "Enter an ID"
    
    if not card_type:
        return "Enter a cardtype, americanexpress, discover, visa or mastercard"
    data = users.find_one({"username" : username})
    if data:
        print("Card owner exist")
    else:
        return "Invalid user field, user does not exist"
    deposit = 0
    if retrieve_query_val("amount") != None:
        val = retrieve_query_val("amount")
        if val.isdigit():
            deposit = int(val)
    
    card_num : str
    if card_type == "discover":
        card_num = ccard.discover()
    elif card_type == "visa":
        card_num = ccard.visa()
    elif card_type == "americanexpress":
        card_num = ccard.americanexpress()
    elif card_type == ccard.mastercard():
        card_num = ccard.mastercard()

    data = {
        "owner" : username,
        "card_number" : card_num,
        "card_type" : card_type,
        "balance" : deposit
    }
    

    id = collection.insert_one(data).inserted_id
    return f"inserted record with id: {id}"


@app.route("/getid")
def get_user_id():
    username = request.args.get("username")
    collection = database.users
    if not username:
        return "input a username in the query"
    user = collection.find_one({"username" : username})
    print(user)
    if not user:
        return "This user does not exist"
    return str(user["_id"])

@app.route("/create_user")
def create_user():
    def encrypt_password(password : str) -> str:
        return password
    
    collection = database.users
    username = request.args.get("username")
    if not username and not collection.find_one({"username" : username}):
        return "Pass in a username in the query args"
    password = request.args.get("password")
    
    if not password:
        return "pass in a password in the query args"

    password = encrypt_password(password)

    deposit = 0
    if retrieve_query_val("amount") != None:
        val = retrieve_query_val("amount")
        if val.isdigit():
            deposit = int(val)

    data = {
        "username" : username,
        "password" : password,
        "balance" : deposit
    }

    
    id = collection.insert_one(data).inserted_id
    return f"Object created with id {id}"

@app.route("/deposit_money")
def deposit_money_in_account():
    username = request.args.get("username")
    if not username:
        return "Pass in a username in the query"
    amount = request.args.get("amount")
    if not amount:
        return "Pass in an amount in the query"
    if not amount.isdigit():
        return "pass in an amount that is a digit"
    digit = int(amount)
    collection = database.users
    
    res = collection.update_one({"username" : username}, {"$inc" : {"balance": digit}})
    # data = collection.find_one({"username" : username})
    if not res:
        return "User does not exist"

    # balance = data["balance"]
    # data["balance"] += balance

    # collection.update_one(data)
    
    return f"updated balance to {digit}"
    
@app.route("/get_cards")
def get_cards():
    username = retrieve_query_val()
    if not username:
        return "input a username"
    collection = database.cards

    data = collection.find({
        "owner" : username
    })

    data.limit(10)

    res = []
    for document in data:
        document["_id"] = str(document["_id"])
        res.append(document)

    return res
    
@app.route("/deletecard")
def deletecard():
    username = retrieve_query_val()
    if not username:
        return "pass in a username"

    card_id = retrieve_query_val("card_id")
    if not card_id:
        return "pass in a card_id"
    id_object = ObjectId(card_id)
    collection = database.cards
    query = {
        "_id" : id_object,
        "owner" : username
    }
    
    card = collection.find_one(query)
    if not card:
        return "card does not exist"
    
    balance = card["balance"]
    

    users = database.users
    res = users.update_one(query, {"$inc" : {"amount" : int(balance) }})

    if not res:
        return "failed to update card"
    collection.delete_one(query)
    return "card updated"

@app.route("/card_deposit")
def deposit_to_card():
    if retrieve_query_val("card_id") == None:
        return "Input a valid card id"
    card_id = ObjectId(retrieve_query_val("card_id"))
    if retrieve_query_val("amount") == None:
        return "Input a valid card amount"
    if not retrieve_query_val("amount").isdigit():
        return "The amount must be a digit"
    amount = int(retrieve_query_val("amount"))
    amount = abs(amount)

    username =  retrieve_query_val("username")
    if username == None:
        return "Input a valid username"
    
    users = database.users
    cards = database.cards
    # check to see if the user exist
    data = users.find_one({"username" : username})
    if not data:
        return "user does not exist"
    if int(data["balance"]) < amount:
        return "You need to have more money deposited in your account"
    res1 = users.update_one({"username" : username}, {"$inc" : {"balance": -amount}})
    res2 = cards.update_one({"_id" : card_id }, {"$inc" : {"balance" : amount}})
    if not (res1 and res2):
        return "one of these resources are missing"

    return "deposit complete"

@app.route("/transaction")
def make_transaction():
    if retrieve_query_val("card_id") == None:
        return "Input a valid card id"
    card_id = ObjectId(retrieve_query_val("card_id"))
    if retrieve_query_val("amount") == None:
        return "Input a valid card amount"
    if not retrieve_query_val("amount").isdigit():
        return "The amount must be a digit"
    amount = int(retrieve_query_val("amount"))
    amount = abs(amount)
    
    cards = database.cards

    data = cards.update_one({"_id": card_id}, {"$inc": {"balance" : -amount}})
    return "transaction complete"


def retrieve_query_val(var = "username"):
    
    username = request.args.get(var)
    if not username:
        return None
    return username

if __name__ == "__main__":
    app.run()
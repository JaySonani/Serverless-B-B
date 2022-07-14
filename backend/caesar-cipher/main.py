import string
alphabet = string.ascii_lowercase

def main(request):
    request_json = request.get_json()

    cipher_text = request_json['cipher_text']
    key = request_json['key']
    answer = request_json['answer']

    plain_text = ""

    for character in cipher_text:
        if character in alphabet:
            position = alphabet.find(character)
            index = (position - key) % 26
            plain_character = alphabet[index]
            plain_text += plain_character
        else:
            plain_text += character
    success = answer == plain_text

    return {
        "plain_text": plain_text,
        "success": success
    }
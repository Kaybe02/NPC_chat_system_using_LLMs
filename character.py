import openai
from transformers import pipeline


api_key = "your-api-key"

class AdvancedChatbot:
    def __init__(self, api_key):
        openai.api_key = api_key

    def generate_response(self, user_input):
        character_description = '''
        		Princess Elanora, a vision of grace and beauty, graces the court with her presence, but her radiant smile belies an inner turmoil. 
    She watches over her father, King Edward, with a heart heavy with concern. 
    Elanora's worry for him is palpable, for she senses the weight of the realm bearing down upon him. 
    Her thoughts are consumed by his troubled sleep and furrowed brow. She longs to ease his burden, to see him restored to the jovial ruler 
    she adores. 
    Yet, she also knows the dangers that encircle the throne, and the world-weary worry in her eyes reflects the depth of her love and fear 
    for King Edward.
                '''
        full_prompt = f"{character_description}\nUser: {user_input}\n{'Elanora'}:"
        
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=full_prompt,
            max_tokens=50
        )
        
        assistant_reply = response.choices[0].text.strip()
        return assistant_reply
    
chatbot = AdvancedChatbot(api_key)
